// Add this function to the top of your script.js
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.src = 'dark-mode.png';
        themeIcon.alt = 'Dark mode';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.src = 'light-mode.png';
            themeIcon.alt = 'Light mode';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.src = 'dark-mode.png';
            themeIcon.alt = 'Dark mode';
            localStorage.setItem('theme', 'dark');
        }
        
        // Add subtle animation
        themeToggle.classList.add('clicked');
        setTimeout(() => {
            themeToggle.classList.remove('clicked');
        }, 300);
    });
}

// Update your document.addEventListener to include the theme toggle setup
document.addEventListener('DOMContentLoaded', function() {
    createMinimalistShapes();
    
    // Set up education section dropdowns
    setupEducationDropdowns();
    
    // Set up smooth scrolling
    setupSmoothScrolling();
    
    // Set up header scroll effect
    setupHeaderScrollEffect();
    
    // Set up form submission
    setupFormSubmission();
    
    // Set up scroll animations
    setupScrollAnimations();
    
    // Set up theme toggle
    setupThemeToggle();
});
function setupScrollAnimations() {
    // Select all elements with the fade-in-init class
    const fadeElements = document.querySelectorAll('.fade-in-init');
    
    // Create the intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If element is in view
            if (entry.isIntersecting) {
                // Add active class to trigger animation
                entry.target.classList.add('fade-in-active');
            } else {
                // Remove active class when element is out of view
                entry.target.classList.remove('fade-in-active');
            }
        });
    }, {
        root: null, // Use the viewport as the root
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly before the element comes into view
    });
    
    // Start observing all fade elements
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

function createMinimalistShapes() {
    const container = document.getElementById('shapes-container');
    if (!container) return;
    
    // Apple-inspired colors with very low opacity
    const colors = [
        '#1d1d1f',  // Dark gray
        '#0071e3',  // Apple blue
        '#86868b',  // Light gray
    ];
    
    // Keep track of all placed shapes to check for collisions
    const placedShapes = [];
    
    // Create 15 circles of varying sizes with collision detection
    for (let i = 0; i < 15; i++) {
        if (!createShapeWithCollisionDetection('circle', colors, container, placedShapes)) {
            console.log("Couldn't place all circles due to space constraints");
            break;
        }
    }
    
    // Create 10 rectangles of varying sizes with collision detection
    for (let i = 0; i < 10; i++) {
        if (!createShapeWithCollisionDetection('rectangle', colors, container, placedShapes)) {
            console.log("Couldn't place all rectangles due to space constraints");
            break;
        }
    }
}

function createShapeWithCollisionDetection(type, colors, container, placedShapes) {
    // Maximum attempts to find a non-colliding position
    const maxAttempts = 100;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        // Generate shape properties
        let size, width, height;
        
        // Random size between 10px and 60px (reduced size slightly)
        size = Math.floor(Math.random() * 50) + 10;
        
        // For rectangles, generate width and height separately
        if (type === 'rectangle') {
            width = Math.floor(Math.random() * 100) + 20;
            height = Math.floor(Math.random() * 50) + 20;
        } else {
            width = size;
            height = size;
        }
        
        // Random position (with some padding from edges)
        const posX = Math.floor(Math.random() * (100 - (width / container.clientWidth * 100))) + 1;
        const posY = Math.floor(Math.random() * (100 - (height / container.clientHeight * 100))) + 1;
        
        // Create shape bounds for collision detection
        const newShapeBounds = {
            left: posX - 1, // Add a small buffer zone
            right: posX + (width / container.clientWidth * 100) + 1,
            top: posY - 1,
            bottom: posY + (height / container.clientHeight * 100) + 1
        };
        
        // Check for collision with existing shapes
        let hasCollision = false;
        for (const shape of placedShapes) {
            if (checkCollision(newShapeBounds, shape)) {
                hasCollision = true;
                break;
            }
        }
        
        // If no collision, create and place the shape
        if (!hasCollision) {
            const shape = document.createElement('div');
            shape.className = `shape ${type}`;
            
            if (type === 'rectangle') {
                shape.style.width = `${width}px`;
                shape.style.height = `${height}px`;
            } else {
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
            }
            
            shape.style.left = `${posX}%`;
            shape.style.top = `${posY}%`;
            
            // Random color from our palette
            const color = colors[Math.floor(Math.random() * colors.length)];
            shape.style.backgroundColor = color;
            
            // Add subtle animation for some shapes
            if (Math.random() > 0.5) {
                const duration = Math.floor(Math.random() * 30) + 40; // 40-70 seconds
                shape.style.transition = `transform ${duration}s ease-in-out`;
                
                // Slight movement animation
                setTimeout(() => {
                    const moveX = (Math.random() * 20) - 10; // Reduced movement range
                    const moveY = (Math.random() * 20) - 10;
                    shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }, 100);
            }
            
            container.appendChild(shape);
            
            // Store shape bounds for future collision detection
            placedShapes.push(newShapeBounds);
            return true;
        }
        
        attempts++;
    }
    
    // If we reached max attempts, we couldn't place the shape
    return false;
}

// Check if two shapes collide
function checkCollision(shape1, shape2) {
    return !(
        shape1.right < shape2.left ||
        shape1.left > shape2.right ||
        shape1.bottom < shape2.top ||
        shape1.top > shape2.bottom
    );
}

// Education section dropdown functionality
function setupEducationDropdowns() {
    const educationItems = document.querySelectorAll('.education-item');
    
    educationItems.forEach(item => {
        const header = item.querySelector('.education-header');
        
        header.addEventListener('click', () => {
            // Toggle active class for the clicked item
            const isActive = item.classList.contains('active');
            
            // Close all items first
            educationItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
            
            // Add subtle animation to highlight the selection
            item.style.backgroundColor = 'rgba(0, 113, 227, 0.05)';
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 300);
        });
    });
    
    // Open the first education item by default
    if (educationItems.length > 0) {
        educationItems[0].classList.add('active');
    }
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
function setupHeaderScrollEffect() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// Form submission
function setupFormSubmission() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would normally handle the form submission
            // This is just a visual confirmation for the demo
            const button = form.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Message Sent';
            button.style.backgroundColor = '#34c759';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                form.reset();
            }, 3000);
        });
    }
}

