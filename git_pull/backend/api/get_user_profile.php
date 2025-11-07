<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';
require_once '../middleware/jwt_auth.php';

// Initialize database connection
$database = new Database();
$pdo = $database->getConnection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

try {
    // Verify JWT token
    $auth_result = verifyJWTFromCookie();
    if (!$auth_result['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth_result['message']]);
        exit;
    }

    $user = $auth_result['user'];
    $userId = $user['user_id'];

    // Get user profile data
    $stmt = $pdo->prepare("
        SELECT 
            u.user_id,
            u.first_name,
            u.last_name, 
            u.email,
            u.phone,
            a.address_line1,
            a.address_line2,
            a.city,
            a.state,
            a.country,
            a.postal_code
        FROM users u 
        LEFT JOIN addresses a ON u.user_id = a.user_id 
        WHERE u.user_id = ? AND u.is_active = 1
    ");
    
    $stmt->execute([$userId]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$userData) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }

    // Format the response to match frontend expectations
    $userProfile = [
        'firstName' => $userData['first_name'],
        'lastName' => $userData['last_name'],
        'email' => $userData['email'],
        'phone' => $userData['phone'] ?? '',
        'addressLine1' => $userData['address_line1'] ?? '',
        'addressLine2' => $userData['address_line2'] ?? '',
        'city' => $userData['city'] ?? '',
        'state' => $userData['state'] ?? '',
        'country' => $userData['country'] ?? '',
        'postalCode' => $userData['postal_code'] ?? ''
    ];

    echo json_encode([
        'status' => 'success',
        'user' => $userProfile
    ]);

} catch (Exception $e) {
    error_log("Get user profile error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
