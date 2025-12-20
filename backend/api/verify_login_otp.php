<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        sendResponse(false, 'Invalid JSON data', null, 400);
    }

    if (empty($input['mobile']) || empty($input['otp_code'])) {
        sendResponse(false, 'Mobile and OTP code are required', null, 400);
    }

    $mobile   = trim($input['mobile']);
    $otp_code = trim($input['otp_code']);

    if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $mobile))) {
        sendResponse(false, 'Invalid mobile number format', null, 400);
    }

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $stored_number = preg_replace('/\D/', '', $mobile);

    $verify_query = "SELECT otp_id, otp_code, expires_at, is_used_email, is_used_number, created_at FROM otp_verification
                     WHERE number = :number
                     AND otp_code = :otp_code
                     AND purpose = 'login'
                     ORDER BY created_at DESC
                     LIMIT 1";

    $verify_stmt = $db->prepare($verify_query);
    $verify_stmt->bindParam(':number', $stored_number);
    $verify_stmt->bindParam(':otp_code', $otp_code);
    $verify_stmt->execute();

    if ($verify_stmt->rowCount() === 0) {
        sendResponse(false, 'Invalid OTP code', null, 400);
    }

    $otp_data = $verify_stmt->fetch();

    if ((isset($otp_data['is_used_number']) && $otp_data['is_used_number'] == 1) || (isset($otp_data['is_used']) && $otp_data['is_used'] == 1)) {
        sendResponse(false, 'OTP code has already been used', null, 400);
    }

    $current_time = time();
    $expiry_time  = strtotime($otp_data['expires_at']);

    if ($expiry_time <= $current_time) {
        sendResponse(false, 'OTP code has expired', null, 400);
    }

    $user_query = 'SELECT user_id, first_name, last_name, email, email_verified, is_active FROM users WHERE phone = :phone';
    $user_stmt = $db->prepare($user_query);
    $user_stmt->bindParam(':phone', $mobile);
    $user_stmt->execute();

    if ($user_stmt->rowCount() === 0) {
        sendResponse(false, 'User not found. Please register first.', null, 400);
    }

    $user = $user_stmt->fetch();

    if ($user['email_verified'] != 1 || $user['is_active'] != 1) {
        sendResponse(false, 'Your account is not active. Please complete verification.', null, 401);
    }

    $db->beginTransaction();

    try {
        if (array_key_exists('is_used_number', $otp_data)) {
            $update_otp_query = 'UPDATE otp_verification SET is_used_number = 1 WHERE otp_id = :otp_id';
        } else {
            $update_otp_query = 'UPDATE otp_verification SET is_used = 1 WHERE otp_id = :otp_id';
        }

        $update_otp_stmt = $db->prepare($update_otp_query);
        $update_otp_stmt->bindParam(':otp_id', $otp_data['otp_id']);
        $update_otp_stmt->execute();

        $db->commit();
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }

    $jwt_secret = $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production-2024';
    $jwt_algorithm = 'HS256';

    $current_time = time();
    $expiration_time = $current_time + (7 * 24 * 60 * 60);

    $payload = [
        'iss' => 'makemyveggies',
        'aud' => 'makemyveggies-users',
        'iat' => $current_time,
        'nbf' => $current_time,
        'exp' => $expiration_time,
        'user_id' => $user['user_id'],
        'email' => $user['email'],
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name']
    ];

    $jwt_token = JWT::encode($payload, $jwt_secret, $jwt_algorithm);

    $cookie_options = [
        'expires' => $expiration_time,
        'path' => '/',
        'domain' => '',
        'secure' => false,
        'httponly' => true,
        'samesite' => 'Lax'
    ];

    setcookie('auth_token', $jwt_token, $cookie_options);

    sendResponse(true, 'Login successful', [
        'user' => [
            'user_id' => $user['user_id'],
            'email' => $user['email'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ]
    ]);

} catch (Exception $e) {
    error_log('Verify login OTP error: ' . $e->getMessage());
    sendResponse(false, 'Login via OTP failed. Please try again.', null, 500);
}
