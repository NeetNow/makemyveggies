<?php
// JWT Authentication Middleware
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

require_once __DIR__ . '/../config/database.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyJWTFromCookie() {
    $jwt_secret = $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production-2024';
    $jwt_algorithm = 'HS256';
    
    try {
        // Get JWT token from cookie
        if (!isset($_COOKIE['auth_token'])) {
            return ['success' => false, 'message' => 'No authentication token found'];
        }
        
        $jwt_token = $_COOKIE['auth_token'];
        
        // Decode and verify JWT token
        $decoded = JWT::decode($jwt_token, new Key($jwt_secret, $jwt_algorithm));
        
        // Convert to array
        $user_data = (array) $decoded;
        
        // Check if token is expired
        if (isset($user_data['exp']) && $user_data['exp'] < time()) {
            return ['success' => false, 'message' => 'Token has expired'];
        }
        
        return [
            'success' => true,
            'user' => [
                'user_id' => $user_data['user_id'],
                'email' => $user_data['email'],
                'first_name' => $user_data['first_name'],
                'last_name' => $user_data['last_name']
            ]
        ];
        
    } catch (Exception $e) {
        error_log("JWT verification error: " . $e->getMessage());
        return ['success' => false, 'message' => 'Invalid token: ' . $e->getMessage()];
    }
}

function requireAuth() {
    $auth_result = verifyJWTFromCookie();
    
    if (!$auth_result['success']) {
        sendResponse(false, $auth_result['message'], null, 401);
        exit;
    }
    
    return $auth_result['user'];
}
?>
