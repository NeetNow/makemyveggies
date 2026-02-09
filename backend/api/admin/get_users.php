<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

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
    $auth = verifyAdminJWTFromCookie(['admin', 'super_admin']);
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

    $where = '1=1';
    $params = [];
    if ($search !== '') {
        $where = '(u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
        $term = '%' . $search . '%';
        $params = [$term, $term, $term];
    }

    $sql = "
        SELECT
            u.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.email_verified,
            u.is_active,
            u.created_at,
            GROUP_CONCAT(r.name ORDER BY r.name SEPARATOR ',') AS roles
        FROM users u
        LEFT JOIN user_roles ur ON ur.user_id = u.user_id
        LEFT JOIN roles r ON r.id = ur.role_id
        WHERE {$where}
        GROUP BY u.user_id
        ORDER BY u.created_at DESC
        LIMIT 200
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $users = [];
    foreach ($rows as $row) {
        $rolesStr = (string)($row['roles'] ?? '');
        $roles = [];
        if ($rolesStr !== '') {
            $parts = explode(',', $rolesStr);
            foreach ($parts as $p) {
                $p = trim($p);
                if ($p !== '') $roles[] = $p;
            }
        }

        $users[] = [
            'user_id' => (int)$row['user_id'],
            'first_name' => (string)$row['first_name'],
            'last_name' => (string)$row['last_name'],
            'email' => (string)$row['email'],
            'phone' => $row['phone'] !== null ? (string)$row['phone'] : null,
            'email_verified' => (int)$row['email_verified'] === 1,
            'is_active' => (int)$row['is_active'] === 1,
            'created_at' => (string)$row['created_at'],
            'roles' => $roles
        ];
    }

    echo json_encode(['status' => 'success', 'users' => $users]);
} catch (Exception $e) {
    error_log('get_users error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to load users']);
}
?>
