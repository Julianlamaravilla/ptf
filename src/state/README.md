# State (Estado)

Este directorio maneja el flujo lógico del juego usando una **Máquina de Estados Finitos (FSM)**.

- **`StateMachine.js`**: Evita la "sopa de booleanos" (ej. `if(isGameOver && !isPlaying && isMenu)`). El juego solo puede estar en un único estado a la vez:
  - `START_SCREEN`: Pantalla de inicio, el fantasma flota.
  - `PLAYING`: Jugando, las tuberías se mueven, caemos.
  - `GAME_OVER`: Chocamos, el fantasma cae al suelo, esperamos reinicio.
