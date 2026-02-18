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

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie(['super_admin']);
    if (!$auth['success']) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $input = readJsonInput();
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit();
    }

    $roleId = isset($input['id']) ? (int)$input['id'] : 0;
    $name = isset($input['name']) ? trim((string)$input['name']) : '';
    $permissionIds = isset($input['permissionIds']) && is_array($input['permissionIds']) ? $input['permissionIds'] : [];

    if ($roleId <= 0 || $name === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Role id and name are required']);
        exit();
    }

    $database = new Database();
    $pdo = $database->getConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('UPDATE roles SET name = ? WHERE id = ?');
    $stmt->execute([$name, $roleId]);

    $pdo->prepare('DELETE FROM role_permissions WHERE role_id = ?')->execute([$roleId]);

    $cleanIds = [];
    foreach ($permissionIds as $pid) {
        $n = (int)$pid;
        if ($n > 0) $cleanIds[] = $n;
    }
    $cleanIds = array_values(array_unique($cleanIds));

    if (count($cleanIds) > 0) {
        $ins = $pdo->prepare('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)');
        foreach ($cleanIds as $pid) {
            $ins->execute([$roleId, $pid]);
        }
    }

    $pdo->commit();

    echo json_encode(['status' => 'success', 'role' => ['id' => $roleId, 'name' => $name]]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('update_role error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update role']);
}
?>
