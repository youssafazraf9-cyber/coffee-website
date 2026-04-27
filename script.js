// Global state
let cart = [];
let isDarkMode = false;

// DOM elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');
const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');

// Menu items data
const menuItems = [
    {
        id: 1,
        name: 'Espresso',
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1494314671902-399b18174975?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Intense and bold shot of pure coffee essence'
    },
    {
        id: 2,
        name: 'Cappuccino',
        price: 4.25,
        image: 'https://images.unsplash.com/photo-1577968897966-f27d5f0d289f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Perfectly balanced with velvety steamed milk'
    },
    {
        id: 3,
        name: 'Latte',
        price: 4.75,
        image: 'https://images.unsplash.com/photo-1572449263567-33c812a70ff1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Smooth and creamy with rich espresso base'
    },
    {
        id: 4,
        name: 'Americano',
        price: 3.00,
        image: 'https://images.unsplash.com/photo-1512568400610-42b9a8bc0e3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Classic espresso diluted with hot water'
    },
    {
        id: 5,
        name: 'Matcha Latte',
        price: 5.25,
        image: 'https://images.unsplash.com/photo-1613769049987-4886e4358e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Premium ceremonial grade matcha with milk'
    },
    {
        id: 6,
        name: 'Cold Brew',
        price: 4.50,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        description: 'Smooth 18-hour cold extracted coffee'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    isDarkMode = savedTheme === 'dark';
    updateTheme();
    
    // Render menu
    renderMenu();
    
    // Event listeners
    setupEventListeners();
    
    // Animate on scroll
    setupScrollAnimations();
    
    // Update cart count
    updateCartCount();
}

function setupEventListeners() {
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Cart toggle
    cartIcon.addEventListener('click', toggleCartModal);
    cartClose.addEventListener('click', closeCartModal);
    
    // Close modals on outside click
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
    
    // Contact form
    contactForm.addEventListener('submit', handleContactForm);
    
    // Window scroll for navbar
    window.addEventListener('scroll', handleScroll);
}

function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuItems.forEach((item, index) => {
        const menuCard = createMenuCard(item, index);
        menuGrid.appendChild(menuCard);
    });
}

function createMenuCard(item, index) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-image">
        <div class="menu-content">
            <h3 class="menu-title">${item.name}</h3>
            <div class="menu-price">$${item.price.toFixed(2)}</div>
            <p class="menu-description">${item.description}</p>
            <button class="add-to-cart" onclick="addToCart(${item.id})">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function addToCart(itemId) {
    const item = menuItems.find(menuItem => menuItem.id === itemId);
    const cartItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    showNotification('Added to cart!');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function updateCartQuantity(itemId, change) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    updateCartCount();
    renderCartItems();
    updateCartTotal();
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCartItems() {
    const cartItemsEl = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p style="text-align: center; color: var(--text-light);">Your cart is empty</p>';
        return;
    }
    
    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
            </div>
            <div>
                <button onclick="updateCartQuantity(${item.id}, -1)" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-right: 1rem;">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 1)" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">+</button>
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #e74c3c;">×</button>
            </div>
        </div>
    `).join('');
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}

function toggleCartModal() {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    renderCartItems();
    updateCartTotal();
}

function closeCartModal() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    updateTheme();
}

function updateTheme() {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe menu cards and other elements
    document.querySelectorAll('.menu-card, .about-section, .contact-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
}

function validateForm() {
    let isValid = true;
    
    // Reset previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    // Name validation
    const name = document.getElementById('name').value.trim();
    if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    // Message validation
    const message = document.getElementById('message').value.trim();
    if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function handleContactForm(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Simulate form submission
        alert('Thank you for your message! We\'ll get back to you soon. ☕');
        contactForm.reset();
    }
}

function showNotification(message) {
    // Simple notification toast
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load cart from localStorage on init
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Initialize cart loading
initApp();
loadCartFromStorage();