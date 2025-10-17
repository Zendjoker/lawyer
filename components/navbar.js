// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const topBar = document.querySelector('.top-bar');
        
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.webkitBackdropFilter = 'blur(10px)';
            navbar.style.backdropFilter = 'blur(10px)';
            // Hide top bar when scrolling down
            if (topBar) {
                topBar.classList.add('hidden');
            }
        } else {
            navbar.style.backgroundColor = '#ffffff';
            navbar.style.webkitBackdropFilter = 'none';
            navbar.style.backdropFilter = 'none';
            // Show top bar when at the top
            if (topBar) {
                topBar.classList.remove('hidden');
            }
        }
    });

    // Dropdown menu functionality for mobile
    const dropdownItems = document.querySelectorAll('.dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const menu = item.querySelector('.dropdown-menu');
        
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
        }
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