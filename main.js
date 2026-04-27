import * as THREE from 'three';

// Game State
let isPlaying = false;
let isGameOver = false;
let score = 0;

// Physics constants
const gravity = -20;
const jumpStrength = 8;
const gameSpeed = 5;
let velocityY = 0;

// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 20, 50);

// 2.5D Camera Setup: PerspectiveCamera slightly angled
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 15);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows for volumetric feel
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Audio Setup
const listener = new THREE.AudioListener();
camera.add(listener);

const jumpSound = new THREE.Audio(listener);
const gameOverSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('./assets/jump.wav', (buffer) => {
    jumpSound.setBuffer(buffer);
    jumpSound.setVolume(0.5);
});

audioLoader.load('./assets/game_over.wav', (buffer) => {
    gameOverSound.setBuffer(buffer);
    gameOverSound.setVolume(0.5);
});

// Ghosty (Bird) Model Construction using Primitives
const ghostGroup = new THREE.Group();

// Ghost Body
const bodyGeo = new THREE.SphereGeometry(0.8, 32, 32);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.castShadow = true;
body.receiveShadow = true;
ghostGroup.add(body);

// Ghost Eyes
const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(0.3, 0.2, 0.7);
ghostGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(-0.3, 0.2, 0.7);
ghostGroup.add(rightEye);

// Ghost Tail (Cones to give a floaty ghost tail look)
const tailGeo = new THREE.ConeGeometry(0.2, 0.6, 16);
const tailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
for (let i = -1; i <= 1; i++) {
    const tailPart = new THREE.Mesh(tailGeo, tailMat);
    tailPart.position.set(i * 0.4, -0.7, 0);
    tailPart.rotation.x = Math.PI; // point downwards
    tailPart.castShadow = true;
    ghostGroup.add(tailPart);
}

scene.add(ghostGroup);
// Initial position
ghostGroup.position.x = -4;

// Bounding box for ghosty
const ghostBox = new THREE.Box3();

// Pipes Setup
const pipes = [];
const pipeWidth = 2;
const pipeGap = 6;
const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x32CD32, roughness: 0.6, metalness: 0.1 });
const pipeGeometry = new THREE.CylinderGeometry(pipeWidth / 2, pipeWidth / 2, 20, 32);

function createPipe() {
    const pipeGroup = new THREE.Group();
    
    // Top Pipe
    const topPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    topPipe.position.y = 10 + pipeGap / 2;
    topPipe.castShadow = true;
    topPipe.receiveShadow = true;
    pipeGroup.add(topPipe);

    // Bottom Pipe
    const bottomPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
    bottomPipe.position.y = -10 - pipeGap / 2;
    bottomPipe.castShadow = true;
    bottomPipe.receiveShadow = true;
    pipeGroup.add(bottomPipe);

    // Cap for Top Pipe
    const capGeo = new THREE.CylinderGeometry(pipeWidth/2 + 0.2, pipeWidth/2 + 0.2, 1, 32);
    const topCap = new THREE.Mesh(capGeo, pipeMaterial);
    topCap.position.y = pipeGap / 2 + 0.5;
    topCap.castShadow = true;
    pipeGroup.add(topCap);

    // Cap for Bottom Pipe
    const bottomCap = new THREE.Mesh(capGeo, pipeMaterial);
    bottomCap.position.y = -pipeGap / 2 - 0.5;
    bottomCap.castShadow = true;
    pipeGroup.add(bottomCap);

    // Randomize vertical position
    const minHeight = -4;
    const maxHeight = 4;
    pipeGroup.position.y = Math.random() * (maxHeight - minHeight) + minHeight;
    pipeGroup.position.x = 15; // start off-screen right

    pipeGroup.passed = false;
    scene.add(pipeGroup);
    pipes.push(pipeGroup);
}

// Background elements (clouds, etc) for 2.5D feel
function createCloud(x, y, z) {
    const cloudGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    
    const p1 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), cloudMat);
    p1.position.set(1.2, -0.2, 0);
    cloud.add(p1);
    
    const p2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), cloudMat);
    p2.position.set(-1.2, -0.3, 0);
    cloud.add(p2);

    cloud.position.set(x, y, z);
    scene.add(cloud);
}

createCloud(10, 8, -10);
createCloud(-15, 6, -15);
createCloud(5, 12, -20);

// UI Elements
const uiScore = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

function startGame() {
    isPlaying = true;
    isGameOver = false;
    score = 0;
    uiScore.innerText = score;
    velocityY = 0;
    ghostGroup.position.y = 0;
    ghostGroup.rotation.z = 0;
    
    // Clear existing pipes
    pipes.forEach(p => scene.remove(p));
    pipes.length = 0;
    
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';

    // Initial jump
    jump();
}

function gameOver() {
    isPlaying = false;
    isGameOver = true;
    if (gameOverSound.buffer && !gameOverSound.isPlaying) gameOverSound.play();
    
    finalScore.innerText = score;
    gameOverScreen.style.display = 'flex';
}

function jump() {
    if (!isPlaying) return;
    velocityY = jumpStrength;
    if (jumpSound.buffer && jumpSound.isPlaying) jumpSound.stop();
    if (jumpSound.buffer) jumpSound.play();
}

// Controls
window.addEventListener('mousedown', jump);
window.addEventListener('touchstart', jump);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Pipe spawning timer
let pipeSpawnTimer = 0;
const pipeSpawnInterval = 2; // seconds

const clock = new THREE.Clock();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (isPlaying && !isGameOver) {
        // Physics
        velocityY += gravity * delta;
        ghostGroup.position.y += velocityY * delta;

        // Rotation based on velocity
        ghostGroup.rotation.z = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, velocityY * 0.1));

        // Update Ghost Bounding Box
        ghostBox.setFromObject(ghostGroup);

        // Pipe spawning
        pipeSpawnTimer += delta;
        if (pipeSpawnTimer > pipeSpawnInterval) {
            createPipe();
            pipeSpawnTimer = 0;
        }

        // Pipe movement and collision
        for (let i = pipes.length - 1; i >= 0; i--) {
            const pipe = pipes[i];
            pipe.position.x -= gameSpeed * delta;

            // Collision detection
            const pipeBoxTop = new THREE.Box3().setFromObject(pipe.children[0]);
            const pipeBoxBottom = new THREE.Box3().setFromObject(pipe.children[1]);
            const capBoxTop = new THREE.Box3().setFromObject(pipe.children[2]);
            const capBoxBottom = new THREE.Box3().setFromObject(pipe.children[3]);

            if (ghostBox.intersectsBox(pipeBoxTop) || 
                ghostBox.intersectsBox(pipeBoxBottom) ||
                ghostBox.intersectsBox(capBoxTop) ||
                ghostBox.intersectsBox(capBoxBottom)) {
                gameOver();
            }

            // Score logic
            if (!pipe.passed && pipe.position.x < ghostGroup.position.x) {
                pipe.passed = true;
                score++;
                uiScore.innerText = score;
            }

            // Remove off-screen pipes
            if (pipe.position.x < -15) {
                scene.remove(pipe);
                pipes.splice(i, 1);
            }
        }

        // Floor / Ceiling collision
        if (ghostGroup.position.y < -10 || ghostGroup.position.y > 10) {
            gameOver();
        }
    } else if (isGameOver) {
        // Fall to the ground on game over
        if (ghostGroup.position.y > -10) {
            velocityY += gravity * delta;
            ghostGroup.position.y += velocityY * delta;
            ghostGroup.rotation.z -= delta * 5;
        }
    } else {
        // Float animation on start screen
        ghostGroup.position.y = Math.sin(clock.getElapsedTime() * 3) * 0.5;
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
