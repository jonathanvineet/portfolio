// Get references to all elements
const terminalScreen = document.getElementById('terminal-screen');
const cityscape = document.getElementById('cityscape');
const batsignalTorch = document.getElementById('batsignal-torch');
const lightBeam = document.getElementById('light-beam');
const batsignalDisplay = document.getElementById('batsignal-display');

// Terminal text lines for batcomputer initialization
const terminalLines = [
  'WAYNE ENTERPRISES SECURE TERMINAL v3.7.1',
  'Initializing BatOS...',
  '',
  'Loading secure protocols................ [OK]',
  'Accessing encrypted network............ [OK]',
  'Connecting to Cave mainframe........... [OK]',
  'Verifying biometric authentication..... [OK]',
  '',
  'BATMAN PROTOCOL ACTIVATED',
  '',
  'Scanning Gotham City surveillance...... [OK]',
  'Analyzing crime patterns............... [OK]',
  'Cross-referencing GCPD database........ [OK]',
  'Monitoring emergency frequencies....... [OK]',
  '',
  'ALERT: Priority signal detected',
  'Commissioner Gordon - Signal activated',
  '',
  'Initiating response protocol...........',
  'Preparing vehicle systems..............',
  'Activating Bat-Signal..................',
  '',
  'BATMAN IS COMING...'
];

// Function to simulate typing effect
function typeText(element, text, speed = 50) {
  return new Promise((resolve) => {
    let i = 0;
    element.classList.add('typing');
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        element.classList.remove('typing');
        clearInterval(typeInterval);
        resolve();
      }
    }, speed);
  });
}

// Function to add delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main sequence function
async function startBatcomputerSequence() {
  // Clear terminal
  terminalScreen.textContent = '';
  
  // Display terminal lines with typing effect
  for (let i = 0; i < terminalLines.length; i++) {
    const line = terminalLines[i];
    
    if (line === '') {
      terminalScreen.textContent += '\n';
      await delay(200);
    } else {
      await typeText(terminalScreen, line, 30);
      terminalScreen.textContent += '\n';
      
      // Add extra delay for dramatic effect on certain lines
      if (line.includes('BATMAN PROTOCOL ACTIVATED') || 
          line.includes('ALERT:') || 
          line.includes('BATMAN IS COMING')) {
        await delay(1000);
      } else {
        await delay(300);
      }
    }
  }
  
  // Wait before starting fade out
  await delay(2000);
  
  // Fade out terminal
  terminalScreen.classList.add('fade-out');
  
  // After fade out completes, hide terminal and show cityscape
  setTimeout(() => {
    terminalScreen.style.display = 'none';
    
    // Show cityscape
    cityscape.classList.remove('hidden');
    cityscape.style.opacity = '1';
    
    // Show and start flickering torch after short delay
    setTimeout(() => {
      batsignalTorch.classList.remove('hidden');
      batsignalTorch.style.opacity = '1';
      batsignalTorch.classList.add('flicker');
      
      // Show light beam after torch appears
      setTimeout(() => {
        lightBeam.classList.remove('hidden');
        lightBeam.classList.add('beam-appear');
        
        // Show batsignal in the beam after light beam appears
        setTimeout(() => {
          batsignalDisplay.classList.remove('hidden');
          batsignalDisplay.classList.add('batsignal-appear');
        }, 1000);
        
      }, 800);
      
    }, 500);
    
  }, 2000);
}

// Start the sequence when DOM is loaded
document.addEventListener('DOMContentLoaded', startBatcomputerSequence);