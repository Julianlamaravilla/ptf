import * as THREE from 'three';
import { Ghosty } from '../entities/Ghosty.js';
import { PipePool } from '../entities/PipePool.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { InputSystem } from '../systems/InputSystem.js';
import { AudioSystem } from '../systems/AudioSystem.js';
import { CameraShakeSystem } from '../systems/CameraShakeSystem.js';
import { events, GameEvents } from '../events/EventBus.js';
import { stateMachine, GameStates } from '../state/StateMachine.js';
import { Config } from './Config.js';

export class Game {
    constructor() {
        this.initThree();
        this.initEntities();
        this.initSystems();
        this.initUI();
        this.bindEvents();

        this.clock = new THREE.Clock();
        this.score = 0;
        this.pipeSpawnTimer = 0;

        // Start Loop
        this.animate = this.animate.bind(this);
        this.animate();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 50);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 15);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);

        // Background Clouds
        this.clouds = [];
        this.createCloud(10, 8, -10);
        this.createCloud(-15, 6, -15);
        this.createCloud(5, 12, -20);
        this.createCloud(25, 4, -12);
        this.createCloud(-5, 10, -25);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createCloud(x, y, z) {
        const cloudGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const cloudMat = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            flatShading: true,
            transparent: true,
            opacity: 0.8
        });
        const cloud = new THREE.Mesh(cloudGeo, cloudMat);
        
        const p1 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), cloudMat);
        p1.position.set(1.2, -0.2, 0);
        cloud.add(p1);
        
        const p2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), cloudMat);
        p2.position.set(-1.2, -0.3, 0);
        cloud.add(p2);

        cloud.position.set(x, y, z);
        this.scene.add(cloud);

        // Calculate speed based on z-depth (closer clouds move faster)
        // Since z is negative, a smaller absolute value means it's closer
        const speed = 10 / Math.abs(z);
        this.clouds.push({ mesh: cloud, speed: speed });
    }

    initEntities() {
        this.ghosty = new Ghosty();
        this.scene.add(this.ghosty.group);

        this.pipePool = new PipePool(this.scene, 10);
    }

    initSystems() {
        this.physicsSystem = new PhysicsSystem(this.ghosty, this.pipePool);
        this.inputSystem = new InputSystem();
        this.audioSystem = new AudioSystem(this.camera);
        this.cameraShakeSystem = new CameraShakeSystem(this.camera);
    }

    initUI() {
        this.uiScore = document.getElementById('score');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScore = document.getElementById('finalScore');

        document.getElementById('startBtn').addEventListener('click', () => events.emit(GameEvents.START_GAME));
        document.getElementById('restartBtn').addEventListener('click', () => events.emit(GameEvents.START_GAME));
    }

    bindEvents() {
        events.on(GameEvents.START_GAME, () => {
            stateMachine.transition(GameStates.PLAYING);
            this.score = 0;
            this.uiScore.innerText = this.score;
            this.pipeSpawnTimer = 0;
            
            this.ghosty.reset();
            this.pipePool.reset();

            this.startScreen.classList.remove('visible');
            this.gameOverScreen.classList.remove('visible');
            
            events.emit(GameEvents.JUMP); // Initial jump
        });

        events.on(GameEvents.COLLISION, () => {
            if (stateMachine.is(GameStates.PLAYING)) {
                stateMachine.transition(GameStates.GAME_OVER);
                this.finalScore.innerText = this.score;
                this.gameOverScreen.classList.add('visible');
            }
        });

        events.on(GameEvents.SCORE, () => {
            this.score++;
            this.uiScore.innerText = this.score;
            
            // Pop animation on score
            this.uiScore.classList.remove('pop');
            void this.uiScore.offsetWidth; // trigger reflow
            this.uiScore.classList.add('pop');
        });
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        const delta = this.clock.getDelta();

        // Update Systems
        this.physicsSystem.update(delta);
        this.cameraShakeSystem.update(delta);

        // Parallax Clouds
        this.clouds.forEach(cloudObj => {
            cloudObj.mesh.position.x -= cloudObj.speed * delta;
            if (cloudObj.mesh.position.x < -25) {
                cloudObj.mesh.position.x = 25; // Wrap around
            }
        });

        // State specific logic
        if (stateMachine.is(GameStates.PLAYING)) {
            this.pipeSpawnTimer += delta;
            if (this.pipeSpawnTimer > Config.PIPE_SPAWN_INTERVAL) {
                this.pipePool.spawn();
                this.pipeSpawnTimer = 0;
            }
        } else if (stateMachine.is(GameStates.START_SCREEN)) {
            // Float animation
            this.ghosty.group.position.y = Math.sin(this.clock.getElapsedTime() * 3) * 0.5;
            this.startScreen.classList.add('visible');
        }

        this.renderer.render(this.scene, this.camera);
    }
}
