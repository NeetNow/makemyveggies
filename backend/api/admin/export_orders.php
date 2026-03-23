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
            u.phone,
            COUNT(oi.order_item_id) AS item_count,
            MAX(p.transaction_id) AS transaction_id,
            MAX(p.gateway_order_id) AS gateway_order_id,
            MAX(p.payment_method) AS payment_method,
            MAX(p.payment_gateway) AS payment_gateway,
            sa.address_line1,
            sa.address_line2,
            sa.city,
            sa.state,
            sa.postal_code
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN payments p ON p.order_id = o.order_id
        LEFT JOIN addresses sa ON o.shipping_address_id = sa.address_id
        WHERE $whereClause
        GROUP BY o.order_id
        ORDER BY $orderBy
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $filename = 'orders_export_' . date('Y-m-d_H-i-s') . '.csv';

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Pragma: no-cache');
    header('Expires: 0');

    $output = fopen('php://output', 'w');

    fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

    $headers = [
        'Order ID',
        'Order Number',
        'Tracking ID',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Shipping Address',
        'City',
        'State',
        'Postal Code',
        'Items Count',
        'Total Amount',
        'Status',
        'Payment Status',
        'Payment Method',
        'Payment Gateway',
        'Transaction ID',
        'Gateway Order ID',
        'Placed Date'
    ];
    fputcsv($output, $headers);

    foreach ($rows as $r) {
        $customerName = trim(($r['first_name'] ?? '') . ' ' . ($r['last_name'] ?? ''));
        if ($customerName === '') $customerName = '—';

        $shippingAddress = trim(($r['address_line1'] ?? '') . ' ' . ($r['address_line2'] ?? ''));
        if ($shippingAddress === '') $shippingAddress = '—';

        $row = [
            $r['order_id'],
            $r['order_number'],
            $r['order_tracking_id'] ?? '—',
            $customerName,
            $r['email'] ?? '—',
            $r['phone'] ?? '—',
            $shippingAddress,
            $r['city'] ?? '—',
            $r['state'] ?? '—',
            $r['postal_code'] ?? '—',
            (int)$r['item_count'],
            (float)$r['total_amount'],
            $r['status'],
            $r['payment_status'],
            $r['payment_method'] ?? '—',
            $r['payment_gateway'] ?? '—',
            $r['transaction_id'] ?? '—',
            $r['gateway_order_id'] ?? '—',
            $r['placed_at']
        ];
        fputcsv($output, $row);
    }

    fclose($output);
    exit();

} catch (Exception $e) {
    error_log('Admin export orders error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
