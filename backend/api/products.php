<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database connection failed. Check DB credentials.']);

  exit();
}

$categoryId = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
$limit = isset($_GET['limit']) ? max(1, intval($_GET['limit'])) : 100;
$offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;

$where = [];
$params = [];
if (!is_null($categoryId)) {
  $where[] = 'p.category_id = :category_id';
  $params[':category_id'] = $categoryId;
}
$whereSql = count($where) ? ('WHERE ' . implode(' AND ', $where)) : '';

$sql = "
  SELECT 
    p.product_id AS id,
    p.title,
    p.description,
    p.price,
    p.stock,
    p.sku,
    p.status,
    c.name AS category,
    COALESCE(
      (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.product_id AND pi.is_primary = 1 ORDER BY pi.image_id DESC LIMIT 1),
      (SELECT pi2.image_url FROM product_images pi2 WHERE pi2.product_id = p.product_id ORDER BY pi2.image_id ASC LIMIT 1)
    ) AS image_url,
    COALESCE(
      (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.product_id),
      0
    ) AS avg_rating
  FROM products p
  LEFT JOIN categories c ON c.category_id = p.category_id
  $whereSql
  ORDER BY p.created_at DESC
  LIMIT :limit OFFSET :offset
";

try {
  $stmt = $conn->prepare($sql);
  foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v, PDO::PARAM_INT);
  }
  $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
  $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
  $stmt->execute();
  $rows = $stmt->fetchAll();

  $products = array_map(function ($row) {
    $price = (float)$row['price'];
    $originalPrice = round($price * 1.2, 2);
    $image = $row['image_url'] ?: '';
    return [
      'id' => (int)$row['id'],
      'name' => $row['title'],
      'description' => $row['description'],
      'price' => $price,
      'originalPrice' => $originalPrice,
      'image' => $image,
      'category' => $row['category'] ?: 'others',
      'inStock' => ((int)$row['stock']) > 0,
      'stock' => (int)$row['stock'],
      'sku' => $row['sku'],
      'status' => (int)$row['status'],
      'rating' => (float)$row['avg_rating'],
      'discount' => max(0, (int)round(($originalPrice - $price) / ($originalPrice ?: 1) * 100))
    ];
  }, $rows);

  echo json_encode(['success' => true, 'data' => $products]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Query failed: ' . $e->getMessage()]);
}
