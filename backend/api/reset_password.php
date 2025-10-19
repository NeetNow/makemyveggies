<?php
// Reset password after OTP verification
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
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        sendResponse(false, 'Invalid JSON data', null, 400);
    }
    
    // Validate required fields
    if (empty($input['email']) || empty($input['otp']) || empty($input['new_password'])) {
        sendResponse(false, 'Email, OTP code, and new password are required', null, 400);
    }
    
    $email = trim(strtolower($input['email']));
    $otp_code = trim($input['otp']);
    $new_password = $input['new_password'];
    
    // Validate password length
    if (strlen($new_password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters long', null, 400);
    }
    
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            throw new Exception('Database connection failed');
        }
    } catch (Exception $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage(), null, 500);
    }
    
    // Verify that OTP was recently validated (check if it was used in the last 30 minutes)
    $otp_query = "SELECT * FROM otp_verification WHERE email = ? AND otp_code = ? AND purpose = 'password_reset' AND is_used = 1 AND expires_at > NOW() AND created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)";
    $otp_stmt = $db->prepare($otp_query);
    $otp_stmt->execute([$email, $otp_code]);
    
    if ($otp_stmt->rowCount() == 0) {
        sendResponse(false, 'Invalid or expired OTP verification', null, 401);
    }
    
    // Hash new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Update user password
    $update_query = "UPDATE users SET password = ? WHERE email = ?";
    $update_stmt = $db->prepare($update_query);
    $result = $update_stmt->execute([$hashed_password, $email]);
    
    if (!$result) {
        throw new Exception('Failed to update password');
    }
    
    // Clean up used OTPs for this email
    $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'password_reset'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$email]);
    
    // Return success
    sendResponse(true, 'Password reset successful! You can now login with your new password.', [
        'email' => $email
    ]);
    
} catch (Exception $e) {
    error_log("Password reset error: " . $e->getMessage());
    sendResponse(false, 'Password reset failed: ' . $e->getMessage(), null, 500);
}
?>
