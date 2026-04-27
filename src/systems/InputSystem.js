import { events, GameEvents } from '../events/EventBus.js';
import { stateMachine, GameStates } from '../state/StateMachine.js';

export class InputSystem {
    constructor() {
        this.handleJump = this.handleJump.bind(this);
        
        window.addEventListener('mousedown', this.handleJump);
        window.addEventListener('touchstart', this.handleJump);
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.handleJump(e);
        });
    }

    handleJump(e) {
        // Prevent default touch behavior
        if (e && e.type === 'touchstart') e.preventDefault();
        
        // We only allow jumping if playing, or to trigger start
        // To avoid spamming restart, we might check if game over screen is fully visible, but logic is handled in UI buttons usually
        // Actually, let UI handle START/RESTART clicks. InputSystem handles gameplay jumps.
        
        // Wait, if Game Over, we don't jump. 
        if (!stateMachine.is(GameStates.GAME_OVER)) {
            events.emit(GameEvents.JUMP);
        }
    }
}
