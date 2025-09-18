// Enhanced JavaScript for Techniki Website

// Utility Functions
const utils = {
    // Throttle function for performance optimization
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Debounce function for performance optimization
    debounce: (func, wait, immediate) => {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main Initialization Function
function initializeWebsite() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeTypewriter();
    initializeParallax();
    initializeLazyLoading();
    initializeFormValidation();
    populateFooterLinks();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();
    
    console.log('🚀 Techniki website initialized successfully!');
}

// Navigation Enhancement
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    
    if (!navbar || !mobileMenu || !menuButton) return;

    // Mobile menu toggle function
    function toggleMobileMenu(isOpen) {
        if (isOpen) {
            mobileMenu.classList.remove('mobile-menu-closed');
            mobileMenu.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden';
            menuButton.querySelector('i').classList.remove('fa-bars');
            menuButton.querySelector('i').classList.add('fa-times');
            menuButton.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            // Focus first menu item for keyboard navigation
            const firstLink = mobileMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            mobileMenu.classList.remove('mobile-menu-open');
            mobileMenu.classList.add('mobile-menu-closed');
            document.body.style.overflow = 'auto';
            menuButton.querySelector('i').classList.remove('fa-times');
            menuButton.querySelector('i').classList.add('fa-bars');
            menuButton.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            // Return focus to menu button
            menuButton.focus();
        }
    }

    // Mobile menu toggle
    menuButton.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('mobile-menu-open');
        toggleMobileMenu(!isOpen);
    });

    // Close button event handler
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            toggleMobileMenu(false);
        });
    }

    // Close mobile menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu(false);
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu-open')) {
            toggleMobileMenu(false);
        }
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            toggleMobileMenu(false);
        }
    });

    // Prevent body scroll on mobile when menu is open
    let touchStartY = 0;
    mobileMenu.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mobileMenu.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchY - touchStartY;
        
        // If at top and trying to scroll up, or at bottom and trying to scroll down
        if ((mobileMenu.scrollTop === 0 && touchDiff > 0) || 
            (mobileMenu.scrollHeight - mobileMenu.clientHeight <= mobileMenu.scrollTop && touchDiff < 0)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Navbar scroll effect
    window.addEventListener('scroll', utils.throttle(function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'none';
        }
    }, 100));

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', utils.throttle(function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// Advanced Animations
function initializeAnimations() {
    // GSAP Timeline for hero section
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        tl.from('.hero-content h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.hero-content p', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.8')
        .from('.hero-content .hero-btn', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out'
        }, '-=0.6');

        // Floating elements animation
        gsap.to('.floating-particles .particle', {
            y: 'random(-20, 20)',
            x: 'random(-10, 10)',
            rotation: 'random(-180, 180)',
            duration: 'random(3, 6)',
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            stagger: 0.5
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.mission-card, .domain-card, .team-member').forEach(el => {
        observer.observe(el);
    });
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    let isAnimated = false;

    const animateCounters = () => {
        if (isAnimated) return;
        isAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };

            updateCounter();
        });
    };

    // Trigger animation when stats section is visible
    const statsSection = document.querySelector('[data-count]')?.closest('section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const texts = [
        'Innovation Through Technology',
        'Community-Driven Learning',
        'Building the Future Together',
        'Empowering Tech Enthusiasts'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500; // Pause before starting new text
        }

        setTimeout(typeWriter, speed);
    }

    typeWriter();
}

// Parallax Effects
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', utils.throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Floating particles parallax
        const particles = document.querySelector('.floating-particles');
        if (particles) {
            particles.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, 16)); // ~60fps
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    showInputError(input, 'This field is required');
                    isValid = false;
                } else {
                    clearInputError(input);
                }
                
                // Email validation
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        showInputError(input, 'Please enter a valid email');
                        isValid = false;
                    }
                }
            });
            
            if (isValid) {
                // Submit form (placeholder)
                showSuccessMessage('Form submitted successfully!');
                form.reset();
            }
        });
    });
}

// Helper functions for form validation
function showInputError(input, message) {
    const errorElement = input.nextElementSibling?.classList.contains('error-message') 
        ? input.nextElementSibling 
        : document.createElement('div');
    
    if (!errorElement.classList.contains('error-message')) {
        errorElement.className = 'error-message text-red-400 text-sm mt-1';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = message;
    input.classList.add('border-red-400');
}

function clearInputError(input) {
    const errorElement = input.nextElementSibling;
    if (errorElement?.classList.contains('error-message')) {
        errorElement.remove();
    }
    input.classList.remove('border-red-400');
}

function showSuccessMessage(message) {
    // Create and show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Footer Links Population
// Footer links are now statically defined in HTML
function populateFooterLinks() {
    // Footer links are handled statically in the HTML
    console.log('📋 Footer links loaded from HTML');
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Preload critical resources
    const criticalResources = [
        'styles.css',
        'logo.png'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        document.head.appendChild(link);
    });

    // Service Worker registration for caching
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error to analytics service
});

// Enhanced Loading State
window.addEventListener('load', function() {
    // Hide loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
    
    // Initialize any post-load animations
    document.body.classList.add('loaded');
});

// Accessibility Enhancements
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.style.transform === 'translateY(0%)') {
            const menuButton = document.getElementById('menu-button');
            menuButton.click();
        }
    }
});

// Export for potential external use
window.TechnikiWebsite = {
    utils,
    initializeWebsite,
    initializeNavigation,
    initializeAnimations,
    initializeCounters
};
