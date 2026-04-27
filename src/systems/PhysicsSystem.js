import { events, GameEvents } from '../events/EventBus.js';
import { Config } from '../core/Config.js';
import { stateMachine, GameStates } from '../state/StateMachine.js';

export class PhysicsSystem {
    constructor(ghosty, pipePool) {
        this.ghosty = ghosty;
        this.pipePool = pipePool;
        
        events.on(GameEvents.JUMP, () => {
            if (stateMachine.is(GameStates.PLAYING)) {
                this.ghosty.velocity = Config.JUMP_STRENGTH;
            } else if (stateMachine.is(GameStates.START_SCREEN) || stateMachine.is(GameStates.GAME_OVER)) {
                // If we jump while not playing, we start the game
                events.emit(GameEvents.START_GAME);
            }
        });
    }

    update(delta) {
        if (stateMachine.is(GameStates.PLAYING)) {
            // Player Physics
            this.ghosty.velocity += Config.GRAVITY * delta;
            this.ghosty.group.position.y += this.ghosty.velocity * delta;
            this.ghosty.group.rotation.z = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.ghosty.velocity * 0.1));
            this.ghosty.updateBox();

            // Check Floor/Ceiling
            if (this.ghosty.group.position.y < -Config.BOUNDS_Y || this.ghosty.group.position.y > Config.BOUNDS_Y) {
                events.emit(GameEvents.COLLISION);
                return;
            }

            // Pipe Movement & Collision
            const activePipes = this.pipePool.getActivePipes();
            for (let pipe of activePipes) {
                pipe.group.position.x -= Config.GAME_SPEED * delta;
                pipe.updateBoxes();

                // Collision detection
                if (this.ghosty.box.intersectsBox(pipe.boxes.topPipe) ||
                    this.ghosty.box.intersectsBox(pipe.boxes.bottomPipe) ||
                    this.ghosty.box.intersectsBox(pipe.boxes.topCap) ||
                    this.ghosty.box.intersectsBox(pipe.boxes.bottomCap)) {
                    events.emit(GameEvents.COLLISION);
                    return; // Stop processing this frame
                }

                // Score logic
                if (!pipe.passed && pipe.group.position.x < this.ghosty.group.position.x) {
                    pipe.passed = true;
                    events.emit(GameEvents.SCORE);
                }

                // Despawn
                if (pipe.group.position.x < -15) {
                    pipe.deactivate();
                }
            }
        } else if (stateMachine.is(GameStates.GAME_OVER)) {
            // Fall to ground animation
            if (this.ghosty.group.position.y > -Config.BOUNDS_Y) {
                this.ghosty.velocity += Config.GRAVITY * delta;
                this.ghosty.group.position.y += this.ghosty.velocity * delta;
                this.ghosty.group.rotation.z -= delta * 5;
            }
        }
    }
}
