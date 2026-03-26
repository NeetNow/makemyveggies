<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');

require_once '../config/database.php';

$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    // Check orders table structure
    $stmt = $pdo->query("DESCRIBE orders");
    $ordersColumns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Check if addresses table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'addresses'");
    $addressesExists = $stmt->fetch() ? true : false;
    
    $addressesColumns = [];
    if ($addressesExists) {
        $stmt = $pdo->query("DESCRIBE addresses");
        $addressesColumns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    // Check order_items table
    $stmt = $pdo->query("SHOW TABLES LIKE 'order_items'");
    $orderItemsExists = $stmt->fetch() ? true : false;
    
    echo json_encode([
        'status' => 'success',
        'orders_columns' => $ordersColumns,
        'addresses_exists' => $addressesExists,
        'addresses_columns' => $addressesColumns,
        'order_items_exists' => $orderItemsExists
    ]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
