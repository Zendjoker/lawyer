// Contact Form Component JavaScript
class ContactForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7;
        this.formData = {};
        this.init();
    }

    init() {
        console.log('ContactForm initializing...');
        this.bindEvents();
        this.updateProgress();
        this.initializeConditionalLogic();
        console.log('ContactForm initialized successfully');
    }

    bindEvents() {
        // Navigation buttons
        const nextButtons = document.querySelectorAll('.btn-next');
        const prevButtons = document.querySelectorAll('.btn-prev');
        
        console.log('Found next buttons:', nextButtons.length);
        console.log('Found prev buttons:', prevButtons.length);
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextStep();
            });
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.prevStep();
            });
        });

        // Form submission
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Case type change for conditional logic
        document.querySelectorAll('input[name="caseType"]').forEach(input => {
            input.addEventListener('change', () => this.handleCaseTypeChange());
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        // Real-time validation
        this.bindValidationEvents();
    }

    bindValidationEvents() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    nextStep() {
        console.log('nextStep called, current step:', this.currentStep);
        if (this.validateCurrentStep()) {
            console.log('Validation passed, proceeding to next step');
            this.saveCurrentStepData();
            
            // Handle conditional logic for physical injuries step
            if (this.currentStep === 2 && !this.shouldShowPhysicalInjuries()) {
                this.currentStep += 2; // Skip step 3
                console.log('Skipping physical injuries step, jumping to step:', this.currentStep);
            } else {
                this.currentStep++;
                console.log('Moving to next step:', this.currentStep);
            }
            
            if (this.currentStep <= this.totalSteps) {
                this.showStep(this.currentStep);
                this.updateProgress();
            }
        } else {
            console.log('Validation failed, staying on current step');
        }
    }

    prevStep() {
        this.saveCurrentStepData();
        
        // Handle conditional logic for going back
        if (this.currentStep === 4 && !this.shouldShowPhysicalInjuries()) {
            this.currentStep -= 2; // Skip step 3
        } else {
            this.currentStep--;
        }
        
        if (this.currentStep >= 1) {
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            const progressPercentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return false;

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for radio groups
        const radioGroups = this.getRadioGroupsInStep(currentStepElement);
        radioGroups.forEach(groupName => {
            const radioButtons = currentStepElement.querySelectorAll(`input[name="${groupName}"]`);
            const isGroupRequired = Array.from(radioButtons).some(radio => radio.hasAttribute('required'));
            
            if (isGroupRequired) {
                const isChecked = Array.from(radioButtons).some(radio => radio.checked);
                if (!isChecked) {
                    this.showError(radioButtons[0], 'Please select an option');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    validateField(field) {
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Handle different field types
        if (field.type === 'checkbox') {
            // Checkbox validation
            if (field.hasAttribute('required') && !field.checked) {
                errorMessage = 'This field is required';
                isValid = false;
            }
        } else {
            const value = field.value.trim();
            
            // Required field validation
            if (field.hasAttribute('required') && !value) {
                errorMessage = 'This field is required';
                isValid = false;
            }

            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
            }

            // Phone validation
            if (field.type === 'tel' && value) {
                const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
                if (!phoneRegex.test(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    showError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        // Add error class to field
        field.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;

        // Insert error message after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);

        // Add error styles if not already present
        if (!document.querySelector('#form-error-styles')) {
            const style = document.createElement('style');
            style.id = 'form-error-styles';
            style.textContent = `
                .error {
                    border-color: #ef4444 !important;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
                }
                .field-error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    display: block;
                }
            `;
            document.head.appendChild(style);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    getRadioGroupsInStep(stepElement) {
        const radioButtons = stepElement.querySelectorAll('input[type="radio"]');
        const groups = new Set();
        radioButtons.forEach(radio => {
            if (radio.name) {
                groups.add(radio.name);
            }
        });
        return Array.from(groups);
    }

    initializeConditionalLogic() {
        // Initialize the conditional step visibility
        this.updateStepIndicators();
    }

    shouldShowPhysicalInjuries() {
        const caseTypeInput = document.querySelector('input[name="caseType"]:checked');
        return caseTypeInput && caseTypeInput.value === 'personal-injury';
    }

    handleCaseTypeChange() {
        // Update step numbering based on whether physical injuries step should be shown
        this.updateStepIndicators();
    }

    updateStepIndicators() {
        const shouldShow = this.shouldShowPhysicalInjuries();
        const physicalInjuriesStep = document.querySelector('[data-step="3"]');
        
        if (physicalInjuriesStep) {
            if (!shouldShow) {
                physicalInjuriesStep.style.display = 'none';
            } else {
                physicalInjuriesStep.style.display = 'block';
            }
        }
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return;

        const formElements = currentStepElement.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            if (element.type === 'radio' || element.type === 'checkbox') {
                if (element.checked) {
                    this.formData[element.name] = element.value;
                }
            } else {
                this.formData[element.name] = element.value;
            }
        });
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0,3)}) ${value.slice(3)}`;
        }
        e.target.value = value;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveCurrentStepData();
        this.showLoadingState();

        try {
            // Simulate API call
            await this.submitForm();
            this.showSuccessMessage();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('There was an error submitting your form. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async submitForm() {
        try {
            // Send form data to PHP backend
            const response = await fetch('/submit-form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to submit form');
            }

            console.log('📋 Form submitted successfully');
            console.log('Response:', result);
            
            return result;
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Log the form data for debugging
            console.log('📋 Form Data (not submitted):');
            console.log('=================================');
            Object.entries(this.formData).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
            console.log('=================================');
            
            throw error;
        }
    }

    showSuccessMessage() {
        console.log('Showing success message...');
        
        // Hide form steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.style.display = 'none';
        });

        // Show success message
        const successElement = document.querySelector('.form-success');
        if (successElement) {
            successElement.classList.remove('hidden');
            successElement.classList.add('show');
            console.log('Success message displayed');
        } else {
            console.error('Success element not found');
        }

        // Update progress to 100%
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = '100%';
            progressText.textContent = '100% Completed';
            console.log('Progress updated to 100%');
        }
        
        // Keep progress bar visible for success state
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
    }

    showErrorMessage(message) {
        // Create or update error message
        let errorElement = document.querySelector('.form-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error-message';
            errorElement.style.cssText = `
                background-color: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
            `;
            
            const currentStep = document.querySelector('.form-step.active');
            if (currentStep) {
                currentStep.insertBefore(errorElement, currentStep.firstChild);
            }
        }
        
        errorElement.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorElement) {
                errorElement.remove();
            }
        }, 5000);
    }
}

// Initialize contact form when called manually (for dynamic loading)
// Note: Don't auto-initialize since we're loading dynamically

// Global initialization function for dynamic loading
window.initContactForm = function() {
    console.log('Initializing ContactForm globally...');
    if (document.getElementById('contactForm')) {
        window.contactFormInstance = new ContactForm();
        console.log('ContactForm instance created and assigned to window.contactFormInstance');
    } else {
        console.error('Contact form element not found in DOM');
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}