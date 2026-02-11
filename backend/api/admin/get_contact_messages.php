<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie(['admin', 'super_admin']);
    if (!$auth['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
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

    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $statusParam = isset($_GET['status']) ? trim((string)$_GET['status']) : '';
    $search = isset($_GET['search']) ? trim((string)$_GET['search']) : '';

    if ($limit < 1) $limit = 50;
    if ($limit > 200) $limit = 200;
    if ($offset < 0) $offset = 0;

    $where = ['1=1'];
    $params = [];

    if ($statusParam !== '') {
        $where[] = 'status = ?';
        $params[] = $statusParam;
    }

    if ($search !== '') {
        $where[] = '(email LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR subject LIKE ? OR message LIKE ?)';
        $term = '%' . $search . '%';
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $whereClause = implode(' AND ', $where);

    $sql = "SELECT id, first_name, last_name, phone, email, subject, message, status, created_at FROM contact_messages WHERE $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countSql = "SELECT COUNT(*) AS total FROM contact_messages WHERE $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    echo json_encode([
        'status' => 'success',
        'messages' => $rows,
        'pagination' => [
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
            'hasMore' => ($offset + $limit) < $total
        ]
    ]);

} catch (Exception $e) {
    error_log('Admin get contact messages error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
