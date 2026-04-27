# Flappy Kiro 3D

Flappy Kiro es un clon del clásico Flappy Bird, pero con un diseño 2.5D renderizado con Three.js. El juego utiliza una arquitectura moderna y modular basada en Entidad-Componente-Sistema (ECS) simplificada, Máquinas de Estados y Eventos.

## Estructura del Proyecto

- `index.html`: Punto de entrada de la aplicación y estructura de la Interfaz de Usuario (UI).
- `style.css`: Estilos visuales y animaciones fluidas para los menús.
- `package.json`: Dependencias (Vite, Three.js) y scripts.
- `deploy.js`: Script de despliegue a AWS S3.
- `src/`: Carpeta principal del código fuente. ¡Revisa el [README interno](./src/README.md) para ver la arquitectura detallada!

## Cómo ejecutar

1. Instalar dependencias: `npm install`
2. Correr en desarrollo: `npm run dev`
3. Compilar para producción: `npm run build`