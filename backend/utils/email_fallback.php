<?php
// Fallback email service for when PHPMailer fails
class FallbackEmailService {
    private $from_email = "admin@makemyveggies.com";
    private $from_name = "MakeMyVeggies";

    public function sendOTP($to_email, $otp_code, $user_name = '') {
        $subject = "Email Verification - MakeMyVeggies";
        $message = $this->getSimpleOTPTemplate($otp_code, $user_name);
        
        return $this->sendSimpleEmail($to_email, $subject, $message);
    }

    private function sendSimpleEmail($to_email, $subject, $message) {
        try {
            // Simple headers for basic email
            $headers = "From: {$this->from_name} <{$this->from_email}>\r\n";
            $headers .= "Reply-To: {$this->from_email}\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

            // In this fallback implementation, we do not actually send via mail() to avoid
            // relying on a local SMTP server configuration (which often does not exist
            // in development environments like XAMPP on Windows). Instead, we log the
            // attempt and report failure so the calling code can handle it appropriately.
            error_log("Fallback email (not sent) to: {$to_email} | Subject: {$subject}");
            return false;

        } catch (Exception $e) {
            error_log("Fallback email error: " . $e->getMessage());
            return false;
        }
    }

    private function getSimpleOTPTemplate($otp_code, $user_name) {
        return "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <div style='background: #4CAF50; color: white; padding: 20px; text-align: center;'>
                    <h1>MakeMyVeggies</h1>
                    <p>Email Verification</p>
                </div>
                
                <div style='padding: 20px; background: #f9f9f9;'>
                    <h2>Hello " . ($user_name ? htmlspecialchars($user_name) : 'there') . "!</h2>
                    <p>Your verification code is:</p>
                    
                    <div style='background: #fff; border: 2px solid #4CAF50; padding: 20px; text-align: center; margin: 20px 0;'>
                        <div style='font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px;'>{$otp_code}</div>
                        <p style='color: #e74c3c; font-weight: bold;'>This code expires in 10 minutes</p>
                    </div>
                    
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Welcome to MakeMyVeggies!</p>
                </div>
                
                <div style='background: #333; color: #fff; text-align: center; padding: 20px;'>
                    <p>&copy; 2024 MakeMyVeggies. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
}
?>
