<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// If PHPMailer is installed in backend/vendor/phpmailer/phpmailer
require __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

$message = "";

if (isset($_POST['send'])) {

    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug = 2; // 0 = silent, 2 = detailed debug
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'admin@dev.makemyveggies.com';
        $mail->Password   = 'mmv_Admin@2025';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('admin@dev.makemyveggies.com', 'SMTP Test');
        // you can change this to any destination you want to test
        $mail->addAddress('nikhilbawa172@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = 'SMTP Test Email';
        $mail->Body    = 'If you received this, SMTP is working.';

        $mail->send();
        $message = "Email sent successfully via SMTP!";
    } catch (Exception $e) {
        $message = "Error: {$mail->ErrorInfo}";
    }
}
?>
<form method="post">
    <button name="send">Send SMTP Test Email</button>
</form>

<p><?= htmlspecialchars($message) ?></p>