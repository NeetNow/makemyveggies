<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $auth = verifyJWTFromCookie();
    if (!$auth['success']) {
        sendResponse(false, $auth['message'], null, 401);
    }
    $user = $auth['user'];
    $userId = $user['user_id'];

    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $stmt = $pdo->prepare('SELECT address_id, address_line1, address_line2, city, state, country, postal_code FROM addresses WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$userId]);
    $addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendResponse(true, 'Addresses fetched successfully', $addresses);
} catch (Exception $e) {
    error_log('get_addresses error: ' . $e->getMessage());
    sendResponse(false, 'Internal server error', null, 500);
}
