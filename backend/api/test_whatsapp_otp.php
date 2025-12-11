<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php'; // for setCorsHeaders() and sendResponse()

setCorsHeaders();

function sendWhatsAppOtp($country_code, $phone, $otp_code)
{
    // Fast2SMS WhatsApp credentials / config (same as main API)
    $apiKey        = 'lFHzTKBtOADpSwrZkWc9suv1hfNg6xL2PdV7QMIaGj3eCynRUXliazCgN8DdU4WoTPEHm7u10QfJIjtF';
    $phoneNumberId = '908580938995112';
    $templateName  = 'otp_template';
    $languageCode  = 'en_US';

    $to = preg_replace('/\D/', '', $country_code . $phone);

    $url = "https://www.fast2sms.com/dev/whatsapp/v24.0/{$phoneNumberId}/messages";

    $payload = [
        'messaging_product' => 'whatsapp',
        'recipient_type'    => 'individual',
        'to'                => $to,
        'type'              => 'template',
        'template'          => [
            'name'     => $templateName,
            'language' => [
                'code' => $languageCode,
            ],
            'components' => [
                [
                    'type'       => 'body',
                    'parameters' => [
                        [
                            'type' => 'text',
                            'text' => $otp_code,
                        ],
                    ],
                ],
                [
                    'type'       => 'button',
                    'sub_type'   => 'url',
                    'index'      => '0',
                    'parameters' => [
                        [
                            'type' => 'text',
                            'text' => $otp_code,
                        ],
                    ],
                ],
            ],
        ],
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'content-type: application/json',
            'authorization: ' . $apiKey,
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload),
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    error_log("Fast2SMS WhatsApp TEST response: HTTP {$httpCode}, error={$error}, body={$response}");

    return [
        'http_code' => $httpCode,
        'error'     => $error,
        'body'      => $response,
    ];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendResponse(false, 'Invalid JSON data', null, 400);
}

if (empty($input['phone']) || empty($input['country_code'])) {
    sendResponse(false, 'country_code and phone are required', null, 400);
}

$phone        = trim($input['phone']);
$country_code = trim($input['country_code']);
$otp_code     = !empty($input['otp_code']) ? trim($input['otp_code']) : sprintf('%06d', mt_rand(100000, 999999));

// Basic validation similar to main API
if (!preg_match('/^\+?[0-9]{1,4}$/', $country_code)) {
    sendResponse(false, 'Invalid country code format', null, 400);
}

if (!preg_match('/^[0-9]{6,15}$/', preg_replace('/\D/', '', $phone))) {
    sendResponse(false, 'Invalid phone number format', null, 400);
}

$result = sendWhatsAppOtp($country_code, $phone, $otp_code);

if ($result['error'] || $result['http_code'] < 200 || $result['http_code'] >= 300) {
    sendResponse(false, 'Failed to send OTP via WhatsApp (TEST). Check logs / Fast2SMS panel.', [
        'otp_code'  => $otp_code,
        'request'   => [
            'country_code' => $country_code,
            'phone'        => $phone,
        ],
        'response'  => $result,
    ], 500);
}

sendResponse(true, 'WhatsApp OTP TEST sent (no DB).', [
    'otp_code'  => $otp_code,
    'request'   => [
        'country_code' => $country_code,
        'phone'        => $phone,
    ],
    'response'  => $result,
]);

?>
