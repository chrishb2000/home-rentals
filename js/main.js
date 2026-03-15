/* ========================================
   PREMIER HOME RENTALS - MAIN JAVASCRIPT
   Professional Real Estate Website
   Developed by Christian Herencia
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // LANGUAGE SWITCHER
    // ========================================
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Set initial language
    setLanguage(currentLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('preferredLanguage', lang);
        });
    });
    
    function setLanguage(lang) {
        // Update button states
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang === 'es' ? 'es' : 'en';
        
        // Update all translatable elements
        document.querySelectorAll('[data-en][data-es]').forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Preserve HTML for elements that might have nested tags
                if (element.tagName === 'P' || element.tagName === 'H1' || 
                    element.tagName === 'H2' || element.tagName === 'H3' ||
                    element.tagName === 'H4' || element.tagName === 'SPAN') {
                    element.textContent = text;
                } else {
                    element.innerHTML = text;
                }
            }
        });
        
        // Update title
        const titleEn = document.querySelector('title').getAttribute('data-en');
        const titleEs = document.querySelector('title').getAttribute('data-es');
        if (titleEn && titleEs) {
            document.title = lang === 'es' ? titleEs : titleEn;
        }
    }
    
    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Scroll to top button visibility
        const scrollTopBtn = document.getElementById('scrollTop');
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // ========================================
    // HERO CAROUSEL
    // ========================================
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    const carouselDots = document.getElementById('carouselDots');
    
    let currentSlide = 0;
    let carouselInterval;
    
    if (carouselSlides.length > 0) {
        // Create dots
        carouselSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.carousel-dot');
        
        function updateCarousel() {
            carouselSlides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
                dots[index].classList.toggle('active', index === currentSlide);
            });
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
            resetCarouselInterval();
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
            updateCarousel();
        }
        
        function startCarouselInterval() {
            carouselInterval = setInterval(nextSlide, 5000);
        }
        
        function resetCarouselInterval() {
            clearInterval(carouselInterval);
            startCarouselInterval();
        }
        
        // Event listeners
        if (carouselNext) {
            carouselNext.addEventListener('click', function() {
                nextSlide();
                resetCarouselInterval();
            });
        }
        
        if (carouselPrev) {
            carouselPrev.addEventListener('click', function() {
                prevSlide();
                resetCarouselInterval();
            });
        }
        
        // Start carousel
        startCarouselInterval();
        
        // Pause on hover
        const heroCarousel = document.getElementById('heroCarousel');
        if (heroCarousel) {
            heroCarousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
            heroCarousel.addEventListener('mouseleave', startCarouselInterval);
        }
    }
    
    // ========================================
    // SCROLL TO TOP
    // ========================================
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ========================================
    // FADE IN ANIMATION ON SCROLL
    // ========================================
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'message'];
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            // Email validation
            const emailInput = this.querySelector('[name="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                isValid = false;
                emailInput.style.borderColor = 'red';
            }
            
            if (isValid) {
                // Show success message (in production, send to server)
                showNotification(
                    currentLang === 'es' ? 
                    '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.' : 
                    'Message sent successfully! We will contact you soon.',
                    'success'
                );
                contactForm.reset();
            } else {
                showNotification(
                    currentLang === 'es' ?
                    'Por favor complete todos los campos requeridos.' :
                    'Please fill in all required fields.',
                    'error'
                );
            }
        });
        
        // Remove error styling on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }
    
    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ========================================
    // COOKIE BANNER
    // ========================================
    function checkCookieConsent() {
        const hasConsent = localStorage.getItem('cookieConsent');
        
        if (!hasConsent) {
            showCookieBanner();
        }
    }
    
    function showCookieBanner() {
        const banner = document.createElement('div');
        banner.classList.add('cookie-banner');
        banner.innerHTML = `
            <p data-en="We use cookies to improve your experience. By using our website, you agree to our use of cookies."
               data-es="Usamos cookies para mejorar su experiencia. Al usar nuestro sitio web, usted acepta nuestro uso de cookies.">
                We use cookies to improve your experience. By using our website, you agree to our use of cookies.
            </p>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary" id="acceptCookies" 
                    data-en="Accept" data-es="Aceptar">Accept</button>
                <a href="cookie-policy.html" class="btn btn-secondary" 
                    data-en="Learn More" data-es="Más Información">Learn More</a>
            </div>
        `;
        
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #1a202c;
            color: white;
            padding: 20px;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(banner);
        
        // Update text based on current language
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const bannerText = banner.querySelector('p');
        bannerText.textContent = bannerText.getAttribute(`data-${lang}`);
        banner.querySelector('#acceptCookies').textContent = 
            banner.querySelector('#acceptCookies').getAttribute(`data-${lang}`);
        banner.querySelector('.btn-secondary').textContent = 
            banner.querySelector('.btn-secondary').getAttribute(`data-${lang}`);
        
        // Accept cookies
        document.getElementById('acceptCookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'true');
            banner.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => banner.remove(), 300);
        });
    }
    
    checkCookieConsent();
    
    // ========================================
    // PROPERTY FILTER (for rents.html)
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            propertyCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
    
    // ========================================
    // PROPERTY SEARCH (for rents.html)
    // ========================================
    const searchInput = document.getElementById('propertySearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            propertyCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const location = card.querySelector('.property-location').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || location.includes(searchTerm)) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    }
    
    // ========================================
    // IMAGE GALLERY (for view-rent.html)
    // ========================================
    const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
    const mainImage = document.getElementById('mainGalleryImage');
    
    if (galleryThumbnails.length > 0 && mainImage) {
        galleryThumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.src;
                
                // Update active state
                galleryThumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // ========================================
    // CONTACT INFO FROM IMAGE
    // Based on the image with contact details
    // ========================================
    const contactEmail = 'office@premierlogistics.info';
    const contactPhones = ['+1 848-342-5250', '+1 848-342-8741'];
    
    // ========================================
    // LAZY LOADING FOR IMAGES
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ========================================
    // PARALLAX EFFECT (optional enhancement)
    // ========================================
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // ========================================
    // FORMATTING PHONE NUMBERS
    // ========================================
    function formatPhoneNumber(phone) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    
    // ========================================
    // INITIALIZE
    // ========================================
    console.log('Premier Home Rentals - Website Loaded Successfully');
    console.log('Developed by Christian Herencia - https://christian-freelance.us/');
});

// ========================================
// GLOBAL FUNCTIONS
// ========================================

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'en';
}

// Translate text
function translateText(textEn, textEs) {
    return getCurrentLanguage() === 'es' ? textEs : textEn;
}
