import { events, GameEvents } from '../events/EventBus.js';

export class CameraShakeSystem {
    constructor(camera) {
        this.camera = camera;
        this.originalPosition = camera.position.clone();
        this.shakeTimer = 0;
        this.shakeDuration = 0.3; // seconds
        this.shakeIntensity = 0.5;

        events.on(GameEvents.COLLISION, () => {
            this.shakeTimer = this.shakeDuration;
        });
    }

    update(delta) {
        if (this.shakeTimer > 0) {
            this.shakeTimer -= delta;
            
            // Apply random offset
            const offsetX = (Math.random() - 0.5) * this.shakeIntensity;
            const offsetY = (Math.random() - 0.5) * this.shakeIntensity;
            
            this.camera.position.x = this.originalPosition.x + offsetX;
            this.camera.position.y = this.originalPosition.y + offsetY;
        } else {
            // Restore original
            this.camera.position.x = this.originalPosition.x;
            this.camera.position.y = this.originalPosition.y;
        }
    }
}
