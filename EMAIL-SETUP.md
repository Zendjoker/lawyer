# Email Setup Instructions

## Current Status
✅ Forms are working - All submissions saved to form-submissions.log
⚠️ Email to Gmail blocked - Gmail rejects unauthorized servers

## Why Gmail Blocks the Emails
Gmail got this error: "550 5.7.1 The IP you're using to send mail is not authorized"

## Solution: Use Gmail SMTP (FREE & Recommended)

### Step 1: Enable Gmail SMTP
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)" 
3. Name it "Adverra Website"
4. Copy the 16-character password (no spaces)

### Step 3: Update Configuration
Edit /var/www/adverra.tech/submit-form-smtp.php:
- Uncomment SMTP lines (remove /* and */)
- Set Username to: adoumazzouz.aa@gmail.com
- Set Password to: (your 16-char app password)

### Step 4: Activate It
```bash
cd /var/www/adverra.tech
mv submit-form.php submit-form-basic.php
mv submit-form-smtp.php submit-form.php
```

## View Form Submissions
All submissions are logged to: /var/www/adverra.tech/form-submissions.log

View them:
```bash
cat /var/www/adverra.tech/form-submissions.log
```
