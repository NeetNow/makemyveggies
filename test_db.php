<?php
// Test database connection and create table

// Database configuration
$host = 'localhost';
$dbname = 'makemyveggies';
$username = 'root';
$password = '';

try {
    // Create connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected to database successfully<br>";
    
    // Create table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($sql);
    echo "✅ Newsletter subscriptions table created successfully<br>";
    
    // Test insert
    $testEmail = 'test_' . time() . '@example.com';
    $stmt = $conn->prepare("INSERT IGNORE INTO newsletter_subscriptions (email) VALUES (:email)");
    $stmt->bindParam(':email', $testEmail);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Test record inserted successfully<br>";
    } else {
        echo "ℹ️ Test record already exists<br>";
    }
    
    // Count records
    $count = $conn->query("SELECT COUNT(*) FROM newsletter_subscriptions")->fetchColumn();
    echo "📊 Total subscriptions: " . $count . "<br>";
    
} catch(PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "<br>";
    echo "Error Code: " . $e->getCode() . "<br>";
}
