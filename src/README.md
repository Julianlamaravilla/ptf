# Arquitectura del Juego

El código fuente (`src/`) de Flappy Kiro está organizado para ser altamente mantenible, escalable y evitar el antipatrón de "archivos monolíticos" (`main.js` gigante).

La arquitectura se divide en 5 módulos principales:

- **`core/`**: Lógica central del motor, configuración y el bucle de renderizado (Game Loop).
- **`state/`**: Máquina de Estados que controla en qué momento del juego estamos (Jugando, Menú, etc.).
- **`events/`**: Sistema de comunicación para que distintas partes del juego hablen entre sí sin acoplarse.
- **`entities/`**: Los objetos del juego que existen en el mundo 3D (El fantasma, las tuberías).
- **`systems/`**: La lógica pura que opera sobre las entidades (Físicas, Inputs, Audio, Cámara).

Revisa los archivos `.md` dentro de cada carpeta para entender su funcionamiento en detalle.
