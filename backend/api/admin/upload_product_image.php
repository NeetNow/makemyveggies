<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'image is required']);
        exit();
    }

    $file = $_FILES['image'];

    if (!empty($file['error'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Upload failed']);
        exit();
    }

    $maxBytes = 10 * 1024 * 1024; // 10MB
    if (!empty($file['size']) && (int)$file['size'] > $maxBytes) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'File too large (max 10MB)']);
        exit();
    }

    $tmp = $file['tmp_name'];
    $origName = isset($file['name']) ? (string)$file['name'] : '';

    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'webp'];

    if ($ext === '' || !in_array($ext, $allowed, true)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Only jpg, jpeg, png, webp allowed']);
        exit();
    }

    $uploadDir = realpath(__DIR__ . '/../../') . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'products';
    if ($uploadDir === false) {
        $uploadDir = __DIR__ . '/../../uploads/products';
    }

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to create upload directory']);
            exit();
        }
    }

    $base = bin2hex(random_bytes(16));
    $filename = $base . '.' . $ext;
    $target = rtrim($uploadDir, '/\\') . DIRECTORY_SEPARATOR . $filename;

    if (!move_uploaded_file($tmp, $target)) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded file']);
        exit();
    }

    // Public URL relative to project root (same base as REACT_APP_API_BASE)
    $publicUrl = '/backend/uploads/products/' . $filename;

    echo json_encode([
        'status' => 'success',
        'url' => $publicUrl
    ]);

} catch (Exception $e) {
    error_log('Admin upload product image error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
