// Modern Hamburger Menu JavaScript
class HamburgerMenu {
    constructor() {
        if (window.hamburgerMenuInitialized) {
            console.log('Hamburger menu already initialized');
            return;
        }
        
        this.hamburgerBtn = document.getElementById('hamburger-menu');
        this.mobileOverlay = document.getElementById('mobile-menu-overlay');
        this.closeBtn = document.getElementById('mobile-menu-close');
        this.dropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
        this.body = document.body;
        
        if (this.hamburgerBtn && this.mobileOverlay) {
            console.log('Hamburger menu elements found, initializing...');
            this.init();
            window.hamburgerMenuInitialized = true;
        } else {
            console.error('Required hamburger menu elements not found');
        }
    }
    
    init() {
        console.log('Hamburger menu initialized');
        this.bindEvents();
        this.handleResize();
    }
    
    bindEvents() {
        // Hamburger button click
        this.hamburgerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Hamburger button clicked');
            this.toggleMenu();
        });
        
        // Close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Close button clicked');
                this.closeMenu();
            });
        }
        
        // Overlay click to close
        this.mobileOverlay.addEventListener('click', (e) => {
            if (e.target === this.mobileOverlay) {
                console.log('Overlay clicked');
                this.closeMenu();
            }
        });
        
        // Mobile dropdown toggles
        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown(toggle);
            });
        });
        
        // Close menu when clicking on mobile nav links (except dropdowns)
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu when clicking on submenu links
        const submenuLinks = document.querySelectorAll('.mobile-submenu-link');
        submenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Handle ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    toggleMenu() {
        console.log('Toggle menu called, isOpen:', this.isMenuOpen());
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        console.log('Opening mobile menu');
        this.hamburgerBtn.classList.add('active');
        this.mobileOverlay.classList.add('active');
        this.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        setTimeout(() => {
            const firstFocusableElement = this.mobileOverlay.querySelector('button, a');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }, 100);
    }
    
    closeMenu() {
        console.log('Closing mobile menu');
        this.hamburgerBtn.classList.remove('active');
        this.mobileOverlay.classList.remove('active');
        this.body.style.overflow = '';
        
        // Close all dropdowns
        this.closeAllDropdowns();
        
        // Return focus to hamburger button
        setTimeout(() => {
            this.hamburgerBtn.focus();
        }, 100);
    }
    
    isMenuOpen() {
        return this.mobileOverlay.classList.contains('active');
    }
    
    toggleDropdown(toggle) {
        const parentItem = toggle.closest('.has-submenu');
        const isActive = parentItem.classList.contains('active');
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        // Toggle current dropdown
        if (!isActive) {
            parentItem.classList.add('active');
            
            // Smooth scroll to make sure dropdown is visible
            setTimeout(() => {
                const submenu = parentItem.querySelector('.mobile-submenu');
                if (submenu) {
                    submenu.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }
            }, 100);
        }
    }
    
    closeAllDropdowns() {
        const activeDropdowns = document.querySelectorAll('.has-submenu.active');
        activeDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    handleResize() {
        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth > 968 && this.isMenuOpen()) {
            this.closeMenu();
        }
    }
}

// Initialize hamburger menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing hamburger menu...');
    
    // Simple immediate initialization
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    
    if (hamburgerBtn && mobileOverlay) {
        console.log('Hamburger elements found immediately');
        new HamburgerMenu();
    } else {
        console.log('Elements not found, waiting...');
        // Retry after a short delay
        setTimeout(() => {
            const hamburgerBtn2 = document.getElementById('hamburger-menu');
            const mobileOverlay2 = document.getElementById('mobile-menu-overlay');
            if (hamburgerBtn2 && mobileOverlay2) {
                console.log('Hamburger elements found after delay');
                new HamburgerMenu();
            } else {
                console.error('Hamburger menu elements not found after delay');
            }
        }, 500);
    }
});

// Also try to initialize after window load
window.addEventListener('load', () => {
    console.log('Window loaded, checking hamburger menu...');
    if (!window.hamburgerMenuInitialized) {
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        if (hamburgerBtn && mobileOverlay) {
            console.log('Initializing hamburger menu on window load');
            new HamburgerMenu();
        }
    }
});

// Handle navbar scroll behavior
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.topBar = document.querySelector('.top-bar');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        if (!this.navbar) return;
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add shadow when scrolled
        if (currentScrollY > 10) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Initialize navbar scroll behavior
document.addEventListener('DOMContentLoaded', () => {
    new NavbarScroll();
});

// Desktop dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        let timeout;
        
        // Mouse enter
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            dropdown.classList.add('active');
        });
        
        // Mouse leave with delay
        dropdown.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                dropdown.classList.remove('active');
            }, 150);
        });
        
        // Keyboard navigation
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdown.classList.toggle('active');
            } else if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                toggle.focus();
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Function to load navbar component
function loadNavbar() {
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Add loading states and error handling
window.addEventListener('load', () => {
    // Remove any loading classes
    document.body.classList.remove('loading');
    
    // Ensure navbar is properly positioned
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.visibility = 'visible';
    }
});