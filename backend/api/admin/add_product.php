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
    $input = json_decode(file_get_contents('php://input'), true);

    $title = isset($input['title']) ? trim($input['title']) : '';
    $description = isset($input['description']) ? trim($input['description']) : '';
    $price = isset($input['price']) ? (float)$input['price'] : null;
    $keyFeatures = array_key_exists('keyFeatures', $input) ? trim((string)$input['keyFeatures']) : null;
    $stock = isset($input['stock']) ? (int)$input['stock'] : 0;
    $sku = isset($input['sku']) ? trim($input['sku']) : '';
    $status = isset($input['status']) ? (int)$input['status'] : 1;
    $categoryId = isset($input['categoryId']) ? (int)$input['categoryId'] : 0;
    $primaryImageUrl = isset($input['primaryImageUrl']) ? trim($input['primaryImageUrl']) : '';

    $secondaryImageUrls = [];
    if (isset($input['secondaryImageUrls']) && is_array($input['secondaryImageUrls'])) {
        foreach ($input['secondaryImageUrls'] as $url) {
            $val = trim((string)$url);
            if ($val !== '') $secondaryImageUrls[] = $val;
        }
    }

    $productIncludes = [];
    if (isset($input['productIncludes']) && is_array($input['productIncludes'])) {
        foreach ($input['productIncludes'] as $inc) {
            $val = trim((string)$inc);
            if ($val !== '') $productIncludes[] = $val;
        }
    }

    $discountEnabled = false;
    $discountPercent = null;
    $discountFromDate = null;
    $discountToDate = null;
    if (isset($input['discount']) && is_array($input['discount'])) {
        $discountEnabled = !empty($input['discount']['enabled']);
        if (array_key_exists('percent', $input['discount']) && $input['discount']['percent'] !== null && $input['discount']['percent'] !== '') {
            $discountPercent = (float)$input['discount']['percent'];
        }
        if (array_key_exists('fromDate', $input['discount'])) {
            $discountFromDate = $input['discount']['fromDate'] ? (string)$input['discount']['fromDate'] : null;
        }
        if (array_key_exists('toDate', $input['discount'])) {
            $discountToDate = $input['discount']['toDate'] ? (string)$input['discount']['toDate'] : null;
        }
    }

    if ($title === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Title is required']);
        exit();
    }

    if ($price === null || !is_numeric($price)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Price is required']);
        exit();
    }

    if ($categoryId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'categoryId is required']);
        exit();
    }

    if ($primaryImageUrl === '') {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'primaryImageUrl is required']);
        exit();
    }

    if ($discountEnabled) {
        if ($discountPercent === null || $discountPercent <= 0) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'discount percent is required when discount is enabled']);
            exit();
        }

        if ($discountFromDate === null || $discountToDate === null) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'discount fromDate/toDate is required when discount is enabled']);
            exit();
        }
    }

    $db = new Database();
    $pdo = $db->getConnection();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    $pdo->beginTransaction();

    $sql = "
        INSERT INTO products (title, description, price, key_features, stock, sku, status, category_id)
        VALUES (:title, :description, :price, :key_features, :stock, :sku, :status, :category_id)
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':title', $title);
    $stmt->bindValue(':description', $description);
    $stmt->bindValue(':price', $price);

    if ($keyFeatures === null || $keyFeatures === '') {
        $stmt->bindValue(':key_features', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindValue(':key_features', $keyFeatures);
    }

    $stmt->bindValue(':stock', $stock, PDO::PARAM_INT);
    $stmt->bindValue(':sku', $sku);
    $stmt->bindValue(':status', $status, PDO::PARAM_INT);
    $stmt->bindValue(':category_id', $categoryId, PDO::PARAM_INT);
    $stmt->execute();

    $productId = (int)$pdo->lastInsertId();

    $imgSql = "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (:product_id, :image_url, 1)";
    $imgStmt = $pdo->prepare($imgSql);
    $imgStmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
    $imgStmt->bindValue(':image_url', $primaryImageUrl);
    $imgStmt->execute();

    if (!empty($secondaryImageUrls)) {
        $secSql = "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (:product_id, :image_url, 0)";
        $secStmt = $pdo->prepare($secSql);
        foreach ($secondaryImageUrls as $url) {
            $secStmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
            $secStmt->bindValue(':image_url', $url);
            $secStmt->execute();
        }
    }

    if (!empty($productIncludes)) {
        $incSql = "INSERT INTO product_includes (product_id, includes) VALUES (:product_id, :includes)";
        $incStmt = $pdo->prepare($incSql);
        foreach ($productIncludes as $inc) {
            $incStmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
            $incStmt->bindValue(':includes', $inc);
            $incStmt->execute();
        }
    }

    if ($discountEnabled) {
        // Calculate final price after deducting discount percent from original price
        // Example: price=100, discount=10% -> dis_amount = 100 - (100*10/100) = 90
        $disAmount = round($price - (($price * $discountPercent) / 100), 2);
        $disSql = "
            INSERT INTO discounts (product_id, dis_percent, dis_amount, from_date, to_date)
            VALUES (:product_id, :dis_percent, :dis_amount, :from_date, :to_date)
        ";
        $disStmt = $pdo->prepare($disSql);
        $disStmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        $disStmt->bindValue(':dis_percent', $discountPercent);
        $disStmt->bindValue(':dis_amount', $disAmount);
        $disStmt->bindValue(':from_date', $discountFromDate);
        $disStmt->bindValue(':to_date', $discountToDate);
        $disStmt->execute();
    }

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Product added',
        'productId' => $productId
    ]);

} catch (Exception $e) {
    if (isset($pdo) && $pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log('Admin add product error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}
