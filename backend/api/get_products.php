<?php
header('Content-Type: application/json');
// In production, change this to your actual frontend domain
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS'); // Only GET and OPTIONS are needed here
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

    // Get query parameters (with safe defaults)
    $category_id = isset($_GET['category']) ? (int)$_GET['category'] : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';

    // Ensure limit and offset are non-negative
    if ($limit < 1) $limit = 12;
    if ($offset < 0) $offset = 0;

    // Build the query
    $whereConditions = ['p.status = 1']; // Only active products
    $params = [];

    if ($category_id) {
        $whereConditions[] = 'p.category_id = ?';
        $params[] = $category_id;
    }

    if ($search) {
        $whereConditions[] = '(p.title LIKE ? OR p.description LIKE ?)';
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    // Sorting (Your method is already secure and correct!)
    $orderBy = 'p.created_at DESC'; // Default
    switch ($sort) {
        case 'price_low':
            $orderBy = 'p.price ASC';
            break;
        case 'price_high':
            $orderBy = 'p.price DESC';
            break;
        case 'name_asc':
            $orderBy = 'p.title ASC';
            break;
        case 'name_desc':
            $orderBy = 'p.title DESC';
            break;
    }

    $whereClause = implode(' AND ', $whereConditions);

    // --- CHANGE 1: LIMIT / OFFSET ---
    // LIMIT and OFFSET values are not always reliably bound as parameters.
    // Since we have already cast $limit and $offset to (int),
    // it is safe and more explicit to put them directly in the query.
    $sql = "
        SELECT 
            p.product_id,
            p.title,
            p.description,
            p.price,
            p.key_features,
            p.stock,
            p.sku,
            p.created_at,
            c.name as category_name,
            pi.image_url as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        WHERE $whereClause
        ORDER BY $orderBy
        LIMIT $limit OFFSET $offset
    ";
    
    // We no longer add $limit and $offset to the $params array
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get total count for pagination
    $countSql = "
        SELECT COUNT(*) as total
        FROM products p
        WHERE $whereClause
    ";
    
    // --- CHANGE 2: COUNT PARAMS ---
    // Since $params no longer contains limit/offset, we can use it directly.
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params); // No need for array_slice
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Format products for frontend
    $formattedProducts = [];
    foreach ($products as $product) {
        $formattedProducts[] = [
            'id' => (int)$product['product_id'],
            'title' => $product['title'],
            'description' => $product['description'],
            'price' => (float)$product['price'],
            // If 'key_features' is stored as JSON, you should decode it:
            // 'keyFeatures' => json_decode($product['key_features']),
            'keyFeatures' => $product['key_features'],
            'stock' => (int)$product['stock'],
            'sku' => $product['sku'],
            'categoryName' => $product['category_name'],
            'primaryImage' => $product['primary_image'] ?: '/images/placeholder-product.jpg',
            'createdAt' => $product['created_at'],
            'inStock' => (int)$product['stock'] > 0
        ];
    }

    echo json_encode([
        'status' => 'success',
        'products' => $formattedProducts,
        'pagination' => [
            'total' => (int)$totalCount,
            'limit' => $limit,
            'offset' => $offset,
            'currentPage' => $offset / $limit + 1,
            'totalPages' => ceil($totalCount / $limit),
            'hasMore' => ($offset + $limit) < $totalCount
        ]
    ]);

} catch (PDOException $e) {
    // Catch database-specific errors
    error_log("Database error in get_products.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred.']);
} catch (Exception $e) {
    // Catch all other errors
    error_log("General error in get_products.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
}
?>