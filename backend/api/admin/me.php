<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Method not allowed', null, 405);
}

$auth = verifyAdminJWTFromCookie([]);
if (!$auth['success']) {
    sendResponse(false, $auth['message'] ?? 'Unauthorized', null, 401);
}

$user = $auth['user'] ?? [];
$userId = isset($user['user_id']) ? (int)$user['user_id'] : 0;
if ($userId <= 0) {
    sendResponse(false, 'Invalid token payload', null, 401);
}

try {
    $database = new Database();
    $db = $database->getConnection();
    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $stmt = $db->prepare("
        SELECT DISTINCT p.name
        FROM user_roles ur
        INNER JOIN role_permissions rp ON rp.role_id = ur.role_id
        INNER JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = ?
        ORDER BY p.name ASC
    ");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();

    $permissions = [];
    foreach ($rows as $r) {
        if (!empty($r['name'])) {
            $permissions[] = $r['name'];
        }
    }

    $roles = [];
    if (isset($user['roles']) && is_array($user['roles'])) {
        $roles = $user['roles'];
    }

    sendResponse(true, 'OK', [
        'user' => [
            'user_id' => $userId,
            'email' => $user['email'] ?? null,
            'first_name' => $user['first_name'] ?? null,
            'last_name' => $user['last_name'] ?? null,
            'roles' => $roles
        ],
        'permissions' => $permissions
    ]);
} catch (Exception $e) {
    error_log('me.php error: ' . $e->getMessage());
    sendResponse(false, 'Failed to load admin session', null, 500);
}
