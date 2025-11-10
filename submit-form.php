<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON data from request body
$jsonData = file_get_contents('php://input');
$formData = json_decode($jsonData, true);

// Validate data
if (!$formData) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit();
}

// Email configuration
$to = 'andrew@filipourlaw.com';
$subject = 'New Case Evaluation Request - ' . ($formData['caseType'] ?? 'General Inquiry');

// Build email body
$emailBody = "NEW CASE EVALUATION REQUEST\n";
$emailBody .= "================================\n\n";

// Contact Information
$emailBody .= "CONTACT INFORMATION:\n";
$emailBody .= "-------------------\n";
$emailBody .= "Name: " . ($formData['firstName'] ?? '') . " " . ($formData['lastName'] ?? '') . "\n";
$emailBody .= "Email: " . ($formData['email'] ?? '') . "\n";
$emailBody .= "Phone: " . ($formData['phone'] ?? 'Not provided') . "\n";
$emailBody .= "Country: " . ($formData['country'] ?? 'Not provided') . "\n\n";

// Case Type
$emailBody .= "CASE TYPE:\n";
$emailBody .= "---------\n";
$emailBody .= "Type: " . ucwords(str_replace('-', ' ', $formData['caseType'] ?? 'Not specified')) . "\n\n";

// Physical Injuries (if applicable)
if (isset($formData['physicalInjuries']) && $formData['physicalInjuries'] !== 'none') {
    $emailBody .= "PHYSICAL INJURIES:\n";
    $emailBody .= "-----------------\n";
    $emailBody .= ucwords(str_replace('-', ' ', $formData['physicalInjuries'])) . "\n\n";
}

// Case Description
$emailBody .= "CASE DESCRIPTION:\n";
$emailBody .= "----------------\n";
$emailBody .= ($formData['caseDescription'] ?? 'Not provided') . "\n\n";

// Incident Date
if (isset($formData['incidentDate'])) {
    $emailBody .= "INCIDENT DATE:\n";
    $emailBody .= "-------------\n";
    $emailBody .= date('F j, Y', strtotime($formData['incidentDate'])) . "\n\n";
}

// Location
if (isset($formData['city']) || isset($formData['state'])) {
    $emailBody .= "LOCATION:\n";
    $emailBody .= "--------\n";
    $emailBody .= ($formData['city'] ?? '') . ", " . ($formData['state'] ?? '') . " " . ($formData['zipCode'] ?? '') . "\n\n";
}

// Preferred Contact
$emailBody .= "PREFERRED CONTACT METHOD:\n";
$emailBody .= "------------------------\n";
$emailBody .= ucfirst($formData['preferredContact'] ?? 'email') . "\n\n";

// Best Time to Contact
if (isset($formData['bestTime'])) {
    $emailBody .= "BEST TIME TO CONTACT:\n";
    $emailBody .= "--------------------\n";
    $emailBody .= ucfirst($formData['bestTime']) . "\n\n";
}

// Representation Status
if (isset($formData['hasRepresentation'])) {
    $emailBody .= "CURRENT REPRESENTATION:\n";
    $emailBody .= "---------------------\n";
    $emailBody .= ($formData['hasRepresentation'] === 'yes' ? 'Yes' : 'No') . "\n\n";
}

// Urgency
if (isset($formData['urgency'])) {
    $emailBody .= "URGENCY LEVEL:\n";
    $emailBody .= "-------------\n";
    $emailBody .= ucfirst($formData['urgency']) . "\n\n";
}

$emailBody .= "================================\n";
$emailBody .= "Submitted: " . date('F j, Y g:i A') . "\n";

// Email headers
$headers = "From: Website Contact Form <noreply@filipourlaw.com>\r\n";
$headers .= "Reply-To: " . ($formData['email'] ?? 'noreply@filipourlaw.com') . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    // Send confirmation email to client
    $clientSubject = "We Received Your Case Evaluation Request";
    $clientBody = "Dear " . ($formData['firstName'] ?? 'Client') . ",\n\n";
    $clientBody .= "Thank you for contacting Andrew Filipour Law. We have received your case evaluation request and will review it shortly.\n\n";
    $clientBody .= "We will contact you within 24 hours using your preferred contact method.\n\n";
    $clientBody .= "Case Type: " . ucwords(str_replace('-', ' ', $formData['caseType'] ?? '')) . "\n\n";
    $clientBody .= "If you need immediate assistance, please call us at (404) 948-3311.\n\n";
    $clientBody .= "Best regards,\n";
    $clientBody .= "Andrew Filipour Law\n";
    $clientBody .= "(404) 948-3311\n";
    $clientBody .= "andrew@filipourlaw.com";
    
    $clientHeaders = "From: Andrew Filipour Law <andrew@filipourlaw.com>\r\n";
    $clientHeaders .= "Reply-To: andrew@filipourlaw.com\r\n";
    $clientHeaders .= "X-Mailer: PHP/" . phpversion();
    
    mail($formData['email'], $clientSubject, $clientBody, $clientHeaders);
    
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you! We will contact you within 24 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send email. Please try again or call us at (404) 948-3311.'
    ]);
}
?>
