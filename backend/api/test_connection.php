<?php
// Test database connection
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Test the connection
    if ($conn) {
        echo "✅ Database connection successful!<br>";
        
        // Test if we can execute a simple query
        $stmt = $conn->query("SELECT DATABASE() as dbname");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "✅ Connected to database: " . htmlspecialchars($result['dbname']) . "<br>";
        
        // Test if the newsletter table exists
        $stmt = $conn->query("SHOW TABLES LIKE 'newsletter_subscriptions'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Newsletter subscriptions table exists<br>";
            
            // Show table structure
            $stmt = $conn->query("DESCRIBE newsletter_subscriptions");
            echo "<br>Table structure:<br>";
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['Field']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Type']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Null']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Key']) . "</td>";
                echo "<td>" . htmlspecialchars($row['Default'] ?? 'NULL') . "</td>";
                echo "<td>" . htmlspecialchars($row['Extra']) . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "❌ Newsletter subscriptions table does not exist<br>";
        }
    } else {
        echo "❌ Database connection failed";
    }
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "<br>";
    echo "Error Code: " . $e->getCode() . "<br>";
    
    // Show more detailed error information
    echo "<pre>Error Info:";
    print_r($database->getConnection()->errorInfo());
    echo "</pre>";
}
?>
