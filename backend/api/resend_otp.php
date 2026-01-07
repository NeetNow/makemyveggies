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
    if (empty($input['email'])) {
        sendResponse(false, 'Email is required', null, 400);
    }
    
    $email = trim(strtolower($input['email']));
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format', null, 400);
    }
    
    // Connect to database first
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');
    
    // Check if user exists and is not yet verified
    $user_check_query = "SELECT user_id, first_name, last_name, email_verified, is_active FROM users WHERE email = ?";
    $user_check_stmt = $db->prepare($user_check_query);
    $user_check_stmt->execute([$email]);
    
    if ($user_check_stmt->rowCount() === 0) {
        sendResponse(false, 'No registration found for this email. Please register first.', null, 400);
    }
    
    $user_info = $user_check_stmt->fetch();
    
    // Check if user is already verified
    if ($user_info['email_verified'] == 1 && $user_info['is_active'] == 1) {
        sendResponse(false, 'Email already verified. You can login now.', null, 400);
    }
    
    // Check rate limiting - allow resend only after 30 seconds (more user-friendly)
    $rateLimitSince = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))
        ->sub(new DateInterval('PT30S'))
        ->format('Y-m-d H:i:s');

    $rate_limit_query = "SELECT created_at FROM otp_verification 
                        WHERE email = ? 
                        AND purpose = 'registration' 
                        AND created_at > ?
                        ORDER BY created_at DESC 
                        LIMIT 1";
    
    $rate_limit_stmt = $db->prepare($rate_limit_query);
    $rate_limit_stmt->execute([$email, $rateLimitSince]);
    
    if ($rate_limit_stmt->rowCount() > 0) {
        sendResponse(false, 'Please wait at least 30 seconds before requesting a new OTP', null, 429);
    }
    
    error_log("Resending OTP for email: " . $email);
    
    // Generate new 6-digit OTP
    $otp_code = sprintf("%06d", mt_rand(100000, 999999));
    error_log("Generated new OTP: " . $otp_code . " for email: " . $email);
    
    // Set OTP expiration (10 minutes from now) - using IST
    $expires_at = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))
        ->add(new DateInterval('PT10M'))
        ->format('Y-m-d H:i:s'); // 10 minutes from current time in IST
    
    // Clean up old OTPs for this email
    $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'registration'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$email]);
    error_log("Cleaned up old OTPs for " . $email . ": Success");
    
    // Store new OTP in database - matching current schema
    // otp_verification(email, number, otp_code, purpose, expires_at, is_used_email, is_used_number, created_at)
    $otp_query = "INSERT INTO otp_verification (email, number, otp_code, purpose, expires_at, is_used_email, is_used_number, created_at)
                  VALUES (?, NULL, ?, 'registration', ?, 0, 0, ?)";
    $otp_stmt = $db->prepare($otp_query);
    if (!$otp_stmt->execute([$email, $otp_code, $expires_at, $istNow])) {
        error_log("Failed to store new OTP in database for: " . $email);
        sendResponse(false, 'Failed to generate new OTP', null, 500);
    }
    
    error_log("Successfully stored new OTP in database for: " . $email);
    
    // Send OTP email using EmailService
    $emailService = new ProductionEmailService();
    $user_name = $user_info['first_name'] . ' ' . $user_info['last_name'];
    $email_sent = $emailService->sendOTP($email, $otp_code, $user_name);
    
    if ($email_sent) {
        error_log("Successfully sent OTP email to: " . $email);
        sendResponse(true, 'New OTP sent to your email successfully.', [
            'email' => $email,
            'otp_expires_in' => 600, // 10 minutes in seconds
            'message' => 'A new 6-digit verification code has been sent to your email address.'
        ]);
    } else {
        error_log("Failed to send OTP email to: " . $email . " but OTP is stored in database");
        sendResponse(true, 'New OTP generated successfully. Please check your email.', [
            'email' => $email,
            'otp_expires_in' => 600,
            'note' => 'Email delivery may be delayed'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Resend OTP error: " . $e->getMessage());
    sendResponse(false, 'Failed to resend OTP. Please try again.', null, 500);
}
?>
