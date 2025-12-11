<?php
// WhatsApp OTP sending helper using Fast2SMS WABA API
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

function sendWhatsAppOtp($country_code, $phone, $otp_code)
{
    $apiKey       = 'lFHzTKBtOADpSwrZkWc9suv1hfNg6xL2PdV7QMIaGj3eCynRUXliazCgN8DdU4WoTPEHm7u10QfJIjtF';
    $templateName = 'otp_template'; // EXACT NAME

    // Build full WhatsApp number (only digits)
    $to = preg_replace('/\D/', '', $country_code . $phone);

    $url = 'https://www.fast2sms.com/dev/waba/v1/messages';

    $payload = [
        'to'       => $to,
        'type'     => 'template',
        'template' => [
            'name'     => $templateName,
            'language' => [
                'code' => 'en_US',
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
    $curlErr  = curl_error($ch);
    curl_close($ch);

    error_log('WABA SEND HTTP ' . $httpCode . ' CURL_ERR ' . $curlErr . ' RESPONSE ' . $response);

    return ($httpCode >= 200 && $httpCode < 300);
}
