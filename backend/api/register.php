<?php
// Registration API - Matches exact database schema
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/email_production.php';

setCorsHeaders();

function sendWhatsAppOtpRegistration($country_code, $phone, $otp_code)
{
    $apiKey        = $_ENV['FAST2SMS_WHATSAPP_API_KEY'] ?? '';
    $messageId     = $_ENV['FAST2SMS_WHATSAPP_MESSAGE_ID'] ?? '';
    $phoneNumberId = $_ENV['FAST2SMS_WHATSAPP_PHONE_NUMBER_ID'] ?? '';

    $numbers          = preg_replace('/\D/', '', $phone);
    $variables_values = $otp_code;

    $baseUrl = 'https://www.fast2sms.com/dev/whatsapp';

    $queryParams = http_build_query([
        'authorization'   => $apiKey,
        'message_id'      => $messageId,
        'phone_number_id' => $phoneNumberId,
        'numbers'         => $numbers,
        'variables_values'=> $variables_values,
    ]);

    $url = $baseUrl . '?' . $queryParams;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPGET        => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($error || $httpCode < 200 || $httpCode >= 300) {
        error_log('Fast2SMS WhatsApp OTP send failed during registration. HTTP ' . $httpCode . ' Error: ' . $error . ' Response: ' . $response);
        return false;
    }

    return true;
}

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

    // Normalize phone for OTP storage (digits only)
    $stored_number = preg_replace('/\D/', '', $phone);

    // Connect to database
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');

    // Check if email already exists and is active
    $check_email_query = "SELECT user_id, email_verified, is_active FROM users WHERE email = ?";
    $check_email_stmt = $db->prepare($check_email_query);
    $check_email_stmt->execute([$email]);

    if ($check_email_stmt->rowCount() > 0) {
        $existing_user = $check_email_stmt->fetch();

        // If user is already verified and active, show clear email error
        if ($existing_user['email_verified'] == 1 && $existing_user['is_active'] == 1) {
            sendResponse(false, 'Email already registered', null, 409);
        }

        // If user exists but is not verified, update user info and resend OTP
        if ($existing_user['email_verified'] == 0) {
            $user_id = $existing_user['user_id'];
            
            // Update existing user with new information
            $update_query = "UPDATE users SET first_name = ?, last_name = ?, password = ?, phone = ?, updated_at = ? WHERE user_id = ?";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->execute([$first_name, $last_name, $hashed_password, $phone, $istNow, $user_id]);
            
            // Generate new OTP
            $otp_code = sprintf("%06d", mt_rand(100000, 999999));
            $expires_at = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))
                ->add(new DateInterval('PT10M'))
                ->format('Y-m-d H:i:s'); // 10 minutes expiry in IST

            // Clean up old OTPs for this email
            $cleanup_query = "DELETE FROM otp_verification WHERE email = ? AND purpose = 'registration'";
            $cleanup_stmt = $db->prepare($cleanup_query);
            $cleanup_stmt->execute([$email]);

            // Store new OTP in database - single row with both email and number
            // Initialize is_used_email and is_used_number as 0
            $otp_query = "INSERT INTO otp_verification (email, number, otp_code, purpose, expires_at, is_used_email, is_used_number, created_at)
                          VALUES (?, ?, ?, 'registration', ?, 0, 0, ?)";
            $otp_stmt = $db->prepare($otp_query);
            $otp_stmt->execute([$email, $stored_number, $otp_code, $expires_at, $istNow]);
            
            // Send OTP email using EmailService
            $emailService = new ProductionEmailService();
            $user_name = $first_name . ' ' . $last_name;
            $email_sent = $emailService->sendOTP($email, $otp_code, $user_name);
            
            if (!$email_sent) {
                error_log("Failed to send OTP email to: " . $email);
            }

            // Also send same OTP via WhatsApp (registration-time send)
            $whatsapp_sent = sendWhatsAppOtpRegistration('+91', $phone, $otp_code);
            if (!$whatsapp_sent) {
                error_log("Failed to send WhatsApp OTP during registration for number: " . $phone);
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
    
    // Check if phone already exists and is active
    $check_phone_query = "SELECT user_id, email_verified, is_active FROM users WHERE phone = ?";
    $check_phone_stmt = $db->prepare($check_phone_query);
    $check_phone_stmt->execute([$phone]);

    if ($check_phone_stmt->rowCount() > 0) {
        $existing_phone_user = $check_phone_stmt->fetch();

        if ($existing_phone_user['is_active'] == 1) {
            sendResponse(false, 'Phone already registered', null, 409);
        }
    }

    // Begin transaction for new user creation
    $db->beginTransaction();

    try {
        // Create user account - exactly matching database schema
        $create_user_query = "INSERT INTO users (first_name, last_name, email, password, phone, email_verified, is_active, created_at, updated_at) 
                             VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)";
        
        $create_user_stmt = $db->prepare($create_user_query);
        
        if (!$create_user_stmt->execute([$first_name, $last_name, $email, $hashed_password, $phone, $istNow, $istNow])) {
            throw new Exception('Failed to create user account');
        }
        
        $user_id = $db->lastInsertId();
        
        // Generate 6-digit OTP
        $otp_code = sprintf("%06d", mt_rand(100000, 999999));
        $expires_at = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))
            ->add(new DateInterval('PT10M'))
            ->format('Y-m-d H:i:s'); // 10 minutes expiry in IST

        // Store OTP in database - single row with both email and number
        // Initialize is_used_email and is_used_number as 0
        $otp_query = "INSERT INTO otp_verification (email, number, otp_code, purpose, expires_at, is_used_email, is_used_number, created_at) 
                     VALUES (?, ?, ?, 'registration', ?, 0, 0, ?)";
        $otp_stmt = $db->prepare($otp_query);

        if (!$otp_stmt->execute([$email, $stored_number, $otp_code, $expires_at, $istNow])) {
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

        // Also send same OTP via WhatsApp (registration-time send)
        $whatsapp_sent = sendWhatsAppOtpRegistration('+91', $phone, $otp_code);
        if (!$whatsapp_sent) {
            error_log("Failed to send WhatsApp OTP during registration for number: " . $phone);
            // Don't fail registration if WhatsApp fails; user can try resend endpoint
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
    // Do not expose internal error details to end users
    sendResponse(false, 'Registration failed due to a server error. Please try again later.', null, 500);
}
?>
