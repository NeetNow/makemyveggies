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

    // Validate required fields
    if (empty($input['currentPassword']) || empty($input['newPassword'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Current password and new password are required']);
        exit;
    }

    // Get current user password
    $stmt = $pdo->prepare("SELECT password FROM users WHERE user_id = ?");
    $stmt->execute([$userId]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }

    // Verify current password
    if (!password_verify($input['currentPassword'], $userData['password'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect']);
        exit;
    }

    // Validate new password length
    if (strlen($input['newPassword']) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'New password must be at least 6 characters long']);
        exit;
    }

    // Hash new password
    $newPasswordHash = password_hash($input['newPassword'], PASSWORD_DEFAULT);

    // Update password
    $updateStmt = $pdo->prepare("
        UPDATE users 
        SET password = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
    ");
    
    $updateStmt->execute([$newPasswordHash, $userId]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Password changed successfully'
    ]);

} catch (Exception $e) {
    error_log("Change password error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
?>
