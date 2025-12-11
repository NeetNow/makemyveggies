
<?php

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

function sendWhatsAppOtp($country_code, $phone, $otp_code)
{
    // Fast2SMS WhatsApp credentials / config
    $apiKey        = 'lFHzTKBtOADpSwrZkWc9suv1hfNg6xL2PdV7QMIaGj3eCynRUXliazCgN8DdU4WoTPEHm7u10QfJIjtF';              // from Fast2SMS Dev API section
    $messageId     = '8855';                 // Fast2SMS WhatsApp template / message ID
    $phoneNumberId = '908580938995112';      // WABA phone number ID configured in Fast2SMS

    // In the example URL Fast2SMS expects just the mobile number in `numbers`
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
    error_log("Fast2SMS WhatsApp response: HTTP {$httpCode}, error={$error}, body={$response}");

    if ($error || $httpCode < 200 || $httpCode >= 300) {
        error_log('Fast2SMS WhatsApp OTP send failed. HTTP ' . $httpCode . ' Error: ' . $error . ' Response: ' . $response);
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

    if (empty($input['phone']) || empty($input['country_code'])) {
        sendResponse(false, 'Country code and phone are required', null, 400);
    }

    $phone        = trim($input['phone']);
    $country_code = trim($input['country_code']);

    // Country code: allow + or digits, then normalize later
    if (!preg_match('/^\+?[0-9]{1,4}$/', $country_code)) {
        sendResponse(false, 'Invalid country code format', null, 400);
    }

    // Phone number: 6 to 15 digits
    if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $phone))) {
        sendResponse(false, 'Invalid phone number format', null, 400);
    }

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $otp_code   = sprintf('%06d', mt_rand(100000, 999999));
    $expires_at = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes expiry

    // Normalize phone digits for storage in `number`
    $stored_number = preg_replace('/\D/', '', $phone);

    // Cleanup existing SMS OTPs for this number to prevent spam/reuse
    $cleanup_query = "DELETE FROM otp_verification WHERE number = ? AND purpose = 'number_verification'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$stored_number]);

    $otp_query = "INSERT INTO otp_verification (email, number, otp_code, purpose, expires_at, is_used, created_at) VALUES (NULL, ?, ?, 'number_verification', ?, 0, CURRENT_TIMESTAMP)";
    $otp_stmt = $db->prepare($otp_query);

    if (!$otp_stmt->execute([$stored_number, $otp_code, $expires_at])) {
        sendResponse(false, 'Failed to store SMS OTP', null, 500);
    }

    // Send the OTP via WhatsApp using the WhatsApp Cloud API
    $sent = sendWhatsAppOtp($country_code, $phone, $otp_code);

    if (!$sent) {
        $db->prepare("DELETE FROM otp_verification WHERE number = ? AND otp_code = ? AND purpose = 'number_verification'")
           ->execute([$stored_number, $otp_code]);
        
        sendResponse(false, 'Failed to send OTP via WhatsApp. Please try again.', null, 500);
    }

    sendResponse(true, 'OTP sent to your mobile number via WhatsApp.', [
        'otp_expires_in'  => 600,
        'country_code'    => $country_code,
        'phone'           => $phone
    ]);

} catch (Exception $e) {
    error_log('Send WhatsApp OTP error: ' . $e->getMessage());
    sendResponse(false, 'Failed to send WhatsApp OTP. Please try again.', null, 500);
}
?>
