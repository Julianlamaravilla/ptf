import * as THREE from 'three';
import { Config } from '../core/Config.js';

class Pipe {
    constructor() {
        this.group = new THREE.Group();
        this.active = false;
        this.passed = false;

        const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x32CD32, roughness: 0.6, metalness: 0.1 });
        const pipeGeometry = new THREE.CylinderGeometry(Config.PIPE_WIDTH / 2, Config.PIPE_WIDTH / 2, 20, 32);
        
        // Top Pipe
        this.topPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        this.topPipe.castShadow = true;
        this.topPipe.receiveShadow = true;
        this.group.add(this.topPipe);

        // Bottom Pipe
        this.bottomPipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        this.bottomPipe.castShadow = true;
        this.bottomPipe.receiveShadow = true;
        this.group.add(this.bottomPipe);

        // Caps
        const capGeo = new THREE.CylinderGeometry(Config.PIPE_WIDTH/2 + 0.2, Config.PIPE_WIDTH/2 + 0.2, 1, 32);
        this.topCap = new THREE.Mesh(capGeo, pipeMaterial);
        this.topCap.castShadow = true;
        this.group.add(this.topCap);

        this.bottomCap = new THREE.Mesh(capGeo, pipeMaterial);
        this.bottomCap.castShadow = true;
        this.group.add(this.bottomCap);

        this.updateGeometryPositions();
        
        // Bounding boxes for collision
        this.boxes = {
            topPipe: new THREE.Box3(),
            bottomPipe: new THREE.Box3(),
            topCap: new THREE.Box3(),
            bottomCap: new THREE.Box3()
        };
    }

    updateGeometryPositions() {
        this.topPipe.position.y = 10 + Config.PIPE_GAP / 2;
        this.bottomPipe.position.y = -10 - Config.PIPE_GAP / 2;
        this.topCap.position.y = Config.PIPE_GAP / 2 + 0.5;
        this.bottomCap.position.y = -Config.PIPE_GAP / 2 - 0.5;
    }

    spawn(x, y) {
        this.active = true;
        this.passed = false;
        this.group.position.set(x, y, 0);
        this.group.visible = true;
        this.updateBoxes();
    }

    updateBoxes() {
        this.boxes.topPipe.setFromObject(this.topPipe);
        this.boxes.bottomPipe.setFromObject(this.bottomPipe);
        this.boxes.topCap.setFromObject(this.topCap);
        this.boxes.bottomCap.setFromObject(this.bottomCap);
    }

    deactivate() {
        this.active = false;
        this.group.visible = false;
    }
}

export class PipePool {
    constructor(scene, size = 10) {
        this.scene = scene;
        this.pool = [];
        
        for (let i = 0; i < size; i++) {
            const pipe = new Pipe();
            pipe.deactivate(); // Hide initially
            this.scene.add(pipe.group);
            this.pool.push(pipe);
        }
    }

    spawn() {
        const pipe = this.pool.find(p => !p.active);
        if (pipe) {
            const y = Math.random() * (Config.MAX_PIPE_HEIGHT - Config.MIN_PIPE_HEIGHT) + Config.MIN_PIPE_HEIGHT;
            pipe.spawn(15, y); // Spawn off-screen right
        }
    }

    getActivePipes() {
        return this.pool.filter(p => p.active);
    }

    reset() {
        this.pool.forEach(p => p.deactivate());
    }
}
