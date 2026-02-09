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
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $input = readJsonInput();
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        exit();
    }

    $userId = isset($input['user_id']) ? (int)$input['user_id'] : 0;
    if ($userId < 1) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid user_id']);
        exit();
    }

    $first = isset($input['first_name']) ? trim((string)$input['first_name']) : null;
    $last = isset($input['last_name']) ? trim((string)$input['last_name']) : null;
    $email = isset($input['email']) ? trim(strtolower((string)$input['email'])) : null;
    $password = isset($input['password']) ? (string)$input['password'] : null;
    $phone = array_key_exists('phone', $input) ? trim((string)$input['phone']) : null;
    $isActive = isset($input['is_active']) ? (bool)$input['is_active'] : null;
    $emailVerified = isset($input['email_verified']) ? (bool)$input['email_verified'] : null;
    $roles = isset($input['roles']) && is_array($input['roles']) ? $input['roles'] : null;

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    $pdo->beginTransaction();

    $existsStmt = $pdo->prepare('SELECT user_id FROM users WHERE user_id = ? LIMIT 1');
    $existsStmt->execute([$userId]);
    if (!$existsStmt->fetchColumn()) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit();
    }

    if ($email !== null) {
        $emailCheck = $pdo->prepare('SELECT user_id FROM users WHERE email = ? AND user_id <> ? LIMIT 1');
        $emailCheck->execute([$email, $userId]);
        if ($emailCheck->fetchColumn()) {
            $pdo->rollBack();
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
            exit();
        }
    }

    $fields = [];
    $params = [];

    if ($first !== null) {
        $fields[] = 'first_name = ?';
        $params[] = $first;
    }
    if ($last !== null) {
        $fields[] = 'last_name = ?';
        $params[] = $last;
    }
    if ($email !== null) {
        $fields[] = 'email = ?';
        $params[] = $email;
    }
    if ($phone !== null) {
        $fields[] = 'phone = ?';
        $params[] = $phone !== '' ? $phone : null;
    }
    if ($isActive !== null) {
        $fields[] = 'is_active = ?';
        $params[] = $isActive ? 1 : 0;
    }
    if ($emailVerified !== null) {
        $fields[] = 'email_verified = ?';
        $params[] = $emailVerified ? 1 : 0;
    }
    if ($password !== null && $password !== '') {
        $fields[] = 'password = ?';
        $params[] = password_hash($password, PASSWORD_DEFAULT);
    }

    if (!empty($fields)) {
        $params[] = $userId;
        $upd = $pdo->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE user_id = ?');
        $upd->execute($params);
    }

    if (is_array($roles)) {
        $pdo->prepare('DELETE FROM user_roles WHERE user_id = ?')->execute([$userId]);

        if (!empty($roles)) {
            $roleStmt = $pdo->prepare('SELECT id, name FROM roles WHERE name IN (' . implode(',', array_fill(0, count($roles), '?')) . ')');
            $roleStmt->execute(array_values($roles));
            $roleRows = $roleStmt->fetchAll(PDO::FETCH_ASSOC);

            $insertUr = $pdo->prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)');
            foreach ($roleRows as $rr) {
                $insertUr->execute([$userId, (int)$rr['id']]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'User updated']);
} catch (Exception $e) {
    if (isset($pdo) && $pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('update_user error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update user']);
}
?>
