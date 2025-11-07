<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

try {
    // Initialize database connection
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Get all categories with product count
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

    // Format categories for frontend
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
    error_log("Get categories error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
