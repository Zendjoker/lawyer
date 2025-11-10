#!/bin/bash

# Gmail SMTP Setup Script for Adverra Contact Form
# This script will configure your contact form to send emails via Gmail

echo "============================================"
echo "Gmail SMTP Setup for Adverra Contact Form"
echo "============================================"
echo ""
echo "Before running this script, you need a Gmail App Password."
echo ""
echo "To get your Gmail App Password:"
echo "1. Go to: https://myaccount.google.com/security"
echo "2. Enable '2-Step Verification' if not already enabled"
echo "3. Go to: https://myaccount.google.com/apppasswords"
echo "4. Select 'Mail' and 'Other (Custom name)'"
echo "5. Name it 'Adverra Website'"
echo "6. Copy the 16-character password (no spaces)"
echo ""
read -p "Press Enter when you have your App Password ready..."
echo ""

# Get the App Password
read -sp "Enter your Gmail App Password (16 characters): " APP_PASSWORD
echo ""

if [ ${#APP_PASSWORD} -ne 16 ]; then
    echo "Error: App Password should be exactly 16 characters!"
    exit 1
fi

# Update the PHP file
echo "Updating submit-form.php..."
sed -i "s/YOUR_GMAIL_APP_PASSWORD/$APP_PASSWORD/g" /var/www/adverra.tech/submit-form.php

# Test the configuration
echo ""
echo "Testing email configuration..."
curl -X POST https://adverra.tech/submit-form.php \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "country":"US",
    "phone":"555-123-4567",
    "caseType":"family-law",
    "timeframe":"days",
    "contactMethod":"email",
    "contactTime":"asap",
    "message":"This is a test message to verify Gmail SMTP is working."
  }' 2>&1

echo ""
echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Check your email at adoumazzouz.aa@gmail.com"
echo "You should receive a test email within a few minutes."
echo ""
echo "If you don't receive it, check:"
echo "  - Spam/Junk folder"
echo "  - App Password is correct (16 characters)"
echo "  - 2-Step Verification is enabled on Gmail"
echo ""
echo "All form submissions are also saved to:"
echo "  /var/www/adverra.tech/form-submissions.log"
echo ""
