<?php
//error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    if ($orderId <= 0) {
        sendResponse(false, 'order_id is required', null, 400);
    }

    // Load order and payment info
    $stmtOrder = $pdo->prepare('SELECT order_id, order_number, total_amount, payment_status FROM orders WHERE order_id = ? AND user_id = ?');
    $stmtOrder->execute([$orderId, $userId]);
    $order = $stmtOrder->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        sendResponse(false, 'Order not found', null, 404);
    }

    if (strtolower($order['payment_status']) === 'paid') {
        sendResponse(false, 'Order is already paid', null, 400);
    }

    // Amount in paise, Razorpay expects integer
    $amount = (float)$order['total_amount'];
    if ($amount <= 0) {
        sendResponse(false, 'Invalid order amount', null, 400);
    }

    $razorpayKeyId     = $_ENV['RAZORPAY_KEY_ID'] ?? '';
    $razorpayKeySecret = $_ENV['RAZORPAY_KEY_SECRET'] ?? '';

    if ($razorpayKeyId === '' || $razorpayKeySecret === '') {
        sendResponse(false, 'Razorpay keys not configured', null, 500);
    }

    $amountInPaise = (int)round($amount * 100);

    $payload = [
        'amount'   => $amountInPaise,
        'currency' => 'INR',
        'receipt'  => $order['order_number'],
        'notes'    => [
            'internal_order_id' => $order['order_id'],
            'user_id'           => $userId,
        ],
    ];

    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPAUTH       => CURLAUTH_BASIC,
        CURLOPT_USERPWD        => $razorpayKeyId . ':' . $razorpayKeySecret,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode($payload),
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        error_log('Razorpay create_order error: HTTP ' . $httpCode . ' err=' . $error . ' body=' . $response);
        sendResponse(false, 'Failed to create Razorpay order', null, 500);
    }

    $data = json_decode($response, true);
    if (!$data || empty($data['id'])) {
        error_log('Razorpay create_order invalid response: ' . $response);
        sendResponse(false, 'Invalid Razorpay response', null, 500);
    }

    $razorpayOrderId = $data['id'];

    // Update payments row with Razorpay info
    $stmtPay = $pdo->prepare('UPDATE payments SET payment_gateway = ?, gateway_order_id = ? WHERE order_id = ?');
    $stmtPay->execute(['RAZORPAY', $razorpayOrderId, $orderId]);

    $customerName  = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
    $customerEmail = $user['email'] ?? null;
    $customerPhone = $user['phone'] ?? null;

    sendResponse(true, 'Razorpay order created', [
        'razorpay_key_id'   => $razorpayKeyId,
        'razorpay_order_id' => $razorpayOrderId,
        'amount'            => $amountInPaise,
        'currency'          => 'INR',
        'name'              => $customerName,
        'email'             => $customerEmail,
        'contact'           => $customerPhone,
        'order_id'          => $order['order_id'],
        'order_number'      => $order['order_number'],
    ]);
} catch (Exception $e) {
    error_log('razorpay_create_order error: ' . $e->getMessage());
    sendResponse(false, 'razorpay_create_order error: ' . $e->getMessage(), null, 500);
}
