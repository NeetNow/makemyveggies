<?php
// Registration API - Matches exact database schema
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
    
    // Validate required fields - matching frontend Register.js
    $required_fields = ['first_name', 'last_name', 'email', 'password', 'phone'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            sendResponse(false, ucfirst(str_replace('_', ' ', $field)) . ' is required', null, 400);
        }
    }
    
    $first_name = trim($input['first_name']);
    $last_name = trim($input['last_name']);
    $email = trim(strtolower($input['email']));
    $password = $input['password'];
    $phone = trim($input['phone']);
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format', null, 400);
    }
    
    // Validate password length
    if (strlen($password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters long', null, 400);
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Validate phone number (10-15 digits)
    if (!preg_match('/^[0-9]{10,15}$/', $phone)) {
        sendResponse(false, 'Invalid phone number format. Must be 10-15 digits.', null, 400);
    }
    
    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }
    
    // Check if email already exists
    $check_query = "SELECT user_id, email_verified, is_active FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$email]);
    
    if ($check_stmt->rowCount() > 0) {
        $existing_user = $check_stmt->fetch();
        
        // If user is already verified and active, show conflict error
        if ($existing_user['email_verified'] == 1 && $existing_user['is_active'] == 1) {
            sendResponse(false, 'Email already registered and verified', null, 409);
        }
        
        // If user exists but is not verified, update user info and resend OTP
        if ($existing_user['email_verified'] == 0) {
            $user_id = $existing_user['user_id'];
            
            // Update existing user with new information
            $update_query = "UPDATE users SET first_name = ?, last_name = ?, password = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->execute([$first_name, $last_name, $hashed_password, $phone, $user_id]);
            
            // Generate new OTP
            $otp_code = sprintf("%06d", mt_rand(100000, 999999));
            $expires_at = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes expiry
            
            // Clean up old OTPs for this email
            $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'registration'";
            $cleanup_stmt = $db->prepare($cleanup_query);
            $cleanup_stmt->execute([$email]);
            
            // Store new OTP in database
            $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at, is_used) VALUES (?, ?, 'registration', ?, 0)";
            $otp_stmt = $db->prepare($otp_query);
            $otp_stmt->execute([$email, $otp_code, $expires_at]);
            
            // Send OTP email using EmailService
            $emailService = new ProductionEmailService();
            $user_name = $first_name . ' ' . $last_name;
            $email_sent = $emailService->sendOTP($email, $otp_code, $user_name);
            
            if (!$email_sent) {
                error_log("Failed to send OTP email to: " . $email);
            }
            
            // Return success
            sendResponse(true, 'Registration updated! Please check your email for OTP verification.', [
                'user_id' => $user_id,
                'email' => $email,
                'otp_expires_in' => 600
            ]);
            
            exit;
        }
    }
    
    // Begin transaction for new user creation
    $db->beginTransaction();
    
    try {
        // Create user account - exactly matching database schema
        $create_user_query = "INSERT INTO users (first_name, last_name, email, password, phone, email_verified, is_active, created_at, updated_at) 
                             VALUES (?, ?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
        
        $create_user_stmt = $db->prepare($create_user_query);
        
        if (!$create_user_stmt->execute([$first_name, $last_name, $email, $hashed_password, $phone])) {
            throw new Exception('Failed to create user account');
        }
        
        $user_id = $db->lastInsertId();
        
        // Generate 6-digit OTP
        $otp_code = sprintf("%06d", mt_rand(100000, 999999));
        $expires_at = date('Y-m-d H:i:s', time() + (10 * 60)); // 10 minutes expiry
        
        // Store OTP in database - matching exact schema
        $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at, is_used, created_at) 
                     VALUES (?, ?, 'registration', ?, 0, CURRENT_TIMESTAMP)";
        $otp_stmt = $db->prepare($otp_query);
        
        if (!$otp_stmt->execute([$email, $otp_code, $expires_at])) {
            throw new Exception('Failed to store OTP');
        }
        
        // Commit transaction
        $db->commit();
        
        // Send OTP email using EmailService
        $emailService = new ProductionEmailService();
        $user_name = $first_name . ' ' . $last_name;
        $email_sent = $emailService->sendOTP($email, $otp_code, $user_name);
        
        if (!$email_sent) {
            error_log("Failed to send OTP email to: " . $email);
            // Don't fail registration if email fails, user can resend
        }
        
        // Return success response
        sendResponse(true, 'Registration successful! Please check your email for OTP verification.', [
            'user_id' => $user_id,
            'email' => $email,
            'name' => $first_name . ' ' . $last_name,
            'otp_expires_in' => 600,
            'message' => 'A 6-digit verification code has been sent to your email address.'
        ]);
        
    } catch (Exception $e) {
        $db->rollback();
        error_log("Registration transaction failed: " . $e->getMessage());
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    sendResponse(false, 'Registration failed: ' . $e->getMessage(), null, 500);
}
?>
