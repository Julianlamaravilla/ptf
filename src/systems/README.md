# Systems (Sistemas)

Los sistemas contienen la "lógica viva" del juego. Modifican a las Entidades en cada frame dependiendo de las circunstancias.

- **`PhysicsSystem.js`**: Aplica gravedad a Ghosty, mueve las tuberías y revisa intersecciones entre las cajas (`Box3`) para determinar choques.
- **`InputSystem.js`**: Escucha toques, clics y barras espaciadoras para emitir la intención de salto.
- **`AudioSystem.js`**: Escucha eventos globales y reproduce los archivos de audio asociados.
- **`CameraShakeSystem.js`**: Efecto visual de "Game Feel". Al ocurrir una colisión, vibra la cámara aleatoriamente durante una fracción de segundo para darle impacto a la muerte.
