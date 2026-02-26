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

    $rows = $pdo->query("SELECT id, name FROM roles WHERE name <> 'super_admin' ORDER BY name ASC")->fetchAll(PDO::FETCH_ASSOC);
    $roles = [];
    foreach ($rows as $r) {
        $roles[] = ['id' => (int)$r['id'], 'name' => (string)$r['name']];
    }

    echo json_encode(['status' => 'success', 'roles' => $roles]);
} catch (Exception $e) {
    error_log('get_roles error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to load roles']);
}
?>
