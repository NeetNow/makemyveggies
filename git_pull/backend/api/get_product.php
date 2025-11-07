<?php
header('Content-Type: application/json');
// In production, change this to your actual frontend domain
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Use __DIR__ for a more reliable file path
require_once __DIR__ . '/../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Get product ID from query parameters
    $product_id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if (!$product_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
        exit;
    }

    // Fetch product with average rating
    $sql = "
        SELECT 
            p.product_id,
            p.title,
            p.description,
            p.price,
            p.key_features,
            p.stock,
            p.sku,
            p.status,
            p.created_at,
            c.name as category_name,
            pi.image_url as primary_image,
            COALESCE(
                (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.product_id),
                0
            ) AS avg_rating,
            COALESCE(
                (SELECT COUNT(r.review_id) FROM reviews r WHERE r.product_id = p.product_id),
                0
            ) AS review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        WHERE p.product_id = ?
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$product_id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit;
    }

    // Format product for frontend
    $formattedProduct = [
        'id' => (int)$product['product_id'],
        'title' => $product['title'],
        'description' => $product['description'],
        'price' => (float)$product['price'],
        'keyFeatures' => $product['key_features'],
        'stock' => (int)$product['stock'],
        'sku' => $product['sku'],
        'status' => (int)$product['status'],
        'categoryName' => $product['category_name'],
        'primaryImage' => $product['primary_image'] ?: '/images/placeholder-product.jpg',
        'createdAt' => $product['created_at'],
        'inStock' => (int)$product['stock'] > 0,
        'rating' => (float)$product['avg_rating'],
        'reviews' => (int)$product['review_count']
    ];

    echo json_encode([
        'status' => 'success',
        'product' => $formattedProduct
    ]);

} catch (PDOException $e) {
    // Catch database-specific errors
    error_log("Database error in get_product.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred.']);
} catch (Exception $e) {
    // Catch all other errors
    error_log("General error in get_product.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
}
?>
