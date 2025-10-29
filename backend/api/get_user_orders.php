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
    
    // Fetch user orders
    $stmt = $pdo->prepare("SELECT order_id, order_number, total_amount, status, payment_status, placed_at, updated_at FROM orders WHERE user_id = ? ORDER BY placed_at DESC");
    $stmt->execute([$userId]);
    
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Orders fetched successfully', $orders);
} catch (PDOException $e) {
    sendResponse(false, 'Database error: ' . $e->getMessage());
}
?>
