<?php
// Simple database connection test
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h3>Database Connection Test</h3>";

// First try direct connection without .env
try {
    $host = 'localhost';
    $dbname = 'makemyveggies';
    $username = 'root';
    $password = '';
    
    echo "Trying direct connection to: $host/$dbname<br>";
    
    $conn = new PDO(
        "mysql:host=$host;dbname=$dbname",
        $username,
        $password
    );
    
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Direct connection successful!<br>";
    
    // Test table
    $stmt = $conn->query("SHOW TABLES LIKE 'newsletter_subscriptions'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Newsletter table exists<br>";
        
        // Show records
        $stmt = $conn->query("SELECT COUNT(*) as count FROM newsletter_subscriptions");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "✅ Table has " . $count['count'] . " records<br>";
        
    } else {
        echo "❌ Newsletter table not found<br>";
    }
    
} catch (PDOException $e) {
    echo "❌ Direct connection failed: " . htmlspecialchars($e->getMessage()) . "<br>";
    
    // Try to list available databases
    try {
        $conn = new PDO("mysql:host=localhost", "root", "");
        $stmt = $conn->query("SHOW DATABASES");
        echo "<br>Available databases:<br>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "- " . htmlspecialchars($row['Database']) . "<br>";
        }
    } catch (Exception $e2) {
        echo "❌ Cannot list databases: " . htmlspecialchars($e2->getMessage()) . "<br>";
    }
}

echo "<br><h3>Testing .env file</h3>";

// Check if .env exists
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    echo "✅ .env file found at: " . htmlspecialchars($envPath) . "<br>";
    
    // Show .env content (hide password)
    $envContent = file_get_contents($envPath);
    $lines = explode("\n", $envContent);
    foreach ($lines as $line) {
        if (strpos($line, 'DB_PASSWORD') !== false) {
            echo "DB_PASSWORD=***HIDDEN***<br>";
        } elseif (!empty(trim($line))) {
            echo htmlspecialchars($line) . "<br>";
        }
    }
} else {
    echo "❌ .env file not found at: " . htmlspecialchars($envPath) . "<br>";
    echo "Expected location: backend/.env<br>";
}

// Try with database.php class
echo "<br><h3>Testing Database class</h3>";
try {
    require_once __DIR__ . '/../config/database.php';
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "✅ Database class connection successful!<br>";
    } else {
        echo "❌ Database class connection failed<br>";
    }
} catch (Exception $e) {
    echo "❌ Database class error: " . htmlspecialchars($e->getMessage()) . "<br>";
}
?>
