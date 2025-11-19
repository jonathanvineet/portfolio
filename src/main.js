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
        <div class="hero-content" data-animate data-animation="fade-in-up">
          <img src="/profile.png" alt="Vineet Jonathan" class="profile-photo">
          <h1>Vineet Jonathan</h1>
          <p>Full Stack Developer | AI & Robotics Engineer | Physicist | IoT Specialist</p>
        </div>
      </section>

      <section id="about" class="content-section">
        <div class="content-wrapper" data-animate data-animation="fade-in-up">
          <h2>Vision</h2>
          <div class="about-container glass">
            <p>My goal is to bridge the gap between the physical and digital worlds, leveraging technology to build a smarter, more connected, and more efficient future.</p>
          </div>
        </div>
      </section>

      <section id="work" class="content-section">
        <div class="content-wrapper" data-animate data-animation="fade-in-up">
          <h2>MY WORK</h2>
          <div class="work-container">
            <a href="hardware.html" class="work-split glass left" data-animate data-animation="fade-in-left">
              <h3>HARDWARE & IOT</h3>
            </a>
            <a href="software.html" class="work-split glass right" data-animate data-animation="fade-in-right">
              <h3>SOFTWARE & AI</h3>
            </a>
          </div>
        </div>
      </section>

      <section id="skills" class="content-section">
        <div class="content-wrapper" data-animate data-animation="fade-in-up">
          <h2>SKILLS</h2>
          <div class="skills-container glass">
            <p>AI/ML, Robotics, Drones, IoT, Physics, Full-Stack Development, JavaScript, Python, C++, React, Node.js, WebGL.</p>
          </div>
        </div>
      </section>

      <section id="contact" class="content-section">
        <div class="content-wrapper" data-animate data-animation="fade-in-up">
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

function initAnimationHooks() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
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
initAnimationHooks();