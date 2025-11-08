# Contact Form Component Integration Guide

## Overview
This is a comprehensive 7-step contact form component designed for law firms. It includes conditional logic, form validation, and professional styling.

## Files Included
- `contact-form.html` - The HTML structure
- `contact-form.css` - Complete styling with animations
- `contact-form.js` - Interactive functionality and validation
- `contact.html` - Example integration page

## Features
✅ **7-Step Multi-Step Form**
- Contact Information
- Case Type Selection
- Physical Injuries (conditional)
- Financial Losses
- Timeline & Urgency
- Preferred Contact Method
- Additional Information

✅ **Smart Conditional Logic**
- Physical injuries step only shows for Personal Injury cases
- Dynamic step navigation

✅ **Form Validation**
- Real-time field validation
- Required field checking
- Email and phone number formatting
- Radio group validation

✅ **Professional UI/UX**
- Progress tracking bar
- Loading states
- Success confirmation (100% completion)
- Error handling
- Mobile responsive design

✅ **Accessibility**
- Semantic HTML structure
- ARIA labels
- Keyboard navigation support
- Screen reader friendly

## Quick Integration

### Method 1: Direct HTML Include
```html
<!-- Include CSS -->
<link rel="stylesheet" href="path/to/contact-form.css">

<!-- Include HTML structure -->
<div id="contactFormContainer">
    <!-- Paste content from contact-form.html here -->
</div>

<!-- Include JavaScript -->
<script src="path/to/contact-form.js"></script>
```

### Method 2: Dynamic Loading (Recommended)
```html
<!-- Include CSS -->
<link rel="stylesheet" href="components/contact-form.css">

<!-- Container for form -->
<div id="contactFormContainer"></div>

<!-- Load form dynamically -->
<script>
fetch('components/contact-form.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('contactFormContainer').innerHTML = html;
        
        // Load JavaScript
        const script = document.createElement('script');
        script.src = 'components/contact-form.js';
        document.head.appendChild(script);
    });
</script>
```

## Customization

### Colors
The form uses CSS custom properties that match your law firm's color scheme:
```css
:root {
    --lawyer-blue: #1F3C88;
    --lawyer-red: #8B1E1E;
    --lawyer-grey: #4B4B4B;
}
```

### Form Fields
To add/remove fields, edit the `contact-form.html` file and update the validation logic in `contact-form.js`.

### Conditional Logic
The physical injuries step is controlled by:
```javascript
shouldShowPhysicalInjuries() {
    const caseTypeInput = document.querySelector('input[name="caseType"]:checked');
    return caseTypeInput && caseTypeInput.value === 'personal-injury';
}
```

## Form Submission
Currently configured to log form data to console. To integrate with your backend:

1. Update the `submitForm()` method in `contact-form.js`
2. Replace the simulation with your API endpoint:

```javascript
async submitForm() {
    const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
    });
    
    if (!response.ok) {
        throw new Error('Submission failed');
    }
    
    return response.json();
}
```

## Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure
```
components/
├── contact-form.html    # Form structure
├── contact-form.css     # Styling
└── contact-form.js      # Functionality

pages/
└── contact.html         # Example integration
```

## Testing
1. Open `pages/contact.html` in your browser
2. Test all form steps and validation
3. Try different case types to see conditional logic
4. Test on mobile devices for responsiveness

## Support
The component is designed to be self-contained and reusable. All dependencies are included, and it works with vanilla HTML/CSS/JavaScript.