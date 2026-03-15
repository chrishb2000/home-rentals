/* ========================================
   VIEW RENT PAGE JAVASCRIPT
   Premier Home Rentals
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // IMAGE GALLERY FUNCTIONALITY
    // ========================================
    const galleryThumbnails = document.querySelectorAll('.gallery-thumbnail');
    const mainGalleryImage = document.getElementById('mainGalleryImage');
    const heroImage = document.getElementById('heroImage');
    
    if (galleryThumbnails.length > 0 && mainGalleryImage) {
        galleryThumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image with fade effect
                mainGalleryImage.style.opacity = '0';
                
                setTimeout(() => {
                    mainGalleryImage.src = this.src;
                    mainGalleryImage.style.opacity = '1';
                }, 200);
                
                // Update active state
                galleryThumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Add transition to main image
        mainGalleryImage.style.transition = 'opacity 0.2s ease';
    }
    
    // ========================================
    // PROPERTY CONTACT FORM
    // ========================================
    const propertyContactForm = document.getElementById('propertyContactForm');
    
    if (propertyContactForm) {
        // Update placeholders based on language
        updateFormPlaceholders();
        
        propertyContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation
            let isValid = true;
            const requiredFields = ['name', 'email', 'message'];
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
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
                // Get property info
                const propertyTitle = document.getElementById('propertyTitle')?.textContent || 'Property';
                const lang = getCurrentLanguage();
                
                // Show success message
                showNotification(
                    lang === 'es' ? 
                    `¡Gracias por tu interés en ${propertyTitle}! Nos pondremos en contacto pronto.` : 
                    `Thank you for your interest in ${propertyTitle}! We will contact you soon.`,
                    'success'
                );
                
                // Reset form
                propertyContactForm.reset();
                
                // In production, send to server here
                console.log('Form submitted:', {
                    property: propertyTitle,
                    ...data
                });
            } else {
                const lang = getCurrentLanguage();
                showNotification(
                    lang === 'es' ?
                    'Por favor complete todos los campos requeridos.' :
                    'Please fill in all required fields.',
                    'error'
                );
            }
        });
        
        // Remove error styling on input
        propertyContactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }
    
    // ========================================
    // UPDATE FORM PLACEHOLDERS ON LANGUAGE CHANGE
    // ========================================
    function updateFormPlaceholders() {
        const lang = getCurrentLanguage();
        
        propertyContactForm?.querySelectorAll('[data-placeholder-en]').forEach(input => {
            const placeholder = input.getAttribute(`data-placeholder-${lang}`);
            if (placeholder) {
                input.placeholder = placeholder;
            }
        });
    }
    
    // Listen for language changes
    document.addEventListener('languageChanged', function() {
        updateFormPlaceholders();
    });
    
    // ========================================
    // PROPERTY ID FROM URL (for dynamic content)
    // ========================================
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (propertyId) {
        // In production, fetch property data from API
        // For now, we'll just log it
        console.log('Viewing property ID:', propertyId);
        
        // Example: Load property data dynamically
        // loadPropertyData(propertyId);
    }
    
    // ========================================
    // SCHEDULE VIEWING MODAL (Optional Enhancement)
    // ========================================
    function showScheduleModal() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>Schedule a Viewing</h2>
                <form id="scheduleForm">
                    <!-- Form fields -->
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // ========================================
    // PRINT PROPERTY FUNCTION
    // ========================================
    function printProperty() {
        window.print();
    }
    
    // ========================================
    // SHARE PROPERTY FUNCTION
    // ========================================
    function shareProperty() {
        if (navigator.share) {
            navigator.share({
                title: document.getElementById('propertyTitle')?.textContent || 'Property',
                text: 'Check out this amazing property!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard!', 'success');
        }
    }
    
    // ========================================
    // INITIALIZE
    // ========================================
    console.log('View Rent page loaded successfully');
    
    // Add print and share buttons (optional enhancement)
    // These could be added to the UI for better user experience
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
