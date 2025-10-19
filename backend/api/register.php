<?php
// Clean Registration API - No external dependencies
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/email.php';

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
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Invalid email format', null, 400);
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            throw new Exception('Database connection failed');
        }
    } catch (Exception $e) {
        sendResponse(false, 'Database connection failed: ' . $e->getMessage(), null, 500);
    }
    
    // Check if email already exists
    $check_query = "SELECT user_id, email_verified, is_active FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute([$email]);
    
    if ($check_stmt->rowCount() > 0) {
        $existing_user = $check_stmt->fetch();
        
        // If user is already verified and active, show conflict error
        if ($existing_user['email_verified'] == 1 && $existing_user['is_active'] == 1) {
            sendResponse(false, 'Email already registered', null, 409);
        }
        
        // If user exists but is not verified, resend OTP instead of creating new user
        if ($existing_user['email_verified'] == 0 && $existing_user['is_active'] == 0) {
            $user_id = $existing_user['user_id'];
            
            // Generate new OTP
            $otp_code = sprintf("%06d", mt_rand(100000, 999999));
            $expires_at = date('Y-m-d H:i:s', time() + (10 * 60));
            
            // Clean up old OTPs for this email
            $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'registration'";
            $cleanup_stmt = $db->prepare($cleanup_query);
            $cleanup_stmt->execute([$email]);
            
            // Store new OTP in database
            $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at) VALUES (?, ?, 'registration', ?)";
            $otp_stmt = $db->prepare($otp_query);
            $otp_stmt->execute([$email, $otp_code, $expires_at]);
            
            // Send OTP email using EmailService
            $emailService = new EmailService();
            $user_name = $first_name . ' ' . $last_name;
            $email_sent = $emailService->sendOTP($email, $otp_code, $user_name);
            
            if (!$email_sent) {
                error_log("Failed to send OTP email to: " . $email);
            }
            
            // Return success
            sendResponse(true, 'Registration successful! Please check your email for OTP verification.', [
                'user_id' => $user_id,
                'email' => $email,
                'otp_expires_in' => 600
            ]);
            
            // Exit here since we've handled the unverified user case
            exit;
        }
    }
    
    // Begin transaction for new user creation
    $db->beginTransaction();
    
    try {
        // Create user account - matching your table structure
        $create_user_query = "INSERT INTO users (first_name, last_name, email, password, phone, email_verified, is_active) 
                             VALUES (?, ?, ?, ?, ?, 0, 0)";
        
        $create_user_stmt = $db->prepare($create_user_query);
        
        if (!$create_user_stmt->execute([$first_name, $last_name, $email, $hashed_password, $phone])) {
            throw new Exception('Failed to create user account');
        }
        
        $user_id = $db->lastInsertId();
        
        // Generate OTP
        $otp_code = sprintf("%06d", mt_rand(100000, 999999));
        $expires_at = date('Y-m-d H:i:s', time() + (10 * 60));
        
        // Try to store OTP (only if table exists)
        try {
            $otp_query = "INSERT INTO otp_verification (email, otp_code, purpose, expires_at) VALUES (?, ?, 'registration', ?)";
            $otp_stmt = $db->prepare($otp_query);
            $otp_stmt->execute([$email, $otp_code, $expires_at]);
        } catch (Exception $otp_error) {
            // Continue without OTP storage if table doesn't exist
            error_log("OTP storage failed: " . $otp_error->getMessage());
        }
        
        // Commit transaction
        $db->commit();
        
        // Send OTP email using EmailService
        $emailService = new EmailService();
        $user_name = $first_name . ' ' . $last_name;
        $email_sent = $emailService->sendOTP($email, $otp_code, $user_name);
        
        if (!$email_sent) {
            error_log("Failed to send OTP email to: " . $email);
        }
        
        // Return success
        sendResponse(true, 'Registration successful! Please check your email for OTP verification.', [
            'user_id' => $user_id,
            'email' => $email,
            'otp_expires_in' => 600
        ]);
        
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    sendResponse(false, 'Registration failed: ' . $e->getMessage(), null, 500);
}
?>
