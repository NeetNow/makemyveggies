<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyJWTToken() {
    // Get token from cookie (primary method for our implementation)
    $jwt = null;
    if (isset($_COOKIE['auth_token'])) {
        $jwt = $_COOKIE['auth_token'];
    }
    
    // Fallback to Authorization header
    if (!$jwt) {
        $authHeader = null;
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        
        if ($authHeader) {
            $authHeaderParts = explode(' ', $authHeader);
            if ($authHeaderParts[0] === 'Bearer' && isset($authHeaderParts[1])) {
                $jwt = $authHeaderParts[1];
            }
        }
    }
    
    if (!$jwt) {
        sendResponse(false, 'Access denied. No token provided.', null, 401);
    }
    
    try {
        $secret_key = "makemyveggies_jwt_secret_key_2025"; // Stronger secret key
        $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
        
        // Return user data
        return $decoded->data;
    } catch (Exception $e) {
        sendResponse(false, 'Invalid token: ' . $e->getMessage(), null, 401);
    }
}
?>
