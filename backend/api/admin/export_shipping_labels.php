<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../../config/database.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to load required files']);
    exit();
}

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

try {
    $auth = verifyAdminJWTFromCookie([]);
    if (!$auth['success']) {
        ob_end_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => $auth['message']]);
        exit();
    }

    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        ob_end_clean();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit();
    }

    requireAnyAdminPermission($pdo, $auth['user'], ['view.order']);

    // Get filter parameters
    $statusFilter = isset($_GET['status']) ? trim($_GET['status']) : 'All';
    $excludeCancelled = isset($_GET['excludeCancelled']) && $_GET['excludeCancelled'] === 'true';
    $dateRange = isset($_GET['dateRange']) ? trim($_GET['dateRange']) : 'all';

    // Build WHERE clause
    $where = ['1=1'];
    $params = [];

    // Status filter
    if ($statusFilter && $statusFilter !== 'All') {
        $where[] = 'o.status = ?';
        $params[] = $statusFilter;
    }

    // Exclude cancelled
    if ($excludeCancelled) {
        $where[] = 'o.status != ?';
        $params[] = 'Cancelled';
    }

    // Date range filter
    if ($dateRange !== 'all') {
        switch ($dateRange) {
            case 'today':
                $where[] = 'DATE(o.placed_at) = CURDATE()';
                break;
            case 'week':
                $where[] = 'o.placed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
                break;
            case 'month':
                $where[] = 'o.placed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
                break;
            case 'custom':
                $startDate = $_GET['startDate'] ?? '';
                $endDate = $_GET['endDate'] ?? '';
                if ($startDate && $endDate) {
                    $where[] = 'DATE(o.placed_at) BETWEEN ? AND ?';
                    $params[] = $startDate;
                    $params[] = $endDate;
                }
                break;
        }
    }

    $whereClause = implode(' AND ', $where);

    // Get orders for PDF
    $sql = "
        SELECT
            o.order_id,
            o.order_number,
            o.order_tracking_id,
            o.total_amount,
            o.placed_at,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            sa.address_line1,
            sa.address_line2,
            sa.city,
            sa.state,
            sa.postal_code,
            sa.country,
            COUNT(oi.order_item_id) AS item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.user_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN addresses sa ON o.shipping_address_id = sa.address_id
        WHERE $whereClause
        GROUP BY o.order_id
        ORDER BY o.placed_at DESC
        LIMIT 100
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($orders)) {
        ob_end_clean();
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No orders found for shipping labels with selected criteria']);
        exit();
    }

    // Clear output buffer before PDF generation
    ob_end_clean();

    // Generate PDF using pure PHP (no external libraries needed)
    $pdfGenerator = new ShippingLabelPDF();
    
    foreach ($orders as $order) {
        $pdfGenerator->addLabel(
            $order['order_number'],
            $order['order_tracking_id'] ?: 'TRACK' . str_pad($order['order_id'], 8, '0', STR_PAD_LEFT),
            trim(($order['first_name'] ?? '') . ' ' . ($order['last_name'] ?? '')) ?: '—',
            trim(($order['address_line1'] ?? '') . ($order['address_line2'] ? ', ' . $order['address_line2'] : '')),
            trim(($order['city'] ?? '') . ', ' . ($order['state'] ?? '') . ' ' . ($order['postal_code'] ?? '')),
            $order['country'] ?? 'India',
            $order['phone'] ?: '—',
            $order['item_count'],
            $order['total_amount'],
            $order['placed_at']
        );
    }
    
    $filename = 'shipping_labels_' . date('Y-m-d_H-i-s') . '.pdf';
    $pdfGenerator->output($filename);
    exit();

} catch (Exception $e) {
    ob_end_clean();
    error_log('Admin export shipping labels error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Internal server error']);
}

// Simple PDF Generator Class for Shipping Labels
class ShippingLabelPDF {
    private $pages = [];
    private $currentPage = 0;
    
    public function addLabel($orderNumber, $trackingId, $customerName, $address, $cityState, $country, $phone, $itemCount, $amount, $placedAt) {
        $this->pages[] = [
            'orderNumber' => $orderNumber,
            'trackingId' => $trackingId,
            'customerName' => $customerName,
            'address' => $address,
            'cityState' => $cityState,
            'country' => $country,
            'phone' => $phone,
            'itemCount' => $itemCount,
            'amount' => $amount,
            'placedAt' => $placedAt
        ];
    }
    
    public function output($filename) {
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        echo $this->generatePDF();
    }
    
    private function generatePDF() {
        $pdf = "%PDF-1.4\n";
        $pdf .= "%\xE2\xE3\xCF\xD3\n";
        
        $objects = [];
        $xref = [];
        $offset = strlen($pdf);
        
        // Object 1: Catalog
        $obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
        $objects[] = $obj1;
        $xref[] = $offset;
        $offset += strlen($obj1);
        
        // Object 2: Pages
        $kids = [];
        for ($i = 0; $i < count($this->pages); $i++) {
            $pageObjNum = 3 + ($i * 2);
            $kids[] = $pageObjNum . " 0 R";
        }
        $obj2 = "2 0 obj\n<< /Type /Pages /Kids [" . implode(' ', $kids) . "] /Count " . count($this->pages) . " >>\nendobj\n";
        $objects[] = $obj2;
        $xref[] = $offset;
        $offset += strlen($obj2);
        
        // Page and content objects
        for ($i = 0; $i < count($this->pages); $i++) {
            $page = $this->pages[$i];
            $pageObjNum = 3 + ($i * 2);
            $contentObjNum = $pageObjNum + 1;
            
            // Page object
            $pageObj = $pageObjNum . " 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents " . $contentObjNum . " 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold >> >> >> >>\nendobj\n";
            $objects[] = $pageObj;
            $xref[] = $offset;
            $offset += strlen($pageObj);
            
            // Content stream
            $content = $this->generatePageContent($page);
            $contentObj = $contentObjNum . " 0 obj\n<< /Length " . strlen($content) . " >>\nstream\n" . $content . "\nendstream\nendobj\n";
            $objects[] = $contentObj;
            $xref[] = $offset;
            $offset += strlen($contentObj);
        }
        
        // Build PDF
        foreach ($objects as $obj) {
            $pdf .= $obj;
        }
        
        // xref
        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";
        foreach ($xref as $pos) {
            $pdf .= sprintf("%010d 00000 n \n", $pos);
        }
        
        // trailer
        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\n";
        $pdf .= "startxref\n" . $xrefOffset . "\n%%EOF";
        
        return $pdf;
    }
    
    private function generatePageContent($page) {
        $content = "";
        
        // Label box coordinates (A4 centered)
        $x = 70;  // left margin
        $y = 200; // top position (from bottom)
        $w = 455; // width
        $h = 500; // height
        
        // Draw rectangle (label border)
        $content .= "0.5 0.5 0.5 RG\n"; // Gray border
        $content .= sprintf("%.2f %.2f %.2f %.2f re S\n", $x, 842 - $y - $h, $w, $h);
        
        // Header background (green)
        $headerH = 60;
        $content .= "0.298 0.686 0.314 rg\n"; // Green fill (#4CAF50)
        $content .= sprintf("%.2f %.2f %.2f %.2f re f\n", $x, 842 - $y - $headerH, $w, $headerH);
        $content .= "0 g\n"; // Reset to black
        
        // Company name
        $content .= "/F2 18 Tf\n"; // Helvetica-Bold 18
        $content .= "1 1 1 rg\n"; // White text
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $y - 40, $this->escapeString('MakeMyVeggies'));
        
        // Shipping Label text
        $content .= "/F1 10 Tf\n"; // Helvetica 10
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + $w - 120, 842 - $y - 40, $this->escapeString('SHIPPING LABEL'));
        
        $content .= "0 g\n"; // Black text
        
        // Recipient section (moved up since tracking box removed)
        $recvY = $y + 80;
        $content .= "/F1 8 Tf\n";
        $content .= "0.4 0.4 0.4 rg\n";
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $recvY, $this->escapeString('Ship To:'));
        
        // Customer name
        $content .= "/F2 16 Tf\n"; // Helvetica-Bold
        $content .= "0 g\n";
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $recvY - 25, $this->escapeString($page['customerName']));
        
        // Address
        $content .= "/F1 11 Tf\n";
        $addrY = $recvY + 50;
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $addrY, $this->escapeString($page['address']));
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $addrY - 15, $this->escapeString($page['cityState']));
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $addrY - 30, $this->escapeString($page['country']));
        
        // Phone
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $addrY - 55, $this->escapeString('Phone: ' . $page['phone']));
        
        // Order info line
        $infoY = $y + $h - 40;
        $content .= "0.7 0.7 0.7 RG\n";
        $content .= sprintf("%.2f %.2f m %.2f %.2f l S\n", $x + 15, 842 - $infoY + 10, $x + $w - 15, 842 - $infoY + 10);
        
        $content .= "/F1 9 Tf\n";
        $content .= "0.4 0.4 0.4 rg\n";
        $infoText = sprintf('Order #%s    |    %s items    |    %s    |    Amount: Rs.%s',
            $page['orderNumber'],
            $page['itemCount'],
            date('M d, Y', strtotime($page['placedAt'])),
            number_format($page['amount'], 2)
        );
        $content .= sprintf("BT\n%.2f %.2f Td\n(%s) Tj\nET\n", $x + 15, 842 - $infoY - 5, $this->escapeString($infoText));
        
        return $content;
    }
    
    private function escapeString($s) {
        return str_replace(['\\', '(', ')', '\n', '\r', '\t'], ['\\\\', '\\(', '\\)', '\\n', '\\r', '\\t'], $s);
    }
}
