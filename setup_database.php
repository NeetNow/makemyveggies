<?php
// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'makemyveggies';

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    echo "✅ Database created successfully\n";
    
    // Select the database
    $pdo->exec("USE `$dbname`");
    
    // Create table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS `newsletter_subscriptions` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "✅ Table 'newsletter_subscriptions' created successfully\n";
    
    echo "✅ Database setup completed successfully!\n";
    
} catch(PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}
?>
