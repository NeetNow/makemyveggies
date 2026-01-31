<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

function verifyAdminJWTFromCookie() {
    $jwt_secret = $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production-2024';
    $jwt_algorithm = 'HS256';

    try {
        if (!isset($_COOKIE['admin_auth_token'])) {
            return ['success' => false, 'message' => 'No authentication token found'];
        }

        $jwt_token = $_COOKIE['admin_auth_token'];
        $decoded = JWT::decode($jwt_token, new Key($jwt_secret, $jwt_algorithm));
        $data = (array)$decoded;

        if (isset($data['exp']) && $data['exp'] < time()) {
            return ['success' => false, 'message' => 'Token has expired'];
        }

        $roles = [];
        if (isset($data['roles'])) {
            if (is_array($data['roles'])) {
                $roles = $data['roles'];
            } elseif (is_object($data['roles'])) {
                $roles = (array)$data['roles'];
            } elseif (is_string($data['roles'])) {
                $decodedRoles = json_decode($data['roles'], true);
                if (is_array($decodedRoles)) $roles = $decodedRoles;
            }
        }

        if (!in_array('admin', $roles, true) && !in_array('super_admin', $roles, true)) {
            return ['success' => false, 'message' => 'Forbidden'];
        }

        return ['success' => true, 'user' => $data];
    } catch (Exception $e) {
        error_log('Admin JWT verification error: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Invalid token'];
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie();
    if (!$auth['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $orderId = isset($input['orderId']) ? (int)$input['orderId'] : 0;
    $status = array_key_exists('status', $input) ? trim((string)$input['status']) : '';
    $paymentStatus = array_key_exists('paymentStatus', $input) ? trim((string)$input['paymentStatus']) : '';

    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'orderId is required']);
        exit();
    }

    if ($status === '' && $paymentStatus === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Nothing to update']);
        exit();
    }

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    $fields = [];
    $params = [];

    if ($status !== '') {
        $fields[] = 'status = ?';
        $params[] = $status;
    }

    if ($paymentStatus !== '') {
        $fields[] = 'payment_status = ?';
        $params[] = $paymentStatus;
    }

    $fields[] = 'updated_at = NOW()';

    $params[] = $orderId;

    $sql = 'UPDATE orders SET ' . implode(', ', $fields) . ' WHERE order_id = ?';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() === 0) {
        $existsStmt = $pdo->prepare('SELECT order_id FROM orders WHERE order_id = ?');
        $existsStmt->execute([$orderId]);
        $exists = $existsStmt->fetch(PDO::FETCH_ASSOC);

        if (!$exists) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Order not found']);
            exit();
        }
    }

    echo json_encode(['status' => 'success', 'message' => 'Order updated']);

} catch (Exception $e) {
    error_log('Admin update order error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
