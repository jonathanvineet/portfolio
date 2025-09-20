import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// -------- Optimized Config --------
const MODEL_URL = '/models/batman_logo.glb';
const ZOOM_DURATION = 6000; // Slower intro for more dramatic effect
const BLOOM_PARAMS = { strength: 0.25, radius: 0.4, threshold: 0.4 };
const STAR_COUNT = 800; // Reduced for performance

// -------- DOM refs --------
const root = document.getElementById('intro-root');
const welcome = document.getElementById('welcome');
const skipBtn = document.getElementById('skip-intro');

// -------- Three.js Setup --------
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance" // Performance optimization
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.classList.add('webgl');
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = createRainyNightSky();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100);
const START_Z = 8.5; const INSIDE_Z = -0.4; // Start from much farther away
camera.position.set(0, 0, START_Z);
scene.add(camera);

// -------- Enhanced Lighting for Rain and Logo Highlight --------
const keyLight = new THREE.DirectionalLight(0xffffff, 2.0); // Bright white light for clear reflections
keyLight.position.set(6, 8, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 50;
scene.add(keyLight);

// Add spotlight to create a focused highlight on the logo
const spotLight = new THREE.SpotLight(0xffffff, 2.0);
spotLight.position.set(3, 5, 2);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.2;
spotLight.decay = 1;
spotLight.distance = 50;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);

const rimLight = new THREE.DirectionalLight(0x4a6fa5, 0.8); // Slightly stronger rim light
rimLight.position.set(-4, -2, -3);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0x2c3e50, 0.3); // Darker ambient for better contrast
scene.add(ambientLight);

scene.fog = new THREE.FogExp2(0x1a1a2e, 0.03); // Reduced fog density

let logoGroup = new THREE.Group();
let logoMesh = null; // Reference to the actual logo mesh
scene.add(logoGroup);

createStarfield(STAR_COUNT);

// -------- BatComputer Text Animation --------
const batComputerText = document.createElement('div');
batComputerText.id = 'batcomputer-init';
batComputerText.style.cssText = `
    position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%);
    color: #ffd64a; font-size: 2.2rem; font-family: monospace;
    text-shadow: 0 0 12px #222, 0 0 24px #ffd64a; z-index: 101;
    pointer-events: none; transition: opacity 0.7s; opacity: 1;
`;
root.appendChild(batComputerText);

const blankOverlay = document.createElement('div');
blankOverlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: #050607; z-index: 100; transition: opacity 0.7s; opacity: 1;
`;
root.appendChild(blankOverlay);

// -------- Logo Loading with Enhanced Materials --------
function addPlaceholder() {
    const geo = new THREE.TorusGeometry(1.4, 0.5, 16, 64);
    const mat = new THREE.MeshStandardMaterial({ 
        color: 0x808080, 
        metalness: 0.3, 
        roughness: 0.7,
        transparent: false // Completely opaque
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    logoGroup.add(mesh);
    logoMesh = mesh;
}

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
gltfLoader.setDRACOLoader(dracoLoader);

let modelLoaded = false;
gltfLoader.load(MODEL_URL, (gltf) => {
    logoGroup.clear();
    logoGroup.add(gltf.scene);
    
    // Enhanced material setup for realistic 3D logo
    gltf.scene.traverse(obj => {
        if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            
            // Create metallic grey Batman logo material with reflective highlights
            const material = new THREE.MeshStandardMaterial({
                color: 0xa0a0a0, // Lighter grey base
                metalness: 0.8, // More metallic
                roughness: 0.2, // Less rough for more reflection
                transparent: false, // Completely opaque
                side: THREE.DoubleSide,
                envMapIntensity: 1.5 // Enhance reflection intensity
            });
            
            // Add simulated light reflection effect
            material.onBeforeCompile = (shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <color_fragment>',
                    `
                    #include <color_fragment>
                    // Add light reflection effect with moving highlight
                    float time = vNormal.x * 5.0 + vNormal.y * 3.0;
                    
                    // Light gray to dark gray with highlight
                    float highlight = pow(abs(sin(time * 0.5)), 8.0) * 0.6;
                    float edge = pow(abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0) * 0.7;
                    
                    // Create metallic grey appearance with light hitting from top right
                    vec3 baseGrey = vec3(0.7, 0.7, 0.7);
                    vec3 darkGrey = vec3(0.3, 0.3, 0.3);
                    vec3 highlightColor = vec3(1.0, 1.0, 1.0);
                    
                    // Combine colors based on angle to simulate light reflection
                    vec3 greyColor = mix(darkGrey, baseGrey, vNormal.y * 0.5 + 0.5);
                    greyColor = mix(greyColor, highlightColor, highlight * edge);
                    
                    diffuseColor.rgb = greyColor;
                    `
                );
            };
            
            obj.material = material;
            
            if (!logoMesh) {
                logoMesh = obj; // Store reference
            }
        }
    });
    
    // Improved scaling and centering of the logo
    // First apply scaling
    const baseScale = 2.8;
    const widthScale = baseScale * 1.2; // Slightly wider
    const heightScale = baseScale * 1.6; // Longer in height
    const depthScale = baseScale * 1.0; // Keep original depth
    
    gltf.scene.scale.set(widthScale, heightScale, depthScale);
    
    // Then calculate the bounding box AFTER scaling
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Apply the negative center offset to center the model perfectly
    gltf.scene.position.x = -center.x;
    gltf.scene.position.y = -center.y;
    gltf.scene.position.z = -center.z;
    
    modelLoaded = true;
    updateOutlineSelection();
    startIntro();
}, undefined, (err) => {
    console.warn('Failed to load model, using placeholder', err);
    addPlaceholder();
    updateOutlineSelection();
    startIntro();
});

// Fallback placeholder
setTimeout(() => { 
    if (!modelLoaded && logoGroup.children.length === 0) { 
        addPlaceholder(); 
        startIntro();
    } 
}, 2000); // Reduced timeout for faster loading

// -------- Animation Control --------
let startTime = null;
let introDone = false;

const BATCOMPUTER_TEXT = 'BatComputer Initializing...';
const TYPE_SEGMENTS = [
    { text: 'Bat', pace: 100 },
    { text: 'Computer', pace: 45 },
    { text: ' ', pace: 20 },
    { text: 'Initializing...', pace: 60 }
];

function showBatComputerInit(callback) {
    batComputerText.textContent = '';
    let segIdx = 0, charIdx = 0;
    
    function typeNext() {
        if (segIdx < TYPE_SEGMENTS.length) {
            const seg = TYPE_SEGMENTS[segIdx];
            if (charIdx < seg.text.length) {
                batComputerText.textContent += seg.text[charIdx];
                charIdx++;
                setTimeout(typeNext, seg.pace);
            } else {
                segIdx++; charIdx = 0;
                setTimeout(typeNext, 120);
            }
        } else {
            setTimeout(() => {
                batComputerText.style.opacity = '0';
                setTimeout(() => {
                    batComputerText.style.display = 'none';
                    blankOverlay.style.opacity = '0';
                    setTimeout(() => { 
                        blankOverlay.style.display = 'none'; 
                        callback(); 
                    }, 500);
                }, 600);
            }, 500);
        }
    }
    typeNext();
}

function startIntro() {
    showBatComputerInit(() => {
        startTime = performance.now();
    });
}

function finishIntro() {
    if (introDone) return;
    introDone = true;
    document.body.classList.add('intro-fade-out');
    
    setTimeout(() => {
        welcome.classList.remove('hidden');
        requestAnimationFrame(() => {
            welcome.classList.add('show');
            // Start the 2D rain effect after intro
            makeItRain();
        });
    }, 300);
}

skipBtn.addEventListener('click', finishIntro);

// -------- 2D Rain System (Converted from jQuery) --------
function makeItRain() {
    // Clear out everything
    const frontRow = document.querySelector('.rain.front-row');
    const backRow = document.querySelector('.rain.back-row');
    
    if (frontRow) frontRow.innerHTML = '';
    if (backRow) backRow.innerHTML = '';

    let increment = 0;
    let drops = "";
    let backDrops = "";

    while (increment < 100) {
        // Random number between 98 and 1
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
        // Random number between 5 and 2
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
        // Increment
        increment += randoFiver;
        
        // Add in a new raindrop with various randomizations
        drops += `<div class="drop" style="left: ${increment}%; bottom: ${(randoFiver + randoFiver - 1 + 100)}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
            <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
            <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        </div>`;
        
        backDrops += `<div class="drop" style="right: ${increment}%; bottom: ${(randoFiver + randoFiver - 1 + 100)}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
            <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
            <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
        </div>`;
    }

    if (frontRow) frontRow.insertAdjacentHTML('beforeend', drops);
    if (backRow) backRow.insertAdjacentHTML('beforeend', backDrops);
}

// Rain toggle event listeners
document.addEventListener('DOMContentLoaded', () => {
    const splatToggle = document.querySelector('.splat-toggle.toggle');
    const backRowToggle = document.querySelector('.back-row-toggle.toggle');
    const singleToggle = document.querySelector('.single-toggle.toggle');

    if (splatToggle) {
        splatToggle.addEventListener('click', () => {
            document.body.classList.toggle('splat-toggle');
            splatToggle.classList.toggle('active');
            makeItRain();
        });
    }

    if (backRowToggle) {
        backRowToggle.addEventListener('click', () => {
            document.body.classList.toggle('back-row-toggle');
            backRowToggle.classList.toggle('active');
            makeItRain();
        });
    }

    if (singleToggle) {
        singleToggle.addEventListener('click', () => {
            document.body.classList.toggle('single-toggle');
            singleToggle.classList.toggle('active');
            makeItRain();
        });
    }
});

// -------- Post-processing --------
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    BLOOM_PARAMS.strength, 
    BLOOM_PARAMS.radius, 
    BLOOM_PARAMS.threshold
);
composer.addPass(bloomPass);

const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    scene, 
    camera, 
    []
);
outlinePass.edgeStrength = 2.0;
outlinePass.edgeGlow = 0.3;
outlinePass.edgeThickness = 1.0;
outlinePass.pulsePeriod = 0;
outlinePass.visibleEdgeColor.set(0xffd64a);
outlinePass.hiddenEdgeColor.set(0x000000);
composer.addPass(outlinePass);

// -------- Enhanced Render Loop with Realistic Logo Movement --------
const clock = new THREE.Clock();
let frameCount = 0;
let totalTime = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.016); // Cap delta time for stability
    totalTime += dt;
    
    // Natural spin animation on single axis (Y-axis)
    if (logoGroup) {
        // Smooth natural rotation on Y-axis only
        const baseRotationSpeed = 0.4; // Moderate base speed
        const speedVariation = Math.sin(totalTime * 0.2) * 0.05; // Subtle natural speed variation
        const rotationSpeedY = baseRotationSpeed + speedVariation; // Natural speed with slight variation
        logoGroup.rotation.y += rotationSpeedY * dt;
        
        // Reset other rotations to zero (we want Y-axis rotation only)
        logoGroup.rotation.x = Math.sin(totalTime * 0.3) * 0.03; // Tiny wobble for natural feel
        logoGroup.rotation.z = Math.sin(totalTime * 0.25) * 0.02; // Tiny wobble for natural feel
        
        // Subtle vertical floating motion (reduced for more stability)
        const floatAmplitude = 0.03;
        const floatFrequency = 0.5;
        logoGroup.position.y = Math.sin(totalTime * floatFrequency) * floatAmplitude;
        
        // Very subtle horizontal drift (reduced for more stability)
        const driftAmplitude = 0.01;
        const driftFrequency = 0.25;
        logoGroup.position.x = Math.sin(totalTime * driftFrequency + Math.PI * 0.3) * driftAmplitude;
    }
    
    // Enhanced camera animation during intro with natural zoom curve
    if (startTime && !introDone) {
        const t = performance.now() - startTime;
        const p = Math.min(t / ZOOM_DURATION, 1);
        
        // Enhanced easing function for more natural camera movement
        // Start slow, accelerate in the middle, then slow down again at the end
        const eased = enhancedEaseInOut(p);
        
        camera.position.z = START_Z + (INSIDE_Z - START_Z) * eased;
        
        // Add subtle camera sway for more dramatic effect
        if (p > 0.1 && p < 0.9) {
            const swayAmount = 0.05 * Math.sin(p * Math.PI * 3) * (1 - p);
            camera.position.x = swayAmount;
            camera.position.y = swayAmount * 0.7;
        }
        
        // Fade outline near end
        if (p > 0.8 && outlinePass) {
            outlinePass.edgeStrength = 2.0 * (1 - (p - 0.8) / 0.2);
            if (p >= 1) outlinePass.enabled = false;
        }
        
        if (p >= 1) {
            finishIntro();
        }
        
        camera.lookAt(0, 0, 0);
    }
    
    // Render the scene
    composer.render();
    frameCount++;
}
animate();

// -------- Optimized Resize Handler --------
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
        bloomPass.setSize(width, height);
        outlinePass.setSize(width, height);
    }, 100);
});

// -------- Utility Functions --------
function easeInOutSine(x) { 
    return -(Math.cos(Math.PI * x) - 1) / 2; 
}

// Enhanced easing function for more dramatic camera movement
function enhancedEaseInOut(x) {
    // Custom easing function that starts slow, speeds up in the middle, and slows down at the end
    // This creates a more natural and cinematic camera movement
    
    // First part: slow start (first 30%)
    if (x < 0.3) {
        return 0.5 * Math.pow(x / 0.3, 2);
    }
    // Middle part: moderate speed (from 30% to 70%)
    else if (x < 0.7) {
        const t = (x - 0.3) / 0.4;
        return 0.5 + 0.4 * t;
    }
    // End part: gradual slowdown (last 30%)
    else {
        const t = (x - 0.7) / 0.3;
        return 0.9 + 0.1 * (1 - Math.pow(1 - t, 2));
    }
}

function createRainyNightSky() {
    const canvas = document.createElement('canvas');
    canvas.width = 16; 
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 0, 256);
    
    // Stormy night sky gradient
    grd.addColorStop(0, '#1a1a2e');
    grd.addColorStop(0.4, '#16213e');
    grd.addColorStop(0.8, '#0f3460');
    grd.addColorStop(1, '#0a0a0d');
    
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 16, 256);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

function createStarfield(count = 800) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        const r = 60 + Math.random() * 20;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * Math.PI * 2;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        positions.set([x, y, z], i * 3);
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 0.4, 
        sizeAttenuation: true, 
        transparent: true, 
        opacity: 0.6 
    });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
}

function updateOutlineSelection() {
    const meshes = [];
    logoGroup.traverse(o => { if (o.isMesh) meshes.push(o); });
    outlinePass.selectedObjects = meshes;
}

// Performance monitoring
window.__skipIntro = finishIntro;
window.__getPerformanceStats = () => ({
    frameCount,
    stars: STAR_COUNT
});