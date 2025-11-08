// FAQ Toggle Functionality
class FAQToggle {
    constructor() {
        this.init();
    }

    init() {
        console.log('FAQ Toggle initializing...');
        this.bindEvents();
        this.setupKeyboardNavigation();
        console.log('FAQ Toggle initialized successfully');
    }

    bindEvents() {
        // Get all FAQ question buttons
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        console.log('Found FAQ questions:', faqQuestions.length);
        
        faqQuestions.forEach(button => {
            button.addEventListener('click', (e) => this.toggleFAQ(e));
        });
    }

    toggleFAQ(event) {
        const button = event.currentTarget;
        const answerId = button.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        console.log('Toggling FAQ:', answerId, 'Currently expanded:', isExpanded);
        
        if (!answer) {
            console.error('FAQ answer element not found:', answerId);
            return;
        }
        
        // Close all other FAQs in the same category (optional - remove if you want multiple open)
        this.closeOtherFAQs(button);
        
        if (isExpanded) {
            // Close this FAQ
            this.closeFAQ(button, answer);
        } else {
            // Open this FAQ
            this.openFAQ(button, answer);
        }
    }

    openFAQ(button, answer) {
        // Update ARIA attributes
        button.setAttribute('aria-expanded', 'true');
        answer.setAttribute('aria-hidden', 'false');
        
        // Add expanded class for animation
        answer.classList.add('expanded');
        
        // Calculate and set max-height for smooth animation
        const content = answer.querySelector('.faq-content');
        if (content) {
            const contentHeight = content.scrollHeight;
            answer.style.maxHeight = `${contentHeight + 40}px`; // Add padding
        }
        
        console.log('Opened FAQ:', button.getAttribute('aria-controls'));
    }

    closeFAQ(button, answer) {
        // Update ARIA attributes
        button.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        
        // Remove expanded class and reset max-height
        answer.classList.remove('expanded');
        answer.style.maxHeight = '0';
        
        console.log('Closed FAQ:', button.getAttribute('aria-controls'));
    }

    closeOtherFAQs(currentButton) {
        // Find the category container
        const category = currentButton.closest('.faq-category');
        if (!category) return;
        
        // Get all FAQ buttons in this category
        const categoryButtons = category.querySelectorAll('.faq-question');
        
        categoryButtons.forEach(button => {
            if (button !== currentButton && button.getAttribute('aria-expanded') === 'true') {
                const answerId = button.getAttribute('aria-controls');
                const answer = document.getElementById(answerId);
                if (answer) {
                    this.closeFAQ(button, answer);
                }
            }
        });
    }

    setupKeyboardNavigation() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(button => {
            button.addEventListener('keydown', (e) => {
                // Handle Enter and Space keys
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFAQ(e);
                }
                
                // Handle Arrow keys for navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateToNextFAQ(button, e.key === 'ArrowDown');
                }
            });
        });
    }

    navigateToNextFAQ(currentButton, moveDown) {
        const allButtons = Array.from(document.querySelectorAll('.faq-question'));
        const currentIndex = allButtons.indexOf(currentButton);
        
        let nextIndex;
        if (moveDown) {
            nextIndex = currentIndex + 1 >= allButtons.length ? 0 : currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1 < 0 ? allButtons.length - 1 : currentIndex - 1;
        }
        
        const nextButton = allButtons[nextIndex];
        if (nextButton) {
            nextButton.focus();
        }
    }

    // Public method to open all FAQs
    openAll() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(button => {
            const answerId = button.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            if (answer && button.getAttribute('aria-expanded') === 'false') {
                this.openFAQ(button, answer);
            }
        });
    }

    // Public method to close all FAQs
    closeAll() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(button => {
            const answerId = button.getAttribute('aria-controls');
            const answer = document.getElementById(answerId);
            if (answer && button.getAttribute('aria-expanded') === 'true') {
                this.closeFAQ(button, answer);
            }
        });
    }
}

// Initialize FAQ functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing FAQ...');
    window.faqToggle = new FAQToggle();
});

// Handle window resize to recalculate heights
window.addEventListener('resize', function() {
    const expandedAnswers = document.querySelectorAll('.faq-answer.expanded');
    expandedAnswers.forEach(answer => {
        const content = answer.querySelector('.faq-content');
        if (content) {
            const contentHeight = content.scrollHeight;
            answer.style.maxHeight = `${contentHeight + 40}px`;
        }
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FAQToggle;
}