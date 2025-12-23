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
    
    // Validate required fields: allow either email+otp or phone+otp
    if (empty($input['otp']) || empty($input['new_password']) || (empty($input['email']) && empty($input['phone']))) {
        sendResponse(false, 'OTP code, new password, and either email or phone are required', null, 400);
    }
    
    $email = !empty($input['email']) ? trim(strtolower($input['email'])) : '';
    $phone = !empty($input['phone']) ? trim($input['phone']) : '';
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

    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');
    
    // If email is not provided but phone is, resolve email from users table
    if (empty($email) && !empty($phone)) {
        $stored_number = preg_replace('/\D/', '', $phone);
        $user_query = 'SELECT email FROM users WHERE phone = :phone';
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(':phone', $stored_number);
        $user_stmt->execute();

        if ($user_stmt->rowCount() === 0) {
            sendResponse(false, 'Phone not found. Please register first.', null, 404);
        }

        $user = $user_stmt->fetch();
        $email = $user['email'];
    }
    
    // Verify that OTP was validated for email channel (used flag set)
    $otp_query = "SELECT * FROM otp_verification WHERE email = ? AND otp_code = ? AND purpose = 'password_reset' AND is_used_email = 1";
    $otp_stmt = $db->prepare($otp_query);
    $otp_stmt->execute([$email, $otp_code]);
    
    if ($otp_stmt->rowCount() == 0) {
        sendResponse(false, 'Invalid or expired OTP verification', null, 401);
    }
    
    // Hash new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Update user password
    $update_query = "UPDATE users SET password = ?, updated_at = ? WHERE email = ?";
    $update_stmt = $db->prepare($update_query);
    $result = $update_stmt->execute([$hashed_password, $istNow, $email]);
    
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
