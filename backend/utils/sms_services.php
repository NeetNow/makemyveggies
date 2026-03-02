<?php
// SMS OTP service using Fast2SMS

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

class SmsService {
    private $api_key;
    private $api_url;
    private $route;
    private $sender_id;
    private $template_id;
    private $route_text;

    public function __construct() {
        $this->api_key     = $_ENV['FAST2SMS_API_KEY'] ?? '';
        $this->api_url     = $_ENV['FAST2SMS_URL'] ?? 'https://www.fast2sms.com/dev/bulkV2';
        $this->route       = $_ENV['FAST2SMS_ROUTE'] ?? 'otp';
        $this->sender_id   = $_ENV['FAST2SMS_SENDER_ID'] ?? '';
        $this->template_id = $_ENV['FAST2SMS_TEMPLATE_ID'] ?? '';
        $this->route_text  = $_ENV['FAST2SMS_ROUTE_TEXT'] ?? 'q';
    }

    public function sendOTP($country_code, $phone, $otp_code) {
        if (empty($this->api_key)) {
            error_log('FAST2SMS_API_KEY is not configured');
            return false;
        }

        $normalized_phone = preg_replace('/\D/', '', $phone);
        $normalized_country = preg_replace('/\D/', '', $country_code);
        $full_number = $normalized_country . $normalized_phone;

        $postData = [
            'route'            => $this->route,
            'variables_values' => $otp_code,
            'numbers'          => $full_number
        ];

        // Optional fields depending on your Fast2SMS setup
        if (!empty($this->sender_id)) {
            $postData['sender_id'] = $this->sender_id;
        }

        if (!empty($this->template_id)) {
            $postData['message'] = $this->template_id;
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $this->api_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($postData),
            CURLOPT_HTTPHEADER     => [
                'authorization: ' . $this->api_key,
                'Content-Type: application/x-www-form-urlencoded'
            ],
            CURLOPT_TIMEOUT        => 15,
        ]);

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            error_log('Fast2SMS cURL error: ' . $error);
            return false;
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            error_log('Fast2SMS HTTP error code: ' . $httpCode . ' Response: ' . $response);
            return false;
        }

        // Parse Fast2SMS JSON response to ensure logical success
        $decoded = json_decode($response, true);
        if ($decoded === null) {
            error_log('Fast2SMS invalid JSON response for number ' . $full_number . ': ' . $response);
            return false;
        }

        // Fast2SMS typically returns a boolean flag like `return` to indicate success
        if (isset($decoded['return']) && $decoded['return'] !== true) {
            error_log('Fast2SMS reported failure for number ' . $full_number . ': ' . $response);
            return false;
        }

        error_log('Fast2SMS OTP sent successfully to: ' . $full_number . ' Response: ' . $response);
        return true;
    }

    public function sendMessage($country_code, $phone, $message) {
        if (empty($this->api_key)) {
            error_log('FAST2SMS_API_KEY is not configured');
            return false;
        }

        $normalized_phone = preg_replace('/\D/', '', $phone);
        $normalized_country = preg_replace('/\D/', '', $country_code);
        $full_number = $normalized_country . $normalized_phone;

        $msg = trim((string)$message);
        if ($msg === '') {
            error_log('Fast2SMS sendMessage called with empty message');
            return false;
        }

        $postData = [
            'route'   => $this->route_text,
            'message' => $msg,
            'numbers' => $full_number
        ];

        if (!empty($this->sender_id)) {
            $postData['sender_id'] = $this->sender_id;
        }

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $this->api_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($postData),
            CURLOPT_HTTPHEADER     => [
                'authorization: ' . $this->api_key,
                'Content-Type: application/x-www-form-urlencoded'
            ],
            CURLOPT_TIMEOUT        => 15,
        ]);

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($error) {
            error_log('Fast2SMS cURL error: ' . $error);
            return false;
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            error_log('Fast2SMS HTTP error code: ' . $httpCode . ' Response: ' . $response);
            return false;
        }

        $decoded = json_decode($response, true);
        if ($decoded === null) {
            error_log('Fast2SMS invalid JSON response for number ' . $full_number . ': ' . $response);
            return false;
        }

        if (isset($decoded['return']) && $decoded['return'] !== true) {
            error_log('Fast2SMS reported failure for number ' . $full_number . ': ' . $response);
            return false;
        }

        error_log('Fast2SMS SMS sent successfully to: ' . $full_number . ' Response: ' . $response);
        return true;
    }
}
