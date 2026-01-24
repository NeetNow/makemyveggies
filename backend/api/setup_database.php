<?php
// Create database and table if they don't exist
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>Database Setup</h3>";

try {
    // Connect to MySQL without database
    $conn = new PDO("mysql:host=localhost", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected to MySQL server<br>";
    
    // Create database if not exists
    $conn->exec("CREATE DATABASE IF NOT EXISTS makemyveggies CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database 'makemyveggies' ready<br>";
    
    // Switch to the database
    $conn->exec("USE makemyveggies");
    
    // Create newsletter table
    $createTableSQL = "CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id int(11) NOT NULL AUTO_INCREMENT,
        email varchar(255) NOT NULL,
        created_at timestamp NULL DEFAULT current_timestamp(),
        updated_at timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $conn->exec($createTableSQL);
    echo "✅ Newsletter table created/verified<br>";
    
    // Test insert
    $testEmail = "test" . time() . "@example.com";
    $stmt = $conn->prepare("INSERT INTO newsletter_subscriptions (email) VALUES (?)");
    $stmt->execute([$testEmail]);
    echo "✅ Test email inserted: " . htmlspecialchars($testEmail) . "<br>";
    
    // Show records
    $stmt = $conn->query("SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC LIMIT 5");
    echo "<br><strong>Recent subscriptions:</strong><br>";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "- " . htmlspecialchars($row['email']) . " (" . $row['created_at'] . ")<br>";
    }
    
    echo "<br><h3>✅ Database setup complete!</h3>";
    echo "Newsletter subscription is now ready to use.";
    
} catch (PDOException $e) {
    echo "❌ Error: " . htmlspecialchars($e->getMessage()) . "<br>";
    
    if (strpos($e->getMessage(), "Access denied") !== false) {
        echo "<br>Please check:<br>";
        echo "- XAMPP MySQL is running<br>";
        echo "- Username is 'root' and password is empty<br>";
        echo "- MySQL port is 3306<br>";
    }
}
?>
