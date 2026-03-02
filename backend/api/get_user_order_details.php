<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';
require_once '../middleware/jwt_auth.php';

// Initialize database connection
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        exit;
    }

    // Verify JWT token
    $auth_result = verifyJWTFromCookie();
    if (!$auth_result['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth_result['message']]);
        exit;
    }

    $user = $auth_result['user'];
    $userId = $user['user_id'];

    $orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Order ID is required']);
        exit;
    }

    // Load order + verify ownership
    $orderSql = "
        SELECT
            o.order_id,
            o.order_number,
            o.total_amount,
            o.status,
            o.payment_status,
            o.placed_at,
            o.updated_at,
            o.shipping_address_id,
            o.billing_id,
            a.address_line1,
            a.address_line2,
            a.city,
            a.state,
            a.country,
            a.postal_code,
            b.first_name AS bill_first_name,
            b.last_name AS bill_last_name,
            b.email AS bill_email,
            b.phone AS bill_phone,
            b.address_line1 AS bill_address_line1,
            b.address_line2 AS bill_address_line2,
            b.city AS bill_city,
            b.state AS bill_state,
            b.country AS bill_country,
            b.postal_code AS bill_postal_code,
            p.payment_gateway,
            p.gateway_order_id,
            p.payment_method,
            p.payment_status AS payment_row_status,
            p.transaction_id,
            p.amount
        FROM orders o
        LEFT JOIN addresses a ON o.shipping_address_id = a.address_id
        LEFT JOIN billing_details b ON o.billing_id = b.billing_id
        LEFT JOIN payments p ON p.order_id = o.order_id
        WHERE o.order_id = ? AND o.user_id = ?
        LIMIT 1
    ";

    $stmtOrder = $pdo->prepare($orderSql);
    $stmtOrder->execute([$orderId, $userId]);
    $orderRow = $stmtOrder->fetch(PDO::FETCH_ASSOC);

    if (!$orderRow) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found']);
        exit;
    }

    // Load order items
    $itemsSql = "
        SELECT
            oi.order_item_id,
            oi.product_id,
            p.title,
            oi.quantity,
            oi.unit_price,
            oi.total_price
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
        ORDER BY oi.order_item_id ASC
    ";

    $stmtItems = $pdo->prepare($itemsSql);
    $stmtItems->execute([$orderId]);
    $itemsRows = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

    $items = [];
    foreach ($itemsRows as $it) {
        $items[] = [
            'id' => (int)$it['order_item_id'],
            'productId' => (int)$it['product_id'],
            'title' => $it['title'],
            'quantity' => (int)$it['quantity'],
            'unitPrice' => (float)$it['unit_price'],
            'totalPrice' => (float)$it['total_price'],
        ];
    }

    $shippingAddress = [
        'address_line1' => $orderRow['address_line1'] ?? null,
        'address_line2' => $orderRow['address_line2'] ?? null,
        'city' => $orderRow['city'] ?? null,
        'state' => $orderRow['state'] ?? null,
        'country' => $orderRow['country'] ?? null,
        'postal_code' => $orderRow['postal_code'] ?? null,
    ];

    $billingDetails = [
        'first_name' => $orderRow['bill_first_name'] ?? null,
        'last_name' => $orderRow['bill_last_name'] ?? null,
        'email' => $orderRow['bill_email'] ?? null,
        'phone' => $orderRow['bill_phone'] ?? null,
        'address_line1' => $orderRow['bill_address_line1'] ?? null,
        'address_line2' => $orderRow['bill_address_line2'] ?? null,
        'city' => $orderRow['bill_city'] ?? null,
        'state' => $orderRow['bill_state'] ?? null,
        'country' => $orderRow['bill_country'] ?? null,
        'postal_code' => $orderRow['bill_postal_code'] ?? null,
    ];

    echo json_encode([
        'status' => 'success',
        'order' => [
            'id' => (int)$orderRow['order_id'],
            'orderNumber' => $orderRow['order_number'],
            'totalAmount' => (float)$orderRow['total_amount'],
            'status' => $orderRow['status'],
            'paymentStatus' => $orderRow['payment_status'],
            'placedAt' => $orderRow['placed_at'],
            'updatedAt' => $orderRow['updated_at'],
            'payment' => [
                'paymentGateway' => $orderRow['payment_gateway'] ?? null,
                'gatewayOrderId' => $orderRow['gateway_order_id'] ?? null,
                'paymentMethod' => $orderRow['payment_method'] ?? null,
                'paymentStatusRaw' => $orderRow['payment_row_status'] ?? null,
                'transactionId' => $orderRow['transaction_id'] ?? null,
                'amount' => isset($orderRow['amount']) ? (float)$orderRow['amount'] : null,
            ],
            'shipping' => $shippingAddress,
            'billing' => $billingDetails,
            'items' => $items,
        ]
    ]);

} catch (Exception $e) {
    error_log('Get user order details error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
