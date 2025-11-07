<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

    // Initialize database connection
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Get cart items for the user
    $sql = "
        SELECT 
            c.cart_id,
            c.product_id,
            c.quantity,
            c.added_at,
            c.updated_at,
            p.title as product_name,
            p.price as product_price,
            p.stock as product_stock,
            COALESCE(
                (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id AND pi.is_primary = 1 ORDER BY pi.image_id DESC LIMIT 1),
                (SELECT pi2.image_url FROM product_images pi2 WHERE pi2.product_id = p.product_id ORDER BY pi2.image_id ASC LIMIT 1)
            ) AS product_image
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ? AND p.status = 1
        ORDER BY c.added_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format cart items for frontend
    $formattedCartItems = [];
    foreach ($cartItems as $item) {
        $formattedCartItems[] = [
            'cart_id' => (int)$item['cart_id'],
            'product_id' => (int)$item['product_id'],
            'quantity' => (int)$item['quantity'],
            'name' => $item['product_name'],
            'price' => (float)$item['product_price'],
            'image' => $item['product_image'] ?: 'https://via.placeholder.com/80x80/eeeeee/888888?text=Product',
            'stock' => (int)$item['product_stock'],
            'added_at' => $item['added_at'],
            'updated_at' => $item['updated_at']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $formattedCartItems
    ]);

} catch (PDOException $e) {
    error_log("Database error in get_cart.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred.']);
} catch (Exception $e) {
    error_log("General error in get_cart.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
}
?>
