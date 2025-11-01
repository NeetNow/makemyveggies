<?php
require_once '../config/database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        die("Database connection failed");
    }

    // Test user data
    $firstName = 'Test';
    $lastName = 'User';
    $email = 'test@example.com';
    $password = password_hash('password123', PASSWORD_DEFAULT);
    $phone = '1234567890';

    // Check if user already exists
    $checkStmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
    $checkStmt->execute([$email]);
    
    if ($checkStmt->fetch()) {
        echo "Test user already exists!<br>";
        echo "Email: test@example.com<br>";
        echo "Password: password123<br>";
    } else {
        // Insert test user
        $stmt = $pdo->prepare("
            INSERT INTO users (first_name, last_name, email, password, phone, email_verified, is_active) 
            VALUES (?, ?, ?, ?, ?, 1, 1)
        ");
        
        $stmt->execute([$firstName, $lastName, $email, $password, $phone]);
        $userId = $pdo->lastInsertId();

        // Insert test address
        $addressStmt = $pdo->prepare("
            INSERT INTO addresses (user_id, address_line1, address_line2, city, state, country, postal_code)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $addressStmt->execute([
            $userId,
            '123 Test Street',
            'Apt 4B',
            'Test City',
            'Test State',
            'Test Country',
            '12345'
        ]);

        echo "✅ Test user created successfully!<br><br>";
        echo "<strong>Login Credentials:</strong><br>";
        echo "Email: test@example.com<br>";
        echo "Password: password123<br><br>";
        echo "User ID: " . $userId . "<br>";
    }

    echo "<br><strong>Next Steps:</strong><br>";
    echo "1. Go to http://localhost:3000<br>";
    echo "2. Log in with the credentials above<br>";
    echo "3. Navigate to the profile page<br>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
