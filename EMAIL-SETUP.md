# Email Setup Instructions

## Overview
The contact forms now send emails to **andrew@filipourlaw.com** when clients submit case evaluation requests.

## Files Created/Modified

### 1. `submit-form.php` (NEW)
- Handles form submissions
- Sends detailed case evaluation emails to andrew@filipourlaw.com
- Sends confirmation emails to clients
- Includes all form data in a formatted email

### 2. `components/contact-form.js` (UPDATED)
- Now sends form data to `/submit-form.php` endpoint
- Handles API responses and error states
- Shows user-friendly success/error messages

### 3. `js/contact.js` (UPDATED)
- Contact page form now sends emails via PHP
- Added loading states during submission
- Improved error handling

## How It Works

When a client fills out the case evaluation form:
1. Form data is validated on the frontend
2. Data is sent to `submit-form.php` via POST request
3. PHP script sends two emails:
   - **To Lawyer**: Detailed case information including:
     - Client contact info (name, email, phone)
     - Case type and description
     - Physical injuries (if applicable)
     - Incident date and location
     - Preferred contact method and time
     - Urgency level
   - **To Client**: Confirmation email thanking them for their submission

## Email Format

### Email to Lawyer (andrew@filipourlaw.com):
```
Subject: New Case Evaluation Request - Personal Injury

NEW CASE EVALUATION REQUEST
================================

CONTACT INFORMATION:
-------------------
Name: John Doe
Email: john@example.com
Phone: (404) 555-1234
Country: United States

CASE TYPE:
---------
Type: Personal Injury

PHYSICAL INJURIES:
-----------------
Broken Bones

CASE DESCRIPTION:
----------------
[Client's description of their case]

INCIDENT DATE:
-------------
January 15, 2025

LOCATION:
--------
Atlanta, GA 30303

PREFERRED CONTACT METHOD:
------------------------
Phone

BEST TIME TO CONTACT:
--------------------
Morning

URGENCY LEVEL:
-------------
High

================================
Submitted: January 20, 2025 2:30 PM
```

### Email to Client:
```
Subject: We Received Your Case Evaluation Request

Dear John,

Thank you for contacting Andrew Filipour Law. We have received your case evaluation request and will review it shortly.

We will contact you within 24 hours using your preferred contact method.

Case Type: Personal Injury

If you need immediate assistance, please call us at (404) 948-3311.

Best regards,
Andrew Filipour Law
(404) 948-3311
andrew@filipourlaw.com
```

## Server Requirements

### For PHP to work, your web hosting must support:
- PHP 7.0 or higher
- `mail()` function enabled
- Write permissions for the web server

### Common Hosting Platforms (Already Support PHP):
- ✅ **Hostinger** - PHP enabled by default
- ✅ **Bluehost** - PHP enabled by default
- ✅ **SiteGround** - PHP enabled by default
- ✅ **GoDaddy** - PHP enabled by default
- ✅ **cPanel hosting** - PHP enabled by default

### Platforms That Need Configuration:
- ❌ **GitHub Pages** - Static only (no PHP support)
- ❌ **Netlify** - Need to use Netlify Functions instead
- ❌ **Vercel** - Need to use Serverless Functions instead

## Alternative Solutions

### If you're using GitHub Pages, Netlify, or Vercel:

#### Option 1: Use FormSubmit.co (Easiest)
Update the form action in HTML:
```html
<form action="https://formsubmit.co/andrew@filipourlaw.com" method="POST">
    <!-- Your form fields -->
</form>
```

#### Option 2: Use Netlify Forms (If using Netlify)
Add `netlify` attribute to form:
```html
<form name="contact" method="POST" data-netlify="true">
    <!-- Your form fields -->
</form>
```

#### Option 3: Use EmailJS (Client-side solution)
Sign up at emailjs.com and update JavaScript to use their API.

## Testing

### To test the current PHP setup:

1. **Upload files to PHP-enabled server**
2. **Test the form** - Fill out and submit
3. **Check andrew@filipourlaw.com** for the email
4. **Check client email** for confirmation

### Local Testing:
To test locally, you need a local PHP server:
```bash
php -S localhost:8000
```
Then visit: http://localhost:8000

## Troubleshooting

### Email not being sent?
1. Check spam/junk folder
2. Verify PHP `mail()` function is enabled on server
3. Check server error logs
4. Try using SMTP instead of `mail()` function

### Alternative: Use SMTP (More Reliable)
For better email delivery, consider using PHPMailer with SMTP:
- Gmail SMTP
- SendGrid
- Mailgun
- AWS SES

## Security Notes

- Form validates data before sending
- Email headers prevent spoofing
- No sensitive data is stored
- Consider adding reCAPTCHA to prevent spam
- Add rate limiting to prevent abuse

## Next Steps

1. **Upload `submit-form.php` to your web server**
2. **Test the form** to ensure emails are received
3. **Check spam folder** if emails don't arrive
4. **Consider adding reCAPTCHA** for spam protection
5. **Set up email forwarding rules** if needed

## Support

If emails aren't working:
- Contact your hosting provider to confirm PHP mail() is enabled
- Check server PHP error logs
- Consider using a third-party email service (FormSubmit, EmailJS, etc.)
