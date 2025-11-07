<?php
// Email utility for sending OTP and other emails using PHPMailer

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

class EmailService {
    private $smtp_host;
    private $smtp_port;
    private $smtp_username;
    private $smtp_password;
    private $from_email;
    private $from_name;

    public function __construct() {
        // Load from environment variables
        $this->smtp_host = $_ENV['EMAIL_HOST'] ?? "smtp.gmail.com";
        $this->smtp_port = $_ENV['EMAIL_PORT'] ?? 587;
        $this->smtp_username = $_ENV['EMAIL_USERNAME'] ?? "";
        $this->smtp_password = $_ENV['EMAIL_PASSWORD'] ?? "";
        $this->from_email = $_ENV['EMAIL_USERNAME'] ?? "";
        $this->from_name = $_ENV['EMAIL_FROM_NAME'] ?? "MakeMyVeggies";
    }

    public function sendOTP($to_email, $otp_code, $user_name = '') {
        $subject = "Email Verification - MakeMyVeggies";
        $message = $this->getOTPEmailTemplate($otp_code, $user_name);
        
        return $this->sendEmailWithPHPMailer($to_email, $subject, $message);
    }

    private function getOTPEmailTemplate($otp_code, $user_name) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Email Verification</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .otp-box { background: #fff; border: 2px solid #4CAF50; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>MakeMyVeggies</h1>
                    <p>Email Verification</p>
                </div>
                <div class='content'>
                    <h2>Hello " . ($user_name ? $user_name : 'there') . "!</h2>
                    <p>Thank you for registering with MakeMyVeggies. To complete your registration, please verify your email address using the OTP code below:</p>
                    
                    <div class='otp-box'>
                        <p>Your verification code is:</p>
                        <div class='otp-code'>{$otp_code}</div>
                        <p><strong>This code will expire in 10 minutes.</strong></p>
                    </div>
                    
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Welcome to MakeMyVeggies - Your trusted partner for fresh vegetables!</p>
                </div>
                <div class='footer'>
                    <p>&copy; 2024 MakeMyVeggies. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function sendEmailWithPHPMailer($to_email, $subject, $message) {
        try {
            // Include PHPMailer classes directly
            require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php';
            require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/SMTP.php';
            require_once __DIR__ . '/../vendor/phpmailer/phpmailer/src/Exception.php';
            
            // Use PHPMailer
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host       = $this->smtp_host;
            $mail->SMTPAuth   = true;
            $mail->Username   = $this->smtp_username;
            $mail->Password   = $this->smtp_password;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = $this->smtp_port;
            
            // Recipients
            $mail->setFrom($this->from_email, $this->from_name);
            $mail->addAddress($to_email);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $message;
            
            $mail->send();
            error_log("Email sent successfully via PHPMailer to: {$to_email}");
            return true;
            
        } catch (Exception $e) {
            error_log("PHPMailer error: " . $e->getMessage());
            return false;
        }
    }
}
?>
