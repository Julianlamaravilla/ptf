# Core (Núcleo)

Este directorio contiene los archivos fundacionales del juego.

- **`Game.js`**: Es el director de orquesta. Configura la escena 3D, instancia los sistemas y entidades, y ejecuta el `requestAnimationFrame` que mantiene vivo el juego (Game Loop).
- **`Config.js`**: Centraliza todas las variables "mágicas" y constantes (gravedad, fuerza de salto, velocidad, distancias). Cambiar la dificultad del juego se hace desde aquí.
