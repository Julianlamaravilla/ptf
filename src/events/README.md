# Events (Eventos)

Este directorio implementa el patrón **Pub/Sub** (Publicador/Suscriptor).

- **`EventBus.js`**: Una clase sencilla que permite emitir (emit) y escuchar (on) eventos. 
- Al usar eventos (como `JUMP`, `COLLISION`, `START_GAME`), evitamos que los sistemas dependan directamente unos de otros. Por ejemplo, el sistema de físicas no necesita saber cómo reproducir un sonido, simplemente "grita" que hubo una colisión, y el sistema de audio reacciona.
