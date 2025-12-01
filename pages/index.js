export default function Home() {
  return (
    <>
      <nav className="fixed-nav" role="navigation" aria-label="Main navigation">
        <ul className="nav-dots">
          <li><a href="#home" className="nav-dot active" data-section="home" aria-label="Navigate to Home"><span>Home</span></a></li>
          <li><a href="#about" className="nav-dot" data-section="about" aria-label="Navigate to About"><span>About</span></a></li>
          <li><a href="#work" className="nav-dot" data-section="work" aria-label="Navigate to Works"><span>Works</span></a></li>
          <li><a href="#skills" className="nav-dot" data-section="skills" aria-label="Navigate to Skills"><span>Skills</span></a></li>
          <li><a href="#contact" className="nav-dot" data-section="contact" aria-label="Navigate to Contact"><span>Contact</span></a></li>
        </ul>
      </nav>

      <main className="scroll-container">
        <section id="home" className="section hero-section">
          <canvas className="particle-canvas" aria-hidden="true"></canvas>

          <div className="hero-content">
            <div className="hero-left">
              <h1 className="hero-name gradient-text" data-reveal="text">Vineet Jonathan</h1>
              <p className="hero-subtitle">IoT Engineer • Web & Mobile Developer</p>

              <div className="tag-pills">
                <span className="tag-pill" data-reveal="pill">IoT</span>
                <span className="tag-pill" data-reveal="pill">Full-stack</span>
                <span className="tag-pill" data-reveal="pill">Mobile</span>
              </div>

              <a href="#work" className="cta-button" data-reveal="button">
                Explore Works
                <svg className="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            <div className="hero-right">
                <div className="portrait-card" data-reveal="portrait">
                <div className="parallax-ring ring-1"></div>
                <div className="parallax-ring ring-2"></div>
                <div className="parallax-ring ring-3"></div>
                <div className="circuit-overlay" aria-hidden="true"></div>
                <img src="/assets/0AC2FC8E-39F9-4EAD-9458-2D1B5FECD0DC.jpeg" alt="Vineet Jonathan portrait" className="portrait-image" />
              </div>
            </div>
          </div>

          <div className="tech-glyphs" aria-hidden="true">
            <svg className="glyph glyph-1" width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="5" fill="currentColor"/>
            </svg>
            <svg className="glyph glyph-2" width="40" height="40" viewBox="0 0 40 40">
              <rect x="10" y="10" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"/>
              <line x1="20" y1="10" x2="20" y2="30" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <svg className="glyph glyph-3" width="40" height="40" viewBox="0 0 40 40">
              <polygon points="20,5 35,30 5,30" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="about-container">
            <div className="glass-card about-card" data-reveal="card">
              <h2 className="section-title">About Me</h2>

              <p className="bio-text">
                I'm an IoT engineer and full-stack developer passionate about creating innovative solutions 
                that bridge the physical and digital worlds. From embedded systems to modern web applications, 
                I build technology that makes a real impact.
              </p>

              <blockquote className="quote-block">
                <div className="quote-border"></div>
                <p className="quote-text" data-typewriter>
                  "I don't just connect devices — I connect ideas, code, and people to build things that actually matter."
                </p>
              </blockquote>

              <div className="timeline-container">
                <div className="timeline-scroll">
                  <div className="timeline-chip">2020 • Started IoT Journey</div>
                  <div className="timeline-chip">2021 • Full-Stack Development</div>
                  <div className="timeline-chip">2022 • Mobile App Development</div>
                  <div className="timeline-chip">2023 • Cloud Integration</div>
                  <div className="timeline-chip">2024 • AI & ML Integration</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section work-section">
          <div className="split-container">
            <div className="split-half left-half" tabIndex="0" role="button" aria-label="View IoT Projects" data-category="iot">
              <div className="parallax-layer bg-layer" style={{backgroundImage: "url('/assets/iot.svg')"}}></div>
              <div className="parallax-layer mesh-layer"></div>
              <div className="parallax-layer content-layer">
                <div className="split-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="20" r="8" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="20" cy="50" r="8" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="60" cy="50" r="8" stroke="currentColor" strokeWidth="3"/>
                    <line x1="35" y1="25" x2="23" y2="45" stroke="currentColor" strokeWidth="3"/>
                    <line x1="45" y1="25" x2="57" y2="45" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="40" cy="40" r="4" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="split-title">IoT Projects</h3>
                <p className="split-teaser">Connected devices & embedded systems</p>
              </div>
              <div className="caption-strip">
                <span className="caption-title">Hardware & IoT</span>
                <div className="caption-underline"></div>
              </div>
            </div>

            <div className="vertical-divider">
              <div className="divider-line"></div>
              <div className="divider-tooltip">WORKS</div>
            </div>

            <div className="split-half right-half" tabIndex="0" role="button" aria-label="View Software Projects" data-category="software">
              <div className="parallax-layer bg-layer" style={{backgroundImage: "url('/assets/software.svg')"}}></div>
              <div className="parallax-layer mesh-layer"></div>
              <div className="parallax-layer content-layer">
                <div className="split-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="15" y="20" width="50" height="40" rx="4" stroke="currentColor" strokeWidth="3"/>
                    <line x1="15" y1="32" x2="65" y2="32" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="23" cy="26" r="2" fill="currentColor"/>
                    <circle cx="30" cy="26" r="2" fill="currentColor"/>
                    <circle cx="37" cy="26" r="2" fill="currentColor"/>
                    <path d="M28 42L33 47L28 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="38" y1="42" x2="44" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="split-title">Software Projects</h3>
                <p className="split-teaser">Web & mobile applications</p>
              </div>
              <div className="caption-strip">
                <span className="caption-title">Software & Cloud</span>
                <div className="caption-underline"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <h2 className="section-title">Technical Skills</h2>

          <div className="skills-grid">
            <div className="skills-column">
              <h3 className="column-title">Hardware & IoT</h3>

              <div className="skill-item" data-skill="esp32" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <rect x="12" y="16" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="12" y1="24" x2="36" y2="24" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
                    <circle cx="24" cy="20" r="1.5" fill="currentColor"/>
                    <circle cx="30" cy="20" r="1.5" fill="currentColor"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">ESP32/Arduino</span>
              </div>

              <div className="skill-item" data-skill="sensors" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
                    <circle cx="24" cy="24" r="3" fill="currentColor"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">Sensors & Actuators</span>
              </div>

              <div className="skill-item" data-skill="mqtt" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <path d="M12 24L24 12L36 24" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M12 24L24 36L36 24" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="24" cy="24" r="2" fill="currentColor"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">MQTT/Protocols</span>
              </div>

              <div className="skill-item" data-skill="pcb" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <rect x="14" y="14" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="18" y1="14" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="30" y1="14" x2="30" y2="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="14" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="20" cy="20" r="2" fill="currentColor"/>
                    <circle cx="28" cy="28" r="2" fill="currentColor"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">PCB Design</span>
              </div>
            </div>

            <div className="skills-column">
              <h3 className="column-title">Software & Cloud</h3>

              <div className="skill-item" data-skill="react" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <ellipse cx="24" cy="24" rx="12" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <ellipse cx="24" cy="24" rx="12" ry="5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(60 24 24)"/>
                    <ellipse cx="24" cy="24" rx="12" ry="5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(120 24 24)"/>
                    <circle cx="24" cy="24" r="2" fill="currentColor"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">React/React Native</span>
              </div>

              <div className="skill-item" data-skill="nodejs" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <path d="M24 12L34 18V30L24 36L14 30V18L24 12Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="24" y1="12" x2="24" y2="24" stroke="currentColor" strokeWidth="2"/>
                    <line x1="24" y1="24" x2="34" y2="30" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">Node.js/Python</span>
              </div>

              <div className="skill-item" data-skill="cloud" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <path d="M32 26C35 26 37 24 37 21C37 18 35 16 32 16C32 13 29 11 26 11C23 11 20 13 20 16C17 16 15 18 15 21C15 24 17 26 20 26H32Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="24" y1="26" x2="24" y2="34" stroke="currentColor" strokeWidth="2"/>
                    <line x1="20" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">AWS/Azure/GCP</span>
              </div>

              <div className="skill-item" data-skill="database" data-reveal="skill">
                <div className="skill-circle">
                  <svg className="skill-icon" width="48" height="48" viewBox="0 0 48 48">
                    <ellipse cx="24" cy="16" rx="10" ry="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M14 16V32C14 34 18 36 24 36C30 36 34 34 34 32V16" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <ellipse cx="24" cy="24" rx="10" ry="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  <svg className="skill-pulse" width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <span className="skill-label">MongoDB/PostgreSQL</span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-container">
            <h2 className="contact-title">Let's Build Something</h2>
            <p className="contact-subtitle">Have a project in mind? Let's collaborate!</p>

            <div className="contact-cards">
              <a href="mailto:vineet@example.com" className="contact-card" data-testid="email-card">
                <img src="/assets/icons/mail.svg" alt="" className="contact-icon" aria-hidden="true" />
                <span className="contact-label">Email</span>
              </a>

              <a href="https://linkedin.com/in/vineetjonathan" target="_blank" rel="noopener noreferrer" className="contact-card" data-testid="linkedin-card">
                <img src="/assets/icons/linkedin.svg" alt="" className="contact-icon" aria-hidden="true" />
                <span className="contact-label">LinkedIn</span>
              </a>

              <a href="https://github.com/vineetjonathan" target="_blank" rel="noopener noreferrer" className="contact-card" data-testid="github-card">
                <img src="/assets/icons/github.svg" alt="" className="contact-icon" aria-hidden="true" />
                <span className="contact-label">GitHub</span>
              </a>
            </div>

            <form className="contact-form" data-testid="contact-form">
              <div className="form-group">
                <input type="text" id="name" name="name" required placeholder="" />
                <label htmlFor="name" className="form-label">Your Name</label>
              </div>

              <div className="form-group">
                <input type="email" id="email" name="email" required placeholder="" />
                <label htmlFor="email" className="form-label">Your Email</label>
              </div>

              <div className="form-group">
                <textarea id="message" name="message" rows="5" required placeholder=""></textarea>
                <label htmlFor="message" className="form-label">Your Message</label>
              </div>

              <button type="submit" className="submit-button" data-testid="submit-button">
                Send Message
              </button>
            </form>
          </div>

          <footer className="footer">
            <p>&copy; 2024 Vineet Jonathan. All rights reserved.</p>
            <button className="contrast-toggle" aria-label="Toggle high contrast mode" data-testid="contrast-toggle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 2V18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </footer>
        </section>
      </main>

      <div className="modal-overlay" id="projectModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div className="modal-content">
          <button className="modal-close" aria-label="Close modal" data-testid="modal-close">
            <img src="/assets/icons/close.svg" alt="" />
          </button>

          <h2 id="modalTitle" className="modal-title"></h2>

          <div className="project-grid" id="projectGrid"></div>
        </div>
      </div>

      <div className="toast" id="toast" role="alert" aria-live="polite"></div>
    </>
  )
}
