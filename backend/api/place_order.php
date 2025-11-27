<?php
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
    $user = $auth['user'];
    $userId = $user['user_id'];

    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) {
        sendResponse(false, 'Database connection failed', null, 500);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        sendResponse(false, 'Invalid JSON input', null, 400);
    }

    $paymentMethod = $input['paymentMethod'] ?? 'COD';
    $notes = $input['notes'] ?? null;
    $billingMode = $input['billingMode'] ?? 'new'; // 'saved' or 'new'
    $selectedAddressId = $input['address_id'] ?? null;
    $billing = $input['billing'] ?? [];

    $pdo->beginTransaction();

    // Load cart for this user, including discount info (if any)
    $cartSql = "
        SELECT 
            c.cart_id,
            c.product_id,
            c.quantity,
            p.title,
            p.price AS base_price,
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
        $pdo->rollBack();
        sendResponse(false, 'Cart is empty', null, 400);
    }

    // Calculate order total using discounted prices when applicable
    $totalAmount = 0;
    foreach ($cartItems as $item) {
        $basePrice  = isset($item['base_price']) ? (float)$item['base_price'] : 0.0;
        $disPercent = isset($item['dis_percent']) ? (float)$item['dis_percent'] : 0.0;
        $disAmount  = isset($item['dis_amount']) ? (float)$item['dis_amount'] : 0.0;

        $hasDiscount = $disPercent > 0 && $disAmount > 0;
        $unitPrice   = $hasDiscount ? $disAmount : $basePrice;

        $totalAmount += $unitPrice * (int)$item['quantity'];
    }

    // Build billing details first, we will also reuse them as shipping if needed
    if ($billingMode === 'saved') {
        if (!$selectedAddressId) {
            $pdo->rollBack();
            sendResponse(false, 'Address ID is required when using saved address', null, 400);
        }

        $addrStmt = $pdo->prepare('SELECT address_line1, address_line2, city, state, country, postal_code FROM addresses WHERE address_id = ? AND user_id = ?');
        $addrStmt->execute([$selectedAddressId, $userId]);
        $addr = $addrStmt->fetch(PDO::FETCH_ASSOC);
        if (!$addr) {
            $pdo->rollBack();
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
        $pdo->rollBack();
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

    // Create order
    $orderNumber = 'MMV-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));

    $orderSql = 'INSERT INTO orders (user_id, order_number, shipping_address_id, total_amount, status, payment_status) VALUES (?, ?, ?, ?, ?, ?)';
    $status = 'Pending';
    $paymentStatus = $paymentMethod === 'COD' ? 'Pending' : 'Pending';
    $stmtOrder = $pdo->prepare($orderSql);
    $stmtOrder->execute([$userId, $orderNumber, $shippingAddressId, $totalAmount, $status, $paymentStatus]);
    $orderId = (int)$pdo->lastInsertId();

    // Insert order items, using discounted unit price when applicable
    $itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)';
    $stmtItem = $pdo->prepare($itemSql);
    foreach ($cartItems as $item) {
        $basePrice  = isset($item['base_price']) ? (float)$item['base_price'] : 0.0;
        $disPercent = isset($item['dis_percent']) ? (float)$item['dis_percent'] : 0.0;
        $disAmount  = isset($item['dis_amount']) ? (float)$item['dis_amount'] : 0.0;

        $hasDiscount = $disPercent > 0 && $disAmount > 0;
        $unit        = $hasDiscount ? $disAmount : $basePrice;

        $qty   = (int)$item['quantity'];
        $total = $unit * $qty;

        $stmtItem->execute([$orderId, $item['product_id'], $qty, $unit, $total]);
    }

    $billSql = 'INSERT INTO billing_details (order_id, first_name, last_name, email, phone, address_line1, address_line2, city, state, country, postal_code) VALUES (:order_id, :first_name, :last_name, :email, :phone, :address_line1, :address_line2, :city, :state, :country, :postal_code)';
    $stmtBill = $pdo->prepare($billSql);
    $stmtBill->execute(array_merge(['order_id' => $orderId], $billingInsert));
    $billingId = (int)$pdo->lastInsertId();

    // Update order with billing_id
    $pdo->prepare('UPDATE orders SET billing_id = ? WHERE order_id = ?')->execute([$billingId, $orderId]);

    // Insert payment row (COD confirmed as pending to be collected on delivery, online as dummy)
    $paySql = 'INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, amount) VALUES (?, ?, ?, ?, ?)';
    $transactionId = null;
    $payStatus = $paymentMethod === 'COD' ? 'Pending' : 'Pending';
    $stmtPay = $pdo->prepare($paySql);
    $stmtPay->execute([$orderId, $paymentMethod, $payStatus, $transactionId, $totalAmount]);

    // Clear cart
    $clearStmt = $pdo->prepare('DELETE FROM cart WHERE user_id = ?');
    $clearStmt->execute([$userId]);

    $pdo->commit();

    sendResponse(true, 'Order placed successfully', [
        'order_id' => $orderId,
        'order_number' => $orderNumber,
        'payment_method' => $paymentMethod,
        'total_amount' => $totalAmount
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('place_order error: ' . $e->getMessage());
    // TEMP: expose detailed error message for debugging
    sendResponse(false, 'place_order error: ' . $e->getMessage(), null, 500);
}
