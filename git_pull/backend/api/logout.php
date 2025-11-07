<?php
// Logout API endpoint
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    // Clear the auth cookie by setting it to expire in the past
    $cookie_options = [
        'expires' => time() - 3600, // 1 hour ago
        'path' => '/',
        'domain' => '', // Set to your domain in production
        'secure' => false, // Set to true in production with HTTPS
        'httponly' => true,
        'samesite' => 'Lax'
    ];
    
    setcookie('auth_token', '', $cookie_options);
    
    // Return success
    sendResponse(true, 'Logout successful', null);
    
} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    sendResponse(false, 'Logout failed: ' . $e->getMessage(), null, 500);
}
?>
