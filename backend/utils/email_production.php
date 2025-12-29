<?php
// Production Email Service with fallback support
require_once __DIR__ . '/email_fallback.php';

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Check if PHPMailer is available
$phpmailer_path = __DIR__ . '/../vendor/phpmailer/phpmailer/src/';
$phpmailer_available = file_exists($phpmailer_path . 'PHPMailer.php') && 
                       file_exists($phpmailer_path . 'SMTP.php') && 
                       file_exists($phpmailer_path . 'Exception.php');

if ($phpmailer_available) {
    require_once $phpmailer_path . 'Exception.php';
    require_once $phpmailer_path . 'PHPMailer.php';
    require_once $phpmailer_path . 'SMTP.php';
}

class ProductionEmailService {
    private $smtp_host;
    private $smtp_port;
    private $smtp_username;
    private $smtp_password;
    private $from_email;
    private $from_name;
    private $debug_mode = false;
    private $use_phpmailer = false;

    public function __construct($debug = false) {
        global $phpmailer_available;
        
        // Load from environment variables
        $this->smtp_host = $_ENV['EMAIL_HOST'] ?? "smtp.hostinger.com";
        $this->smtp_port = $_ENV['EMAIL_PORT'] ?? 587;
        $this->smtp_username = $_ENV['EMAIL_USERNAME'] ?? "";
        $this->smtp_password = $_ENV['EMAIL_PASSWORD'] ?? "";
        $this->from_email = $_ENV['EMAIL_USERNAME'] ?? "";
        $this->from_name = $_ENV['EMAIL_FROM_NAME'] ?? "MakeMyVeggies";
        
        $this->debug_mode = $debug;
        $this->use_phpmailer = $phpmailer_available;
        
        if (!$this->use_phpmailer) {
            error_log("PHPMailer not available. Using fallback email service.");
        }
    }

    public function sendOTP($to_email, $otp_code, $user_name = '') {
        // Use fallback if PHPMailer is not available
        if (!$this->use_phpmailer) {
            $fallback = new FallbackEmailService();
            return $fallback->sendOTP($to_email, $otp_code, $user_name);
        }
        
        $subject = "Email Verification - MakeMyVeggies";
        $message = $this->getOTPEmailTemplate($otp_code, $user_name);
        
        try {
            return $this->sendEmailWithPHPMailer($to_email, $subject, $message);
        } catch (Exception $e) {
            error_log("PHPMailer failed, trying fallback: " . $e->getMessage());
            $fallback = new FallbackEmailService();
            return $fallback->sendOTP($to_email, $otp_code, $user_name);
        }
    }

    public function sendPasswordResetOTP($to_email, $otp_code, $user_name = '') {
        // Use fallback if PHPMailer is not available
        if (!$this->use_phpmailer) {
            $fallback = new FallbackEmailService();
            return $fallback->sendOTP($to_email, $otp_code, $user_name); // Reuse sendOTP for fallback
        }
        
        $subject = "Password Reset - MakeMyVeggies";
        $message = $this->getPasswordResetOTPEmailTemplate($otp_code, $user_name);
        
        try {
            return $this->sendEmailWithPHPMailer($to_email, $subject, $message);
        } catch (Exception $e) {
            error_log("PHPMailer failed for password reset, trying fallback: " . $e->getMessage());
            $fallback = new FallbackEmailService();
            return $fallback->sendOTP($to_email, $otp_code, $user_name); // Reuse sendOTP for fallback
        }
    }

    private function sendEmailWithPHPMailer($to_email, $subject, $message) {
        if (!class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            throw new Exception("PHPMailer class not available");
        }
        
        $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = $this->smtp_host;
            $mail->SMTPAuth   = true;
            $mail->Username   = $this->smtp_username;
            $mail->Password   = $this->smtp_password;
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $this->smtp_port;

            // Debug settings
            if ($this->debug_mode) {
                $mail->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_SERVER;
            } else {
                $mail->SMTPDebug = 0;
            }

            // Recipients
            $mail->setFrom($this->from_email, $this->from_name);
            $mail->addAddress($to_email);
            $mail->addReplyTo($this->from_email, $this->from_name);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $message;
            $mail->AltBody = strip_tags($message);

            // Additional headers
            $mail->addCustomHeader('X-Mailer', 'MakeMyVeggies v1.0');
            $mail->addCustomHeader('X-Priority', '1');

            $result = $mail->send();
            
            if ($result) {
                error_log("Production email sent successfully to: {$to_email}");
                return true;
            } else {
                error_log("Failed to send production email to: {$to_email}");
                return false;
            }

        } catch (Exception $e) {
            error_log("PHPMailer Error: {$mail->ErrorInfo}");
            error_log("Exception: " . $e->getMessage());
            throw $e;
        }
    }

    private function getOTPEmailTemplate($otp_code, $user_name) {
        return "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Email Verification - MakeMyVeggies</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    background-color: #f4f4f4;
                }
                .email-container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white; 
                    padding: 30px 20px; 
                    text-align: center; 
                }
                .header h1 { 
                    font-size: 28px; 
                    margin-bottom: 5px;
                    font-weight: 600;
                }
                .content { 
                    padding: 40px 30px; 
                    background: #ffffff; 
                }
                .greeting { 
                    font-size: 20px; 
                    margin-bottom: 20px; 
                    color: #2c3e50;
                }
                .message { 
                    font-size: 16px; 
                    margin-bottom: 30px; 
                    color: #555;
                    line-height: 1.8;
                }
                .otp-container { 
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border: 2px solid #4CAF50; 
                    padding: 30px; 
                    text-align: center; 
                    margin: 30px 0; 
                    border-radius: 10px;
                }
                .otp-code { 
                    font-size: 36px; 
                    font-weight: bold; 
                    color: #4CAF50; 
                    letter-spacing: 8px; 
                    font-family: 'Courier New', monospace;
                    margin: 15px 0;
                }
                .otp-expiry { 
                    font-size: 14px; 
                    color: #e74c3c; 
                    font-weight: 600;
                    margin-top: 15px;
                }
                .footer { 
                    background: #2c3e50; 
                    color: #ecf0f1; 
                    text-align: center; 
                    padding: 25px; 
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <div class='header'>
                    <h1>🥬 MakeMyVeggies</h1>
                    <p>Fresh Vegetables, Delivered Fresh</p>
                </div>
                
                <div class='content'>
                    <div class='greeting'>
                        Hello " . ($user_name ? htmlspecialchars($user_name) : 'there') . "! 👋
                    </div>
                    
                    <div class='message'>
                        Thank you for choosing MakeMyVeggies! To complete your registration, please verify your email address using the verification code below:
                    </div>
                    
                    <div class='otp-container'>
                        <div class='otp-code'>{$otp_code}</div>
                        <div class='otp-expiry'>⏰ This code expires in 10 minutes</div>
                    </div>
                    
                    <div class='message'>
                        If you didn't request this verification, please ignore this email.
                    </div>
                    
                    <div style='text-align: center; margin-top: 30px;'>
                        <p style='color: #4CAF50; font-weight: 600; font-size: 18px;'>
                            Welcome to the MakeMyVeggies family! 🌱
                        </p>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>&copy; 2024 MakeMyVeggies. All rights reserved.</p>
                    <p>Your trusted partner for fresh, quality vegetables</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getOrderConfirmationTemplate($user_name, $orderNumber, $items, $totalAmount, $paymentMethod) {
        $safeName = $user_name ? htmlspecialchars($user_name) : 'Customer';

        $rowsHtml = '';
        if (is_array($items)) {
            foreach ($items as $item) {
                $name = htmlspecialchars((string)($item['name'] ?? 'Item'));
                $qty = (int)($item['quantity'] ?? 0);
                $unit = number_format((float)($item['unit_price'] ?? 0), 2);
                $total = number_format((float)($item['total_price'] ?? 0), 2);

                $rowsHtml .= "<tr>"
                    . "<td style='padding:8px;border:1px solid #ddd;'>{$name}</td>"
                    . "<td style='padding:8px;border:1px solid #ddd;text-align:center;'>{$qty}</td>"
                    . "<td style='padding:8px;border:1px solid #ddd;text-align:right;'>{$unit}</td>"
                    . "<td style='padding:8px;border:1px solid #ddd;text-align:right;'>{$total}</td>"
                    . "</tr>";
            }
        }

        $grandTotal = number_format((float)$totalAmount, 2);
        $payment = htmlspecialchars((string)$paymentMethod);

        return "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <title>Order Confirmation - MakeMyVeggies</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
                .container { max-width: 700px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 25px; text-align: center; }
                .content { padding: 25px; }
                .footer { background: #2c3e50; color: #ecf0f1; text-align: center; padding: 15px; font-size: 13px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th { background: #f1f1f1; padding: 8px; border: 1px solid #ddd; text-align: left; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Order Confirmed</h1>
                    <p>Thank you for shopping with MakeMyVeggies</p>
                </div>
                <div class='content'>
                    <p>Hi {$safeName},</p>
                    <p>Your order <strong>{$orderNumber}</strong> has been placed successfully.</p>

                    <h3>Order Details</h3>
                    <p><strong>Payment Method:</strong> {$payment}</p>

                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style='text-align:center;'>Qty</th>
                                <th style='text-align:right;'>Unit Price</th>
                                <th style='text-align:right;'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$rowsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan='3' style='padding:8px;border:1px solid #ddd;text-align:right;'><strong>Grand Total</strong></td>
                                <td style='padding:8px;border:1px solid #ddd;text-align:right;'><strong>₹{$grandTotal}</strong></td>
                            </tr>
                        </tfoot>
                    </table>

                    <p style='margin-top:20px;'>You will receive another update when your order is out for delivery.</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2024 MakeMyVeggies. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function getPasswordResetOTPEmailTemplate($otp_code, $user_name) {
        return "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Password Reset - MakeMyVeggies</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    background-color: #f4f4f4;
                }
                .email-container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #4CAF50, #4CAF50);
                    color: white; 
                    padding: 30px 20px; 
                    text-align: center; 
                }
                .header h1 { 
                    font-size: 28px; 
                    margin-bottom: 5px;
                    font-weight: 600;
                }
                .content { 
                    padding: 40px 30px; 
                    background: #ffffff; 
                }
                .greeting { 
                    font-size: 20px; 
                    margin-bottom: 20px; 
                    color: #2c3e50;
                }
                .message { 
                    font-size: 16px; 
                    margin-bottom: 30px; 
                    color: #555;
                    line-height: 1.8;
                }
                .otp-container { 
                    background: linear-gradient(135deg, #f8f9fa, #f8f9fa);
                    border: 2px solid #4CAF50; 
                    padding: 30px; 
                    text-align: center; 
                    margin: 30px 0; 
                    border-radius: 10px;
                }
                .otp-code { 
                    font-size: 36px; 
                    font-weight: bold; 
                    color: #4CAF50; 
                    letter-spacing: 8px; 
                    font-family: 'Courier New', monospace;
                    margin: 15px 0;
                }
                .otp-expiry { 
                    font-size: 14px; 
                    color: #e74c3c; 
                    font-weight: 600;
                    margin-top: 15px;
                }
                .footer { 
                    background: #2c3e50; 
                    color: #ecf0f1; 
                    text-align: center; 
                    padding: 25px; 
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <div class='header'>
                    <h1>🔐 Password Reset</h1>
                    <p>MakeMyVeggies - Fresh Vegetables Delivery</p>
                </div>
                
                <div class='content'>
                    <div class='greeting'>
                        Hello " . ($user_name ? htmlspecialchars($user_name) : 'there') . "! 👋
                    </div>
                    
                    <div class='message'>
                        We received a request to reset your password for your MakeMyVeggies account. Please use the verification code below to proceed with resetting your password:
                    </div>
                    
                    <div class='otp-container'>
                        <div class='otp-code'>{$otp_code}</div>
                        <div class='otp-expiry'>⏰ This code expires in 10 minutes</div>
                    </div>
                    
                    <div class='message'>
                        If you didn't request a password reset, you can safely ignore this email. Your account password will remain unchanged.
                    </div>
                    
                    <div style='text-align: center; margin-top: 30px;'>
                        <p style='color: #4CAF50; font-weight: 600; font-size: 18px;'>
                            Thank you for choosing MakeMyVeggies! 🌱
                        </p>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>&copy; 2024 MakeMyVeggies. All rights reserved.</p>
                    <p>Your trusted partner for fresh, quality vegetables</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    // Send welcome email after successful registration
    public function sendWelcomeEmail($to_email, $user_name) {
        $subject = "Welcome to MakeMyVeggies! 🥬";
        $message = $this->getWelcomeEmailTemplate($user_name);
        
        if (!$this->use_phpmailer) {
            // Use simple fallback for welcome email
            $headers = "From: {$this->from_name} <{$this->from_email}>\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            return mail($to_email, $subject, $message, $headers);
        }
        
        try {
            return $this->sendEmailWithPHPMailer($to_email, $subject, $message);
        } catch (Exception $e) {
            error_log("Welcome email failed: " . $e->getMessage());
            return false;
        }
    }

    // Send order confirmation email after successful order placement
    public function sendOrderConfirmation($to_email, $user_name, $orderNumber, $items, $totalAmount, $paymentMethod) {
        $subject = "Your MakeMyVeggies order {$orderNumber}";
        $message = $this->getOrderConfirmationTemplate($user_name, $orderNumber, $items, $totalAmount, $paymentMethod);

        if (!$this->use_phpmailer) {
            $headers = "From: {$this->from_name} <{$this->from_email}>\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            return mail($to_email, $subject, $message, $headers);
        }

        try {
            return $this->sendEmailWithPHPMailer($to_email, $subject, $message);
        } catch (Exception $e) {
            error_log("Order confirmation email failed: " . $e->getMessage());
            return false;
        }
    }

    private function getWelcomeEmailTemplate($user_name) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Welcome to MakeMyVeggies</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
                .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .footer { background: #2c3e50; color: #ecf0f1; text-align: center; padding: 20px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🎉 Welcome to MakeMyVeggies!</h1>
                </div>
                <div class='content'>
                    <h2>Hello " . htmlspecialchars($user_name) . "!</h2>
                    <p>Your account has been successfully created and verified. Welcome to the MakeMyVeggies family!</p>
                    <p>You can now enjoy fresh vegetables delivered to your doorstep!</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2024 MakeMyVeggies. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    // Test email configuration
    public function testConnection() {
        if (!$this->use_phpmailer) {
            return [
                'success' => false,
                'message' => 'PHPMailer not available, using fallback service'
            ];
        }
        
        try {
            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $this->smtp_host;
            $mail->SMTPAuth = true;
            $mail->Username = $this->smtp_username;
            $mail->Password = $this->smtp_password;
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $this->smtp_port;
            $mail->SMTPDebug = 0;
            
            $mail->smtpConnect();
            $mail->smtpClose();
            
            return [
                'success' => true,
                'message' => 'SMTP connection successful'
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'SMTP connection failed: ' . $e->getMessage()
            ];
        }
    }
}
?>
