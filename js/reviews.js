// Reviews Page Functionality
class ReviewsManager {
    constructor() {
        this.currentFilter = 'all';
        this.visibleReviews = 6; // Initial number of reviews to show
        this.reviewsPerLoad = 3; // Number of reviews to load each time
        this.init();
    }

    init() {
        console.log('Reviews Manager initializing...');
        this.bindEvents();
        this.filterReviews('all');
        this.updateLoadMoreButton();
        console.log('Reviews Manager initialized successfully');
    }

    bindEvents() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setActiveFilter(e.target);
                this.filterReviews(filter);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreReviews();
            });
        }

        console.log('Review events bound successfully');
    }

    setActiveFilter(activeButton) {
        // Remove active class from all buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        activeButton.classList.add('active');
    }

    filterReviews(filter) {
        this.currentFilter = filter;
        this.visibleReviews = 6; // Reset visible count when filtering
        
        const reviewCards = document.querySelectorAll('.reviews-grid .review-card[data-category]');
        
        reviewCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                // Show cards up to the visible limit
                if (index < this.visibleReviews) {
                    card.classList.remove('hidden');
                    this.animateCardIn(card, index * 100);
                } else {
                    card.classList.add('hidden');
                }
            } else {
                card.classList.add('hidden');
            }
        });

        this.updateLoadMoreButton();
        console.log(`Filtered reviews by: ${filter}`);
    }

    loadMoreReviews() {
        const reviewCards = document.querySelectorAll('.reviews-grid .review-card[data-category]');
        const filteredCards = Array.from(reviewCards).filter(card => {
            const category = card.getAttribute('data-category');
            return this.currentFilter === 'all' || category === this.currentFilter;
        });

        const currentVisible = filteredCards.filter(card => !card.classList.contains('hidden')).length;
        const toShow = Math.min(this.reviewsPerLoad, filteredCards.length - currentVisible);

        for (let i = 0; i < toShow; i++) {
            const cardIndex = currentVisible + i;
            if (cardIndex < filteredCards.length) {
                const card = filteredCards[cardIndex];
                card.classList.remove('hidden');
                this.animateCardIn(card, i * 100);
            }
        }

        this.visibleReviews += toShow;
        this.updateLoadMoreButton();
        
        console.log(`Loaded ${toShow} more reviews`);
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const reviewCards = document.querySelectorAll('.reviews-grid .review-card[data-category]');
        const filteredCards = Array.from(reviewCards).filter(card => {
            const category = card.getAttribute('data-category');
            return this.currentFilter === 'all' || category === this.currentFilter;
        });

        const visibleCards = filteredCards.filter(card => !card.classList.contains('hidden')).length;
        
        if (visibleCards >= filteredCards.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    animateCardIn(card, delay = 0) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    }

    // Method to add a new review (for future use)
    addReview(reviewData) {
        const reviewsGrid = document.getElementById('reviews-grid');
        if (!reviewsGrid) return;

        const reviewCard = this.createReviewCard(reviewData);
        reviewsGrid.appendChild(reviewCard);
        this.animateCardIn(reviewCard);
    }

    createReviewCard(data) {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.setAttribute('data-category', data.category || 'general');
        
        card.innerHTML = `
            <div class="review-header">
                <div class="star-rating">
                    ${this.generateStars(data.rating || 5)}
                </div>
                <div class="review-date">${data.date || 'Recent'}</div>
            </div>
            <div class="review-content">
                <p>${data.content || ''}</p>
            </div>
            <div class="review-footer">
                <div class="client-info">
                    <div class="client-name">${data.clientName || 'Anonymous'}</div>
                    <div class="case-type">${data.caseType || 'General'}</div>
                </div>
                ${data.source ? `
                <div class="review-source">
                    <i class="${data.source.icon || 'fas fa-star'}"></i>
                    ${data.source.name || 'Review'}
                </div>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    // Method to get review statistics
    getReviewStats() {
        const reviewCards = document.querySelectorAll('.reviews-grid .review-card[data-category]');
        const stats = {
            total: reviewCards.length,
            byCategory: {}
        };

        reviewCards.forEach(card => {
            const category = card.getAttribute('data-category');
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        });

        return stats;
    }
}

// Smooth scrolling for anchor links
function smoothScrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize reviews functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Reviews Manager...');
    window.reviewsManager = new ReviewsManager();
    
    // Add smooth scrolling to any anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollToSection(targetId);
        });
    });
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Adjust any responsive elements if needed
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        if (card.style.transition) {
            card.style.transition = 'all 0.3s ease';
        }
    });
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReviewsManager;
}