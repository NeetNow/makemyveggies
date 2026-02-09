<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyAdminJWTFromCookie(array $requiredRoles = ['admin', 'super_admin']) {
    $jwt_secret = $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production-2024';
    $jwt_algorithm = 'HS256';

    try {
        if (!isset($_COOKIE['admin_auth_token'])) {
            return ['success' => false, 'message' => 'No authentication token found'];
        }

        $jwt_token = $_COOKIE['admin_auth_token'];
        $decoded = JWT::decode($jwt_token, new Key($jwt_secret, $jwt_algorithm));
        $data = (array)$decoded;

        if (isset($data['exp']) && (int)$data['exp'] < time()) {
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
                if (is_array($decodedRoles)) {
                    $roles = $decodedRoles;
                }
            }
        }

        $hasRole = false;
        foreach ($requiredRoles as $rr) {
            if (in_array($rr, $roles, true)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            return ['success' => false, 'message' => 'Forbidden'];
        }

        $data['roles'] = $roles;
        return ['success' => true, 'user' => $data];
    } catch (Exception $e) {
        error_log('Admin JWT verification error: ' . $e->getMessage());
        return ['success' => false, 'message' => 'Invalid token'];
    }
}

function readJsonInput() {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        return null;
    }
    return $input;
}
?>
