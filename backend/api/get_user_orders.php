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

    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    if ($page < 1) $page = 1;
    if ($limit < 1) $limit = 10;
    if ($limit > 50) $limit = 50;
    $offset = ($page - 1) * $limit;

    // Only show confirmed orders in profile history
    $statusFilter = 'confirmed';

    // Total count for pagination
    $countSql = "SELECT COUNT(*) AS cnt FROM orders WHERE user_id = ? AND LOWER(status) = ?";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute([$userId, $statusFilter]);
    $totalCountRow = $countStmt->fetch(PDO::FETCH_ASSOC);
    $totalCount = isset($totalCountRow['cnt']) ? (int)$totalCountRow['cnt'] : 0;
    $totalPages = (int)ceil($totalCount / $limit);

    // Get user orders with order items
    $ordersSql = "
        SELECT 
            o.order_id,
            o.order_number,
            o.total_amount,
            o.status,
            o.payment_status,
            o.placed_at,
            COUNT(oi.order_item_id) as item_count
        FROM orders o 
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.user_id = ? AND LOWER(o.status) = ?
        GROUP BY o.order_id
        ORDER BY o.placed_at DESC
        LIMIT ? OFFSET ?
    ";
    $stmt = $pdo->prepare($ordersSql);
    
    $stmt->bindValue(1, $userId, PDO::PARAM_INT);
    $stmt->bindValue(2, $statusFilter, PDO::PARAM_STR);
    $stmt->bindValue(3, $limit, PDO::PARAM_INT);
    $stmt->bindValue(4, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format orders for frontend
    $formattedOrders = [];
    foreach ($orders as $order) {
        $formattedOrders[] = [
            'id' => $order['order_id'],
            'orderNumber' => $order['order_number'],
            'date' => date('M d, Y', strtotime($order['placed_at'])),
            'total' => '$' . number_format($order['total_amount'], 2),
            'status' => $order['status'],
            'paymentStatus' => $order['payment_status'],
            'items' => (int)$order['item_count']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'orders' => $formattedOrders,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $totalCount,
            'total_pages' => $totalPages
        ]
    ]);

} catch (Exception $e) {
    error_log("Get user orders error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
