<?php
// Include database configuration
include '../config/database.php';
include '../middleware/jwt_auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Set CORS headers
setCorsHeaders();

// Verify JWT token
$userData = verifyJWTToken();
$tokenUserId = $userData->user_id;

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if required data is provided
if (!isset($input['userId']) || empty($input['userId'])) {
    sendResponse(false, 'User ID is required');
}

// Verify that the userId in the request matches the token userId
if ($input['userId'] != $tokenUserId) {
    sendResponse(false, 'Unauthorized access');
}

if (!isset($input['currentPassword']) || empty($input['currentPassword'])) {
    sendResponse(false, 'Current password is required');
}

if (!isset($input['newPassword']) || empty($input['newPassword'])) {
    sendResponse(false, 'New password is required');
}

$userId = $input['userId'];
$currentPassword = $input['currentPassword'];
$newPassword = $input['newPassword'];

try {
    // Create database connection using the Database class
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        sendResponse(false, 'Database connection failed');
    }
    
    // Fetch current user data to verify current password
    $stmt = $pdo->prepare("SELECT password FROM users WHERE user_id = ? AND is_active = 1");
    $stmt->execute([$userId]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sendResponse(false, 'User not found');
    }
    
    // Verify current password
    if (!password_verify($currentPassword, $user['password'])) {
        sendResponse(false, 'Current password is incorrect');
    }
    
    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password
    $stmt = $pdo->prepare("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?");
    $stmt->execute([$hashedPassword, $userId]);
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Password changed successfully');
    } else {
        sendResponse(false, 'Failed to change password');
    }
} catch (PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>
