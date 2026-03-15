/* ========================================
   RENTS PAGE JAVASCRIPT
   Premier Home Rentals
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // PROPERTY FILTER FUNCTIONALITY
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    const resultsCount = document.getElementById('resultsCount');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProperties(filter);
        });
    });
    
    function filterProperties(filter) {
        let visibleCount = 0;
        
        propertyCards.forEach(card => {
            const propertyType = card.getAttribute('data-type');
            
            if (filter === 'all' || propertyType === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        updateResultsCount(visibleCount);
    }
    
    // ========================================
    // PROPERTY SEARCH FUNCTIONALITY
    // ========================================
    const searchInput = document.getElementById('propertySearch');
    
    if (searchInput) {
        // Update placeholder based on language
        updateSearchPlaceholder();
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchProperties(searchTerm);
        });
    }
    
    function searchProperties(searchTerm) {
        let visibleCount = 0;
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        propertyCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const location = card.querySelector('.property-location').textContent.toLowerCase();
            const propertyType = card.getAttribute('data-type');
            
            const matchesSearch = title.includes(searchTerm) || location.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || propertyType === activeFilter;
            
            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        updateResultsCount(visibleCount);
        
        // Show no results message if needed
        if (visibleCount === 0) {
            showNoResults(searchTerm);
        } else {
            hideNoResults();
        }
    }
    
    function updateResultsCount(count) {
        const lang = getCurrentLanguage();
        if (lang === 'es') {
            resultsCount.textContent = `Mostrando ${count} propiedad${count !== 1 ? 'es' : ''}`;
        } else {
            resultsCount.textContent = `Showing ${count} propert${count !== 1 ? 'ies' : 'y'}`;
        }
    }
    
    function showNoResults(searchTerm) {
        let noResultsEl = document.querySelector('.no-results');
        
        if (!noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.classList.add('no-results');
            document.getElementById('propertiesGrid').appendChild(noResultsEl);
        }
        
        const lang = getCurrentLanguage();
        if (lang === 'es') {
            noResultsEl.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No se encontraron propiedades</h3>
                <p>Intenta con otros términos de búsqueda o filtros diferentes.</p>
            `;
        } else {
            noResultsEl.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No properties found</h3>
                <p>Try different search terms or filters.</p>
            `;
        }
    }
    
    function hideNoResults() {
        const noResultsEl = document.querySelector('.no-results');
        if (noResultsEl) {
            noResultsEl.remove();
        }
    }
    
    // ========================================
    // SORT FUNCTIONALITY
    // ========================================
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProperties(this.value);
        });
    }
    
    function sortProperties(sortBy) {
        const grid = document.getElementById('propertiesGrid');
        const cards = Array.from(document.querySelectorAll('.property-card'));
        
        cards.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price-value').textContent.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(b.querySelector('.price-value').textContent.replace(/[^0-9.]/g, ''));
            
            const bedsA = parseInt(a.querySelector('.property-features span:first-child').textContent.trim());
            const bedsB = parseInt(b.querySelector('.property-features span:first-child').textContent.trim());
            
            switch(sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'beds':
                    return bedsB - bedsA;
                default:
                    return 0;
            }
        });
        
        cards.forEach(card => grid.appendChild(card));
    }
    
    // ========================================
    // LANGUAGE UPDATE FOR SEARCH
    // ========================================
    function updateSearchPlaceholder() {
        const lang = getCurrentLanguage();
        const placeholder = searchInput.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            searchInput.placeholder = placeholder;
        }
    }
    
    // Listen for language changes
    document.addEventListener('languageChanged', function() {
        updateSearchPlaceholder();
        updateResultsCount(document.querySelectorAll('.property-card[style="display: block;"]').length || 
                          document.querySelectorAll('.property-card:not([style*="display: none"])').length);
    });
    
    // ========================================
    // INITIALIZE
    // ========================================
    console.log('Rents page loaded successfully');
});
