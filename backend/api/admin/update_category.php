<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie([]);
    if (!$auth['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $id = isset($input['id']) ? (int)$input['id'] : 0;
    $name = isset($input['name']) ? trim($input['name']) : '';
    $description = isset($input['description']) ? trim($input['description']) : '';
    $parentId = array_key_exists('parentId', $input) ? $input['parentId'] : null;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Category id is required']);
        exit();
    }

    if ($name === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Category name is required']);
        exit();
    }

    $db = new Database();
    $conn = $db->getConnection();

    if (!$conn) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    requireAdminPermission($conn, $auth['user'], 'update.category');

    $sql = "UPDATE categories SET name = :name, description = :description, parent_id = :parent_id WHERE category_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->bindValue(':name', $name);
    $stmt->bindValue(':description', $description);

    if ($parentId === null || $parentId === '') {
        $stmt->bindValue(':parent_id', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindValue(':parent_id', (int)$parentId, PDO::PARAM_INT);
    }

    $stmt->execute();

    echo json_encode([
        'status' => 'success',
        'message' => 'Category updated'
    ]);

} catch (Exception $e) {
    error_log('Admin update category error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
