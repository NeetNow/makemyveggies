<?php
// Include database configuration
include '../config/database.php';

// Set CORS headers
setCorsHeaders();

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

// Clear the auth_token cookie with matching settings
setcookie('auth_token', '', [
    'expires' => time() - 3600, // Expire in the past
    'path' => '/',
    'domain' => '', // leave empty for localhost
    'secure' => true, // HTTPS only
    'httponly' => true,
    'samesite' => 'Strict'
]);

// Return success response
sendResponse(true, 'Logout successful');
?>
