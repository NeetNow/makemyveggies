<?php
// Verify password reset OTP
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
    if (empty($input['email']) || empty($input['otp'])) {
        sendResponse(false, 'Email and OTP code are required', null, 400);
    }
    
    $email = trim(strtolower($input['email']));
    $otp_code = trim($input['otp']);
    
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            throw new Exception('Database connection failed');
        }
    } catch (Exception $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage(), null, 500);
    }
    
    // Verify OTP
    $otp_query = "SELECT * FROM otp_verification WHERE email = ? AND otp_code = ? AND purpose = 'password_reset' AND is_used = 0 AND expires_at > NOW()";
    $otp_stmt = $db->prepare($otp_query);
    $otp_stmt->execute([$email, $otp_code]);
    
    if ($otp_stmt->rowCount() == 0) {
        sendResponse(false, 'Invalid or expired OTP code', null, 401);
    }
    
    // Get OTP record
    $otp_record = $otp_stmt->fetch();
    
    // Mark OTP as used
    $update_otp_query = "UPDATE otp_verification SET is_used = 1 WHERE otp_id = ?";
    $update_otp_stmt = $db->prepare($update_otp_query);
    $update_otp_stmt->execute([$otp_record['otp_id']]);
    
    // Return success
    sendResponse(true, 'OTP verified successfully. You can now reset your password.', [
        'email' => $email
    ]);
    
} catch (Exception $e) {
    error_log("Password reset OTP verification error: " . $e->getMessage());
    sendResponse(false, 'OTP verification failed: ' . $e->getMessage(), null, 500);
}
?>
