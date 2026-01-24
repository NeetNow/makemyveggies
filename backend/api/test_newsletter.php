<?php
// Test connection and newsletter table
require_once __DIR__ . '/../config/database.php';

echo "<h3>Database Connection Test</h3>";

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "✅ Database connection successful!<br>";
        
        // Get database name
        $stmt = $conn->query("SELECT DATABASE() as dbname");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "✅ Connected to database: " . htmlspecialchars($result['dbname']) . "<br>";
        
        // Check newsletter table
        echo "<br><h3>Newsletter Table Check</h3>";
        $stmt = $conn->query("SHOW TABLES LIKE 'newsletter_subscriptions'");
        
        if ($stmt->rowCount() > 0) {
            echo "✅ Newsletter subscriptions table exists<br>";
            
            // Show table structure
            $stmt = $conn->query("DESCRIBE newsletter_subscriptions");
            echo "<br><strong>Table structure:</strong><br>";
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['Field']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Type']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Null']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Key']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Default']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Extra']) . "</td>";
                echo "</tr>";
            }
            echo "</table>";
            
            // Show sample data
            $stmt = $conn->query("SELECT COUNT(*) as count FROM newsletter_subscriptions");
            $count = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<br>✅ Table has " . $count['count'] . " records<br>";
            
        } else {
            echo "❌ Newsletter subscriptions table does not exist<br>";
            echo "<br>Please run this SQL in your database:<br>";
            echo "<pre>";
            echo "CREATE TABLE `newsletter_subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
            echo "</pre>";
        }
        
    } else {
        echo "❌ Database connection failed";
    }
} catch (PDOException $e) {
    echo "❌ Connection failed: " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<br>Please check your .env file configuration";
}
?>
