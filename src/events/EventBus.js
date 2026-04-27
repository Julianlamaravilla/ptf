// A simple Pub/Sub Event Bus
export const GameEvents = {
    JUMP: 'JUMP',
    COLLISION: 'COLLISION',
    SCORE: 'SCORE',
    START_GAME: 'START_GAME',
    GAME_OVER: 'GAME_OVER'
};

class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, payload) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(payload));
        }
    }
}

export const events = new EventBus();
