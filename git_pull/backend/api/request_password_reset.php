<?php
// Request password reset OTP
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/email_production.php';

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
    if (empty($input['email'])) {
        sendResponse(false, 'Email is required', null, 400);
    }
    
    $email = trim(strtolower($input['email']));
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format', null, 400);
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
    
    // Check if user exists
    $check_query = "SELECT user_id, first_name, last_name, email_verified, is_active FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$email]);
    
    if ($check_stmt->rowCount() == 0) {
        sendResponse(false, 'Email not found. Please register first.', null, 404);
    }
    
    $user = $check_stmt->fetch();
    
    // Check if user is verified
    if ($user['email_verified'] != 1 || $user['is_active'] != 1) {
        sendResponse(false, 'Please verify your email before requesting password reset', null, 401);
    }
    
    // Generate OTP
    $otp_code = sprintf("%06d", mt_rand(100000, 999999));
    $expires_at = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes
    
    // Clean up old OTPs for this email
    $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'password_reset'";
    $cleanup_stmt = $db->prepare($cleanup_query);
    $cleanup_stmt->execute([$email]);
    
    // Store new OTP in database
    $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at) VALUES (?, ?, 'password_reset', ?)";
    $otp_stmt = $db->prepare($otp_query);
    $otp_stmt->execute([$email, $otp_code, $expires_at]);
    
    // Send OTP email using EmailService
    $emailService = new ProductionEmailService();
    $user_name = $user['first_name'] . ' ' . $user['last_name'];
    $email_sent = $emailService->sendPasswordResetOTP($email, $otp_code, $user_name);
    
    if (!$email_sent) {
        error_log("Failed to send password reset OTP email to: " . $email);
    }
    
    // Return success
    sendResponse(true, 'OTP sent to your email. Please check your inbox.', [
        'email' => $email,
        'otp_expires_in' => 600
    ]);
    
} catch (Exception $e) {
    error_log("Password reset OTP request error: " . $e->getMessage());
    sendResponse(false, 'Failed to process password reset request: ' . $e->getMessage(), null, 500);
}
?>
