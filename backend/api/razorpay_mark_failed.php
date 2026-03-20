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

    $orderId = isset($input['order_id']) ? (int)$input['order_id'] : 0;
    $gatewayOrderId = $input['razorpay_order_id'] ?? null;

    if ($orderId <= 0) {
        sendResponse(false, 'Missing order_id', null, 400);
    }

    // Load order and verify ownership
    $stmtOrder = $pdo->prepare('SELECT order_id, payment_status, status FROM orders WHERE order_id = ? AND user_id = ?');
    $stmtOrder->execute([$orderId, $userId]);
    $order = $stmtOrder->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        sendResponse(false, 'Order not found', null, 404);
    }

    // Idempotency: if already paid/confirmed, do not override
    if (strtolower((string)$order['payment_status']) === 'paid') {
        sendResponse(true, 'Order already paid', [
            'order_id' => $orderId,
            'payment_status' => 'paid',
            'status' => $order['status'],
        ], 200);
    }

    $pdo->beginTransaction();

    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');

    $stmtOrderFail = $pdo->prepare('UPDATE orders SET payment_status = ?, status = ?, updated_at = ? WHERE order_id = ? AND user_id = ?');
    $stmtOrderFail->execute(['failed', 'payment_failed', $istNow, $orderId, $userId]);

    // Update the latest matching payment row if present (do not error if missing)
    if ($gatewayOrderId) {
        $stmtPay = $pdo->prepare('UPDATE payments SET payment_status = ? WHERE order_id = ? AND gateway_order_id = ?');
        $stmtPay->execute(['failed', $orderId, $gatewayOrderId]);
    } else {
        $stmtPay = $pdo->prepare('UPDATE payments SET payment_status = ? WHERE order_id = ?');
        $stmtPay->execute(['failed', $orderId]);
    }

    $pdo->commit();

    sendResponse(true, 'Order marked as payment_failed', [
        'order_id' => $orderId,
        'status' => 'payment_failed',
        'payment_status' => 'failed',
    ], 200);
} catch (Exception $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('razorpay_mark_failed error: ' . $e->getMessage());
    sendResponse(false, 'razorpay_mark_failed error: ' . $e->getMessage(), null, 500);
}
