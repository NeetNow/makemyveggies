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

    $categoryParam = isset($_GET['category']) ? trim($_GET['category']) : null;
    $categoryIdParam = isset($_GET['categoryId']) ? trim($_GET['categoryId']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 9;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';
    $statusParam = isset($_GET['status']) ? trim($_GET['status']) : null;

    if ($limit < 1) $limit = 9;
    if ($offset < 0) $offset = 0;

    $whereConditions = ['1=1'];
    $params = [];

    if ($categoryParam !== null && $categoryParam !== '') {
        if (ctype_digit($categoryParam)) {
            $whereConditions[] = 'p.category_id = ?';
            $params[] = (int)$categoryParam;
        } else {
            $whereConditions[] = '(LOWER(c.name) = ? OR LOWER(pc.name) = ?)';
            $params[] = strtolower($categoryParam);
            $params[] = strtolower($categoryParam);
        }
    }

    if ($categoryIdParam !== null && $categoryIdParam !== '' && ctype_digit($categoryIdParam)) {
        $whereConditions[] = 'p.category_id = ?';
        $params[] = (int)$categoryIdParam;
    }

    if ($statusParam !== null && $statusParam !== '' && ($statusParam === '0' || $statusParam === '1')) {
        $whereConditions[] = 'p.status = ?';
        $params[] = (int)$statusParam;
    }

    if ($search) {
        $whereConditions[] = '(p.title LIKE ? OR p.description LIKE ?)';
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    $orderBy = 'p.created_at DESC';
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

    $sql = "
        SELECT 
            p.product_id,
            p.title,
            p.description,
            p.price,
            p.stock,
            p.sku,
            p.status,
            p.created_at,
            c.name as category_name,
            pi.image_url as primary_image,
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
        LEFT JOIN categories pc ON c.parent_id = pc.category_id
        LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
        WHERE $whereClause
        ORDER BY $orderBy
        LIMIT $limit OFFSET $offset
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countSql = "
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN categories pc ON c.parent_id = pc.category_id
        WHERE $whereClause
    ";

    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalCount = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    $formattedProducts = [];
    foreach ($products as $product) {
        $disPercent = isset($product['dis_percent']) ? (float)$product['dis_percent'] : 0.0;
        $disAmount  = isset($product['dis_amount'])  ? (float)$product['dis_amount']  : 0.0;
        $hasDiscount = $disPercent > 0 && $disAmount > 0;

        $formattedProducts[] = [
            'id' => (int)$product['product_id'],
            'title' => $product['title'],
            'description' => $product['description'],
            'price' => (float)$product['price'],
            'stock' => (int)$product['stock'],
            'sku' => $product['sku'],
            'status' => (int)$product['status'],
            'categoryName' => $product['category_name'],
            'primaryImage' => $product['primary_image'] ?: '/images/placeholder-product.jpg',
            'createdAt' => $product['created_at'],
            'discount' => $hasDiscount ? [
                'percent' => $disPercent,
                'amount' => $disAmount
            ] : null
        ];
    }

    echo json_encode([
        'status' => 'success',
        'products' => $formattedProducts,
        'pagination' => [
            'total' => $totalCount,
            'limit' => $limit,
            'offset' => $offset,
            'currentPage' => (int)floor($offset / $limit) + 1,
            'totalPages' => (int)ceil($totalCount / $limit),
            'hasMore' => ($offset + $limit) < $totalCount
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin get products error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
