<?php
// Request password reset OTP via WhatsApp
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

function sendWhatsAppOtp($country_code, $phone, $otp_code)
{
    // Fast2SMS WhatsApp credentials / config
    $apiKey        = $_ENV['FAST2SMS_WHATSAPP_API_KEY'] ?? '';
    $messageId     = $_ENV['FAST2SMS_WHATSAPP_MESSAGE_ID'] ?? '';
    $phoneNumberId = $_ENV['FAST2SMS_WHATSAPP_PHONE_NUMBER_ID'] ?? '';

    // Fast2SMS expects just the mobile number in `numbers`
    $numbers          = preg_replace('/\D/', '', $phone);
    $variables_values = $otp_code;

    $baseUrl = 'https://www.fast2sms.com/dev/whatsapp';

    $queryParams = http_build_query([
        'authorization'    => $apiKey,
        'message_id'       => $messageId,
        'phone_number_id'  => $phoneNumberId,
        'numbers'          => $numbers,
        'variables_values' => $variables_values,
    ]);

    $url = $baseUrl . '?' . $queryParams;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPGET        => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);
    error_log("Fast2SMS WhatsApp response: HTTP {$httpCode}, error={$error}, body={$response}");

    if ($error || $httpCode < 200 || $httpCode >= 300) {
        error_log('Fast2SMS WhatsApp OTP send failed. HTTP ' . $httpCode . ' Error: ' . $error . ' Response: ' . $response);
        return false;
    }

    return true;
}

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

    // Mobile-only reset: only phone is required from client
    if (empty($input['phone'])) {
        sendResponse(false, 'Phone is required', null, 400);
    }

    $phone = trim($input['phone']);

    // Basic phone validation (6-15 digits)
    if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $phone))) {
        sendResponse(false, 'Invalid phone number format', null, 400);
    }

    // Normalize phone digits for storage in otp_verification.number
    $stored_number = preg_replace('/\D/', '', $phone);

    // Default country code for WhatsApp sending (can be adjusted via env later)
    $country_code = '+91';

    try {
        $database = new Database();
        $db = $database->getConnection();

        if (!$db) {
            throw new Exception('Database connection failed');
        }
    } catch (Exception $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage(), null, 500);
    }

    // Check if user exists by phone and is active / verified
    $check_query = "SELECT user_id, first_name, last_name, email, email_verified, is_active FROM users WHERE phone = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$stored_number]);

    if ($check_stmt->rowCount() == 0) {
        sendResponse(false, 'Phone not found. Please register first.', null, 404);
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
    $cleanup_stmt->execute([$user['email']]);

    // Store new OTP in database using unified schema (email + number + is_used_email/number)
    $otp_query = "INSERT INTO otp_verification (email, number, otp_code, purpose, expires_at, is_used_email, is_used_number, created_at)
                  VALUES (?, ?, ?, 'password_reset', ?, 0, 0, CURRENT_TIMESTAMP)";
    $otp_stmt  = $db->prepare($otp_query);

    if (!$otp_stmt->execute([$user['email'], $stored_number, $otp_code, $expires_at])) {
        sendResponse(false, 'Failed to store WhatsApp OTP', null, 500);
    }

    // Send OTP via WhatsApp using Fast2SMS helper (same as send_sms_otp.php)
    $sent = sendWhatsAppOtp($country_code, $phone, $otp_code);

    if (!$sent) {
        sendResponse(false, 'Failed to send OTP via WhatsApp. Please try again.', null, 500);
    }

    // Return success
    sendResponse(true, 'OTP sent to your WhatsApp number.', [
        'email'          => $user['email'],
        'otp_expires_in' => 600,
        'country_code'   => $country_code,
        'phone'          => $phone,
    ]);

} catch (Exception $e) {
    error_log('Password reset WhatsApp OTP error: ' . $e->getMessage());
    sendResponse(false, 'Failed to process password reset request via WhatsApp.', null, 500);
}

?>
