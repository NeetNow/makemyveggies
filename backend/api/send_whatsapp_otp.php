<?php
// Send WhatsApp / SMS OTP using Fast2SMS
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/whatsapp_service.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        sendResponse(false, 'Invalid JSON data', null, 400);
    }

    if (empty($input['email']) || empty($input['phone']) || empty($input['country_code'])) {
        sendResponse(false, 'Email, country code and phone are required', null, 400);
    }

    $email        = trim(strtolower($input['email']));
    $phone        = trim($input['phone']);
    $country_code = trim($input['country_code']);

    if (!preg_match('/^[0-9]{1,4}$/', preg_replace('/\D/', '', $country_code))) {
        sendResponse(false, 'Invalid country code', null, 400);
    }

    if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $phone))) {
        sendResponse(false, 'Invalid phone number format', null, 400);
    }

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $otp_code   = sprintf('%06d', mt_rand(100000, 999999));
    $expires_at = date('Y-m-d H:i:s', time() + (10 * 60));

    $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'whatsapp_registration'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$email]);

    $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at, is_used, created_at) VALUES (?, ?, 'whatsapp_registration', ?, 0, CURRENT_TIMESTAMP)";
    $otp_stmt = $db->prepare($otp_query);

    if (!$otp_stmt->execute([$email, $otp_code, $expires_at])) {
        sendResponse(false, 'Failed to store WhatsApp OTP', null, 500);
    }

    $whatsappService = new WhatsappService();
    $sent = $whatsappService->sendOTP($country_code, $phone, $otp_code);

    if (!$sent) {
        sendResponse(false, 'Failed to send OTP via WhatsApp. Please try again.', null, 500);
    }

    sendResponse(true, 'OTP sent to your WhatsApp number.', [
        'email'           => $email,
        'otp_expires_in'  => 600,
        'country_code'    => $country_code,
        'phone'           => $phone
    ]);

} catch (Exception $e) {
    error_log('Send WhatsApp OTP error: ' . $e->getMessage());
    sendResponse(false, 'Failed to send WhatsApp OTP. Please try again.', null, 500);
}
