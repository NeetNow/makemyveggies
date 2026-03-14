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
    // Verify JWT token
    $auth_result = verifyJWTFromCookie();
    if (!$auth_result['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth_result['message']]);
        exit;
    }

    $user = $auth_result['user'];
    $userId = $user['user_id'];

    // Get order ID from query parameter
    $orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Order ID is required']);
        exit;
    }

    // Get order details (verify it belongs to the current user)
    $orderSql = "
        SELECT
            o.order_id,
            o.order_number,
            o.total_amount,
            o.status,
            o.payment_status,
            o.payment_method,
            o.shipping_address,
            o.placed_at,
            o.updated_at
        FROM orders o
        WHERE o.order_id = ? AND o.user_id = ?
        LIMIT 1
    ";

    $stmt = $pdo->prepare($orderSql);
    $stmt->execute([$orderId, $userId]);
    $orderRow = $stmt->fetch(PDO::FETCH_ASSOC);

    // If not found with direct shipping_address, try with address_id
    if (!$orderRow) {
        $orderSql2 = "
            SELECT
                o.order_id,
                o.order_number,
                o.total_amount,
                o.status,
                o.payment_status,
                o.payment_method,
                o.shipping_address_id,
                o.placed_at,
                o.updated_at,
                a.address_line1,
                a.address_line2,
                a.city,
                a.state,
                a.country,
                a.postal_code
            FROM orders o
            LEFT JOIN addresses a ON o.shipping_address_id = a.address_id
            WHERE o.order_id = ? AND o.user_id = ?
            LIMIT 1
        ";

        $stmt2 = $pdo->prepare($orderSql2);
        $stmt2->execute([$orderId, $userId]);
        $orderRow = $stmt2->fetch(PDO::FETCH_ASSOC);

        if ($orderRow) {
            // Build shipping address from address fields
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
    } else {
        $shippingAddressText = $orderRow['shipping_address'] ?? '';
    }

    if (!$orderRow) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found']);
        exit;
    }

    // Get order items with product details
    $itemsSql = "
        SELECT
            oi.order_item_id,
            oi.product_id,
            p.title,
            p.sku,
            p.image_url,
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
            'image' => $it['image_url'],
            'quantity' => (int)$it['quantity'],
            'unitPrice' => (float)$it['unit_price'],
            'totalPrice' => (float)$it['total_price']
        ];
    }

    // Calculate subtotal from items
    $subtotal = array_sum(array_column($formattedItems, 'totalPrice'));
    $shippingCost = (float)$orderRow['total_amount'] - $subtotal;
    if ($shippingCost < 0) $shippingCost = 0;

    echo json_encode([
        'status' => 'success',
        'order' => [
            'id' => (int)$orderRow['order_id'],
            'orderNumber' => $orderRow['order_number'],
            'totalAmount' => (float)$orderRow['total_amount'],
            'subtotal' => $subtotal,
            'shippingCost' => $shippingCost,
            'status' => $orderRow['status'],
            'paymentStatus' => $orderRow['payment_status'],
            'paymentMethod' => $orderRow['payment_method'] ?? 'Online Payment',
            'shippingAddress' => $shippingAddressText,
            'placedAt' => $orderRow['placed_at'],
            'updatedAt' => $orderRow['updated_at'],
            'items' => $formattedItems
        ]
    ]);

} catch (Exception $e) {
    error_log("Get order details error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
