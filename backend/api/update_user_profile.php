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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if userId is provided in input and matches token
if (isset($input['userId']) && $input['userId'] != $userId) {
    sendResponse(false, 'Unauthorized access');
}
$firstName = isset($input['firstName']) ? $input['firstName'] : '';
$lastName = isset($input['lastName']) ? $input['lastName'] : '';
$phone = isset($input['phone']) ? $input['phone'] : '';
$addressLine1 = isset($input['addressLine1']) ? $input['addressLine1'] : '';
$addressLine2 = isset($input['addressLine2']) ? $input['addressLine2'] : '';
$city = isset($input['city']) ? $input['city'] : '';
$state = isset($input['state']) ? $input['state'] : '';
$country = isset($input['country']) ? $input['country'] : '';
$postalCode = isset($input['postalCode']) ? $input['postalCode'] : '';

try {
    // Create database connection using the Database class
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        sendResponse(false, 'Database connection failed');
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Update user profile data in users table
    $userStmt = $pdo->prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_active = 1");
    $userStmt->execute([$firstName, $lastName, $phone, $userId]);
    
    // Check if address exists for user
    $checkAddressStmt = $pdo->prepare("SELECT address_id FROM addresses WHERE user_id = ?");
    $checkAddressStmt->execute([$userId]);
    
    if ($checkAddressStmt->fetch()) {
        // Update existing address
        $addressStmt = $pdo->prepare("UPDATE addresses SET address_line1 = ?, address_line2 = ?, city = ?, state = ?, country = ?, postal_code = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?");
        $addressStmt->execute([$addressLine1, $addressLine2, $city, $state, $country, $postalCode, $userId]);
    } else {
        // Insert new address
        $addressStmt = $pdo->prepare("INSERT INTO addresses (user_id, address_line1, address_line2, city, state, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $addressStmt->execute([$userId, $addressLine1, $addressLine2, $city, $state, $country, $postalCode]);
    }
    
    // Commit transaction
    $pdo->commit();
    
    sendResponse(true, 'Profile updated successfully');
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollback();
    }
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>
