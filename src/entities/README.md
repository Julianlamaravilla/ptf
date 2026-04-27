# Entities (Entidades)

Las entidades son los actores que habitan el mundo 3D. 

- **`Ghosty.js`**: Contiene la definición visual del fantasma utilizando primitivas de Three.js (cilindros, esferas) y su caja de colisiones (`Box3`).
- **`PipePool.js`**: Contiene el diseño de las tuberías. Además, implementa un patrón fundamental en videojuegos: **Object Pooling**. En lugar de crear y destruir tuberías constantemente (lo que causa lag por el Recolector de Basura), reciclamos un número fijo de tuberías infinitamente.
