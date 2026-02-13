/**
 * 织り生 (Orise) - Main JavaScript
 * Intersection Observer for elegant fade-in animations (1.0s)
 * Smooth scroll functionality
 * Navbar scroll effect
 */

(function() {
    'use strict';

    // ============================================
    // Intersection Observer for Fade-in Animation (1.0s)
    // ============================================
    const initFadeInAnimation = () => {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (fadeElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation with delay
                    setTimeout(() => {
                        entry.target.classList.add('fade-in-visible');
                    }, index * 100);
                    // Optional: Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    };

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    const initSmoothScroll = () => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip empty hash or just "#"
                if (!href || href === '#') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ============================================
    // Navbar Scroll Effect (Transparent to Blurred)
    // ============================================
    const initNavbarScroll = () => {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        const handleScroll = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        };

        // Initial check
        handleScroll();

        // Throttle scroll event for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    };

    // ============================================
    // Initialize on DOM Content Loaded
    // ============================================
    const init = () => {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initFadeInAnimation();
                initSmoothScroll();
                initNavbarScroll();
            });
        } else {
            // DOM is already loaded
            initFadeInAnimation();
            initSmoothScroll();
            initNavbarScroll();
        }
    };

    // Start initialization
    init();

})();
