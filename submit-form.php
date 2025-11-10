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

// Get and sanitize form data from multi-step form
$firstName = isset($data['firstName']) ? trim(strip_tags($data['firstName'])) : '';
$lastName = isset($data['lastName']) ? trim(strip_tags($data['lastName'])) : '';
$name = $firstName . ' ' . $lastName;
$email = isset($data['email']) ? trim(strip_tags($data['email'])) : '';
$country = isset($data['country']) ? trim(strip_tags($data['country'])) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$caseType = isset($data['caseType']) ? trim(strip_tags($data['caseType'])) : 'General Inquiry';
$physicalInjuries = isset($data['physicalInjuries']) ? trim(strip_tags($data['physicalInjuries'])) : '';
$timeframe = isset($data['timeframe']) ? trim(strip_tags($data['timeframe'])) : '';
$contactMethod = isset($data['contactMethod']) ? trim(strip_tags($data['contactMethod'])) : '';
$contactTime = isset($data['contactTime']) ? trim(strip_tags($data['contactTime'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

// Validate required fields
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required';
}

if (empty($caseType)) {
    $errors[] = 'Case type is required';
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
$log_entry .= "Country: $country\n";
$log_entry .= "Case Type: $caseType\n";
if (!empty($physicalInjuries)) {
    $log_entry .= "Physical Injuries: $physicalInjuries\n";
}
$log_entry .= "Timeframe: $timeframe\n";
$log_entry .= "Preferred Contact: $contactMethod\n";
$log_entry .= "Contact Time: $contactTime\n";
$log_entry .= "Message: $message\n";
$log_entry .= str_repeat('=', 80) . "\n";

file_put_contents($log_file, $log_entry, FILE_APPEND);

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'adoumazzouz.aa@gmail.com';
    $mail->Password   = 'mhjxhpwhjcbzlrdk';  // Gmail App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    
    // Recipients
    $mail->setFrom('noreply@adverra.tech', 'Adverra Law Contact Form');
    $mail->addAddress($to_email, 'Adverra Law');
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Case Inquiry - $caseType - $name";
    
    // Build HTML email body
    $mail->Body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h2 { color: #1a1a1a; border-bottom: 3px solid #dc2626; padding-bottom: 10px; }
            .info-block { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .label { font-weight: bold; color: #666; }
            .value { color: #1a1a1a; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>New Case Inquiry from Adverra.tech</h2>
            
            <div class='info-block'>
                <h3>Contact Information</h3>
                <div class='value'><span class='label'>Name:</span> $name</div>
                <div class='value'><span class='label'>Email:</span> <a href='mailto:$email'>$email</a></div>
                <div class='value'><span class='label'>Phone:</span> <a href='tel:$phone'>$phone</a></div>
                <div class='value'><span class='label'>Country:</span> $country</div>
            </div>
            
            <div class='info-block'>
                <h3>Case Details</h3>
                <div class='value'><span class='label'>Case Type:</span> $caseType</div>
                " . (!empty($physicalInjuries) ? "<div class='value'><span class='label'>Physical Injuries:</span> $physicalInjuries</div>" : "") . "
                <div class='value'><span class='label'>When it occurred:</span> $timeframe</div>
            </div>
            
            <div class='info-block'>
                <h3>Contact Preferences</h3>
                <div class='value'><span class='label'>Preferred Method:</span> $contactMethod</div>
                <div class='value'><span class='label'>Best Time:</span> $contactTime</div>
            </div>
            
            " . (!empty($message) ? "
            <div class='info-block'>
                <h3>Additional Details</h3>
                <div class='value'>$message</div>
            </div>
            " : "") . "
            
            <p style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;'>
                Submitted on " . date('F j, Y g:i A') . " via adverra.tech contact form
            </p>
        </div>
    </body>
    </html>
    ";
    
    // Plain text version
    $mail->AltBody = "New Case Inquiry from Adverra.tech\n\n";
    $mail->AltBody .= "Contact Information:\n";
    $mail->AltBody .= "Name: $name\n";
    $mail->AltBody .= "Email: $email\n";
    $mail->AltBody .= "Phone: $phone\n";
    $mail->AltBody .= "Country: $country\n\n";
    $mail->AltBody .= "Case Details:\n";
    $mail->AltBody .= "Case Type: $caseType\n";
    if (!empty($physicalInjuries)) {
        $mail->AltBody .= "Physical Injuries: $physicalInjuries\n";
    }
    $mail->AltBody .= "Timeframe: $timeframe\n\n";
    $mail->AltBody .= "Contact Preferences:\n";
    $mail->AltBody .= "Preferred Method: $contactMethod\n";
    $mail->AltBody .= "Best Time: $contactTime\n\n";
    if (!empty($message)) {
        $mail->AltBody .= "Additional Details:\n$message\n\n";
    }
    $mail->AltBody .= "Submitted on " . date('F j, Y g:i A');
    
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you soon.',
        'note' => 'Email sent successfully'
    ]);
    
} catch (Exception $e) {
    // Email failed but form is still logged
    error_log("Email send failed: " . $mail->ErrorInfo);
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you soon.',
        'note' => 'Submission logged (email pending)',
        'debug' => 'Email error: ' . $mail->ErrorInfo
    ]);
}
?>
