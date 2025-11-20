import './index.css';

const root = document.getElementById('root');

function createParticleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.insertBefore(canvas, root);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 100;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.fillStyle = `rgba(255, 0, 51, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.strokeStyle = `rgba(255, 0, 51, ${0.2 * (1 - distance / 150)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function createPortfolio() {
  root.innerHTML = `
    <header class="header">
      <nav class="navbar">
        <div class="logo">
          <a href="#hero">VJ</a>
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
          <div class="glitch-wrapper">
            <h1 class="hero-title">
              <span class="glitch" data-text="VINEET JONATHAN">VINEET JONATHAN</span>
            </h1>
          </div>
          <p class="hero-subtitle">Web3 Developer | Hardware Engineer | Innovation Architect</p>
          <a href="#work" class="cta-button">Explore My Work</a>
        </div>
      </section>

      <section id="work" class="work-section">
        <div class="work-container">
          <div class="work-split hardware">
            <div class="work-content">
              <div class="work-icon">⚙️</div>
              <h2 class="work-title">Hardware</h2>
              <p class="work-description">Robotics, IoT, Embedded Systems, Circuit Design, PCB Development</p>
            </div>
          </div>
          <div class="work-split software">
            <div class="work-content">
              <div class="work-icon">💻</div>
              <h2 class="work-title">Software</h2>
              <p class="work-description">Web3, AI/ML, Full-Stack Development, Smart Contracts, DApps</p>
            </div>
          </div>
          <div class="work-split-line"></div>
        </div>
      </section>

      <section id="about" class="about-section">
        <div class="about-container animate-on-scroll">
          <h2 class="section-title">About Me</h2>
          <p class="about-text">
            I'm a multidisciplinary engineer passionate about creating innovative solutions that bridge the physical and digital worlds.
            My expertise spans from low-level hardware design to cutting-edge Web3 applications, enabling me to build comprehensive,
            end-to-end systems that push the boundaries of what's possible.
          </p>
        </div>
      </section>

      <section id="skills" class="skills-section">
        <div class="skills-container">
          <h2 class="section-title animate-on-scroll">Core Expertise</h2>
          <div class="skills-grid">
            <div class="skill-card animate-on-scroll">
              <h3>Web3 & Blockchain</h3>
              <p>Smart Contracts, DeFi, NFTs, Solidity, Ethereum</p>
            </div>
            <div class="skill-card animate-on-scroll">
              <h3>Full-Stack Dev</h3>
              <p>React, Node.js, TypeScript, Python, Next.js</p>
            </div>
            <div class="skill-card animate-on-scroll">
              <h3>AI & Machine Learning</h3>
              <p>Neural Networks, Computer Vision, NLP, TensorFlow</p>
            </div>
            <div class="skill-card animate-on-scroll">
              <h3>Hardware Engineering</h3>
              <p>Arduino, Raspberry Pi, IoT, Embedded C++</p>
            </div>
            <div class="skill-card animate-on-scroll">
              <h3>Robotics</h3>
              <p>ROS, Autonomous Systems, Sensor Fusion</p>
            </div>
            <div class="skill-card animate-on-scroll">
              <h3>Cloud & DevOps</h3>
              <p>AWS, Docker, Kubernetes, CI/CD</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="contact-section">
        <div class="contact-container animate-on-scroll">
          <h2 class="section-title">Let's Connect</h2>
          <p class="contact-text">
            Ready to collaborate on groundbreaking projects? Let's build the future together.
          </p>
          <div class="contact-links">
            <a href="#" class="contact-link">📧</a>
            <a href="#" class="contact-link">💼</a>
            <a href="#" class="contact-link">🐙</a>
            <a href="#" class="contact-link">🐦</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>&copy; 2025 Vineet Jonathan. All Rights Reserved.</p>
    </footer>
  `;
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

function initHeaderScroll() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initWorkSplit() {
  const hardwareSection = document.querySelector('.work-split.hardware');
  const softwareSection = document.querySelector('.work-split.software');

  hardwareSection.addEventListener('click', () => {
    window.location.href = '/hardware.html';
  });

  softwareSection.addEventListener('click', () => {
    window.location.href = '/software.html';
  });

  let hoverTimeout;

  [hardwareSection, softwareSection].forEach(section => {
    section.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout);
      const otherSection = this === hardwareSection ? softwareSection : hardwareSection;

      this.style.flex = '1.5';
      otherSection.style.flex = '0.5';
    });

    section.addEventListener('mouseleave', function() {
      hoverTimeout = setTimeout(() => {
        hardwareSection.style.flex = '1';
        softwareSection.style.flex = '1';
      }, 100);
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

createParticleCanvas();
createPortfolio();
initScrollAnimations();
initHeaderScroll();
initWorkSplit();
initSmoothScroll();
