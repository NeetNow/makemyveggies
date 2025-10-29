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

try {
    // Create database connection using the Database class
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        sendResponse(false, 'Database connection failed');
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Delete user's cart items
    $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->execute([$userId]);
    
    // Delete user's wishlist items
    $stmt = $pdo->prepare("DELETE FROM wishlist WHERE user_id = ?");
    $stmt->execute([$userId]);
    
    // Delete user's reviews
    $stmt = $pdo->prepare("DELETE FROM reviews WHERE user_id = ?");
    $stmt->execute([$userId]);
    
    // Delete user's order items (this will cascade delete orders)
    $stmt = $pdo->prepare("DELETE FROM order_items WHERE order_id IN (SELECT order_id FROM orders WHERE user_id = ?)");
    $stmt->execute([$userId]);
    
    // Delete user's orders
    $stmt = $pdo->prepare("DELETE FROM orders WHERE user_id = ?");
    $stmt->execute([$userId]);
    
    // Finally, delete the user account
    $stmt = $pdo->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->execute([$userId]);
    
    // Commit transaction
    $pdo->commit();
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Account deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete account');
    }
} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollback();
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>
