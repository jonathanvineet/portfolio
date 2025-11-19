import './index.css';

const root = document.getElementById('root');

function createPortfolioLayout() {
  root.innerHTML = `
    <header class="header">
      <nav class="navbar glass">
        <div class="logo">
          <a href="#">Vineet Jonathan</a>
        </div>
        <ul class="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="hero" class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 id="hero-title">Vineet Jonathan</h1>
            <p id="hero-subtitle">Full Stack Developer | AI & Robotics Engineer | Physicist | IoT Specialist</p>
          </div>
          <img src="/profile.png" alt="Vineet Jonathan" class="profile-photo" data-animate data-animation="slide-in-right" data-animation-duration="1s">
        </div>
      </section>

      <section id="about" class="content-section">
        <div class="content-wrapper" data-animate data-animation="slide-in-up" data-animation-duration="0.8s">
          <h2>Vision</h2>
          <div class="about-container glass">
            <p>My goal is to bridge the gap between the physical and digital worlds, leveraging technology to build a smarter, more connected, and more efficient future.</p>
          </div>
        </div>
      </section>

      <section id="work" class="content-section">
        <div class="content-wrapper" data-animate data-animation="slide-in-up">
          <h2>MY WORK</h2>
          <div class="work-container">
            <a href="hardware.html" class="work-split glass left" data-animate data-animation="slide-in-left" data-animation-duration="0.8s" data-animation-delay="0.2s">
              <h3>HARDWARE & IOT</h3>
            </a>
            <a href="software.html" class="work-split glass right" data-animate data-animation="slide-in-right" data-animation-duration="0.8s" data-animation-delay="0.2s">
              <h3>SOFTWARE & AI</h3>
            </a>
          </div>
        </div>
      </section>

      <section id="skills" class="content-section">
        <div class="content-wrapper" data-animate data-animation="slide-in-up" data-animation-duration="0.8s">
          <h2>SKILLS</h2>
          <div class="skills-container glass">
            <p>AI/ML, Robotics, Drones, IoT, Physics, Full-Stack Development, JavaScript, Python, C++, React, Node.js, WebGL.</p>
          </div>
        </div>
      </section>

      <section id="contact" class="content-section">
        <div class="content-wrapper" data-animate data-animation="slide-in-up" data-animation-duration="0.8s">
          <h2>GET IN TOUCH</h2>
          <div class="contact-container glass">
            <p>Have a project in mind? Let's create something amazing together.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>&copy; 2025 Vineet Jonathan. All Rights Reserved.</p>
    </footer>
  `;
}

function initBlurTextAnimation() {
  const heroTextContainer = document.querySelector('.hero-text');
  if (!heroTextContainer) return;

  const elementsToAnimate = [
    { id: 'hero-title', delay: 100 },
    { id: 'hero-subtitle', delay: 50 }
  ];

  elementsToAnimate.forEach(el => {
    const element = document.getElementById(el.id);
    if (!element) return;
    const text = element.textContent;
    element.innerHTML = '';
    text.split(' ').forEach(word => {
      const span = document.createElement('span');
      span.className = 'blur-text-word';
      span.textContent = word + '\u00A0';
      element.appendChild(span);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.blur-text-word');
        words.forEach((word, index) => {
          const delay = entry.target.id === 'hero-title' ? 100 : 50;
          word.style.animationDelay = `${index * delay}ms`;
          word.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(heroTextContainer);
}

function initAnimationHooks() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // Read animation properties from data attributes
        const duration = el.dataset.animationDuration;
        const delay = el.dataset.animationDelay;
        const distance = el.dataset.animationDistance;

        // Apply styles before adding 'visible' class
        if (duration) el.style.animationDuration = duration;
        if (delay) el.style.animationDelay = delay;
        if (distance) el.style.setProperty('--animation-distance', distance);

        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// --- Main Execution ---
createPortfolioLayout();
initBlurTextAnimation();
initAnimationHooks();