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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie([]);
    if (!$auth['success']) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $productId = isset($input['id']) ? (int)$input['id'] : 0;

    if ($productId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Product ID is required']);
        exit();
    }

    $db = new Database();
    $pdo = $db->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    requireAdminPermission($pdo, $auth['user'], 'delete.product');

    $pdo->beginTransaction();

    // Delete related rows explicitly to avoid FK errors on tables without ON DELETE CASCADE
    $delOrderItems = $pdo->prepare('DELETE FROM order_items WHERE product_id = ?');
    $delOrderItems->execute([$productId]);

    $delCart = $pdo->prepare('DELETE FROM cart WHERE product_id = ?');
    $delCart->execute([$productId]);

    $delWishlist = $pdo->prepare('DELETE FROM wishlist WHERE product_id = ?');
    $delWishlist->execute([$productId]);

    $delReviews = $pdo->prepare('DELETE FROM reviews WHERE product_id = ?');
    $delReviews->execute([$productId]);

    $delIncludes = $pdo->prepare('DELETE FROM product_includes WHERE product_id = ?');
    $delIncludes->execute([$productId]);

    $delImages = $pdo->prepare('DELETE FROM product_images WHERE product_id = ?');
    $delImages->execute([$productId]);

    // In case discounts table exists and doesn't have FK cascade
    try {
        $delDiscounts = $pdo->prepare('DELETE FROM discounts WHERE product_id = ?');
        $delDiscounts->execute([$productId]);
    } catch (Exception $e) {
        // ignore if discounts table does not exist
    }

    $delProduct = $pdo->prepare('DELETE FROM products WHERE product_id = ?');
    $delProduct->execute([$productId]);

    if ($delProduct->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Product not found']);
        exit();
    }

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Product deleted']);

} catch (Exception $e) {
    if (isset($pdo) && $pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log('Admin delete product error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
