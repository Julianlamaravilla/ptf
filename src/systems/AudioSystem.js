import * as THREE from 'three';
import { events, GameEvents } from '../events/EventBus.js';

export class AudioSystem {
    constructor(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);

        this.jumpSound = new THREE.Audio(this.listener);
        this.gameOverSound = new THREE.Audio(this.listener);

        const audioLoader = new THREE.AudioLoader();
        
        // Note: Paths are relative to index.html when run in browser
        audioLoader.load('./assets/jump.wav', (buffer) => {
            this.jumpSound.setBuffer(buffer);
            this.jumpSound.setVolume(0.5);
        });

        audioLoader.load('./assets/game_over.wav', (buffer) => {
            this.gameOverSound.setBuffer(buffer);
            this.gameOverSound.setVolume(0.5);
        });

        // Listen to events
        events.on(GameEvents.JUMP, () => this.playJump());
        events.on(GameEvents.COLLISION, () => this.playGameOver());
    }

    playJump() {
        if (this.jumpSound.buffer) {
            if (this.jumpSound.isPlaying) this.jumpSound.stop();
            this.jumpSound.play();
        }
    }

    playGameOver() {
        if (this.gameOverSound.buffer && !this.gameOverSound.isPlaying) {
            this.gameOverSound.play();
        }
    }
}
