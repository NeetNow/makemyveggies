<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

require_once '../config/database.php';

// Initialize database connection
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Test query
try {
    $stmt = $pdo->query("SELECT 1 as test");
    $result = $stmt->fetch();
    echo json_encode(['status' => 'success', 'message' => 'Database connected', 'test' => $result]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
