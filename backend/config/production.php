<?php
// Production configuration for MakeMyVeggies

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

class ProductionConfig {
    // Email Configuration
    const EMAIL_HOST = "smtp.gmail.com";
    const EMAIL_PORT = 587;
    const EMAIL_FROM_NAME = "MakeMyVeggies";
    
    // Database Configuration
    const DB_HOST = "localhost";
    const DB_PORT = "3306";
    
    // Application Configuration
    const APP_NAME = "MakeMyVeggies";
    const APP_URL = "https://makemyveggies.com"; // Change to your domain
    const FRONTEND_URL = "http://localhost:3000"; // Change to your frontend URL
    
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
    
    // Environment variable accessors
    public static function getEmailUsername() {
        return $_ENV['EMAIL_USERNAME'] ?? '';
    }
    
    public static function getEmailPassword() {
        return $_ENV['EMAIL_PASSWORD'] ?? '';
    }
    
    public static function getDatabaseName() {
        return $_ENV['DB_NAME'] ?? '';
    }
    
    public static function getDatabaseUsername() {
        return $_ENV['DB_USERNAME'] ?? '';
    }
    
    public static function getDatabasePassword() {
        return $_ENV['DB_PASSWORD'] ?? '';
    }
    
    public static function getJwtSecret() {
        return $_ENV['JWT_SECRET'] ?? '';
    }
    
    public static function getEncryptionKey() {
        return $_ENV['ENCRYPTION_KEY'] ?? '';
    }
    
    public static function isProduction() {
        return !in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1']);
    }
    
    public static function getEmailConfig() {
        return [
            'host' => self::EMAIL_HOST,
            'port' => self::EMAIL_PORT,
            'username' => self::getEmailUsername(),
            'password' => self::getEmailPassword(),
            'from_name' => self::EMAIL_FROM_NAME
        ];
    }
    
    public static function getDatabaseConfig() {
        return [
            'host' => self::DB_HOST,
            'port' => self::DB_PORT,
            'dbname' => self::getDatabaseName(),
            'username' => self::getDatabaseUsername(),
            'password' => self::getDatabasePassword()
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
