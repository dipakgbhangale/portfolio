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

    // Magnet Effect & Hover State
    const interactiveElements = document.querySelectorAll('a, button, .card, .skill-item, .nav-logo');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            body.classList.remove('hovering');
        });
    });
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

const projectDetails = {
    project1: {
        title: "APSIT NOTIFY",
        content: "A comprehensive notification system for college students.<br><br><b>Key Features:</b><br>- Secure Login System<br>- Real-time Email Alerts (EmailJS)<br>- Responsive Dashboard<br>- Scheduled Reminders"
    },
    project2: {
        title: "Retail Billing System",
        content: "A desktop application for small businesses to manage billing and inventory.<br><br><b>Tech Stack:</b> Python, Tkinter<br><b>Features:</b><br>- Admin/Employee Login<br>- Invoice Generation<br>- Inventory Tracking"
    },
    project3: {
        title: "QUICKDEAL",
        content: "An E-Commerce landing page design.<br><br><b>Focus:</b><br>- Modern UI/UX<br>- Responsive Grid Layouts<br>- Product Showcases"
    },
    project4: {
        title: "College App (GPM)",
        content: "Android/Web solution for Government Polytechnic Mumbai.<br><br><b>Utility:</b><br>- Notice Board updates<br>- Event Calendars<br>- Resource Sharing"
    }
};

viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        const data = projectDetails[projectId];

        if (data) {
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.content;
            modal.style.display = "flex";
            // Trigger animation
            setTimeout(() => modal.classList.add('show'), 10);
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

// Certificate Load More Logic
const cards = document.querySelectorAll('.certificate-card');
const loadMoreBtn = document.getElementById('load-more-btn');
let itemsToShow = 6;

// Show initial items
cards.forEach((card, index) => {
    if (index < itemsToShow) {
        card.style.display = 'block';
        card.classList.add('visible');
    }
});

if (cards.length <= itemsToShow && loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        const currentlyVisible = document.querySelectorAll('.certificate-card.visible').length;
        const nextBatch = currentlyVisible + 3;

        cards.forEach((card, index) => {
            if (index < nextBatch) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('visible'), 10);
            }
        });

        if (nextBatch >= cards.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// Contact Form Logic
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const subject = `Portfolio Contact from ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage:%0D%0A${message}`;

        const mailtoLink = `mailto:dipakbhangale@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        window.location.href = mailtoLink;
    });
}
