// Category filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get selected category
        const category = button.getAttribute('data-category');
        
        // Filter products
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.btn-add-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Added ✓';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        button.style.color = 'white';
        button.style.borderColor = '#10b981';
        
        // Reset after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
        
        // In a real app, this would add to cart
        console.log(`Added to cart: ${productName} - ${productPrice}`);
    });
});

// Product card hover effect enhancement
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.product-icon svg');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.product-icon svg');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Smooth scroll reveal for products
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

productCards.forEach(card => {
    observer.observe(card);
});
