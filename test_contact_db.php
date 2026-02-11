<?php
// Test script for contact_messages database connection
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

require_once __DIR__ . '/backend/config/database.php';

echo "<h2>Contact Messages Database Test</h2>";

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        echo "<p style='color:red'>Database connection FAILED</p>";
        exit;
    }

    echo "<p style='color:green'>Database connection: OK</p>";

    // Check if table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'contact_messages'");
    $tableExists = $stmt->rowCount() > 0;

    if ($tableExists) {
        echo "<p style='color:green'>Table 'contact_messages' exists: YES</p>";

        // Count records
        $countStmt = $pdo->query("SELECT COUNT(*) as total FROM contact_messages");
        $count = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        echo "<p>Total messages in database: <strong>$count</strong></p>";

        // Show last 5 messages
        if ($count > 0) {
            echo "<h3>Last 5 messages:</h3>";
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Created</th></tr>";

            $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $name = trim($row['first_name'] . ' ' . $row['last_name']);
                if (empty($name)) $name = '—';
                echo "<tr>";
                echo "<td>" . $row['id'] . "</td>";
                echo "<td>" . htmlspecialchars($name) . "</td>";
                echo "<td>" . htmlspecialchars($row['email']) . "</td>";
                echo "<td>" . htmlspecialchars($row['subject'] ?? '—') . "</td>";
                echo "<td>" . $row['status'] . "</td>";
                echo "<td>" . $row['created_at'] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    } else {
        echo "<p style='color:orange'>Table 'contact_messages' does NOT exist yet</p>";
        echo "<p>The table will be auto-created when you submit the first contact form.</p>";
    }

    // Test insert
    echo "<h3>Test Insert</h3>";

    $pdo->exec("CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(120) NULL,
        last_name VARCHAR(120) NULL,
        phone VARCHAR(50) NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NULL,
        message TEXT NOT NULL,
        status ENUM('new','read','archived') NOT NULL DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $testEmail = 'test_' . time() . '@example.com';
    $stmt = $pdo->prepare("INSERT INTO contact_messages (first_name, last_name, phone, email, subject, message, status) VALUES ('Test', 'User', '1234567890', :email, 'Test Subject', 'This is a test message', 'new')");
    $stmt->bindValue(':email', $testEmail);

    if ($stmt->execute()) {
        $newId = $pdo->lastInsertId();
        echo "<p style='color:green'>Test insert SUCCESS (ID: $newId)</p>";

        // Delete test record
        $pdo->prepare("DELETE FROM contact_messages WHERE id = ?")->execute([$newId]);
        echo "<p>Test record cleaned up.</p>";
    } else {
        echo "<p style='color:red'>Test insert FAILED</p>";
    }

} catch (Exception $e) {
    echo "<p style='color:red'>ERROR: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<hr><p>Test completed. Check your PHP error log for more details if needed.</p>";
