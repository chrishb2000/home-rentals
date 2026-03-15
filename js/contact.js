/* ========================================
   CONTACT PAGE JAVASCRIPT
   Premier Home Rentals
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Update placeholders based on language
        updateFormPlaceholders();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'message', 'privacy'];
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (field === 'privacy') {
                    if (!input.checked) {
                        isValid = false;
                        input.parentElement.style.color = '#ef4444';
                    } else {
                        input.parentElement.style.color = '';
                    }
                } else {
                    if (!data[field] || data[field].trim() === '') {
                        isValid = false;
                        input.style.borderColor = '#ef4444';
                    } else {
                        input.style.borderColor = '';
                    }
                }
            });
            
            // Email validation
            const emailInput = this.querySelector('[name="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
            }
            
            if (isValid) {
                const lang = getCurrentLanguage();
                
                // Show success message
                showNotification(
                    lang === 'es' ? 
                    '¡Mensaje enviado con éxito! Nos pondremos en contacto con usted pronto.' : 
                    'Message sent successfully! We will contact you soon.',
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                
                // In production, send to server here
                console.log('Contact form submitted:', data);
                
                // Simulate sending to server
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
            } else {
                const lang = getCurrentLanguage();
                showNotification(
                    lang === 'es' ?
                    'Por favor complete todos los campos requeridos y acepte la política de privacidad.' :
                    'Please fill in all required fields and accept the privacy policy.',
                    'error'
                );
            }
        });
        
        // Remove error styling on input
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
        
        contactForm.querySelector('[name="privacy"]').addEventListener('change', function() {
            this.parentElement.style.color = '';
        });
    }
    
    // ========================================
    // UPDATE FORM PLACEHOLDERS ON LANGUAGE CHANGE
    // ========================================
    function updateFormPlaceholders() {
        const lang = getCurrentLanguage();
        
        contactForm?.querySelectorAll('[data-placeholder-en]').forEach(input => {
            const placeholder = input.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
        
        // Update static text
        contactForm?.querySelectorAll('[data-en][data-es]').forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                element.textContent = text;
            }
        });
    }
    
    // Listen for language changes
    document.addEventListener('languageChanged', function() {
        updateFormPlaceholders();
    });
    
    // ========================================
    // FAQ ACCORDION (Optional Enhancement)
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.style.cursor = 'pointer';
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = '0';
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
    
    // ========================================
    // FORMATTING PHONE NUMBER INPUT
    // ========================================
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 6) {
                value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{1})(\d{3})(\d{0,3})/, '+$1 ($2) $3');
            } else if (value.length > 0) {
                value = value.replace(/(\d{0,1})/, '+$1');
            }
            
            e.target.value = value;
        });
    }
    
    // ========================================
    // GOOGLE MAPS ENHANCEMENT (Optional)
    // ========================================
    function openMapInGoogle(address) {
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
    
    // ========================================
    // INITIALIZE
    // ========================================
    console.log('Contact page loaded successfully');
});

// ========================================
// HELPER FUNCTIONS
// ========================================

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('preferredLanguage') || 'en';
}

// Show notification
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
