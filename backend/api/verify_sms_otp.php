<?php
// Verify SMS OTP and update number_verified
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        sendResponse(false, 'Invalid JSON data', null, 400);
    }

    if (empty($input['email']) || empty($input['phone']) || empty($input['country_code']) || empty($input['otp_code'])) {
        sendResponse(false, 'Email, phone, country code and OTP code are required', null, 400);
    }

    $email        = trim(strtolower($input['email']));
    $phone        = trim($input['phone']);
    $country_code = trim($input['country_code']);
    $otp_code     = trim($input['otp_code']);

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    // Normalize phone digits as stored in otp_verification.number
    $stored_number = preg_replace('/\D/', '', $phone);

    // Allow verification using either legacy 'number_verification' OTPs
    // or the shared registration OTP row (purpose 'registration')
    // Also compute expiry relative to NOW() using DATETIME semantics
    $verify_query = "SELECT otp_id, otp_code, expires_at, is_used_number, created_at,
                            TIMESTAMPDIFF(SECOND, NOW(), expires_at) AS seconds_left
                     FROM otp_verification
                     WHERE number = :number
                     AND otp_code = :otp_code
                     AND purpose IN ('number_verification', 'registration')
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

    // Check if OTP has already been used for number/phone
    if (isset($otp_data['is_used_number']) && $otp_data['is_used_number'] == 1) {
        sendResponse(false, 'SMS OTP code has already been used', null, 400);
    }

    // Check expiry using DATETIME (expires_at) vs NOW() in MySQL
    $seconds_left = isset($otp_data['seconds_left']) ? (int)$otp_data['seconds_left'] : null;

    error_log(
        'SMS OTP expiry check - Now vs expires_at for number ' . $stored_number .
        ' | expires_at: ' . $otp_data['expires_at'] .
        ' | seconds_left: ' . var_export($seconds_left, true)
    );

    if ($seconds_left !== null && $seconds_left <= 0) {
        sendResponse(false, 'OTP code has expired', null, 400);
    }

    $user_query = 'SELECT user_id, email_verified, number_verified FROM users WHERE email = :email';
    $user_stmt = $db->prepare($user_query);
    $user_stmt->bindParam(':email', $email);
    $user_stmt->execute();

    if ($user_stmt->rowCount() === 0) {
        sendResponse(false, 'User not found. Please register first.', null, 400);
    }

    $user_info = $user_stmt->fetch();

    if (isset($user_info['number_verified']) && $user_info['number_verified'] == 1) {
        sendResponse(false, 'Mobile number already verified.', null, 400);
    }

    $db->beginTransaction();

    try {
        // Mark OTP as used for number channel (if column exists)
        if (array_key_exists('is_used_number', $otp_data)) {
            $update_otp_query = 'UPDATE otp_verification SET is_used_number = 1 WHERE otp_id = :otp_id';
            $update_otp_stmt = $db->prepare($update_otp_query);
            $update_otp_stmt->bindParam(':otp_id', $otp_data['otp_id']);
            $update_otp_stmt->execute();
        }

        $update_user_query = 'UPDATE users SET number_verified = 1, is_active = CASE WHEN email_verified = 1 THEN 1 ELSE 0 END, updated_at = CURRENT_TIMESTAMP WHERE user_id = :user_id';
        $update_user_stmt = $db->prepare($update_user_query);
        $update_user_stmt->bindParam(':user_id', $user_info['user_id']);

        if (!$update_user_stmt->execute()) {
            $error_info = $update_user_stmt->errorInfo();
            throw new Exception('Failed to verify mobile number: ' . $error_info[2]);
        }

        $db->commit();

        sendResponse(true, 'Mobile number verification via SMS successful.', [
            'user_id'         => $user_info['user_id'],
            'number_verified' => 1
        ]);

    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log('Verify SMS OTP error: ' . $e->getMessage());
    sendResponse(false, 'SMS OTP verification failed. Please try again.', null, 500);
}
