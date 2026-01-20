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

    // Fetch product with average rating and active discount (if any)
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
            ) AS review_count,
            (
                SELECT d.dis_percent
                FROM discounts d
                WHERE d.product_id = p.product_id
                  AND CURDATE() BETWEEN d.from_date AND d.to_date
                ORDER BY d.from_date DESC
                LIMIT 1
            ) AS dis_percent,
            (
                SELECT d.dis_amount
                FROM discounts d
                WHERE d.product_id = p.product_id
                  AND CURDATE() BETWEEN d.from_date AND d.to_date
                ORDER BY d.from_date DESC
                LIMIT 1
            ) AS dis_amount
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

    // Fetch all product images for gallery (primary first)
    $imagesSql = "
        SELECT image_url, is_primary
        FROM product_images
        WHERE product_id = ?
        ORDER BY is_primary DESC, image_id ASC
    ";
    $imagesStmt = $pdo->prepare($imagesSql);
    $imagesStmt->execute([$product_id]);
    $imagesRows = $imagesStmt->fetchAll(PDO::FETCH_ASSOC);
    $images = [];
    foreach ($imagesRows as $row) {
        if (!empty($row['image_url'])) {
            $images[] = $row['image_url'];
        }
    }

    // Fetch recent reviews with user names
    $reviewsSql = "
        SELECT r.rating, r.comment, r.created_at, u.first_name, u.last_name
        FROM reviews r
        JOIN users u ON u.user_id = r.user_id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
        LIMIT 20
    ";
    $reviewsStmt = $pdo->prepare($reviewsSql);
    $reviewsStmt->execute([$product_id]);
    $reviewsRows = $reviewsStmt->fetchAll(PDO::FETCH_ASSOC);

    $reviewsList = [];
    foreach ($reviewsRows as $r) {
        $name = trim(($r['first_name'] ?? '') . ' ' . ($r['last_name'] ?? ''));
        $reviewsList[] = [
            'rating' => (int)$r['rating'],
            'comment' => $r['comment'] ?? '',
            'createdAt' => $r['created_at'],
            'userName' => $name !== '' ? $name : 'Customer'
        ];
    }

    // Rating breakdown (1-5)
    $breakdownSql = "
        SELECT rating, COUNT(*) AS cnt
        FROM reviews
        WHERE product_id = ?
        GROUP BY rating
    ";
    $breakdownStmt = $pdo->prepare($breakdownSql);
    $breakdownStmt->execute([$product_id]);
    $breakdownRows = $breakdownStmt->fetchAll(PDO::FETCH_ASSOC);

    $ratingBreakdown = [
        '5' => 0,
        '4' => 0,
        '3' => 0,
        '2' => 0,
        '1' => 0
    ];
    foreach ($breakdownRows as $b) {
        $rt = (string)(int)$b['rating'];
        if (isset($ratingBreakdown[$rt])) {
            $ratingBreakdown[$rt] = (int)$b['cnt'];
        }
    }

    // Compute discount-aware pricing using discounts table (same as get_products.php)
    $basePrice = (float)$product['price'];
    $disPercent = isset($product['dis_percent']) ? (float)$product['dis_percent'] : 0.0;
    $disAmount  = isset($product['dis_amount'])  ? (float)$product['dis_amount']  : 0.0;

    $hasDiscount = $disPercent > 0 && $disAmount > 0;

    if ($hasDiscount) {
        $price = $disAmount;
        $originalPrice = $basePrice;
        $discount = (int)round($disPercent);
    } else {
        $price = $basePrice;
        $originalPrice = $basePrice;
        $discount = 0;
    }

    // Format product for frontend
    $formattedProduct = [
        'id' => (int)$product['product_id'],
        'title' => $product['title'],
        'description' => $product['description'],
        'price' => $price,
        'originalPrice' => $originalPrice,
        'discount' => $discount,
        'keyFeatures' => $product['key_features'],
        'stock' => (int)$product['stock'],
        'sku' => $product['sku'],
        'status' => (int)$product['status'],
        'categoryName' => $product['category_name'],
        'primaryImage' => $product['primary_image'] ?: '/images/placeholder-product.jpg',
        'images' => $images,
        'createdAt' => $product['created_at'],
        'inStock' => (int)$product['stock'] > 0,
        'rating' => (float)$product['avg_rating'],
        'reviews' => (int)$product['review_count'],
        'reviewsList' => $reviewsList,
        'ratingBreakdown' => $ratingBreakdown
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
