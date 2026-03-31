<?php
//error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method not allowed', null, 405);
}

try {
    $auth = verifyJWTFromCookie();
    if (!$auth['success']) {
        sendResponse(false, $auth['message'], null, 401);
    }
    $user   = $auth['user'];
    $userId = $user['user_id'];

    $db  = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        sendResponse(false, 'Invalid JSON input', null, 400);
    }

    $paymentMethod = strtoupper((string)($input['paymentMethod'] ?? 'ONLINE'));
    if ($paymentMethod !== 'ONLINE') {
        sendResponse(false, 'Invalid payment method for Razorpay', null, 400);
    }

    $notes = $input['notes'] ?? null;
    $billingMode = $input['billingMode'] ?? 'new'; // 'saved' or 'new'
    $selectedAddressId = $input['address_id'] ?? null;
    $billing = $input['billing'] ?? [];

    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');

    // Load cart for this user, including discount info (if any)
    $cartSql = "
        SELECT 
            c.cart_id,
            c.product_id,
            c.quantity,
            p.title,
            p.price AS base_price,
            p.stock AS product_stock,
            (
                SELECT d.dis_percent
                FROM discounts d
                WHERE d.product_id = p.product_id
                  AND CURDATE() BETWEEN d.from_date AND d.to_date
                ORDER BY d.from_date DESC
                LIMIT 1
            ) AS dis_percent,
            (
                SELECT d.dis_amount
                FROM discounts d
                WHERE d.product_id = p.product_id
                  AND CURDATE() BETWEEN d.from_date AND d.to_date
                ORDER BY d.from_date DESC
                LIMIT 1
            ) AS dis_amount
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ? AND p.status = 1
    ";
    $stmtCart = $pdo->prepare($cartSql);
    $stmtCart->execute([$userId]);
    $cartItems = $stmtCart->fetchAll(PDO::FETCH_ASSOC);

    if (empty($cartItems)) {
        sendResponse(false, 'Cart is empty', null, 400);
    }

    $totalAmount = 0;
    $orderItemsSummary = [];
    foreach ($cartItems as $item) {
        $basePrice  = isset($item['base_price']) ? (float)$item['base_price'] : 0.0;
        $disPercent = isset($item['dis_percent']) ? (float)$item['dis_percent'] : 0.0;
        $disAmount  = isset($item['dis_amount']) ? (float)$item['dis_amount'] : 0.0;

        $hasDiscount = $disPercent > 0 || $disAmount > 0;

        // Calculate final price: base - discount
        // Formula: final = base - (base * percent / 100)
        // If percent is 0 but disAmount exists: final = base - disAmount
        if ($hasDiscount) {
            if ($disPercent > 0) {
                $unitPrice = $basePrice - ($basePrice * $disPercent / 100);
            } else {
                // Only disAmount exists - subtract it from base price
                $unitPrice = $basePrice - $disAmount;
            }
        } else {
            $unitPrice = $basePrice;
        }

        $qty = (int)$item['quantity'];
        $currentStock = isset($item['product_stock']) ? (int)$item['product_stock'] : 0;
        if ($currentStock < $qty) {
            sendResponse(false, 'Insufficient stock for product: ' . $item['title'], null, 400);
        }

        $lineTotal = $unitPrice * $qty;
        $totalAmount += $lineTotal;

        $orderItemsSummary[] = [
            'product_id' => (int)$item['product_id'],
            'name' => $item['title'],
            'quantity' => $qty,
            'unit_price' => $unitPrice,
            'total_price' => $lineTotal,
        ];
    }

    $amount = (float)$totalAmount;
    if ($amount <= 0) {
        sendResponse(false, 'Invalid order amount', null, 400);
    }

    // Build billing details first, we will also reuse them as shipping if needed
    if ($billingMode === 'saved') {
        if (!$selectedAddressId) {
            sendResponse(false, 'Address ID is required when using saved address', null, 400);
        }

        $addrStmt = $pdo->prepare('SELECT address_line1, address_line2, city, state, country, postal_code FROM addresses WHERE address_id = ? AND user_id = ?');
        $addrStmt->execute([$selectedAddressId, $userId]);
        $addr = $addrStmt->fetch(PDO::FETCH_ASSOC);
        if (!$addr) {
            sendResponse(false, 'Selected address not found', null, 400);
        }

        $billingInsert = [
            'first_name'   => $billing['first_name'] ?? $user['first_name'],
            'last_name'    => $billing['last_name'] ?? $user['last_name'],
            'email'        => $billing['email'] ?? $user['email'],
            'phone'        => $billing['phone'] ?? null,
            'address_line1'=> $addr['address_line1'],
            'address_line2'=> $addr['address_line2'],
            'city'         => $addr['city'],
            'state'        => $addr['state'],
            'country'      => $addr['country'],
            'postal_code'  => $addr['postal_code'],
        ];
    } else {
        $billingInsert = [
            'first_name'   => $billing['first_name'] ?? null,
            'last_name'    => $billing['last_name'] ?? null,
            'email'        => $billing['email'] ?? null,
            'phone'        => $billing['phone'] ?? null,
            'address_line1'=> $billing['address_line1'] ?? null,
            'address_line2'=> $billing['address_line2'] ?? null,
            'city'         => $billing['city'] ?? null,
            'state'        => $billing['state'] ?? null,
            'country'      => $billing['country'] ?? null,
            'postal_code'  => $billing['postal_code'] ?? null,
        ];
    }

    if (empty($billingInsert['first_name']) || empty($billingInsert['last_name']) || empty($billingInsert['address_line1']) || empty($billingInsert['city']) || empty($billingInsert['state']) || empty($billingInsert['postal_code']) || empty($billingInsert['country'])) {
        sendResponse(false, 'Incomplete billing details', null, 400);
    }

    // Determine / create shipping address id
    $shippingAddressId = null;
    if ($billingMode === 'saved') {
        $shippingAddressId = (int)$selectedAddressId;
    } else {
        // Use the entered billing address as shipping address as well
        $shipSql = 'INSERT INTO addresses (user_id, address_line1, address_line2, city, state, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)';
        $stmtShip = $pdo->prepare($shipSql);
        $stmtShip->execute([
            $userId,
            $billingInsert['address_line1'],
            $billingInsert['address_line2'],
            $billingInsert['city'],
            $billingInsert['state'],
            $billingInsert['country'],
            $billingInsert['postal_code'],
        ]);
        $shippingAddressId = (int)$pdo->lastInsertId();
    }

    $razorpayKeyId     = $_ENV['RAZORPAY_KEY_ID'] ?? '';
    $razorpayKeySecret = $_ENV['RAZORPAY_KEY_SECRET'] ?? '';

    if ($razorpayKeyId === '' || $razorpayKeySecret === '') {
        sendResponse(false, 'Razorpay keys not configured', null, 500);
    }

    $amountInPaise = (int)round($amount * 100);

    $orderYearIst = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y');
    $orderNumber = 'MMV' . $orderYearIst . strtoupper(bin2hex(random_bytes(4)));

    $payload = [
        'amount'   => $amountInPaise,
        'currency' => 'INR',
        'receipt'  => $orderNumber,
        'notes'    => [
            'internal_order_id' => 'pending',
            'user_id'           => $userId,
            'notes'             => $notes,
        ],
    ];

    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPAUTH       => CURLAUTH_BASIC,
        CURLOPT_USERPWD        => $razorpayKeyId . ':' . $razorpayKeySecret,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode($payload),
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        error_log('Razorpay create_order error: HTTP ' . $httpCode . ' err=' . $error . ' body=' . $response);
        sendResponse(false, 'Failed to create Razorpay order', null, 500);
    }

    $data = json_decode($response, true);
    if (!$data || empty($data['id'])) {
        error_log('Razorpay create_order invalid response: ' . $response);
        sendResponse(false, 'Invalid Razorpay response', null, 500);
    }

    $razorpayOrderId = $data['id'];

    // Create internal order and payment row (INITIATED-like: pending/pending)
    $pdo->beginTransaction();

    $orderSql = 'INSERT INTO orders (user_id, order_number, shipping_address_id, total_amount, status, payment_status, placed_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    $stmtOrder = $pdo->prepare($orderSql);
    $stmtOrder->execute([$userId, $orderNumber, $shippingAddressId, $totalAmount, 'pending', 'pending', $istNow, $istNow]);
    $orderId = (int)$pdo->lastInsertId();

    $itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    $stmtItem = $pdo->prepare($itemSql);
    foreach ($orderItemsSummary as $it) {
        $stmtItem->execute([$orderId, $it['product_id'], $it['quantity'], $it['unit_price'], $it['total_price'], $istNow, $istNow]);
    }

    $billSql = 'INSERT INTO billing_details (order_id, first_name, last_name, email, phone, address_line1, address_line2, city, state, country, postal_code, created_at, updated_at) VALUES (:order_id, :first_name, :last_name, :email, :phone, :address_line1, :address_line2, :city, :state, :country, :postal_code, :created_at, :updated_at)';
    $stmtBill = $pdo->prepare($billSql);
    $stmtBill->execute(array_merge(
        [
            'order_id'   => $orderId,
            'created_at' => $istNow,
            'updated_at' => $istNow,
        ],
        $billingInsert
    ));
    $billingId = (int)$pdo->lastInsertId();
    $pdo->prepare('UPDATE orders SET billing_id = ? WHERE order_id = ?')->execute([$billingId, $orderId]);

    $paySql = 'INSERT INTO payments (order_id, payment_gateway, gateway_order_id, payment_method, payment_status, transaction_id, amount, created_at, gateway_signature)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $stmtPay = $pdo->prepare($paySql);
    $stmtPay->execute([
        $orderId,
        'RAZORPAY',
        $razorpayOrderId,
        'ONLINE',
        'Initiated',
        null,
        $totalAmount,
        $istNow,
        ''
    ]);

    $pdo->commit();

    $customerName  = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
    $customerEmail = $user['email'] ?? null;
    $customerPhone = $user['phone'] ?? null;

    sendResponse(true, 'Razorpay order created', [
        'razorpay_key_id'   => $razorpayKeyId,
        'razorpay_order_id' => $razorpayOrderId,
        'amount'            => $amountInPaise,
        'currency'          => 'INR',
        'name'              => $customerName,
        'email'             => $customerEmail,
        'contact'           => $customerPhone,
        'order_id'          => $orderId,
        'order_number'      => $orderNumber,
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('razorpay_create_order error: ' . $e->getMessage());
    sendResponse(false, 'razorpay_create_order error: ' . $e->getMessage(), null, 500);
}
