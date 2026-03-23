<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/jwt_auth.php';
require_once __DIR__ . '/../utils/email_production.php';

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

    $istNow = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        sendResponse(false, 'Invalid JSON input', null, 400);
    }

    $paymentMethod = $input['paymentMethod'] ?? 'COD';
    $notes = $input['notes'] ?? null;
    $billingMode = $input['billingMode'] ?? 'new'; // 'saved' or 'new'
    $selectedAddressId = $input['address_id'] ?? null;
    $billing = $input['billing'] ?? [];

    if (strtoupper((string)$paymentMethod) !== 'COD') {
        sendResponse(false, 'Online payment must be initiated via Razorpay. Please try again.', null, 400);
    }

    $pdo->beginTransaction();

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
        $pdo->rollBack();
        sendResponse(false, 'Cart is empty', null, 400);
    }

    $totalAmount = 0;
    $orderItemsSummary = [];
    foreach ($cartItems as $item) {
        $basePrice  = isset($item['base_price']) ? (float)$item['base_price'] : 0.0;
        $disPercent = isset($item['dis_percent']) ? (float)$item['dis_percent'] : 0.0;
        $disAmount  = isset($item['dis_amount']) ? (float)$item['dis_amount'] : 0.0;

        $hasDiscount = $disPercent > 0 && $disAmount > 0;
        $unitPrice   = $hasDiscount ? $disAmount : $basePrice;

        $qty = (int)$item['quantity'];
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
    $orderYearIst = (new DateTime('now', new DateTimeZone('Asia/Kolkata')))->format('Y');
    $orderNumber = 'MMV' . $orderYearIst . strtoupper(bin2hex(random_bytes(4)));

    $orderSql = 'INSERT INTO orders (user_id, order_number, shipping_address_id, total_amount, status, payment_status, placed_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    $status = 'pending';
    $paymentStatus = 'pending';
    $stmtOrder = $pdo->prepare($orderSql);
    $stmtOrder->execute([$userId, $orderNumber, $shippingAddressId, $totalAmount, $status, $paymentStatus, $istNow, $istNow]);
    $orderId = (int)$pdo->lastInsertId();

    $itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
    $stmtItem = $pdo->prepare($itemSql);
    $stockUpdateSql = 'UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?';
    $stmtStock = $pdo->prepare($stockUpdateSql);
    foreach ($cartItems as $item) {
        $basePrice  = isset($item['base_price']) ? (float)$item['base_price'] : 0.0;
        $disPercent = isset($item['dis_percent']) ? (float)$item['dis_percent'] : 0.0;
        $disAmount  = isset($item['dis_amount']) ? (float)$item['dis_amount'] : 0.0;

        $hasDiscount = $disPercent > 0 && $disAmount > 0;
        $unit        = $hasDiscount ? $disAmount : $basePrice;

        $qty   = (int)$item['quantity'];
        $currentStock = isset($item['product_stock']) ? (int)$item['product_stock'] : 0;
        if ($currentStock < $qty) {
            $pdo->rollBack();
            sendResponse(false, 'Insufficient stock for product: ' . $item['title'], null, 400);
        }

        $total = $unit * $qty;

        $stmtItem->execute([$orderId, $item['product_id'], $qty, $unit, $total, $istNow, $istNow]);

        $stmtStock->execute([$qty, $item['product_id'], $qty]);
        if ($stmtStock->rowCount() === 0) {
            $pdo->rollBack();
            sendResponse(false, 'Unable to update stock for product: ' . $item['title'], null, 400);
        }
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

    // Update order with billing_id
    $pdo->prepare('UPDATE orders SET billing_id = ? WHERE order_id = ?')->execute([$billingId, $orderId]);

    // Insert payment row (COD confirmed as pending to be collected on delivery, online as dummy)
    // New payments table schema:
    // payment_id, order_id, payment_gateway, gateway_order_id, payment_method,
    // payment_status, transaction_id, amount, created_at, gateway_signature
    $paySql = 'INSERT INTO payments (order_id, payment_gateway, gateway_order_id, payment_method, payment_status, transaction_id, amount, created_at, gateway_signature)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    $paymentGateway   = 'COD';
    $gatewayOrderId   = $orderNumber; // use our order number as the gateway order id for now
    $transactionId    = null;         // for COD or before online capture
    $gatewaySignature = '';           // no signature at order creation
    $payStatus        = 'Pending';

    $stmtPay = $pdo->prepare($paySql);
    $stmtPay->execute([
        $orderId,
        $paymentGateway,
        $gatewayOrderId,
        $paymentMethod,
        $payStatus,
        $transactionId,
        $totalAmount,
        $istNow,
        $gatewaySignature,
    ]);

    // Clear cart
    $clearStmt = $pdo->prepare('DELETE FROM cart WHERE user_id = ?');
    $clearStmt->execute([$userId]);

    $pdo->commit();

    // Always send order confirmation email to account (login) email
    $accountEmail = $user['email'] ?? null;
    $accountName  = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));

    // Also send to billing email if present
    $billingEmail = $billingInsert['email'] ?? null;
    $billingName  = trim(($billingInsert['first_name'] ?? '') . ' ' . ($billingInsert['last_name'] ?? ''));

    try {
        $emailService = new ProductionEmailService(false);

        if ($accountEmail) {
            $emailService->sendOrderConfirmation($accountEmail, $accountName, $orderNumber, $orderItemsSummary, $totalAmount, $paymentMethod);
        }

        if ($billingEmail && $billingEmail !== $accountEmail) {
            $emailService->sendOrderConfirmation($billingEmail, $billingName ?: $accountName, $orderNumber, $orderItemsSummary, $totalAmount, $paymentMethod);
        }
    } catch (Exception $e) {
        error_log('Order confirmation email failed: ' . $e->getMessage());
    }

    // WhatsApp notification: send to both account phone and billing phone (no duplicates)
    $accountPhone = $user['phone'] ?? null;
    $billingPhone = $billingInsert['phone'] ?? null;

    $phonesToNotify = [];
    if ($accountPhone) {
        $phonesToNotify[$accountPhone] = $accountName;
    }
    if ($billingPhone) {
        // If same number as account phone, this will just overwrite the name but avoid duplicate send
        $phonesToNotify[$billingPhone] = $billingName ?: $accountName;
    }

    if (!empty($phonesToNotify)) {
        $fast2smsAuthKey   = $_ENV['FAST2SMS_AUTH_KEY'];
        $fast2smsBaseUrl   = $_ENV['FAST2SMS_BASE_URL'];
        $fast2smsMessageId = $_ENV['FAST2SMS_MESSAGE_ID_2'];
        $fast2smsPhoneId   = $_ENV['FAST2SMS_PHONE_NUMBER_ID'];
        $fast2smsImageUrl  = $_ENV['FAST2SMS_IMAGE_URL_ORDER_PLACED'];

        if ($fast2smsAuthKey !== '') {
            foreach ($phonesToNotify as $phoneNumber => $name) {
                // Normalize phone number to digits only, as Fast2SMS expects
                $numbers = preg_replace('/\D/', '', $phoneNumber);

                $queryParams = [
                    'authorization'    => $fast2smsAuthKey,
                    'message_id'       => $fast2smsMessageId,
                    'phone_number_id'  => $fast2smsPhoneId,
                    'numbers'          => $numbers,
                    'image_url'        => $fast2smsImageUrl,
                    'variables_values' => $name . '|' . $orderNumber,
                ];

                $url = $fast2smsBaseUrl . '?' . http_build_query($queryParams);

                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $response = curl_exec($ch);
                if ($response === false) {
                    error_log('Fast2SMS WhatsApp error: ' . curl_error($ch));
                } else {
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    error_log('Fast2SMS WhatsApp response for order ' . $orderNumber . ' to ' . $numbers . ': HTTP ' . $httpCode . ' body: ' . $response);
                }
                curl_close($ch);
            }
        } else {
            error_log('Fast2SMS WhatsApp skipped: FAST2SMS_AUTH_KEY is empty');
        }
    }

    sendResponse(true, 'Order placed successfully', [
        'order_id' => $orderId,
        'order_number' => $orderNumber,
        'payment_method' => $paymentMethod,
        'total_amount' => $totalAmount,
        'items' => $orderItemsSummary,
        'billing' => [
            'first_name' => $billingInsert['first_name'],
            'last_name' => $billingInsert['last_name'],
            'email' => $billingInsert['email'] ?? $user['email'] ?? null,
            'phone' => $billingInsert['phone'] ?? null,
            'address_line1' => $billingInsert['address_line1'],
            'address_line2' => $billingInsert['address_line2'],
            'city' => $billingInsert['city'],
            'state' => $billingInsert['state'],
            'country' => $billingInsert['country'],
            'postal_code' => $billingInsert['postal_code'],
        ],
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('place_order error: ' . $e->getMessage());
    // TEMP: expose detailed error message for debugging
    sendResponse(false, 'place_order error: ' . $e->getMessage(), null, 500);
}
