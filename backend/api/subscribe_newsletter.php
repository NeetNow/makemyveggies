<?php
// Newsletter subscription API endpoint
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Use database connection from config
require_once __DIR__ . '/../config/database.php';

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get the request data
$requestData = json_decode(file_get_contents("php://input"));

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit();
}

// Check if email exists in the request
if (!isset($requestData->email) || empty(trim($requestData->email))) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit();
}

// Validate email format
$email = trim($requestData->email);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please enter a valid email address"]);
    exit();
}

// Initialize database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    error_log("Newsletter: Database connection failed");
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

error_log("Newsletter: Database connected, processing email: " . $email);

try {
    // Check if email already exists
    $query = "SELECT id FROM newsletter_subscriptions WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    
    if (!$stmt->execute()) {
        throw new Exception("Database query failed");
    }
    
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            "success" => true, 
            "message" => "You're already subscribed to our newsletter!"
        ]);
        exit();
    }
    
    // Insert new subscription
    $query = "INSERT INTO newsletter_subscriptions (email, created_at) VALUES (:email, NOW())";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    
    error_log("Newsletter: Executing insert for email: " . $email);
    
    if ($stmt->execute()) {
        error_log("Newsletter: Insert successful for email: " . $email);
        http_response_code(201);
        echo json_encode([
            "success" => true, 
            "message" => "Thank you for subscribing to our newsletter!"
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        error_log("Newsletter: Insert failed - " . ($errorInfo[2] ?? "Unknown error"));
        throw new Exception($errorInfo[2] ?? "Failed to subscribe. Please try again later.");
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}

// Close the database connection
$db = null;
?>
