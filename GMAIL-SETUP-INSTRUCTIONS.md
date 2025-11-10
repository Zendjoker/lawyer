# ✅ Contact Form is Working!

Your multi-step contact form is now fully functional and saves all submissions.

## Current Status

✅ **Form saves all data** - Every submission is logged to `form-submissions.log`
✅ **All 7 steps working** - Collects all information from your multi-step form
✅ **PHPMailer installed** - Ready for Gmail SMTP
⚠️ **Gmail delivery pending** - Needs your App Password

## What the Form Collects

Your contact form now collects and saves:
- First Name & Last Name
- Email & Country
- Phone Number
- Case Type (family-law, business-law, personal-injury, etc.)
- Physical Injuries (if applicable)
- When incident occurred
- Preferred contact method (phone/text/email)
- Best time to contact
- Additional details/message

## To Enable Gmail Delivery

### Quick Setup (5 minutes):

**Step 1: Get Gmail App Password**
1. Visit: https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already on)
3. Visit: https://myaccount.google.com/apppasswords
4. Create new app password:
   - App: Mail
   - Device: Other (Adverra Website)
5. Copy the 16-character password (looks like: `xxxx xxxx xxxx xxxx`)

**Step 2: Run Setup Script**
```bash
cd /var/www/adverra.tech
./setup-gmail.sh
```

The script will:
- Ask for your App Password
- Update the configuration
- Send a test email
- Confirm everything works

**Step 3: Done!**
Check your inbox at adoumazzouz.aa@gmail.com for the test email.

## Viewing Form Submissions

### View all submissions:
```bash
cat /var/www/adverra.tech/form-submissions.log
```

### View latest submissions:
```bash
tail -50 /var/www/adverra.tech/form-submissions.log
```

### Watch for new submissions in real-time:
```bash
tail -f /var/www/adverra.tech/form-submissions.log
```

## Test the Form

Visit: https://adverra.tech/contact.html

Or test with curl:
```bash
curl -X POST https://adverra.tech/submit-form.php \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","country":"US","phone":"555-123-4567","caseType":"family-law","timeframe":"days","contactMethod":"email","contactTime":"asap","message":"Test message"}'
```

## Files Modified

- `/var/www/adverra.tech/submit-form.php` - Main form handler with PHPMailer
- `/var/www/adverra.tech/form-submissions.log` - All submissions saved here
- `/var/www/adverra.tech/setup-gmail.sh` - Easy setup script

## Troubleshooting

**No email received?**
- Check spam/junk folder
- Verify App Password is 16 characters (no spaces)
- Make sure 2-Step Verification is enabled
- Check `/var/log/mail.log` for errors

**Form not submitting?**
- Check browser console (F12) for JavaScript errors
- All submissions are saved to `form-submissions.log` regardless

## Email Preview

When someone submits the form, you'll receive a nicely formatted HTML email with:
- Contact information (name, email, phone, country)
- Case details (type, injuries, timeframe)
- Contact preferences (method, best time)
- Full message/additional details

---

Need help? All submissions are always saved to the log file, so you won't miss any leads!
