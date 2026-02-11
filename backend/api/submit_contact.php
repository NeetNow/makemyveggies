<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    sendResponse(false, 'Invalid JSON data', null, 400);
}

$firstName = isset($input['firstName']) ? trim((string)$input['firstName']) : '';
$lastName = isset($input['lastName']) ? trim((string)$input['lastName']) : '';
$phone = isset($input['phone']) ? trim((string)$input['phone']) : '';
$email = isset($input['email']) ? trim((string)$input['email']) : '';
$subject = isset($input['subject']) ? trim((string)$input['subject']) : '';
$message = isset($input['message']) ? trim((string)$input['message']) : '';

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please enter a valid email address', null, 400);
}

if ($message === '') {
    sendResponse(false, 'Message is required', null, 400);
}

if (strlen($message) > 5000) {
    sendResponse(false, 'Message is too long', null, 400);
}

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS contact_messages (\n"
        . "  id INT AUTO_INCREMENT PRIMARY KEY,\n"
        . "  first_name VARCHAR(120) NULL,\n"
        . "  last_name VARCHAR(120) NULL,\n"
        . "  phone VARCHAR(50) NULL,\n"
        . "  email VARCHAR(255) NOT NULL,\n"
        . "  subject VARCHAR(255) NULL,\n"
        . "  message TEXT NOT NULL,\n"
        . "  status ENUM('new','read','archived') NOT NULL DEFAULT 'new',\n"
        . "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n"
        . "  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n"
        . ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $stmt = $pdo->prepare('INSERT INTO contact_messages (first_name, last_name, phone, email, subject, message, status) VALUES (:first_name, :last_name, :phone, :email, :subject, :message, \'new\')');
    $stmt->bindValue(':first_name', $firstName !== '' ? $firstName : null);
    $stmt->bindValue(':last_name', $lastName !== '' ? $lastName : null);
    $stmt->bindValue(':phone', $phone !== '' ? $phone : null);
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':subject', $subject !== '' ? $subject : null);
    $stmt->bindValue(':message', $message);

    if (!$stmt->execute()) {
        $err = $stmt->errorInfo();
        throw new Exception($err[2] ?? 'Failed to submit message');
    }

    sendResponse(true, 'Message sent successfully', [
        'id' => (int)$pdo->lastInsertId()
    ], 201);
} catch (Exception $e) {
    error_log('Submit contact error: ' . $e->getMessage());
    error_log('Submit contact trace: ' . $e->getTraceAsString());
    sendResponse(false, 'Failed to submit message: ' . $e->getMessage(), null, 500);
}
