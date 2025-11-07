<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

try {
    // Verify JWT token
    $auth_result = verifyJWTFromCookie();
    if (!$auth_result['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth_result['message']]);
        exit;
    }

    $user = $auth_result['user'];
    $userId = $user['user_id'];

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
        exit;
    }

    // Validate required fields
    $product_id = isset($input['product_id']) ? (int)$input['product_id'] : null;
    $quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;

    if (!$product_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
        exit;
    }

    // Validate quantity
    if ($quantity < 1) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Quantity must be at least 1']);
        exit;
    }

    // Initialize database connection
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Check if product exists and is active
    $productCheckSql = "SELECT product_id, title, price, stock FROM products WHERE product_id = ? AND status = 1";
    $productStmt = $pdo->prepare($productCheckSql);
    $productStmt->execute([$product_id]);
    $product = $productStmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Product not found or inactive']);
        exit;
    }

    // Check if there's enough stock
    if ($product['stock'] < $quantity) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Not enough stock available']);
        exit;
    }

    // Check if item already exists in cart
    $cartCheckSql = "SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ?";
    $cartCheckStmt = $pdo->prepare($cartCheckSql);
    $cartCheckStmt->execute([$userId, $product_id]);
    $existingCartItem = $cartCheckStmt->fetch(PDO::FETCH_ASSOC);

    if ($existingCartItem) {
        // Update existing cart item quantity
        $newQuantity = $existingCartItem['quantity'] + $quantity;
        
        // Check if new quantity exceeds stock
        if ($product['stock'] < $newQuantity) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Adding this quantity would exceed available stock']);
            exit;
        }
        
        $updateSql = "UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$newQuantity, $existingCartItem['cart_id']]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Cart item updated successfully',
            'data' => [
                'cart_id' => $existingCartItem['cart_id'],
                'product_id' => $product_id,
                'quantity' => $newQuantity
            ]
        ]);
    } else {
        // Insert new cart item
        $insertSql = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
        $insertStmt = $pdo->prepare($insertSql);
        $insertStmt->execute([$userId, $product_id, $quantity]);
        
        $cart_id = $pdo->lastInsertId();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Item added to cart successfully',
            'data' => [
                'cart_id' => $cart_id,
                'product_id' => $product_id,
                'quantity' => $quantity
            ]
        ]);
    }

} catch (PDOException $e) {
    error_log("Database error in add_to_cart.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred.']);
} catch (Exception $e) {
    error_log("General error in add_to_cart.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
}
?>
