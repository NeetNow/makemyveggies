<?php
// Check Authentication Status API endpoint
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

setCorsHeaders();

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $auth_result = verifyJWTFromCookie();
    
    if ($auth_result['success']) {
        sendResponse(true, 'Authenticated', $auth_result['user']);
    } else {
        sendResponse(false, $auth_result['message'], null, 401);
    }
    
} catch (Exception $e) {
    error_log("Auth check error: " . $e->getMessage());
    sendResponse(false, 'Authentication check failed: ' . $e->getMessage(), null, 500);
}
?>
