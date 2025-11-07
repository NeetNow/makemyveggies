<?php
header('Content-Type: application/json');
// In production, change this to your actual frontend domain
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
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
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
        exit;
    }

    // Validate required fields
    $product_id = isset($input['product_id']) ? (int)$input['product_id'] : null;
    $rating = isset($input['rating']) ? (int)$input['rating'] : null;
    $comment = isset($input['comment']) ? trim($input['comment']) : '';

    if (!$product_id || !$rating) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID and rating are required']);
        exit;
    }

    // Validate rating range (1-5)
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Rating must be between 1 and 5']);
        exit;
    }

    // Initialize database connection
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    // Check if product exists
    $productCheckSql = "SELECT product_id FROM products WHERE product_id = ?";
    $productStmt = $pdo->prepare($productCheckSql);
    $productStmt->execute([$product_id]);
    $product = $productStmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit;
    }

    // Check if user has already reviewed this product
    $reviewCheckSql = "SELECT review_id FROM reviews WHERE user_id = ? AND product_id = ?";
    $reviewCheckStmt = $pdo->prepare($reviewCheckSql);
    $reviewCheckStmt->execute([$userId, $product_id]);
    $existingReview = $reviewCheckStmt->fetch(PDO::FETCH_ASSOC);

    if ($existingReview) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'You have already reviewed this product']);
        exit;
    }

    // Insert review
    $insertSql = "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)";
    $insertStmt = $pdo->prepare($insertSql);
    $insertStmt->execute([$userId, $product_id, $rating, $comment]);

    $review_id = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Review submitted successfully',
        'review_id' => $review_id
    ]);

} catch (PDOException $e) {
    // Catch database-specific errors
    error_log("Database error in submit_review.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'A database error occurred.']);
} catch (Exception $e) {
    // Catch all other errors
    error_log("General error in submit_review.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error.']);
}
?>
