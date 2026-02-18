<?php
// Admin Login API endpoint
// Source - https://stackoverflow.com/q
// Posted by Abs, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-14, License - CC BY-SA 4.0

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';
// Load environment from backend root (same as other APIs)
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

setCorsHeaders();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        sendResponse(false, 'Invalid JSON data', null, 400);
    }

    $email = !empty($input['email']) ? trim(strtolower($input['email'])) : null;
    $password = !empty($input['password']) ? $input['password'] : null;

    if (empty($email) || empty($password)) {
        sendResponse(false, 'Email and password are required', null, 400);
    }

    // DB connection
    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Database connection failed');
        }
    } catch (Exception $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage(), null, 500);
    }

    // Check if user exists, is active, verified, and has at least one role assigned
    $query = "
        SELECT u.user_id, u.first_name, u.last_name, u.password, u.email, u.email_verified, u.is_active
        FROM users u
        INNER JOIN user_roles ur ON ur.user_id = u.user_id
        INNER JOIN roles r ON r.id = ur.role_id
        WHERE u.email = ?
          AND u.is_active = 1
          AND u.email_verified = 1
        GROUP BY u.user_id
        LIMIT 1
    ";

    $stmt = $db->prepare($query);
    $stmt->execute([$email]);

    if ($stmt->rowCount() === 0) {
        // Either user not found, not verified/active, or not an admin
        sendResponse(false, 'Invalid admin credentials', null, 401);
    }

    $user = $stmt->fetch();

    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendResponse(false, 'Invalid admin credentials', null, 401);
    }

    $rolesStmt = $db->prepare("
        SELECT r.name
        FROM user_roles ur
        INNER JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = ?
    ");
    $rolesStmt->execute([(int)$user['user_id']]);
    $roleRows = $rolesStmt->fetchAll();

    $roles = [];
    foreach ($roleRows as $rr) {
        if (!empty($rr['name'])) {
            $roles[] = $rr['name'];
        }
    }
    if (empty($roles)) {
        sendResponse(false, 'No role assigned to this user', null, 403);
    }

    // JWT Configuration
    $jwt_secret = $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production-2024';
    $jwt_algorithm = 'HS256';

    $current_time = time();
    $expiration_time = $current_time + (7 * 24 * 60 * 60); // 7 days

    $payload = [
        'iss' => 'makemyveggies', // Issuer
        'aud' => 'makemyveggies-admins', // Audience for admins
        'iat' => $current_time,
        'nbf' => $current_time,
        'exp' => $expiration_time,
        'user_id' => $user['user_id'],
        'email' => $user['email'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'roles' => $roles
    ];

    $jwt_token = JWT::encode($payload, $jwt_secret, $jwt_algorithm);

    // Set HTTP-only cookie with JWT token (can reuse same cookie name or a separate one)
    $cookie_options = [
        'expires' => $expiration_time,
        'path' => '/',
        'domain' => '', // Set to your domain in production
        'secure' => false, // Set to true in production with HTTPS
        'httponly' => true,
        'samesite' => 'Lax'
    ];

    setcookie('admin_auth_token', $jwt_token, $cookie_options);

    // Return success (no token in body, it's in cookie)
    sendResponse(true, 'Admin login successful', [
        'user' => [
            'user_id' => $user['user_id'],
            'email' => $user['email'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin login error: ' . $e->getMessage());
    sendResponse(false, 'Admin login failed: ' . $e->getMessage(), null, 500);
}
