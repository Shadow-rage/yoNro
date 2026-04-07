// Tab functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding content
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Variant selection
const variantButtons = document.querySelectorAll('.variant-btn');

variantButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all variant buttons
        variantButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update price if needed (for different variants)
        const variant = button.getAttribute('data-variant');
        console.log(`Selected variant: ${variant}`);
    });
});

// Add to cart functionality
const addToCartBtn = document.querySelector('.product-actions .btn-primary');

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const productName = document.querySelector('.product-title').textContent;
        const productPrice = document.querySelector('.price-main').textContent;
        const selectedVariant = document.querySelector('.variant-btn.active')?.textContent || 'Default';
        
        // Visual feedback
        const originalText = addToCartBtn.textContent;
        addToCartBtn.textContent = 'Added to Cart ✓';
        addToCartBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            addToCartBtn.style.transform = 'scale(1)';
        }, 100);
        
        setTimeout(() => {
            addToCartBtn.textContent = originalText;
        }, 2000);
        
        // In a real app, this would add to cart
        console.log(`Added to cart: ${productName} (${selectedVariant}) - ${productPrice}`);
    });
}

// Try for free button
const tryFreeBtn = document.querySelector('.product-actions .btn-secondary');

if (tryFreeBtn) {
    tryFreeBtn.addEventListener('click', () => {
        console.log('Starting 14-day free trial...');
        // In a real app, this would open trial signup
    });
}

// Smooth scroll for related products
document.querySelectorAll('.btn-view').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add ripple effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
});

// Image zoom effect on hover
const heroIcon = document.querySelector('.hero-icon');

if (heroIcon) {
    heroIcon.addEventListener('mouseenter', () => {
        heroIcon.style.transform = 'scale(1.05)';
        heroIcon.style.transition = 'transform 0.3s ease';
    });
    
    heroIcon.addEventListener('mouseleave', () => {
        heroIcon.style.transform = 'scale(1)';
    });
}

// Scroll reveal for feature cards
const featureCards = document.querySelectorAll('.feature-detail');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
});

// Review cards animation
const reviewCards = document.querySelectorAll('.review-card');

reviewCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 150);
});
