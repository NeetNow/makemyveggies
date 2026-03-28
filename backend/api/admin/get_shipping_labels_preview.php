<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../../config/database.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to load required files']);
    exit();
}

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie([]);
    if (!$auth['success']) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    requireAnyAdminPermission($pdo, $auth['user'], ['view.order']);

    // Get filter parameters
    $statusFilter = isset($_GET['status']) ? trim($_GET['status']) : 'All';
    $excludeCancelled = isset($_GET['excludeCancelled']) && $_GET['excludeCancelled'] === 'true';
    $dateRange = isset($_GET['dateRange']) ? trim($_GET['dateRange']) : 'all';

    // Build WHERE clause
    $where = ['1=1'];
    $params = [];

    // Status filter
    if ($statusFilter && $statusFilter !== 'All') {
        $where[] = 'o.status = ?';
        $params[] = $statusFilter;
    }

    // Exclude cancelled
    if ($excludeCancelled) {
        $where[] = 'o.status != ?';
        $params[] = 'Cancelled';
    }

    // Date range filter
    if ($dateRange !== 'all') {
        switch ($dateRange) {
            case 'today':
                $where[] = 'DATE(o.placed_at) = CURDATE()';
                break;
            case 'week':
                $where[] = 'o.placed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
                break;
            case 'month':
                $where[] = 'o.placed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
                break;
            case 'custom':
                $startDate = $_GET['startDate'] ?? '';
                $endDate = $_GET['endDate'] ?? '';
                if ($startDate && $endDate) {
                    $where[] = 'DATE(o.placed_at) BETWEEN ? AND ?';
                    $params[] = $startDate;
                    $params[] = $endDate;
                }
                break;
        }
    }

    $whereClause = implode(' AND ', $where);

    // Get orders for preview
    $sql = "
        SELECT
            o.order_id,
            o.order_number,
            o.order_tracking_id,
            o.total_amount,
            o.placed_at,
            o.status,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            sa.address_line1,
            sa.address_line2,
            sa.city,
            sa.state,
            sa.postal_code,
            sa.country,
            COUNT(oi.order_item_id) AS item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN addresses sa ON o.shipping_address_id = sa.address_id
        WHERE $whereClause
        GROUP BY o.order_id
        ORDER BY o.placed_at DESC
        LIMIT 100
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $labels = [];
    foreach ($orders as $order) {
        $labels[] = [
            'orderId' => $order['order_id'],
            'orderNumber' => $order['order_number'],
            'trackingId' => $order['order_tracking_id'] ?: 'TRACK' . str_pad($order['order_id'], 8, '0', STR_PAD_LEFT),
            'customerName' => trim(($order['first_name'] ?? '') . ' ' . ($order['last_name'] ?? '')) ?: '—',
            'address' => trim(($order['address_line1'] ?? '') . ($order['address_line2'] ? ', ' . $order['address_line2'] : '')) ?: '—',
            'cityState' => trim(($order['city'] ?? '') . ', ' . ($order['state'] ?? '') . ' ' . ($order['postal_code'] ?? '')) ?: '—',
            'country' => $order['country'] ?? 'India',
            'phone' => $order['phone'] ?: '—',
            'itemCount' => $order['item_count'],
            'amount' => $order['total_amount'],
            'placedAt' => $order['placed_at'],
            'status' => $order['status']
        ];
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'labels' => $labels,
        'total' => count($labels)
    ]);
    ob_end_flush();
    exit();

} catch (Exception $e) {
    ob_end_clean();
    error_log('Admin get shipping labels preview error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
