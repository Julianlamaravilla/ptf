import * as THREE from 'three';

export class Ghosty {
    constructor() {
        this.group = new THREE.Group();
        this.velocity = 0;
        this.box = new THREE.Box3();

        this.buildModel();
    }

    buildModel() {
        // Ghost Body (Cylinder with rounded top)
        const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        this.group.add(body);

        // Rounded top (Sphere on top of cylinder)
        const headGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const head = new THREE.Mesh(headGeo, bodyMat);
        head.position.y = 0.6; // Top of the cylinder
        head.castShadow = true;
        head.receiveShadow = true;
        this.group.add(head);

        // Wavy bottom (Small spheres at the base)
        const skirtGeo = new THREE.SphereGeometry(0.25, 16, 16);
        for (let i = 0; i < 5; i++) {
            const skirt = new THREE.Mesh(skirtGeo, bodyMat);
            // Distribute them evenly in a circle around the bottom edge
            const angle = (i / 5) * Math.PI * 2;
            const radius = 0.6; // Slightly inside the edge
            skirt.position.set(Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius);
            skirt.castShadow = true;
            this.group.add(skirt);
        }

        // Ghost Eyes
        const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White of the eye
        const pupilGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black pupil

        // Left Eye
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(0.3, 0.4, 0.75);
        const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
        leftPupil.position.set(0.1, 0, 0.15); // Looking slightly forward/right
        leftEye.add(leftPupil);
        this.group.add(leftEye);

        // Right Eye
        const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(-0.3, 0.4, 0.75);
        const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
        rightPupil.position.set(0.1, 0, 0.15);
        rightEye.add(rightPupil);
        this.group.add(rightEye);

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
