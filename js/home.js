// Home page JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Clickable lawyer image functionality
    const lawyerImg = document.querySelector('.clickable-lawyer');
    if (lawyerImg) {
        lawyerImg.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Redirect to contact page for appointment booking
                window.location.href = 'contact.html';
            }, 150);
        });
    }
    
    // Clickable message box functionality
    const messageBox = document.querySelector('.message-box');
    if (messageBox) {
        messageBox.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Redirect to contact page for appointment booking
                window.location.href = 'contact.html';
            }, 150);
        });
    }
    
    // Practice area cards functionality
    const practiceAreaCards = document.querySelectorAll('.practice-card');
    practiceAreaCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                this.style.transform = '';
                // You can redirect to specific practice area pages here
                // For now, redirect to contact page
                window.location.href = 'contact.html';
            }, 150);
        });
    });
    
    // More Wins button functionality
    const moreWinsBtn = document.querySelector('.more-wins-btn');
    if (moreWinsBtn) {
        moreWinsBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Redirect to results page or show more results
                window.location.href = 'results.html';
            }, 150);
        });
    }
    
    // Back to Top Button functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Form submission handler
    const quickForm = document.querySelector('.quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData);
            
            // Simple validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#dc2626';
                    isValid = false;
                } else {
                    field.style.borderColor = '#e5e7eb';
                }
            });
            
            if (isValid) {
                // Show success message
                showMessage('Thank you! We will contact you within 24 hours.', 'success');
                this.reset();
            } else {
                showMessage('Please fill in all required fields.', 'error');
            }
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.practice-card, .feature, .result-card');
    animateElements.forEach(el => observer.observe(el));

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }
            e.target.value = value;
        });
    });

    // Practice area cards hover effect
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Results counter animation
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        const amount = card.querySelector('.result-amount');
        const finalAmount = amount.textContent;
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(amount, finalAmount);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(card);
    });

    // Header background change on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.navbar');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
});

// Helper function to show messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 5px;
        font-weight: 600;
        text-align: center;
        ${type === 'success' ? 
            'background-color: #d1fae5; color: #065f46; border: 1px solid #10b981;' : 
            'background-color: #fee2e2; color: #991b1b; border: 1px solid #ef4444;'
        }
    `;
    
    // Insert message
    const form = document.querySelector('.quick-form');
    form.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Counter animation function
function animateCounter(element, finalValue) {
    const prefix = finalValue.match(/[^\d.]/g)?.[0] || '';
    const suffix = finalValue.match(/[^\d.]$/)?.[0] || '';
    const number = parseFloat(finalValue.replace(/[^\d.]/g, ''));
    
    let current = 0;
    const increment = number / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        let displayValue = current.toFixed(1);
        if (number >= 1000000) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            displayValue = (current / 1000).toFixed(0) + 'K';
        }
        
        element.textContent = prefix + displayValue + suffix;
    }, 20);
}

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}