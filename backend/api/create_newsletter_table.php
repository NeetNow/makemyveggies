<?php
// Create newsletter subscriptions table
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($query);
    echo "Newsletter subscriptions table created successfully";
} catch(PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>
