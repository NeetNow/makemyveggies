<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    $productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($productId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
        exit();
    }

    $sql = "
        SELECT 
            p.product_id,
            p.title,
            p.description,
            p.price,
            p.key_features,
            p.category_id,
            p.stock,
            p.sku,
            p.status,
            p.created_at,
            c.name as category_name,
            pi.image_url as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        WHERE p.product_id = ?
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit();
    }

    $imgStmt = $pdo->prepare("SELECT image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, image_id ASC");
    $imgStmt->execute([$productId]);
    $images = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

    $primaryImage = $product['primary_image'] ?: '/images/placeholder-product.jpg';
    $secondaryImages = [];
    foreach ($images as $img) {
        $url = isset($img['image_url']) ? (string)$img['image_url'] : '';
        if ($url === '') continue;
        if ((int)($img['is_primary'] ?? 0) === 1) {
            $primaryImage = $url;
        } else {
            $secondaryImages[] = $url;
        }
    }

    $incStmt = $pdo->prepare("SELECT includes FROM product_includes WHERE product_id = ? ORDER BY id ASC");
    $incStmt->execute([$productId]);
    $includesRows = $incStmt->fetchAll(PDO::FETCH_ASSOC);
    $productIncludes = [];
    foreach ($includesRows as $row) {
        $val = isset($row['includes']) ? trim((string)$row['includes']) : '';
        if ($val !== '') $productIncludes[] = $val;
    }

    $disStmt = $pdo->prepare("
        SELECT dis_id, dis_percent, dis_amount, from_date, to_date
        FROM discounts
        WHERE product_id = ?
        ORDER BY from_date DESC
        LIMIT 1
    ");
    $disStmt->execute([$productId]);
    $discount = $disStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'product' => [
            'id' => (int)$product['product_id'],
            'title' => $product['title'],
            'description' => $product['description'],
            'price' => (float)$product['price'],
            'keyFeatures' => $product['key_features'],
            'categoryId' => isset($product['category_id']) ? (int)$product['category_id'] : null,
            'stock' => (int)$product['stock'],
            'sku' => $product['sku'],
            'status' => (int)$product['status'],
            'categoryName' => $product['category_name'],
            'primaryImage' => $primaryImage,
            'secondaryImages' => $secondaryImages,
            'productIncludes' => $productIncludes,
            'discount' => $discount ? [
                'id' => (int)$discount['dis_id'],
                'percent' => (float)$discount['dis_percent'],
                'amount' => (float)$discount['dis_amount'],
                'fromDate' => $discount['from_date'],
                'toDate' => $discount['to_date']
            ] : null,
            'createdAt' => $product['created_at']
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin get product error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
