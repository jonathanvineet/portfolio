import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// -------- Optimized Config --------
const MODEL_URL = '/models/batman_logo.glb';
const ZOOM_DURATION = 3800; // Faster intro
const BLOOM_PARAMS = { strength: 0.25, radius: 0.4, threshold: 0.4 };
const STAR_COUNT = 800; // Reduced for performance
const RAIN_COUNT = 150; // Optimized rain particle count

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
const START_Z = 4.5; const INSIDE_Z = -0.4;
camera.position.set(0, 0, START_Z);
scene.add(camera);

// -------- Enhanced Lighting for Rain --------
const keyLight = new THREE.DirectionalLight(0x9bb5ff, 1.8); // Cool overcast light
keyLight.position.set(6, 8, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 50;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x4a6fa5, 0.6);
rimLight.position.set(-4, -2, -3);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0x2c3e50, 0.4); // Darker ambient for stormy feel
scene.add(ambientLight);

scene.fog = new THREE.FogExp2(0x1a1a2e, 0.05); // Atmospheric fog

let logoGroup = new THREE.Group();
let logoMesh = null; // Reference to the actual logo mesh for collision
let logoBoundingBox = new THREE.Box3();
scene.add(logoGroup);

createStarfield(STAR_COUNT);

// -------- Rain Physics System --------
class RainDrop {
    constructor() {
        this.velocity = new THREE.Vector3();
        this.position = new THREE.Vector3();
        this.gravity = -9.8;
        this.bounce = 0.3;
        this.friction = 0.95;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.splashing = false;
        this.splashTime = 0;
        this.onLogo = false;
        this.reset();
    }

    reset() {
        // Spawn rain above the scene
        this.position.set(
            (Math.random() - 0.5) * 12,
            8 + Math.random() * 4,
            (Math.random() - 0.5) * 12
        );
        this.velocity.set(
            (Math.random() - 0.5) * 0.5, // Slight horizontal drift
            -8 - Math.random() * 4, // Downward velocity
            (Math.random() - 0.5) * 0.5
        );
        this.life = this.maxLife = 0.8 + Math.random() * 0.4;
        this.splashing = false;
        this.splashTime = 0;
        this.onLogo = false;
    }

    update(deltaTime) {
        if (this.splashing) {
            this.splashTime += deltaTime;
            this.life -= deltaTime * 3;
            if (this.splashTime > 0.2 || this.life <= 0) {
                this.reset();
            }
            return;
        }

        // Apply gravity
        this.velocity.y += this.gravity * deltaTime;
        
        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Check collision with logo
        if (logoMesh && this.checkLogoCollision()) {
            this.handleLogoCollision();
        }

        // Reset if too far down or out of bounds
        if (this.position.y < -6 || Math.abs(this.position.x) > 15 || Math.abs(this.position.z) > 15) {
            this.reset();
        }

        this.life -= deltaTime * 0.1;
        if (this.life <= 0) {
            this.reset();
        }
    }

    checkLogoCollision() {
        if (!logoMesh) return false;
        
        // Simple bounding box collision first
        if (!logoBoundingBox.containsPoint(this.position)) {
            return false;
        }

        // More precise collision using raycasting
        const raycaster = new THREE.Raycaster();
        const direction = this.velocity.clone().normalize();
        raycaster.set(this.position, direction);
        
        const intersects = raycaster.intersectObject(logoMesh, true);
        return intersects.length > 0 && intersects[0].distance < 0.1;
    }

    handleLogoCollision() {
        this.onLogo = true;
        
        // Create splash effect
        this.splashing = true;
        this.splashTime = 0;
        
        // Bounce off with reduced velocity
        this.velocity.multiplyScalar(this.bounce);
        this.velocity.y = Math.abs(this.velocity.y) * 0.5; // Bounce up slightly
        
        // Add some randomness to the bounce
        this.velocity.x += (Math.random() - 0.5) * 2;
        this.velocity.z += (Math.random() - 0.5) * 2;
    }
}

class RainSystem {
    constructor() {
        this.drops = [];
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(RAIN_COUNT * 3);
        this.colors = new Float32Array(RAIN_COUNT * 3);
        this.sizes = new Float32Array(RAIN_COUNT);
        
        // Initialize rain drops
        for (let i = 0; i < RAIN_COUNT; i++) {
            this.drops.push(new RainDrop());
        }

        // Create geometry attributes
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

        // Rain material with realistic water properties
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vSize = size;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vSize;
                uniform float time;
                
                void main() {
                    vec2 center = gl_PointCoord - 0.5;
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Create water droplet effect
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                    alpha *= 0.8;
                    
                    // Add slight shimmer
                    float shimmer = sin(time * 10.0 + dist * 20.0) * 0.1 + 0.9;
                    
                    gl_FragColor = vec4(vColor * shimmer, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.points = new THREE.Points(this.geometry, this.material);
        scene.add(this.points);
    }

    update(deltaTime) {
        this.material.uniforms.time.value += deltaTime;

        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            drop.update(deltaTime);

            // Update geometry
            const i3 = i * 3;
            this.positions[i3] = drop.position.x;
            this.positions[i3 + 1] = drop.position.y;
            this.positions[i3 + 2] = drop.position.z;

            // Color based on state
            if (drop.splashing) {
                this.colors[i3] = 0.8;     // R - bright splash
                this.colors[i3 + 1] = 0.9; // G
                this.colors[i3 + 2] = 1.0; // B
                this.sizes[i] = 8 + Math.sin(drop.splashTime * 20) * 4;
            } else if (drop.onLogo) {
                this.colors[i3] = 0.6;     // R - on logo
                this.colors[i3 + 1] = 0.8; // G
                this.colors[i3 + 2] = 1.0; // B
                this.sizes[i] = 3;
            } else {
                this.colors[i3] = 0.4;     // R - falling
                this.colors[i3 + 1] = 0.6; // G
                this.colors[i3 + 2] = 0.9; // B
                this.sizes[i] = 2 + Math.random();
            }
        }

        // Update geometry
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
    }
}

const rainSystem = new RainSystem();

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
    logoBoundingBox.setFromObject(mesh);
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
            
            // Create realistic Batman logo material
            const material = new THREE.MeshStandardMaterial({
                color: 0x808080, // Grey base
                metalness: 0.2,
                roughness: 0.8,
                transparent: false, // Completely opaque
                side: THREE.DoubleSide
            });
            
            // Add gradient effect
            material.onBeforeCompile = (shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <color_fragment>',
                    `
                    #include <color_fragment>
                    // Add gradient from grey to dark grey
                    float gradient = (vNormal.y + 1.0) * 0.5;
                    vec3 greyColor = mix(vec3(0.25, 0.25, 0.25), vec3(0.5, 0.5, 0.5), gradient);
                    diffuseColor.rgb = greyColor;
                    `
                );
            };
            
            obj.material = material;
            
            if (!logoMesh) {
                logoMesh = obj; // Store reference for collision
            }
        }
    });
    
    // Scale and center the logo
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.8 / maxDim;
    gltf.scene.scale.setScalar(scale);
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    gltf.scene.position.sub(center.multiplyScalar(scale));
    
    // Update bounding box for collision detection
    logoBoundingBox.setFromObject(gltf.scene);
    
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
        requestAnimationFrame(() => welcome.classList.add('show'));
    }, 300);
}

skipBtn.addEventListener('click', finishIntro);

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

// -------- Optimized Render Loop --------
const clock = new THREE.Clock();
let frameCount = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.016); // Cap delta time for stability
    
    // Update logo rotation
    logoGroup.rotation.y += 0.25 * dt;
    
    // Update rain physics
    rainSystem.update(dt);
    
    // Camera animation during intro
    if (startTime && !introDone) {
        const t = performance.now() - startTime;
        const p = Math.min(t / ZOOM_DURATION, 1);
        const eased = easeInOutSine(p);
        camera.position.z = START_Z + (INSIDE_Z - START_Z) * eased;
        
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
    
    // Render every frame for smooth rain physics
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
    rainDrops: RAIN_COUNT,
    stars: STAR_COUNT
});