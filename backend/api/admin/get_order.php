<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie([]);
    if (!$auth['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Order ID is required']);
        exit();
    }

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    requireAdminPermission($pdo, $auth['user'], 'view.order');

    $orderRow = null;
    $shippingAddressText = '';

    try {
        $orderSql = "
            SELECT
                o.order_id,
                o.user_id,
                o.order_number,
                o.total_amount,
                o.status,
                o.payment_status,
                o.shipping_address,
                o.placed_at,
                o.updated_at,
                u.first_name,
                u.last_name,
                u.email,
                u.phone
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            WHERE o.order_id = ?
            LIMIT 1
        ";

        $stmt = $pdo->prepare($orderSql);
        $stmt->execute([$orderId]);
        $orderRow = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($orderRow && isset($orderRow['shipping_address'])) {
            $shippingAddressText = (string)$orderRow['shipping_address'];
        }
    } catch (Exception $e) {
        $orderRow = null;
    }

    if (!$orderRow) {
        $orderSql2 = "
            SELECT
                o.order_id,
                o.user_id,
                o.order_number,
                o.total_amount,
                o.status,
                o.payment_status,
                o.shipping_address_id,
                o.placed_at,
                o.updated_at,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                a.address_line1,
                a.address_line2,
                a.city,
                a.state,
                a.country,
                a.postal_code
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.user_id
            LEFT JOIN addresses a ON o.shipping_address_id = a.address_id
            WHERE o.order_id = ?
            LIMIT 1
        ";

        $stmt2 = $pdo->prepare($orderSql2);
        $stmt2->execute([$orderId]);
        $orderRow = $stmt2->fetch(PDO::FETCH_ASSOC);

        if ($orderRow) {
            $parts = [];
            if (!empty($orderRow['address_line1'])) $parts[] = $orderRow['address_line1'];
            if (!empty($orderRow['address_line2'])) $parts[] = $orderRow['address_line2'];
            $cityLine = trim((string)($orderRow['city'] ?? ''));
            $stateLine = trim((string)($orderRow['state'] ?? ''));
            $countryLine = trim((string)($orderRow['country'] ?? ''));
            $pinLine = trim((string)($orderRow['postal_code'] ?? ''));
            $line3 = trim($cityLine . ($stateLine ? ', ' . $stateLine : ''));
            if ($line3 !== '') $parts[] = $line3;
            $line4 = trim($countryLine . ($pinLine ? ' - ' . $pinLine : ''));
            if ($line4 !== '') $parts[] = $line4;
            $shippingAddressText = implode("\n", $parts);
        }
    }

    if (!$orderRow) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found']);
        exit();
    }

    $itemsSql = "
        SELECT
            oi.order_item_id,
            oi.product_id,
            p.title,
            p.sku,
            oi.quantity,
            oi.unit_price,
            oi.total_price
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
        ORDER BY oi.order_item_id ASC
    ";

    $itemsStmt = $pdo->prepare($itemsSql);
    $itemsStmt->execute([$orderId]);
    $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedItems = [];
    foreach ($items as $it) {
        $formattedItems[] = [
            'id' => (int)$it['order_item_id'],
            'productId' => (int)$it['product_id'],
            'title' => $it['title'],
            'sku' => $it['sku'],
            'quantity' => (int)$it['quantity'],
            'unitPrice' => (float)$it['unit_price'],
            'totalPrice' => (float)$it['total_price']
        ];
    }

    $customerName = trim(($orderRow['first_name'] ?? '') . ' ' . ($orderRow['last_name'] ?? ''));
    if ($customerName === '') $customerName = '—';

    echo json_encode([
        'status' => 'success',
        'order' => [
            'id' => (int)$orderRow['order_id'],
            'orderNumber' => $orderRow['order_number'],
            'totalAmount' => (float)$orderRow['total_amount'],
            'status' => $orderRow['status'],
            'paymentStatus' => $orderRow['payment_status'],
            'shippingAddress' => $shippingAddressText,
            'placedAt' => $orderRow['placed_at'],
            'updatedAt' => $orderRow['updated_at'],
            'customer' => [
                'id' => (int)$orderRow['user_id'],
                'name' => $customerName,
                'email' => $orderRow['email'],
                'phone' => $orderRow['phone']
            ],
            'items' => $formattedItems
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin get order error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
