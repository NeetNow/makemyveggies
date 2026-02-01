<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

function verifyAdminJWTFromCookie() {
    $jwt_secret = $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production-2024';
    $jwt_algorithm = 'HS256';

    try {
        if (!isset($_COOKIE['admin_auth_token'])) {
            return ['success' => false, 'message' => 'No authentication token found'];
        }

        $jwt_token = $_COOKIE['admin_auth_token'];
        $decoded = JWT::decode($jwt_token, new Key($jwt_secret, $jwt_algorithm));
        $data = (array)$decoded;

        if (isset($data['exp']) && $data['exp'] < time()) {
            return ['success' => false, 'message' => 'Token has expired'];
        }

        $roles = [];
        if (isset($data['roles'])) {
            if (is_array($data['roles'])) {
                $roles = $data['roles'];
            } elseif (is_object($data['roles'])) {
                $roles = (array)$data['roles'];
            } elseif (is_string($data['roles'])) {
                $decodedRoles = json_decode($data['roles'], true);
                if (is_array($decodedRoles)) $roles = $decodedRoles;
            }
        }

        if (!in_array('admin', $roles, true) && !in_array('super_admin', $roles, true)) {
            return ['success' => false, 'message' => 'Forbidden'];
        }

        return ['success' => true, 'user' => $data];
    } catch (Exception $e) {
        error_log('Admin JWT verification error: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Invalid token'];
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie();
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
            o.status,
            o.payment_status,
            o.placed_at,
            u.first_name,
            u.last_name,
            u.email,
            COUNT(oi.order_item_id) AS item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
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

    $orders = [];
    foreach ($rows as $r) {
        $customerName = trim(($r['first_name'] ?? '') . ' ' . ($r['last_name'] ?? ''));
        if ($customerName === '') $customerName = '—';

        $orders[] = [
            'id' => (int)$r['order_id'],
            'orderNumber' => $r['order_number'],
            'totalAmount' => (float)$r['total_amount'],
            'status' => $r['status'],
            'paymentStatus' => $r['payment_status'],
            'placedAt' => $r['placed_at'],
            'items' => (int)$r['item_count'],
            'customerName' => $customerName,
            'customerEmail' => $r['email']
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
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin get orders error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
