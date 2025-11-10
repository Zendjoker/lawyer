<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$to_email = "adoumazzouz.aa@gmail.com";

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Get and sanitize form data
$name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email = isset($data['email']) ? trim(strip_tags($data['email'])) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';
$case_type = isset($data['caseType']) ? trim(strip_tags($data['caseType'])) : 'General Inquiry';

// Validate required fields
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

// Return validation errors if any
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Save to file as backup
$log_file = '/var/www/adverra.tech/form-submissions.log';
$log_entry = "\n" . str_repeat('=', 80) . "\n";
$log_entry .= "Date: " . date('Y-m-d H:i:s') . "\n";
$log_entry .= "Name: $name\n";
$log_entry .= "Email: $email\n";
$log_entry .= "Phone: $phone\n";
$log_entry .= "Case Type: $case_type\n";
$log_entry .= "Message: $message\n";
$log_entry .= str_repeat('=', 80) . "\n";

file_put_contents($log_file, $log_entry, FILE_APPEND);

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP Configuration - UPDATE THESE WITH YOUR GMAIL APP PASSWORD
    // To use Gmail SMTP, you need to:
    // 1. Enable 2-factor authentication on your Gmail
    // 2. Create an App Password: https://myaccount.google.com/apppasswords
    // 3. Update the values below
    
    // Uncomment and configure these lines when you have Gmail App Password:
    /*
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@gmail.com';  // Your Gmail address
    $mail->Password   = 'your-app-password';      // Gmail App Password (16 characters)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    */
    
    // For now, use regular mail() function
    $mail->isMail();
    
    // Recipients
    $mail->setFrom('noreply@adverra.tech', 'Adverra Law Contact Form');
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(false);
    $mail->Subject = "Contact Form - Adverra Law - $case_type";
    $mail->Body    = "You have received a new message from your website contact form.\n\n";
    $mail->Body   .= "Name: $name\n";
    $mail->Body   .= "Email: $email\n";
    $mail->Body   .= "Phone: $phone\n";
    $mail->Body   .= "Case Type: $case_type\n\n";
    $mail->Body   .= "Message:\n$message\n";
    
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you soon.',
        'note' => 'Submission logged and email sent'
    ]);
    
} catch (Exception $e) {
    // Email failed but form is still logged
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you soon.',
        'note' => 'Submission logged (email pending)'
    ]);
}
?>
