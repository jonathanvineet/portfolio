export function createProjectsPage(type) {
  const projectsData = {
    hardware: [
      {
        id: 'h1',
        title: 'Smart IoT Hub',
        category: 'IoT & Embedded',
        preview: 'Advanced home automation system with real-time monitoring and control',
        description: 'A comprehensive IoT platform that integrates multiple sensors and actuators for smart home automation. Features include real-time data monitoring, remote control via mobile app, and AI-powered predictive maintenance.',
        tech: ['ESP32', 'MQTT', 'Node.js', 'React Native', 'TensorFlow Lite'],
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop',
        links: [
          { text: 'View Project', url: '#' },
          { text: 'GitHub', url: '#' }
        ]
      },
      {
        id: 'h2',
        title: 'Autonomous Drone',
        category: 'Robotics & AI',
        preview: 'Self-navigating drone with computer vision and obstacle avoidance',
        description: 'Custom-built autonomous drone featuring computer vision for object detection, GPS navigation, and advanced obstacle avoidance algorithms. Capable of autonomous flight paths and real-time video streaming.',
        tech: ['Raspberry Pi', 'OpenCV', 'Python', 'ROS', 'LiDAR'],
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop',
        links: [
          { text: 'View Project', url: '#' },
          { text: 'Documentation', url: '#' }
        ]
      },
      {
        id: 'h3',
        title: 'Biometric Security System',
        category: 'Security & Hardware',
        preview: 'Multi-factor authentication system using fingerprint and facial recognition',
        description: 'Enterprise-grade security system combining fingerprint scanning, facial recognition, and RFID technology. Features encrypted data transmission and cloud-based access management.',
        tech: ['Arduino', 'Fingerprint Scanner', 'Camera Module', 'Firebase', 'C++'],
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop',
        links: [
          { text: 'Case Study', url: '#' }
        ]
      },
      {
        id: 'h4',
        title: 'Energy Monitoring System',
        category: 'Green Tech & IoT',
        preview: 'Real-time power consumption tracker with predictive analytics',
        description: 'Smart energy monitoring solution that tracks power consumption in real-time, provides detailed analytics, and uses machine learning to predict usage patterns and optimize energy efficiency.',
        tech: ['ESP8266', 'Current Sensors', 'InfluxDB', 'Grafana', 'Python'],
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop',
        links: [
          { text: 'Learn More', url: '#' },
          { text: 'Open Source', url: '#' }
        ]
      }
    ],
    software: [
      {
        id: 's1',
        title: 'DeFi Trading Platform',
        category: 'Web3 & Blockchain',
        preview: 'Decentralized exchange with automated market making and yield farming',
        description: 'Full-featured decentralized finance platform built on Ethereum. Includes automated market maker, liquidity pools, yield farming, and governance token functionality. Smart contracts audited for security.',
        tech: ['Solidity', 'Hardhat', 'React', 'Web3.js', 'The Graph'],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop',
        links: [
          { text: 'Live Demo', url: '#' },
          { text: 'Smart Contracts', url: '#' }
        ]
      },
      {
        id: 's2',
        title: 'AI Code Assistant',
        category: 'Artificial Intelligence',
        preview: 'Machine learning powered code completion and generation tool',
        description: 'Advanced AI-powered development tool that provides intelligent code suggestions, automatic documentation generation, and bug detection. Trained on millions of code repositories.',
        tech: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
        links: [
          { text: 'Try It Out', url: '#' },
          { text: 'Research Paper', url: '#' }
        ]
      },
      {
        id: 's3',
        title: 'NFT Marketplace',
        category: 'Web3 & Digital Art',
        preview: 'Decentralized platform for creating, buying, and selling NFTs',
        description: 'Comprehensive NFT marketplace with minting capabilities, auction system, and royalty management. Features IPFS storage, metadata standards compliance, and gas-optimized smart contracts.',
        tech: ['Next.js', 'Solidity', 'IPFS', 'Ethers.js', 'Tailwind CSS'],
        image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&auto=format&fit=crop',
        links: [
          { text: 'Visit Marketplace', url: '#' },
          { text: 'GitHub', url: '#' }
        ]
      },
      {
        id: 's4',
        title: 'Real-time Collaboration Tool',
        category: 'SaaS & Productivity',
        preview: 'WebRTC-based platform for team collaboration and project management',
        description: 'Enterprise collaboration platform featuring real-time document editing, video conferencing, task management, and team chat. Built with scalability and security in mind.',
        tech: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'PostgreSQL'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
        links: [
          { text: 'Learn More', url: '#' },
          { text: 'Request Demo', url: '#' }
        ]
      }
    ]
  };

  const projects = projectsData[type] || [];

  return `
    <div class="projects-page">
      <a href="/" class="back-button">← Back to Home</a>
      <div class="projects-header">
        <h1>${type === 'hardware' ? 'Hardware & IoT Projects' : 'Software & AI Projects'}</h1>
      </div>
      <div class="projects-grid">
        ${projects.map(project => `
          <div class="project-card" data-project-id="${project.id}">
            <button class="close-button">×</button>
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-overlay">
              <div class="project-category">${project.category}</div>
              <h3 class="project-title">${project.title}</h3>
              <p class="project-preview">${project.preview}</p>
              <div class="project-details">
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                  <h3>Technologies</h3>
                  <div class="tech-tags">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                  </div>
                </div>
                <div class="project-links">
                  ${project.links.map(link => `
                    <a href="${link.url}" class="project-link" target="_blank">${link.text}</a>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function initProjectCards() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const closeButton = card.querySelector('.close-button');

    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('close-button')) {
        return;
      }

      if (e.target.tagName === 'A') {
        return;
      }

      if (!card.classList.contains('expanded')) {
        cards.forEach(c => c.classList.remove('expanded'));
        card.classList.add('expanded');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.remove('expanded');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cards.forEach(c => c.classList.remove('expanded'));
    }
  });
}
