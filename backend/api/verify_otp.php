<?php
// Disable error display to prevent JSON corruption
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/email_production.php';

setCorsHeaders();

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
    if (empty($input['email']) || empty($input['otp_code'])) {
        sendResponse(false, 'Email and OTP code are required', null, 400);
    }
    
    $email = trim(strtolower($input['email']));
    $otp_code = trim($input['otp_code']);
    
    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }
    
    // Debug: Log the verification attempt
    error_log("OTP Verification attempt - Email: " . $email . ", OTP: " . $otp_code);
    
    // Verify OTP with detailed checking
    $verify_query = "SELECT otp_id, otp_code, expires_at, is_used_email, created_at FROM otp_verification 
                     WHERE email = :email 
                     AND otp_code = :otp_code 
                     AND purpose = 'registration'
                     ORDER BY created_at DESC 
                     LIMIT 1";
    
    $verify_stmt = $db->prepare($verify_query);
    $verify_stmt->bindParam(':email', $email);
    $verify_stmt->bindParam(':otp_code', $otp_code);
    $verify_stmt->execute();
    
    if ($verify_stmt->rowCount() === 0) {
        error_log("No OTP record found for email: " . $email . " with OTP: " . $otp_code);
        sendResponse(false, 'Invalid OTP code', null, 400);
    }
    
    $otp_data = $verify_stmt->fetch();

    // Check if OTP has already been used for email
    if (isset($otp_data['is_used_email']) && $otp_data['is_used_email'] == 1) {
        error_log("Email OTP already used for email: " . $email);
        sendResponse(false, 'Email OTP code has already been used', null, 400);
    }
    
    // Check if OTP is expired
    $current_time = time();
    $expiry_time = strtotime($otp_data['expires_at']);
    
    error_log("OTP expiry check - Current: " . date('Y-m-d H:i:s', $current_time) . ", Expires: " . $otp_data['expires_at'] . ", Diff: " . ($expiry_time - $current_time) . " seconds");
    
    if ($expiry_time <= $current_time) {
        error_log("OTP expired for email: " . $email . " (expired at: " . $otp_data['expires_at'] . ")");
        sendResponse(false, 'OTP code has expired', null, 400);
    }
    
    error_log("OTP verification successful for email: " . $email . " (OTP ID: " . $otp_data['otp_id'] . ")");
    
    // Check if user exists in database (should exist from registration)
    $user_check_query = "SELECT user_id, first_name, last_name, email_verified, is_active FROM users WHERE email = :email";
    $user_check_stmt = $db->prepare($user_check_query);
    $user_check_stmt->bindParam(':email', $email);
    $user_check_stmt->execute();
    
    if ($user_check_stmt->rowCount() === 0) {
        error_log("No user found for email: " . $email . " during OTP verification");
        sendResponse(false, 'User not found. Please register first.', null, 400);
        return;
    }
    
    $user_info = $user_check_stmt->fetch();
    
    // Check if user is already verified
    if ($user_info['email_verified'] == 1 && $user_info['is_active'] == 1) {
        error_log("User already verified for email: " . $email);
        sendResponse(false, 'Email already verified. You can login now.', null, 400);
        return;
    }
    
    error_log("Found user ID: " . $user_info['user_id'] . " for email: " . $email . " - proceeding with verification");
    
    // Begin transaction
    $db->beginTransaction();
    
    try {
        // Mark OTP as used for email channel (if column exists)
        if (array_key_exists('is_used_email', $otp_data)) {
            $update_otp_query = "UPDATE otp_verification SET is_used_email = 1 WHERE otp_id = :otp_id";
            $update_otp_stmt = $db->prepare($update_otp_query);
            $update_otp_stmt->bindParam(':otp_id', $otp_data['otp_id']);
            $update_otp_stmt->execute();
        }

        // Update user verification status: mark email_verified=1 and activate only if number_verified already 1
        error_log("Updating user verification status for email: " . $email);
        
        $update_user_query = "UPDATE users
                              SET email_verified = 1,
                                  is_active = CASE WHEN number_verified = 1 THEN 1 ELSE 0 END,
                                  updated_at = CURRENT_TIMESTAMP
                              WHERE user_id = :user_id";
        $update_user_stmt = $db->prepare($update_user_query);
        $update_user_stmt->bindParam(':user_id', $user_info['user_id']);
        
        if (!$update_user_stmt->execute()) {
            $error_info = $update_user_stmt->errorInfo();
            error_log("Failed to update user verification for: " . $email . " - SQL Error: " . json_encode($error_info));
            throw new Exception('Failed to verify user account: ' . $error_info[2]);
        }
        
        error_log("Successfully verified user account ID: " . $user_info['user_id'] . " for email: " . $email);
        
        // Commit transaction
        $db->commit();
        
        // Get updated user data for response
        $user_query = "SELECT user_id, first_name, last_name, email, phone, email_verified, is_active, created_at FROM users WHERE user_id = :user_id";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->bindParam(':user_id', $user_info['user_id']);
        $user_stmt->execute();
        $updated_user_info = $user_stmt->fetch();
        
        // Send welcome email
        $emailService = new ProductionEmailService();
        $welcome_sent = $emailService->sendWelcomeEmail(
            $updated_user_info['email'], 
            $updated_user_info['first_name'] . ' ' . $updated_user_info['last_name']
        );
        
        if (!$welcome_sent) {
            error_log("Failed to send welcome email to: " . $updated_user_info['email']);
        }
        
        // Registration completed successfully
        sendResponse(true, 'Email verification successful! Your account is now active.', [
            'user' => [
                'user_id' => $updated_user_info['user_id'],
                'first_name' => $updated_user_info['first_name'],
                'last_name' => $updated_user_info['last_name'],
                'email' => $updated_user_info['email'],
                'phone' => $updated_user_info['phone'],
                'email_verified' => $updated_user_info['email_verified'],
                'is_active' => $updated_user_info['is_active']
            ],
            'message' => 'Your email has been verified and your account is now active. You can now login.',
            'redirect' => '/login'
        ]);
        
    } catch (Exception $e) {
        // Rollback transaction
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("OTP verification error: " . $e->getMessage());
    sendResponse(false, 'OTP verification failed. Please try again.', null, 500);
}
?>
