<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';

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
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    $ordersTotal = (int)$pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn();
    $productsTotal = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $customersTotal = (int)$pdo->query('SELECT COUNT(*) FROM users WHERE is_active = 1')->fetchColumn();

    $paidRevenueSql = "
        SELECT COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE LOWER(payment_status) IN ('paid', 'success')
    ";
    $paidRevenue = (float)$pdo->query($paidRevenueSql)->fetchColumn();

    $todayRevenueSql = "
        SELECT COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE LOWER(payment_status) IN ('paid', 'success')
          AND DATE(placed_at) = CURDATE()
    ";
    $todayRevenue = (float)$pdo->query($todayRevenueSql)->fetchColumn();

    $monthRevenueSql = "
        SELECT COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE LOWER(payment_status) IN ('paid', 'success')
          AND YEAR(placed_at) = YEAR(CURDATE())
          AND MONTH(placed_at) = MONTH(CURDATE())
    ";
    $monthRevenue = (float)$pdo->query($monthRevenueSql)->fetchColumn();

    $todayOrdersSql = "
        SELECT COUNT(*)
        FROM orders
        WHERE DATE(placed_at) = CURDATE()
    ";
    $todayOrders = (int)$pdo->query($todayOrdersSql)->fetchColumn();

    $weekOrdersSql = "
        SELECT COUNT(*)
        FROM orders
        WHERE placed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ";
    $weekOrders = (int)$pdo->query($weekOrdersSql)->fetchColumn();

    $recentOrdersSql = "
        SELECT
            o.order_id,
            o.order_number,
            o.total_amount,
            o.status,
            o.payment_status,
            o.placed_at,
            u.first_name,
            u.last_name,
            COUNT(oi.order_item_id) AS item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        GROUP BY o.order_id
        ORDER BY o.placed_at DESC
        LIMIT 8
    ";

    $recentStmt = $pdo->prepare($recentOrdersSql);
    $recentStmt->execute();
    $recentOrders = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedRecent = [];
    foreach ($recentOrders as $o) {
        $customerName = trim(($o['first_name'] ?? '') . ' ' . ($o['last_name'] ?? ''));
        if ($customerName === '') $customerName = '—';

        $formattedRecent[] = [
            'id' => (int)$o['order_id'],
            'orderNumber' => $o['order_number'],
            'totalAmount' => (float)$o['total_amount'],
            'status' => $o['status'],
            'paymentStatus' => $o['payment_status'],
            'placedAt' => $o['placed_at'],
            'customerName' => $customerName,
            'items' => (int)$o['item_count']
        ];
    }

    $sales7DaysSql = "
        SELECT
            DATE(o.placed_at) AS day,
            COALESCE(SUM(o.total_amount), 0) AS revenue
        FROM orders o
        WHERE LOWER(o.payment_status) IN ('paid', 'success')
          AND o.placed_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(o.placed_at)
        ORDER BY day ASC
    ";

    $salesStmt = $pdo->prepare($sales7DaysSql);
    $salesStmt->execute();
    $salesRows = $salesStmt->fetchAll(PDO::FETCH_ASSOC);

    $salesMap = [];
    foreach ($salesRows as $r) {
        $salesMap[$r['day']] = (float)$r['revenue'];
    }

    $salesSeries = [];
    $dt = new DateTime('today');
    $dt->modify('-6 days');
    for ($i = 0; $i < 7; $i++) {
        $key = $dt->format('Y-m-d');
        $salesSeries[] = [
            'date' => $key,
            'revenue' => isset($salesMap[$key]) ? (float)$salesMap[$key] : 0.0
        ];
        $dt->modify('+1 day');
    }

    echo json_encode([
        'status' => 'success',
        'stats' => [
            'ordersTotal' => $ordersTotal,
            'productsTotal' => $productsTotal,
            'customersTotal' => $customersTotal,
            'paidRevenueTotal' => $paidRevenue,
            'todayRevenue' => $todayRevenue,
            'monthRevenue' => $monthRevenue,
            'todayOrders' => $todayOrders,
            'weekOrders' => $weekOrders
        ],
        'recentOrders' => $formattedRecent,
        'salesLast7Days' => $salesSeries
    ]);

} catch (Exception $e) {
    error_log('Admin dashboard stats error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
