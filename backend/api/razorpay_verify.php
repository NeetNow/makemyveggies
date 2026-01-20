<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $auth = verifyJWTFromCookie();
    if (!$auth['success']) {
        sendResponse(false, $auth['message'], null, 401);
    }
    $user   = $auth['user'];
    $userId = $user['user_id'];

    $db  = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        sendResponse(false, 'Invalid JSON input', null, 400);
    }

    $orderId          = isset($input['order_id']) ? (int)$input['order_id'] : 0;
    $razorpayOrderId  = $input['razorpay_order_id'] ?? '';
    $razorpayPaymentId= $input['razorpay_payment_id'] ?? '';
    $razorpaySignature= $input['razorpay_signature'] ?? '';

    if ($orderId <= 0 || $razorpayOrderId === '' || $razorpayPaymentId === '' || $razorpaySignature === '') {
        sendResponse(false, 'Missing Razorpay payment details', null, 400);
    }

    // Load order and verify ownership
    $stmtOrder = $pdo->prepare('SELECT order_id, order_number, payment_status FROM orders WHERE order_id = ? AND user_id = ?');
    $stmtOrder->execute([$orderId, $userId]);
    $order = $stmtOrder->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        sendResponse(false, 'Order not found', null, 404);
    }

    if (strtolower($order['payment_status']) === 'paid') {
        sendResponse(true, 'Order already marked as paid', null, 200);
    }

    $razorpayKeySecret = $_ENV['RAZORPAY_KEY_SECRET'] ?? '';
    if ($razorpayKeySecret === '') {
        sendResponse(false, 'Razorpay keys not configured', null, 500);
    }

    // Verify signature
    $generatedSignature = hash_hmac('sha256', $razorpayOrderId . '|' . $razorpayPaymentId, $razorpayKeySecret);

    if (!hash_equals($generatedSignature, $razorpaySignature)) {
        error_log('Razorpay signature mismatch for order ' . $orderId);
        // Optionally mark payment as failed
        $stmtFail = $pdo->prepare('UPDATE payments SET payment_status = ? WHERE order_id = ? AND gateway_order_id = ?');
        $stmtFail->execute(['Failed', $orderId, $razorpayOrderId]);
        sendResponse(false, 'Payment verification failed', null, 400);
    }

    // Signature valid, mark payment and order as paid
    $pdo->beginTransaction();

    $stmtPay = $pdo->prepare('UPDATE payments SET payment_status = ?, transaction_id = ?, gateway_signature = ? WHERE order_id = ? AND gateway_order_id = ?');
    $stmtPay->execute(['Success', $razorpayPaymentId, $razorpaySignature, $orderId, $razorpayOrderId]);

    $stmtOrderUpd = $pdo->prepare('UPDATE orders SET payment_status = ?, status = ?, updated_at = ? WHERE order_id = ?');
    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');
    $stmtOrderUpd->execute(['Paid', 'Confirmed', $istNow, $orderId]);

    $pdo->commit();

    sendResponse(true, 'Payment verified successfully', [
        'order_id'     => $orderId,
        'order_number' => $order['order_number'],
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('razorpay_verify error: ' . $e->getMessage());
    sendResponse(false, 'razorpay_verify error: ' . $e->getMessage(), null, 500);
}
