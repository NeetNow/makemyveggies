<?php
// Login API endpoint
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
    
    // Validate required fields based on login type
    $email = !empty($input['email']) ? trim(strtolower($input['email'])) : null;
    $mobile = !empty($input['mobile']) ? trim($input['mobile']) : null;
    $password = !empty($input['password']) ? $input['password'] : null;
    
    if (empty($password)) {
        sendResponse(false, 'Password is required', null, 400);
    }
    
    // Validate based on login type
    if (empty($email) && empty($mobile)) {
        sendResponse(false, 'Email or mobile number is required', null, 400);
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
    
    // Check if user exists and is verified
    if (!empty($email)) {
        $check_query = "SELECT user_id, first_name, last_name, password, email_verified, is_active FROM users WHERE email = ?";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->execute([$email]);
    } else {
        $check_query = "SELECT user_id, first_name, last_name, password, email, email_verified, is_active FROM users WHERE phone = ?";
        $check_stmt = $db->prepare($check_query);
        $check_stmt->execute([$mobile]);
    }
    
    if ($check_stmt->rowCount() == 0) {
        sendResponse(false, 'Invalid email or password', null, 401);
    }
    
    $user = $check_stmt->fetch();
    
    // Check if user is verified
    if ($user['email_verified'] != 1 || $user['is_active'] != 1) {
        sendResponse(false, 'Please verify your email before logging in', null, 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendResponse(false, 'Invalid email or password', null, 401);
    }
    
    // Generate a simple token (in production, use JWT or more secure method)
    $user_email = !empty($email) ? $email : $user['email']; // For mobile login, use email from DB
    $token = base64_encode(json_encode([
        'user_id' => $user['user_id'],
        'email' => $user_email,
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'timestamp' => time()
    ]));
    
    // Return success with token
    sendResponse(true, 'Login successful', [
        'token' => $token,
        'user' => [
            'user_id' => $user['user_id'],
            'email' => $user_email,
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendResponse(false, 'Login failed: ' . $e->getMessage(), null, 500);
}
?>
