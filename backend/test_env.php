<?php
// Test environment variables and database connection
require_once __DIR__ . '/config/database.php';

echo "<h2>Environment Variables Test</h2>";

try {
    // Load environment variables
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    
    // List of required environment variables
    $requiredVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD'];
    
    echo "<h3>Checking Environment Variables:</h3>";
    echo "<pre>";
    
    $allVarsExist = true;
    foreach ($requiredVars as $var) {
        $value = $_ENV[$var] ?? 'NOT SET';
        echo str_pad("$var: ", 15) . "$value\n";
        
        if ($value === 'NOT SET') {
            $allVarsExist = false;
        }
    }
    
    echo "</pre>";
    
    if (!$allVarsExist) {
        throw new Exception("Some required environment variables are not set. Please check your .env file.");
    }
    
    // Test database connection
    echo "<h3>Testing Database Connection:</h3>";
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "<p style='color: green;'>✅ Successfully connected to the database!</p>";
        
        // Test a simple query
        $stmt = $conn->query("SELECT DATABASE() as dbname");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p>Connected to database: <strong>" . htmlspecialchars($result['dbname']) . "</strong></p>";
        
    } else {
        throw new Exception("Failed to connect to the database.");
    }
    
} catch (Exception $e) {
    echo "<div style='color: red; margin: 20px; padding: 10px; border: 1px solid red;'>";
    echo "<h3>Error:</h3>";
    echo "<p>" . $e->getMessage() . "</p>";
    
    if (strpos($e->getMessage(), 'No such file or directory') !== false) {
        echo "<p>Make sure the .env file exists in the backend directory.</p>";
    } elseif (strpos($e->getMessage(), 'SQLSTATE') !== false) {
        echo "<p>Database connection error. Please check your database credentials in the .env file.</p>";
    }
    
    echo "<h4>Debug Information:</h4>";
    echo "<pre>" . print_r(error_get_last(), true) . "</pre>";
    echo "</div>";
}
?>
