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

$roleId = isset($_GET['role_id']) ? (int)$_GET['role_id'] : 0;
if ($roleId <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'role_id is required']);
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

    $stmt = $pdo->prepare('SELECT permission_id FROM role_permissions WHERE role_id = ?');
    $stmt->execute([$roleId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $permissionIds = [];
    foreach ($rows as $r) {
        $permissionIds[] = (int)$r['permission_id'];
    }

    echo json_encode(['status' => 'success', 'permissionIds' => $permissionIds]);
} catch (Exception $e) {
    error_log('get_role_permissions error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to load role permissions']);
}
?>
