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

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        exit;
    }

    // Update user profile
    $stmt = $pdo->prepare("
        UPDATE users 
        SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
    ");
    
    $stmt->execute([
        $input['firstName'] ?? '',
        $input['lastName'] ?? '',
        $input['phone'] ?? '',
        $userId
    ]);

    // Handle address update/insert
    if (isset($input['addressLine1']) || isset($input['city']) || isset($input['state'])) {
        // Check if address exists
        $addressCheckStmt = $pdo->prepare("SELECT address_id FROM addresses WHERE user_id = ?");
        $addressCheckStmt->execute([$userId]);
        $existingAddress = $addressCheckStmt->fetch();

        if ($existingAddress) {
            // Update existing address
            $addressStmt = $pdo->prepare("
                UPDATE addresses 
                SET address_line1 = ?, address_line2 = ?, city = ?, state = ?, country = ?, postal_code = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ");
            
            $addressStmt->execute([
                $input['addressLine1'] ?? '',
                $input['addressLine2'] ?? '',
                $input['city'] ?? '',
                $input['state'] ?? '',
                $input['country'] ?? '',
                $input['postalCode'] ?? '',
                $userId
            ]);
        } else {
            // Insert new address
            $addressStmt = $pdo->prepare("
                INSERT INTO addresses (user_id, address_line1, address_line2, city, state, country, postal_code)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            
            $addressStmt->execute([
                $userId,
                $input['addressLine1'] ?? '',
                $input['addressLine2'] ?? '',
                $input['city'] ?? '',
                $input['state'] ?? '',
                $input['country'] ?? '',
                $input['postalCode'] ?? ''
            ]);
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Profile updated successfully'
    ]);

} catch (Exception $e) {
    error_log("Update profile error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
