<?php
// Include database configuration
include '../config/database.php';
include '../middleware/jwt_auth.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

// Set CORS headers
setCorsHeaders();

// Verify JWT token
$userData = verifyJWTToken();
$userId = $userData->user_id;

// Check if userId matches the one from token
if (isset($_GET['userId']) && $_GET['userId'] != $userId) {
    sendResponse(false, 'Unauthorized access');
}

try {
    // Create database connection using the Database class
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        sendResponse(false, 'Database connection failed');
    }
    
    // Fetch user profile data from users table
    $userStmt = $pdo->prepare("SELECT user_id, first_name, last_name, email, phone, created_at FROM users WHERE user_id = ? AND is_active = 1");
    $userStmt->execute([$userId]);
    
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Fetch address data from addresses table
        $addressStmt = $pdo->prepare("SELECT address_line1, address_line2, city, state, country, postal_code FROM addresses WHERE user_id = ?");
        $addressStmt->execute([$userId]);
        
        $address = $addressStmt->fetch(PDO::FETCH_ASSOC);
        
        // Merge user and address data
        if ($address) {
            $user = array_merge($user, $address);
        }
        
        sendResponse(true, 'Profile fetched successfully', $user);
    } else {
        sendResponse(false, 'User not found');
    }
} catch (PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>
