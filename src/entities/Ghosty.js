import * as THREE from 'three';

export class Ghosty {
    constructor() {
        this.group = new THREE.Group();
        this.velocity = 0;
        this.box = new THREE.Box3();

        this.buildModel();
    }

    buildModel() {
        // Ghost Body
        const bodyGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        this.group.add(body);

        // Ghost Eyes
        const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(0.3, 0.2, 0.7);
        this.group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(-0.3, 0.2, 0.7);
        this.group.add(rightEye);

        // Ghost Tail
        const tailGeo = new THREE.ConeGeometry(0.2, 0.6, 16);
        const tailMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        for (let i = -1; i <= 1; i++) {
            const tailPart = new THREE.Mesh(tailGeo, tailMat);
            tailPart.position.set(i * 0.4, -0.7, 0);
            tailPart.rotation.x = Math.PI; // point downwards
            tailPart.castShadow = true;
            this.group.add(tailPart);
        }

        // Initial Position
        this.group.position.x = -4;
    }

    updateBox() {
        this.box.setFromObject(this.group);
    }

    reset() {
        this.group.position.y = 0;
        this.group.rotation.z = 0;
        this.velocity = 0;
        this.updateBox();
    }
}
