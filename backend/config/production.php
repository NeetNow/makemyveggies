<?php
// Production configuration for MakeMyVeggies
class ProductionConfig {
    // Email Configuration
    const EMAIL_HOST = "smtp.gmail.com";
    const EMAIL_PORT = 587;
    const EMAIL_USERNAME = "nikhil.bava@makemyveggies.com";
    const EMAIL_PASSWORD = "ivqt kxab vcjq wxcs"; // App password
    const EMAIL_FROM_NAME = "MakeMyVeggies";
    
    // Database Configuration
    const DB_HOST = "localhost";
    const DB_PORT = "3306";
    const DB_NAME = "u913267094_mmv_dev";
    const DB_USERNAME = "u913267094_mmv_developer";
    const DB_PASSWORD = "MMV_shp@2025";
    
    // Security Configuration
    const JWT_SECRET = "makemyveggies_jwt_secret_2025"; 
    const ENCRYPTION_KEY = "makemyveggies_encryption_key"; 
    
    // Application Configuration
    const APP_NAME = "MakeMyVeggies";
    const APP_URL = "https://makemyveggies.com"; 
    const FRONTEND_URL = "http://localhost:3000"; 
    
    // OTP Configuration
    const OTP_EXPIRY_MINUTES = 10;
    const OTP_RESEND_LIMIT_SECONDS = 60;
    
    // File Upload Configuration
    const MAX_FILE_SIZE = 5242880; // 5MB
    const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    // Rate Limiting
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOGIN_LOCKOUT_MINUTES = 15;
    
    // Session Configuration
    const SESSION_LIFETIME = 86400; // 24 hours
    
    public static function isProduction() {
        return !in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1']);
    }
    
    public static function getEmailConfig() {
        return [
            'host' => self::EMAIL_HOST,
            'port' => self::EMAIL_PORT,
            'username' => self::EMAIL_USERNAME,
            'password' => self::EMAIL_PASSWORD,
            'from_name' => self::EMAIL_FROM_NAME
        ];
    }
    
    public static function getDatabaseConfig() {
        return [
            'host' => self::DB_HOST,
            'port' => self::DB_PORT,
            'dbname' => self::DB_NAME,
            'username' => self::DB_USERNAME,
            'password' => self::DB_PASSWORD
        ];
    }
}

// Set production error handling
if (ProductionConfig::isProduction()) {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
}
?>
