<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

// Only allow PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    $cart_id = isset($input['cart_id']) ? (int)$input['cart_id'] : null;
    $quantity = isset($input['quantity']) ? (int)$input['quantity'] : null;

    if (!$cart_id || $quantity === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Cart ID and quantity are required']);
        exit;
    }

    // Validate quantity
    if ($quantity < 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Quantity cannot be negative']);
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

    // Check if cart item exists and belongs to the user
    $cartCheckSql = "SELECT c.cart_id, c.quantity, c.product_id, p.stock FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.cart_id = ? AND c.user_id = ?";
    $cartCheckStmt = $pdo->prepare($cartCheckSql);
    $cartCheckStmt->execute([$cart_id, $userId]);
    $cartItem = $cartCheckStmt->fetch(PDO::FETCH_ASSOC);

    if (!$cartItem) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Cart item not found or does not belong to user']);
        exit;
    }

    if ($quantity === 0) {
        // Remove item from cart
        $deleteSql = "DELETE FROM cart WHERE cart_id = ?";
        $deleteStmt = $pdo->prepare($deleteSql);
        $deleteStmt->execute([$cart_id]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Item removed from cart successfully'
        ]);
    } else {
        // Check if there's enough stock for the new quantity
        if ($cartItem['stock'] < $quantity) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Not enough stock available']);
            exit;
        }
        
        // Update cart item quantity
        $updateSql = "UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE cart_id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$quantity, $cart_id]);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Cart item updated successfully',
            'data' => [
                'cart_id' => $cart_id,
                'quantity' => $quantity
            ]
        ]);
    }

} catch (PDOException $e) {
    error_log("Database error in update_cart_item.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred.']);
} catch (Exception $e) {
    error_log("General error in update_cart_item.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
}
?>
