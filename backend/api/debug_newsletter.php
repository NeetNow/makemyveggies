<?php
// Debug newsletter subscription
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

echo "<h3>Newsletter Debug Test</h3>";

// Test database connection
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        echo "❌ Database connection failed<br>";
        exit();
    }
    
    echo "✅ Database connected<br>";
    
    // Test table exists
    $stmt = $db->query("SHOW TABLES LIKE 'newsletter_subscriptions'");
    if ($stmt->rowCount() === 0) {
        echo "❌ Table newsletter_subscriptions doesn't exist<br>";
        exit();
    }
    
    echo "✅ Table exists<br>";
    
    // Test insert with sample data
    $testEmail = "test" . time() . "@example.com";
    echo "<br>Testing insert with email: " . htmlspecialchars($testEmail) . "<br>";
    
    $query = "INSERT INTO newsletter_subscriptions (email, created_at) VALUES (:email, NOW())";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $testEmail);
    
    if ($stmt->execute()) {
        echo "✅ Insert successful! ID: " . $db->lastInsertId() . "<br>";
        
        // Verify the insert
        $stmt = $db->prepare("SELECT * FROM newsletter_subscriptions WHERE email = :email");
        $stmt->bindParam(":email", $testEmail);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo "✅ Record verified in database<br>";
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "Email: " . htmlspecialchars($row['email']) . "<br>";
            echo "Created: " . htmlspecialchars($row['created_at']) . "<br>";
        } else {
            echo "❌ Record not found after insert<br>";
        }
        
    } else {
        $errorInfo = $stmt->errorInfo();
        echo "❌ Insert failed: " . htmlspecialchars($errorInfo[2]) . "<br>";
    }
    
    // Show all records
    echo "<br><h3>All Newsletter Records:</h3>";
    $stmt = $db->query("SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC LIMIT 10");
    
    if ($stmt->rowCount() > 0) {
        echo "<table border='1' cellpadding='5'>";
        echo "<tr><th>ID</th><th>Email</th><th>Created</th></tr>";
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . htmlspecialchars($row['email']) . "</td>";
            echo "<td>" . htmlspecialchars($row['created_at']) . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No records found in newsletter table<br>";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . htmlspecialchars($e->getMessage()) . "<br>";
}
?>
