# Vineet Jonathan - Portfolio Website

A cinematic, single-page portfolio website featuring glossy glass UI design, advanced animations, and interactive elements.

## 🎨 Features

- **Glossy Glass UI** - iOS26-inspired design with backdrop blur effects
- **Cinematic Animations** - Smooth transitions, parallax effects, and micro-interactions
- **Split-Screen Works Section** - Interactive divided layout showcasing IoT and Software projects
- **Scroll Snap Navigation** - Full-screen sections with smooth vertical scrolling
- **Particle System** - Dynamic canvas-based particle background
- **Fully Responsive** - Optimized for all devices from 320px to 4K
- **Accessibility First** - Keyboard navigation, ARIA labels, reduced-motion support
- **Performance Optimized** - GPU-accelerated animations, lazy loading

## 📁 Project Structure

```
/app/
├── index.html          # Main HTML structure
├── styles.css          # All styling with CSS variables
├── script.js           # Interactive functionality
├── assets/
│   ├── photo.jpg       # Portrait placeholder
│   ├── iot.jpg         # IoT projects background
│   ├── software.jpg    # Software projects background
│   ├── readme.txt      # Assets customization guide
│   └── icons/
│       ├── favicon.svg
│       ├── mail.svg
│       ├── linkedin.svg
│       ├── github.svg
│       └── close.svg
└── README.md           # This file
```

## 🚀 Getting Started

**Installation:**
No build process required! This is a static HTML/CSS/JS website.

**To view:**
1. Open `index.html` in any modern browser
2. Or use a local server: `python -m http.server 8000`
3. Navigate to `http://localhost:8000`

## 🎨 Customization Guide

### 1. Change Theme Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-bg: #050409;      /* Background */
    --color-red: #ff2d2d;     /* Accent red */
    --color-yellow: #ffdd00;  /* Accent yellow */
    --color-cyan: #00d9ff;    /* Accent cyan */
}
```

### 2. Replace Placeholder Images
- Update files in `/assets/` folder
- Keep the same filenames or update references in `index.html`
- See `/assets/readme.txt` for specifications

### 3. Update Personal Information
Edit `index.html`:
- Line 26: Change name in `<h1>` tag
- Line 27: Update subtitle/role
- Line 51-53: Modify bio text
- Line 56-58: Update quote
- Line 227-237: Change contact links

### 4. Add Projects
Edit `projectData` object in `script.js` (lines 26-52):
```javascript
const projectData = {
    iot: [
        {
            name: 'Your Project',
            description: 'Project description'
        }
    ],
    software: [...]
};
```

### 5. Customize Skill Animations
Use the exported API in `script.js`:
```javascript
VineetPortfolio.animateSkill('react', (element) => {
    // Your custom animation code
});
```

### 6. Adjust Animation Speeds
Modify motion duration variables in `styles.css`:
```css
--motion-short: 220ms;
--motion-medium: 420ms;
--motion-long: 820ms;
```

## 🎯 Sections Overview

1. **Hero (#home)** - Animated name, portrait card, CTA button
2. **About (#about)** - Bio, quote block, timeline
3. **Works (#work)** - Split-screen with IoT/Software projects + modals
4. **Skills (#skills)** - Two-column layout with circular widgets
5. **Contact (#contact)** - Form, social links, footer

## ⌨️ Keyboard Navigation

- `Arrow Up/Down` or `Page Up/Down` - Navigate between sections
- `Enter/Space` - Activate focused interactive elements
- `Escape` - Close modals
- `Tab` - Navigate through focusable elements

## 🎨 Design System

**Typography:**
- Headings: Poppins (Google Fonts)
- Body: Inter (Google Fonts)

**Color Palette:**
- Primary: Black (#050409)
- Accents: Red (#ff2d2d), Yellow (#ffdd00), Cyan (#00d9ff)
- Glass effects with 5-10% opacity overlays

**Motion:**
- Spring easing: cubic-bezier(0.34, 1.56, 0.64, 1)
- Soft easing: cubic-bezier(0.4, 0, 0.2, 1)
- Sharp easing: cubic-bezier(0.4, 0, 0.6, 1)

## 📱 Responsive Breakpoints

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 320px - 767px

## ♿ Accessibility Features

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Reduced motion support
- High contrast mode toggle
- Screen reader friendly

## 🛠️ Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📝 JavaScript API

The portfolio exposes a global `VineetPortfolio` object with helper methods:

```javascript
// Animate specific skills
VineetPortfolio.animateSkill('react', callback);

// Add custom projects
VineetPortfolio.addProjects('iot', [...]);

// Get current section
VineetPortfolio.getCurrentSection();

// Show toast message
VineetPortfolio.showToast('Your message');
```

## 🎬 Performance Tips

- Images are lazy-loaded
- Animations use GPU acceleration (transform/opacity only)
- Reduced motion queries respected
- Canvas particles disabled on reduced motion
- Intersection observers for scroll animations

## 📄 License

Personal portfolio project. Feel free to use as inspiration, but please don't copy directly.

## 🤝 Contact

- Email: vineet@example.com
- LinkedIn: linkedin.com/in/vineetjonathan
- GitHub: github.com/vineetjonathan

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript