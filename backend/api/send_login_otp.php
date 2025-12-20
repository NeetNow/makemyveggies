<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

// Helper to send WhatsApp OTP for login using Fast2SMS
function sendLoginWhatsAppOtp($phone, $otp_code)
{
    $apiKey        = $_ENV['FAST2SMS_WHATSAPP_API_KEY'] ?? '';
    $messageId     = $_ENV['FAST2SMS_WHATSAPP_MESSAGE_ID'] ?? '';
    $phoneNumberId = $_ENV['FAST2SMS_WHATSAPP_PHONE_NUMBER_ID'] ?? '';

    $numbers          = preg_replace('/\D/', '', $phone);
    $variables_values = $otp_code;

    $baseUrl = 'https://www.fast2sms.com/dev/whatsapp';

    $queryParams = http_build_query([
        'authorization'   => $apiKey,
        'message_id'      => $messageId,
        'phone_number_id' => $phoneNumberId,
        'numbers'         => $numbers,
        'variables_values'=> $variables_values,
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

    error_log("Fast2SMS Login WhatsApp OTP response: HTTP {$httpCode}, error={$error}, body={$response}");

    if ($error || $httpCode < 200 || $httpCode >= 300) {
        error_log('Fast2SMS Login WhatsApp OTP send failed. HTTP ' . $httpCode . ' Error: ' . $error . ' Response: ' . $response);
        return false;
    }

    return true;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        sendResponse(false, 'Invalid JSON data', null, 400);
    }

    if (empty($input['mobile'])) {
        sendResponse(false, 'Mobile is required', null, 400);
    }

    $mobile = trim($input['mobile']);

    if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $mobile))) {
        sendResponse(false, 'Invalid mobile number format', null, 400);
    }

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $user_query = 'SELECT user_id, phone, email, email_verified, is_active FROM users WHERE phone = :phone';
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

    $otp_code   = sprintf('%06d', mt_rand(100000, 999999));
    $expires_at = date('Y-m-d H:i:s', time() + (10 * 60));

    // Normalize phone digits for storage in `number`
    $stored_number = preg_replace('/\D/', '', $mobile);

    // Cleanup existing login OTPs for this number to prevent spam/reuse
    $cleanup_query = "DELETE FROM otp_verification WHERE number = ? AND purpose = 'login'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$stored_number]);

    // Store new OTP for login
    $otp_query = "INSERT INTO otp_verification (email, number, otp_code, purpose, expires_at, is_used_email, is_used_number, created_at) VALUES (?, ?, ?, 'login', ?, 0, 0, CURRENT_TIMESTAMP)";
    $otp_stmt = $db->prepare($otp_query);

    if (!$otp_stmt->execute([$user['email'], $stored_number, $otp_code, $expires_at])) {
        sendResponse(false, 'Failed to store login OTP', null, 500);
    }

    // Send the OTP via WhatsApp using Fast2SMS
    $sent = sendLoginWhatsAppOtp($mobile, $otp_code);

    if (!$sent) {
        $db->prepare("DELETE FROM otp_verification WHERE number = ? AND otp_code = ? AND purpose = 'login'")
           ->execute([$stored_number, $otp_code]);

        sendResponse(false, 'Failed to send OTP via WhatsApp. Please try again.', null, 500);
    }

    sendResponse(true, 'Login OTP sent to your mobile number via WhatsApp.', [
        'otp_expires_in' => 600,
        'mobile'         => $mobile
    ]);

} catch (Exception $e) {
    error_log('Send login OTP error: ' . $e->getMessage());
    sendResponse(false, 'Failed to send login OTP. Please try again.', null, 500);
}
