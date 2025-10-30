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
                    background: linear-gradient(135deg, #FF9800, #F57C00);
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
                    border: 2px solid #FF9800; 
                    padding: 30px; 
                    text-align: center; 
                    margin: 30px 0; 
                    border-radius: 10px;
                }
                .otp-code { 
                    font-size: 36px; 
                    font-weight: bold; 
                    color: #FF9800; 
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
                        <p style='color: #FF9800; font-weight: 600; font-size: 18px;'>
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
