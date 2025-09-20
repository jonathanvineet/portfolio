import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// -------- Config --------
const MODEL_URL = '/models/batman_logo.glb';
const PHASE1_DURATION = 1800; // kept for reference (no longer split)
const PHASE2_DURATION = 1400; // kept for reference (no longer split)
const HOLD_ON_LOGO = 600;     // no longer used (continuous zoom)
const INTRO_TOTAL = PHASE1_DURATION + PHASE2_DURATION; // legacy
const ZOOM_DURATION = 5200; // single continuous gradual zoom (ms)
const BLOOM_PARAMS = { strength: 0.35, radius: 0.55, threshold: 0.3 };
const STAR_COUNT = 1300;

// -------- DOM refs --------
const root = document.getElementById('intro-root');
const welcome = document.getElementById('welcome');
const skipBtn = document.getElementById('skip-intro');
// ---- Rain canvas (re-added after simplification) ----
const rainCanvas = document.createElement('canvas');
rainCanvas.className = 'rain-canvas';
root.appendChild(rainCanvas);
const rctx = rainCanvas.getContext('2d');
function resizeRainCanvas(){
	const dpr = window.devicePixelRatio || 1;
	rainCanvas.width = window.innerWidth * dpr;
	rainCanvas.height = window.innerHeight * dpr;
	rainCanvas.style.width = window.innerWidth + 'px';
	rainCanvas.style.height = window.innerHeight + 'px';
	rctx.setTransform(1,0,0,1,0,0);
	rctx.scale(dpr,dpr);
}
resizeRainCanvas();
class RainEngine {
	constructor(){
		this.drops=[]; this.dropCount=260; this.spawnInitial();
	}
	spawnInitial(){ for(let i=0;i<this.dropCount;i++) this.drops.push(this.makeDrop(true)); }
	makeDrop(seed=false){ const w=window.innerWidth,h=window.innerHeight; return { x:Math.random()*w, y:seed?Math.random()*h:-40-Math.random()*600, len:70+Math.random()*140, speed:800+Math.random()*900, thick:0.8+Math.random()*1.1 }; }
	update(dt){ if(introDone) return; const h=window.innerHeight; for(let d of this.drops){ d.y+=d.speed*dt; if(d.y - d.len > h+80){ Object.assign(d,this.makeDrop()); } } }
	draw(){ rctx.clearRect(0,0,rainCanvas.width,rainCanvas.height); rctx.lineCap='round'; rctx.globalCompositeOperation='source-over'; rctx.strokeStyle='rgba(255,255,255,0.32)'; for(let d of this.drops){ rctx.lineWidth=d.thick; rctx.beginPath(); rctx.moveTo(d.x,d.y-d.len); rctx.lineTo(d.x,d.y); rctx.stroke(); } }
}
// (Old masked-letter rain fragment removed)
const rainEngine = new RainEngine();

// Three.js renderer / scene bootstrapping (restored)
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.domElement.classList.add('webgl');
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = createNightSkyGradient();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 100);
const START_Z = 4.5; const MID_Z = 2.2; const INSIDE_Z = -0.6;
camera.position.set(0,0,START_Z);
scene.add(camera);

const keyLight = new THREE.DirectionalLight(0xffe9aa, 1.25);
keyLight.position.set(4,6,5); scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0xffd54d, 0.75); rimLight.position.set(-4,-2,-3); scene.add(rimLight);
scene.add(new THREE.AmbientLight(0x404040,0.6));
scene.fog = new THREE.FogExp2(0x000000,0.08);
let logoGroup = new THREE.Group(); scene.add(logoGroup);
createStarfield(STAR_COUNT);

// Add BatComputer Initializing text element
const batComputerText = document.createElement('div');
batComputerText.id = 'batcomputer-init';
batComputerText.style.position = 'absolute';
batComputerText.style.top = '48%';
batComputerText.style.left = '50%';
batComputerText.style.transform = 'translate(-50%, -50%)';
batComputerText.style.color = '#ffd64a';
batComputerText.style.fontSize = '2.2rem';
batComputerText.style.fontFamily = 'monospace';
batComputerText.style.textShadow = '0 0 12px #222, 0 0 24px #ffd64a';
batComputerText.style.zIndex = '101'; // <-- ensure above overlay
batComputerText.style.pointerEvents = 'none';
batComputerText.style.transition = 'opacity 0.7s';
batComputerText.style.opacity = '1';
batComputerText.textContent = '';
root.appendChild(batComputerText);
		// (Removed per request: individual splash on letters)
const blankOverlay = document.createElement('div');
blankOverlay.id = 'blank-overlay';
blankOverlay.style.position = 'fixed';
blankOverlay.style.top = '0';
blankOverlay.style.left = '0';
blankOverlay.style.width = '100vw';
blankOverlay.style.height = '100vh';
blankOverlay.style.background = '#050607';
blankOverlay.style.zIndex = '100'; // <-- lower than batComputerText
blankOverlay.style.transition = 'opacity 0.7s';
blankOverlay.style.opacity = '1';
root.appendChild(blankOverlay);

function addPlaceholder() {
	const geo = new THREE.TorusGeometry(1.4, 0.5, 16, 64);
	const mat = new THREE.MeshStandardMaterial({ color:0xffd400, metalness:0.7, roughness:0.2, emissive:0x111100 });
	const mesh = new THREE.Mesh(geo, mat);
	mesh.rotation.x = Math.PI * 0.5;
	logoGroup.add(mesh);
}

// Load model
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
gltfLoader.setDRACOLoader(dracoLoader);

let modelLoaded = false;
gltfLoader.load(MODEL_URL, (gltf) => {
	// Center & scale
	logoGroup.clear();
	logoGroup.add(gltf.scene);
	gltf.scene.traverse(obj => {
		if (obj.isMesh) {
			obj.castShadow = obj.receiveShadow = true;
			if (obj.material) {
				obj.material.depthWrite = true;
			}
		}
	});
	// Compute bounding box to scale
	const box = new THREE.Box3().setFromObject(gltf.scene);
	const size = new THREE.Vector3();
	box.getSize(size);
	const maxDim = Math.max(size.x, size.y, size.z);
	const scale = 2.8 / maxDim; // target size
	gltf.scene.scale.setScalar(scale);
	// Recenter
	const center = new THREE.Vector3();
	box.getCenter(center);
	gltf.scene.position.sub(center.multiplyScalar(scale));
				modelLoaded = true;
				updateOutlineSelection();
		startIntro();
}, (xhr) => {
	// progress
}, (err) => {
	console.warn('Failed to load model, using placeholder', err);
	addPlaceholder();
	updateOutlineSelection();
	startIntro();
});

// If model doesn't load in 3s show placeholder
setTimeout(() => { if (!modelLoaded && logoGroup.children.length === 0) { addPlaceholder(); } }, 3000);

// Animation state
let startTime = null;
let introDone = false;
// removed hold / fade staging for continuous zoom

// BatComputer typing animation config
const BATCOMPUTER_TEXT = 'BatComputer Initializing...';
// Define segments and their pace (ms per letter)
const TYPE_SEGMENTS = [
	{ text: 'Bat', pace: 120 },
	{ text: 'Computer', pace: 55 },
	{ text: ' ', pace: 30 },
	{ text: 'Initializing...', pace: 80 }
];
const AFTER_TYPE_DELAY = 700; // ms after full text before fade
const BATCOMPUTER_FADE = 900; // ms for fade out

function showBatComputerInit(callback) {
	batComputerText.textContent = '';
	batComputerText.innerHTML = '';
	let segIdx = 0, charIdx = 0;
	function appendLetter(ch) {
		const span = document.createElement('span');
		span.className = 'letter';
		span.style.position = 'relative';
		span.textContent = ch;
		batComputerText.appendChild(span);
		// Plain typing, no rain interaction
	}
	function typeNext() {
		if (segIdx < TYPE_SEGMENTS.length) {
			const seg = TYPE_SEGMENTS[segIdx];
			if (charIdx < seg.text.length) {
				const ch = seg.text[charIdx];
				appendLetter(ch);
				charIdx++;
				setTimeout(typeNext, seg.pace);
			} else {
				segIdx++; charIdx = 0;
				setTimeout(typeNext, 180);
			}
		} else {
			setTimeout(() => {
				batComputerText.style.opacity = '0';
				setTimeout(() => {
					batComputerText.style.display = 'none';
					blankOverlay.style.opacity = '0';
					setTimeout(() => { blankOverlay.style.display = 'none'; callback(); }, 700);
				}, BATCOMPUTER_FADE);
			}, AFTER_TYPE_DELAY);
		}
	}
	typeNext();
}

function startIntro() {
	// Start Batman logo animation after BatComputer init sequence
	showBatComputerInit(() => {
		startTime = performance.now();
	});
}

function finishIntro() {
	if (introDone) return;
	introDone = true;
	document.body.classList.add('intro-fade-out');
	// Fade rain canvas away
	rainCanvas.classList.add('fade-out');
	setTimeout(() => { rainCanvas.remove(); }, 1600);
	setTimeout(() => {
		welcome.classList.remove('hidden');
		requestAnimationFrame(() => welcome.classList.add('show'));
	}, 300); // slight delay for fade
}

skipBtn.addEventListener('click', () => {
	finishIntro();
});

// Post-processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), BLOOM_PARAMS.strength, BLOOM_PARAMS.radius, BLOOM_PARAMS.threshold);
composer.addPass(bloomPass);

// Outline pass (true border glow)
const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, []);
outlinePass.edgeStrength = 2.4;      // lower intensity
outlinePass.edgeGlow = 0.35;         // minimal spread
outlinePass.edgeThickness = 1.1;     // thinner line
outlinePass.pulsePeriod = 0;         // no built-in pulsing
outlinePass.visibleEdgeColor.set(0xffd64a); // cartoonish yellow
outlinePass.hiddenEdgeColor.set(0x000000);
composer.addPass(outlinePass);

// Render loop
const clock = new THREE.Clock();
function animate() {
	requestAnimationFrame(animate);
	const dt = clock.getDelta();
	logoGroup.rotation.y += 0.3 * dt;
	const now = performance.now();
	rainEngine.update(dt);
	rainEngine.draw();

	// Intermittent rain impacts on logo (simulate hits)
		// (Removed per request: random logo splash hits)

		if (startTime && !introDone) {
			const t = performance.now() - startTime;
			const p = Math.min(t / ZOOM_DURATION, 1);
			// More gradual overall motion using sine ease
			const eased = easeInOutSine(p);
			camera.position.z = START_Z + (INSIDE_Z - START_Z) * eased;
			// Fade outline near end
			if (p > 0.75 && outlinePass) {
				outlinePass.edgeStrength = 4.0 * (1 - (p - 0.75) / 0.25);
				if (p >= 1) outlinePass.enabled = false;
			}
			if (p >= 1) {
				finishIntro();
			}
			camera.lookAt(0,0,0);
		}

		composer.render();
}
animate();

// Resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
			composer.setSize(window.innerWidth, window.innerHeight);
			bloomPass.setSize(window.innerWidth, window.innerHeight);
			outlinePass.setSize(window.innerWidth, window.innerHeight);
	resizeRainCanvas();
	// no letter collision scan needed now
});

// Easing
function easeInOutQuad(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
function easeInExpo(x) { return x === 0 ? 0 : Math.pow(2, 10 * (x - 1)); }
function easeInOutSine(x){ return -(Math.cos(Math.PI * x) - 1) / 2; }

// ---- Helpers: Night sky, stars, halo ----
function createNightSkyGradient() {
	const canvas = document.createElement('canvas');
	canvas.width = 16; canvas.height = 256;
	const ctx = canvas.getContext('2d');
	const grd = ctx.createLinearGradient(0, 0, 0, 256);
	// Deep top (near-black navy) to slightly warmer bottom
	grd.addColorStop(0, '#020307');
	grd.addColorStop(0.55, '#040b16');
	grd.addColorStop(1, '#0a0a0d');
	ctx.fillStyle = grd;
	ctx.fillRect(0,0,16,256);
	const tex = new THREE.CanvasTexture(canvas);
	tex.colorSpace = THREE.SRGBColorSpace;
	return tex;
}

function createStarfield(count = 800) {
	const geo = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		// Random position on a spherical shell
		const r = 60 + Math.random() * 20; // distant
		const theta = Math.acos(2 * Math.random() - 1);
		const phi = Math.random() * Math.PI * 2;
		const x = r * Math.sin(theta) * Math.cos(phi);
		const y = r * Math.sin(theta) * Math.sin(phi);
		const z = r * Math.cos(theta);
		positions.set([x, y, z], i * 3);
	}
	geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, sizeAttenuation: true, transparent:true, opacity:0.8 });
	const stars = new THREE.Points(geo, mat);
	scene.add(stars);
}

function updateOutlineSelection() {
	const meshes = [];
	logoGroup.traverse(o => { if (o.isMesh) meshes.push(o); });
	outlinePass.selectedObjects = meshes;
}

// Expose a hook for manual skip via console
window.__skipIntro = finishIntro;

// (Removed old DOM rain implementation; using canvas RainEngine above)


