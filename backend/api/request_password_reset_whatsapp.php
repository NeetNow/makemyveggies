<?php
// Request password reset OTP via WhatsApp
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/whatsapp_service.php';

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

    // Validate required fields
    if (empty($input['email']) || empty($input['phone']) || empty($input['country_code'])) {
        sendResponse(false, 'Email, country code and phone are required', null, 400);
    }

    $email        = trim(strtolower($input['email']));
    $phone        = trim($input['phone']);
    $country_code = trim($input['country_code']);

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format', null, 400);
    }

    // Basic validation similar to send_whatsapp_otp.php
    if (!preg_match('/^[0-9]{1,4}$/', preg_replace('/\D/', '', $country_code))) {
        sendResponse(false, 'Invalid country code', null, 400);
    }

    if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $phone))) {
        sendResponse(false, 'Invalid phone number format', null, 400);
    }

    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Database connection failed');
        }
    } catch (Exception $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage(), null, 500);
    }

    // Check if user exists and is active / verified (same as email password reset)
    $check_query = "SELECT user_id, first_name, last_name, email_verified, is_active FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$email]);

    if ($check_stmt->rowCount() == 0) {
        sendResponse(false, 'Email not found. Please register first.', null, 404);
    }

    $user = $check_stmt->fetch();

    if ($user['email_verified'] != 1 || $user['is_active'] != 1) {
        sendResponse(false, 'Please verify your email before requesting password reset', null, 401);
    }

    // Generate OTP
    $otp_code   = sprintf('%06d', mt_rand(100000, 999999));
    $expires_at = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes

    // Clean up old OTPs for this email for password reset
    $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'password_reset'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$email]);

    // Store new OTP in database with purpose password_reset so existing verification APIs work
    $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at, is_used, created_at) VALUES (?, ?, 'password_reset', ?, 0, CURRENT_TIMESTAMP)";
    $otp_stmt  = $db->prepare($otp_query);

    if (!$otp_stmt->execute([$email, $otp_code, $expires_at])) {
        sendResponse(false, 'Failed to store WhatsApp OTP', null, 500);
    }

    // Send OTP via WhatsApp
    $whatsappService = new WhatsappService();
    $sent = $whatsappService->sendOTP($country_code, $phone, $otp_code);

    if (!$sent) {
        sendResponse(false, 'Failed to send OTP via WhatsApp. Please try again.', null, 500);
    }

    // Return success
    sendResponse(true, 'OTP sent to your WhatsApp number.', [
        'email'          => $email,
        'otp_expires_in' => 600,
        'country_code'   => $country_code,
        'phone'          => $phone,
    ]);

} catch (Exception $e) {
    error_log('Password reset WhatsApp OTP error: ' . $e->getMessage());
    sendResponse(false, 'Failed to process password reset request via WhatsApp.', null, 500);
}

?>
