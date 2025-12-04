<?php
// Database configuration for MakeMyVeggies

class Database {
    private $host = 'localhost';
    private $port = '3306';
    private $db_name = 'makemyveggies';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function __construct() {
        // You can uncomment and use environment variables if needed
        /*
        if (file_exists(__DIR__ . '/../.env')) {
            $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
            $dotenv->load();
            
            $this->host = $_ENV['DB_HOST'] ?? $this->host;
            $this->port = $_ENV['DB_PORT'] ?? $this->port;
            $this->db_name = $_ENV['DB_NAME'] ?? $this->db_name;
            $this->username = $_ENV['DB_USERNAME'] ?? $this->username;
            $this->password = $_ENV['DB_PASSWORD'] ?? $this->password;
        }
        */
    }

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            return null;
        }
        
        return $this->conn;
    }
}

// CORS headers for frontend communication
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Response helper function
function sendResponse($success, $message, $data = null, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json');
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response);
    exit();
}
?>
