export const GameStates = {
    START_SCREEN: 'START_SCREEN',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER'
};

class StateMachine {
    constructor() {
        this.currentState = GameStates.START_SCREEN;
    }

    transition(newState) {
        this.currentState = newState;
    }

    is(state) {
        return this.currentState === state;
    }
}

export const stateMachine = new StateMachine();
