/**
 * ============================================
 * VINEET JONATHAN PORTFOLIO - MAIN JAVASCRIPT
 * ============================================
 * 
 * This file contains all interactive functionality:
 * - Smooth scroll navigation
 * - Intersection observers for animations
 * - Split-screen works section mechanics
 * - Modal project gallery
 * - Form submission handling
 * - Particle system
 * - Accessibility features
 * 
 * Customization Guide:
 * - To add custom skill animations: Use VineetPortfolio.animateSkill()
 * - To modify particle colors: Edit particleSystem.colors array
 * - To add projects: Edit projectData object
 */

// ============================================
// GLOBAL STATE
// ============================================

const state = {
    currentSection: 'home',
    isModalOpen: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// ============================================
// PROJECT DATA
// ============================================

const projectData = {
    iot: [
        {
            name: 'Smart Home Hub',
            description: 'ESP32-based central control system for home automation with MQTT integration.'
        },
        {
            name: 'Environmental Monitor',
            description: 'Multi-sensor IoT device tracking temperature, humidity, and air quality.'
        },
        {
            name: 'Wireless Irrigation',
            description: 'Automated plant watering system with soil moisture sensors and mobile app.'
        },
        {
            name: 'Security Camera Network',
            description: 'DIY CCTV system with motion detection and cloud storage integration.'
        }
    ],
    software: [
        {
            name: 'Task Management App',
            description: 'Full-stack React and Node.js application with real-time collaboration.'
        },
        {
            name: 'E-commerce Platform',
            description: 'Modern shopping platform with payment integration and inventory management.'
        },
        {
            name: 'Mobile Fitness Tracker',
            description: 'React Native app with health metrics tracking and workout planning.'
        },
        {
            name: 'Analytics Dashboard',
            description: 'Data visualization platform built with React and D3.js for business insights.'
        }
    ]
};

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

function initNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: state.reducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// ACTIVE SECTION TRACKING
// ============================================

function initSectionObserver() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    state.currentSection = sectionId;
                    
                    // Update nav dots
                    navDots.forEach(dot => {
                        const dotSection = dot.getAttribute('data-section');
                        dot.classList.toggle('active', dotSection === sectionId);
                    });
                }
            });
        },
        {
            threshold: 0.5
        }
    );
    
    sections.forEach(section => observer.observe(section));
}

// ============================================
// REVEAL ANIMATIONS
// ============================================

function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );
    
    revealElements.forEach(el => observer.observe(el));
}

// ============================================
// TYPEWRITER EFFECT FOR QUOTE
// ============================================

function initTypewriter() {
    const quoteText = document.querySelector('[data-typewriter]');
    if (!quoteText || state.reducedMotion) return;
    
    const text = quoteText.textContent;
    quoteText.textContent = '';
    quoteText.style.opacity = '1';
    
    let index = 0;
    const speed = 30;
    
    function type() {
        if (index < text.length) {
            quoteText.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    // Start typing when quote becomes visible
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(type, 500);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    
    observer.observe(quoteText);
}

// ============================================
// SPLIT SCREEN WORKS SECTION
// ============================================

function initSplitScreen() {
    const splitHalves = document.querySelectorAll('.split-half');
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const projectGrid = document.getElementById('projectGrid');
    const modalClose = document.querySelector('.modal-close');
    
    // Click handler for split halves
    splitHalves.forEach(half => {
        half.addEventListener('click', () => {
            const category = half.getAttribute('data-category');
            openProjectModal(category);
        });
        
        // Keyboard support
        half.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const category = half.getAttribute('data-category');
                openProjectModal(category);
            }
        });
    });
    
    // Modal open function
    function openProjectModal(category) {
        const projects = projectData[category] || [];
        const title = category === 'iot' ? 'IoT Projects' : 'Software Projects';
        
        modalTitle.textContent = title;
        projectGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <div class="project-thumbnail">Project Thumbnail</div>
                <h3 class="project-name">${project.name}</h3>
                <p class="project-description">${project.description}</p>
            `;
            projectGrid.appendChild(projectItem);
        });
        
        modal.classList.add('active');
        state.isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        state.isModalOpen = false;
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isModalOpen) {
            closeModal();
        }
    });
}

// ============================================
// SKILLS REVEAL ANIMATION
// ============================================

function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100); // Stagger animation
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2
        }
    );
    
    skillItems.forEach(item => observer.observe(item));
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

function initContactForm() {
    const form = document.querySelector('.contact-form');
    const toast = document.getElementById('toast');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Mock submission (replace with actual API call)
        console.log('Form submitted:', { name, email, message });
        
        // Show success toast
        showToast('Message sent successfully! I\'ll get back to you soon.');
        
        // Reset form
        form.reset();
    });
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

// ============================================
// PARTICLE SYSTEM (CANVAS)
// ============================================

const particleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    colors: ['#ffdd00', '#ff2d2d', '#00d9ff'],
    
    init() {
        if (state.reducedMotion) return;
        
        this.canvas = document.querySelector('.particle-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    },
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    },
    
    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
};

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallax() {
    if (state.reducedMotion) return;
    
    const portraitCard = document.querySelector('.portrait-card');
    const parallaxRings = document.querySelectorAll('.parallax-ring');
    
    if (!portraitCard) return;
    
    portraitCard.addEventListener('mousemove', (e) => {
        const rect = portraitCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (y / rect.height) * 10;
        const rotateY = (x / rect.width) * -10;
        
        portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        parallaxRings.forEach((ring, index) => {
            const depth = (index + 1) * 5;
            ring.style.transform = `translateZ(${depth}px) translateX(${x * 0.02}px) translateY(${y * 0.02}px)`;
        });
    });
    
    portraitCard.addEventListener('mouseleave', () => {
        portraitCard.style.transform = '';
        parallaxRings.forEach(ring => {
            ring.style.transform = '';
        });
    });
}

// ============================================
// CONTRAST TOGGLE
// ============================================

function initContrastToggle() {
    const toggle = document.querySelector('.contrast-toggle');
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function initKeyboardNav() {
    const sections = ['home', 'about', 'work', 'skills', 'contact'];
    let currentIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        // Skip if modal is open or user is typing
        if (state.isModalOpen || e.target.matches('input, textarea')) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, sections.length - 1);
            scrollToSection(sections[currentIndex]);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            scrollToSection(sections[currentIndex]);
        }
    });
    
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: state.reducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    }
}

// ============================================
// EXPORTED API FOR CUSTOM ANIMATIONS
// ============================================

window.VineetPortfolio = {
    /**
     * Animate a specific skill item
     * @param {string} skillName - The data-skill attribute value
     * @param {function} animationCallback - Custom animation function
     * 
     * Example:
     * VineetPortfolio.animateSkill('react', (element) => {
     *     element.querySelector('.skill-pulse').style.animation = 'myCustomAnimation 2s ease infinite';
     * });
     */
    animateSkill(skillName, animationCallback) {
        const skillElement = document.querySelector(`[data-skill="${skillName}"]`);
        if (skillElement && typeof animationCallback === 'function') {
            animationCallback(skillElement);
        }
    },
    
    /**
     * Add custom projects to a category
     * @param {string} category - 'iot' or 'software'
     * @param {array} projects - Array of project objects
     */
    addProjects(category, projects) {
        if (projectData[category]) {
            projectData[category].push(...projects);
        }
    },
    
    /**
     * Get current active section
     */
    getCurrentSection() {
        return state.currentSection;
    },
    
    /**
     * Show custom toast message
     * @param {string} message
     */
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
    console.log('🚀 Vineet Jonathan Portfolio Initialized');
    
    // Initialize all modules
    initNavigation();
    initSectionObserver();
    initRevealAnimations();
    initTypewriter();
    initSplitScreen();
    initSkillsAnimation();
    initContactForm();
    particleSystem.init();
    initParallax();
    initContrastToggle();
    initKeyboardNav();
    
    console.log('✅ All systems ready');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/**
 * ============================================
 * CUSTOMIZATION NOTES
 * ============================================
 * 
 * 1. To change theme colors:
 *    Edit CSS variables in styles.css :root section
 * 
 * 2. To replace placeholder images:
 *    Update src attributes in index.html and files in assets/ folder
 * 
 * 3. To modify skill animations:
 *    Use VineetPortfolio.animateSkill() as shown in API documentation above
 * 
 * 4. To add more projects:
 *    Edit projectData object at the top of this file
 * 
 * 5. To customize particle colors:
 *    Edit particleSystem.colors array
 * 
 * 6. To adjust animation speeds:
 *    Modify CSS variables: --motion-short, --motion-medium, --motion-long
 */

/* Installation/Run Instruction:
 * Open index.html in a browser to view
 */