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
    
    // Validate required fields: allow either email+otp or phone+otp
    if (empty($input['otp']) || (empty($input['email']) && empty($input['phone']))) {
        sendResponse(false, 'OTP code and either email or phone are required', null, 400);
    }
    
    $email = !empty($input['email']) ? trim(strtolower($input['email'])) : '';
    $phone = !empty($input['phone']) ? trim($input['phone']) : '';
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
    
    // Verify OTP using is_used_email flag: must be unused for this email and purpose
    $otp_query = "SELECT * FROM otp_verification WHERE email = ? AND otp_code = ? AND purpose = 'password_reset' AND is_used_email = 0";
    $otp_stmt = $db->prepare($otp_query);
    $otp_stmt->execute([$email, $otp_code]);
    
    if ($otp_stmt->rowCount() == 0) {
        sendResponse(false, 'Invalid or expired OTP code', null, 401);
    }
    
    // Get OTP record
    $otp_record = $otp_stmt->fetch();
    
    // Mark OTP as used for email channel
    $update_otp_query = "UPDATE otp_verification SET is_used_email = 1 WHERE otp_id = ?";
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
