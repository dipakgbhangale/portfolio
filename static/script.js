// DOM Elements
const navbar = document.getElementById('navbar');
const typingTextElement = document.getElementById('typing-text');
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
const body = document.body;

// Sticky Navbar Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typing Effect
const roles = [
    "Web Developer",
    "Cyber Security Enthusiast",
    "Python Programmer",
    "Creative Thinker"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWithEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeWithEffect, typeSpeed);
}

// Start Effects on Load
document.addEventListener('DOMContentLoaded', () => {
    typeWithEffect();
    observeElements();
    initCanvas();
    initTilt();
});

// --- EXTRAORDINARY FEATURES ---

// 1. Custom Magnetic Cursor
if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Animate dot immediately
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Animate outline with delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Magnet Effect & Hover State (Event Delegation for better performance & dynamic elements)
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .card, .skill-item, .nav-logo, .view-cert-btn');
        if (target) {
            body.classList.add('hovering');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .card, .skill-item, .nav-logo, .view-cert-btn');
        if (target) {
            body.classList.remove('hovering');
        }
    });

    // Note: The specific "magnetic" pull effect would require per-element logic, 
    // but the cursor expansion (hovering class) works best with delegation here.
}

// 2. AntiGravity Particle Background (Canvas)
function initCanvas() {
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * -0.5 - 0.2; // Move UP (Anti-Gravity)
            this.speedX = Math.random() * 0.4 - 0.2;
            this.opacity = Math.random() * 0.5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y < 0) this.y = height; // Reset to bottom
            if (this.x > width || this.x < 0) this.x = Math.random() * width;
        }

        draw() {
            ctx.fillStyle = `rgba(34, 211, 238, ${this.opacity})`; // Cyan color
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        const particleCount = Math.floor(width * 0.05); // Density based on screen width
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    createParticles();
    animateParticles();
}

// 3. 3D Tilt Initialization
function initTilt() {
    // VanillaTilt auto-initializes if data-tilt is present, but we can configure defaults here if we used JS init
    // Since we used CDN and data-tilt attribute, it handles itself.
    // We just ensure the script is loaded.
}

// 4. Project Modals
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const viewBtns = document.querySelectorAll('.view-details-btn');

viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');

        // Find project in the injected global data
        const data = window.projectData ? window.projectData.find(p => p.id === projectId) : null;

        if (data) {
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.modal_content || data.description; // Fallback
            modal.style.display = "flex";
            // Trigger animation
            setTimeout(() => modal.classList.add('show'), 10);
        } else {
            console.error("Project data not found for ID:", projectId);
        }
    });
});

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300);
    });
}

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300);
    }
});

// 5. Cyber Mode Theme Toggle - REMOVED


// Scroll Reveal Animation (Intersection Observer)
function observeElements() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const elementsToAnimate = document.querySelectorAll('.card, .skill-item, .section-title, .timeline-content');

    elementsToAnimate.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
    });
}

// --- DYNAMIC CONTENT GENERATION ---
// (Migrated to Flask Jinja2 Templates)

// Certificate Load More Logic
const loadMoreBtn = document.getElementById('load-more-btn');
let itemsToShow = 6;
const totalItems = document.querySelectorAll('.certificate-card').length;

if (loadMoreBtn) {
    // Hide if not enough items
    if (totalItems <= itemsToShow) {
        loadMoreBtn.style.display = 'none';
    }

    loadMoreBtn.addEventListener('click', () => {
        itemsToShow += 3;
        const cards = document.querySelectorAll('.certificate-card');

        cards.forEach((card, index) => {
            if (index < itemsToShow) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('visible'), 50);
            }
        });

        if (itemsToShow >= totalItems) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Spam Protection (Honeypot)
        const honeypot = document.getElementById('honeypot').value;
        if (honeypot) {
            console.warn("Spambot detected!");
            return; // Silently fail for bots
        }

        // 2. UI Elements
        const loadingOverlay = document.getElementById('loading-overlay');
        const successPopup = document.getElementById('success-popup');
        const submitBtn = document.getElementById('submit-btn');
        const closePopupBtn = document.getElementById('close-popup-btn');

        // Show Loading
        loadingOverlay.classList.add('active');
        submitBtn.disabled = true;

        // 3. EmailJS Send
        if (typeof CONFIG === 'undefined') {
            console.error("Config file not loaded!");
            showError("Configuration error. Please reinstall config.");
            loadingOverlay.classList.remove('active');
            submitBtn.disabled = false;
            return;
        }

        emailjs.sendForm(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, this)
            .then(function () {
                // SUCCESS
                loadingOverlay.classList.remove('active');
                successPopup.classList.add('active');
                contactForm.reset();
                submitBtn.disabled = false;
            }, function (error) {
                // ERROR
                loadingOverlay.classList.remove('active');
                submitBtn.disabled = false;

                // Show Error Notification
                showError("Failed to send message. Please try again later.");
                console.error('EmailJS Error:', error);
            });

        // Close Popup Event
        closePopupBtn.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });

        // Close on outside click
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                successPopup.classList.remove('active');
            }
        });
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerText = message;
    document.body.appendChild(errorDiv);

    // Trigger animation
    setTimeout(() => errorDiv.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
}

