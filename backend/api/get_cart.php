<?php
// File: backend/api/get_cart.php
// Get cart items with simple discount logic

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $authResult = verifyJWTFromCookie();
    if (!$authResult['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }
    $userId = $authResult['user']['user_id'];

    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Get cart items with product price and BOTH discount fields
    $sql = "
        SELECT 
            c.cart_id,
            c.product_id,
            c.quantity,
            p.title as product_name,
            p.price as original_price,
            p.stock as product_stock,
            (
                SELECT d.dis_percent 
                FROM discounts d 
                WHERE d.product_id = p.product_id 
                  AND CURDATE() BETWEEN d.from_date AND d.to_date 
                LIMIT 1
            ) as dis_percent,
            (
                SELECT d.dis_amount 
                FROM discounts d 
                WHERE d.product_id = p.product_id 
                  AND CURDATE() BETWEEN d.from_date AND d.to_date 
                LIMIT 1
            ) as dis_amount
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ? AND p.status = 1
        ORDER BY c.added_at DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate price matching get_product.php logic exactly
    $formattedItems = [];
    foreach ($cartItems as $item) {
        $basePrice = (float)$item['original_price'];
        $disPercent = isset($item['dis_percent']) ? (float)$item['dis_percent'] : 0.0;
        $disAmount = isset($item['dis_amount']) ? (float)$item['dis_amount'] : 0.0;

        $hasDiscount = $disPercent > 0 || $disAmount > 0;

        if ($hasDiscount) {
            if ($disPercent > 0) {
                // Percentage discount
                $finalPrice = $basePrice - ($basePrice * $disPercent / 100);
                $discount = (int)round($disPercent);
                $discountType = 'percent';
            } else {
                // Flat amount discount
                $finalPrice = $basePrice - $disAmount;
                $discount = round($disAmount, 2);
                $discountType = 'flat';
            }
        } else {
            $finalPrice = $basePrice;
            $discount = 0;
            $discountType = 'none';
        }

        $formattedItems[] = [
            'cart_id' => (int)$item['cart_id'],
            'product_id' => (int)$item['product_id'],
            'name' => $item['product_name'],
            'quantity' => (int)$item['quantity'],
            'original_price' => round($basePrice, 2),
            'price' => round($finalPrice, 2),
            'discount' => $discount,
            'discount_type' => $discountType,
            'has_discount' => $hasDiscount,
            'stock' => (int)$item['product_stock']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'data' => $formattedItems
    ]);

} catch (Exception $e) {
    error_log("Error in get_cart.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Server error']);
}
?>
