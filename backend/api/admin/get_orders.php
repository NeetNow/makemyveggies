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

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    requireAnyAdminPermission($pdo, $auth['user'], ['view.order', 'view.payments']);

    $search = isset($_GET['search']) ? trim((string)$_GET['search']) : '';
    $statusParam = isset($_GET['status']) ? trim((string)$_GET['status']) : '';
    $paymentParam = isset($_GET['paymentStatus']) ? trim((string)$_GET['paymentStatus']) : '';
    $sort = isset($_GET['sort']) ? trim((string)$_GET['sort']) : 'newest';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    if ($limit < 1) $limit = 10;
    if ($limit > 100) $limit = 100;
    if ($offset < 0) $offset = 0;

    $where = ['1=1'];
    $params = [];

    if ($statusParam !== '') {
        $where[] = 'o.status = ?';
        $params[] = $statusParam;
    }

    if ($paymentParam !== '') {
        $where[] = 'o.payment_status = ?';
        $params[] = $paymentParam;
    }

    if ($search !== '') {
        $where[] = '(o.order_number LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
        $term = '%' . $search . '%';
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $orderBy = 'o.placed_at DESC';
    if ($sort === 'oldest') {
        $orderBy = 'o.placed_at ASC';
    } elseif ($sort === 'amount_high') {
        $orderBy = 'o.total_amount DESC';
    } elseif ($sort === 'amount_low') {
        $orderBy = 'o.total_amount ASC';
    }

    $whereClause = implode(' AND ', $where);

    $sql = "
        SELECT
            o.order_id,
            o.order_number,
            o.total_amount,
            o.order_tracking_id,
            o.status,
            o.payment_status,
            o.placed_at,
            u.first_name,
            u.last_name,
            u.email,
            COUNT(oi.order_item_id) AS item_count,
            MAX(p.transaction_id) AS transaction_id,
            MAX(p.gateway_order_id) AS gateway_order_id,
            MAX(p.payment_method) AS payment_method,
            MAX(p.payment_gateway) AS payment_gateway,
            MAX(p.payment_status) AS payment_row_status
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN payments p ON p.order_id = o.order_id
        WHERE $whereClause
        GROUP BY o.order_id
        ORDER BY $orderBy
        LIMIT $limit OFFSET $offset
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countSql = "
        SELECT COUNT(*) AS total
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        WHERE $whereClause
    ";

    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalCount = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Calculate totals for all filtered results (not just current page)
    $totalsSql = "
        SELECT 
            COALESCE(SUM(CASE WHEN o.payment_status IN ('paid', 'success', 'Paid', 'Success') THEN o.total_amount ELSE 0 END), 0) as total_paid,
            COALESCE(SUM(CASE WHEN o.payment_status IN ('pending', 'Pending') THEN o.total_amount ELSE 0 END), 0) as total_pending,
            COALESCE(SUM(CASE WHEN o.payment_status IN ('failed', 'Failed', 'payment_failed') THEN o.total_amount ELSE 0 END), 0) as total_failed,
            COALESCE(SUM(CASE WHEN o.payment_status IN ('refunded', 'Refunded') THEN o.total_amount ELSE 0 END), 0) as total_refunded,
            COUNT(CASE WHEN o.payment_status IN ('paid', 'success', 'Paid', 'Success') THEN 1 END) as paid_count,
            COUNT(CASE WHEN o.payment_status IN ('pending', 'Pending') THEN 1 END) as pending_count,
            COUNT(CASE WHEN o.payment_status IN ('failed', 'Failed', 'payment_failed') THEN 1 END) as failed_count,
            COUNT(CASE WHEN o.payment_status IN ('refunded', 'Refunded') THEN 1 END) as refunded_count,
            COUNT(*) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as grand_total
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        WHERE $whereClause
    ";

    $totalsStmt = $pdo->prepare($totalsSql);
    $totalsStmt->execute($params);
    $totals = $totalsStmt->fetch(PDO::FETCH_ASSOC);

    $orders = [];
    foreach ($rows as $r) {
        $customerName = trim(($r['first_name'] ?? '') . ' ' . ($r['last_name'] ?? ''));
        if ($customerName === '') $customerName = '—';

        $orders[] = [
            'id' => (int)$r['order_id'],
            'orderNumber' => $r['order_number'],
            'totalAmount' => (float)$r['total_amount'],
            'orderTrackingId' => $r['order_tracking_id'],
            'status' => $r['status'],
            'paymentStatus' => $r['payment_status'],
            'paymentStatusRaw' => $r['payment_row_status'],
            'placedAt' => $r['placed_at'],
            'items' => (int)$r['item_count'],
            'customerName' => $customerName,
            'customerEmail' => $r['email'],
            'transactionId' => $r['transaction_id'],
            'gatewayOrderId' => $r['gateway_order_id'],
            'paymentMethod' => $r['payment_method'],
            'paymentGateway' => $r['payment_gateway']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'orders' => $orders,
        'pagination' => [
            'total' => $totalCount,
            'limit' => $limit,
            'offset' => $offset,
            'currentPage' => (int)floor($offset / $limit) + 1,
            'totalPages' => (int)ceil($totalCount / $limit),
            'hasMore' => ($offset + $limit) < $totalCount
        ],
        'totals' => [
            'totalPaid' => (float)$totals['total_paid'],
            'totalPending' => (float)$totals['total_pending'],
            'totalFailed' => (float)$totals['total_failed'],
            'totalRefunded' => (float)$totals['total_refunded'],
            'paidCount' => (int)$totals['paid_count'],
            'pendingCount' => (int)$totals['pending_count'],
            'failedCount' => (int)$totals['failed_count'],
            'refundedCount' => (int)$totals['refunded_count'],
            'totalOrders' => (int)$totals['total_orders'],
            'grandTotal' => (float)$totals['grand_total']
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin get orders error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
