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

    $stmt = $pdo->prepare("
        SELECT 
            c.category_id,
            c.name,
            c.description,
            c.parent_id,
            COUNT(p.product_id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.category_id = p.category_id AND p.status = 1
        GROUP BY c.category_id, c.name, c.description, c.parent_id
        ORDER BY c.name ASC
    ");

    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedCategories = [];
    foreach ($categories as $category) {
        $formattedCategories[] = [
            'id' => (int)$category['category_id'],
            'name' => $category['name'],
            'description' => $category['description'],
            'parentId' => $category['parent_id'] ? (int)$category['parent_id'] : null,
            'productCount' => (int)$category['product_count']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'categories' => $formattedCategories
    ]);

} catch (Exception $e) {
    error_log('Admin get categories error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
