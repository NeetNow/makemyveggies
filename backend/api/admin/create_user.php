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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

    $first = isset($input['first_name']) ? trim((string)$input['first_name']) : '';
    $last = isset($input['last_name']) ? trim((string)$input['last_name']) : '';
    $email = isset($input['email']) ? trim(strtolower((string)$input['email'])) : '';
    $password = isset($input['password']) ? (string)$input['password'] : '';
    $phone = isset($input['phone']) ? trim((string)$input['phone']) : null;
    $isActive = isset($input['is_active']) ? (bool)$input['is_active'] : true;
    $emailVerified = isset($input['email_verified']) ? (bool)$input['email_verified'] : true;
    $roles = isset($input['roles']) && is_array($input['roles']) ? $input['roles'] : [];

    if ($first === '' || $last === '' || $email === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
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

    $check = $pdo->prepare('SELECT user_id FROM users WHERE email = ? LIMIT 1');
    $check->execute([$email]);
    if ($check->fetchColumn()) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        exit();
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare('INSERT INTO users (first_name, last_name, email, password, phone, email_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$first, $last, $email, $hash, $phone !== '' ? $phone : null, $emailVerified ? 1 : 0, $isActive ? 1 : 0]);
    $userId = (int)$pdo->lastInsertId();

    if (!empty($roles)) {
        $roleStmt = $pdo->prepare('SELECT id, name FROM roles WHERE name IN (' . implode(',', array_fill(0, count($roles), '?')) . ')');
        $roleStmt->execute(array_values($roles));
        $roleRows = $roleStmt->fetchAll(PDO::FETCH_ASSOC);

        $insertUr = $pdo->prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)');
        foreach ($roleRows as $rr) {
            $insertUr->execute([$userId, (int)$rr['id']]);
        }
    }

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'User created', 'user_id' => $userId]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('create_user error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to create user']);
}
?>
