# Hood Kicks 🖤👟

Tienda de zapatillas urbanas desarrollada como proyecto final del curso de JavaScript en Coderhouse. Simula una tienda online completa con carrito de compras, filtros por marca y proceso de checkout.

## Demo en vivo

🔗 [Ver proyecto](https://TU-USUARIO.github.io/hood-kicks/)

## Funcionalidades

- 🛒 Carrito de compras con panel lateral deslizable
- ➕ Agregar y eliminar productos del carrito
- 🔍 Filtrado de productos por marca (Nike, Adidas, Converse, Vans, New Balance, Puma)
- 📦 Productos cargados asincrónicamente desde `data.json` con `fetch` y `async/await`
- 💾 Persistencia del carrito con `localStorage` (no se pierde al recargar)
- ✅ Confirmación de compra con formulario de nombre y email (SweetAlert2)
- 🔔 Notificaciones al agregar productos (Toastify)
- 📱 Diseño responsive para mobile y desktop

## Tecnologías

- HTML5 semántico
- CSS3 (variables, flexbox, grid, animaciones)
- JavaScript ES6+ (async/await, arrow functions, destructuring, spread operator)

## Librerías externas

- [SweetAlert2](https://sweetalert2.github.io/) — modales de confirmación y formulario de checkout
- [Toastify JS](https://apvarun.github.io/toastify-js/) — notificaciones al agregar al carrito

## Cómo correrlo localmente

1. Clonar el repositorio
   ```bash
   git clone https://github.com/TU-USUARIO/hood-kicks.git
   ```
2. Abrir la carpeta en VS Code
3. Usar la extensión **Live Server** y hacer click derecho en `index.html` → *Open with Live Server*

> ⚠️ Es necesario usar Live Server (o cualquier servidor local) para que el `fetch` a `data.json` funcione sin errores de CORS.

## Estructura del proyecto

```
hood-kicks/
├── index.html
├── app.js
├── data.json
├── style.css
└── README.md
```

## Conceptos aplicados

| Concepto | Dónde se usa |
|---|---|
| `fetch` + `async/await` | Carga de productos desde `data.json` |
| Manipulación del DOM | Renderizado de tarjetas y tabla del carrito |
| `.filter()` | Filtrado por marca y eliminación del carrito |
| `.find()` | Búsqueda de productos al agregar al carrito |
| `.reduce()` | Cálculo del total y contador de items |
| `localStorage` | Persistencia del carrito entre sesiones |
| Eventos | Click en filtros, carrito, botones de agregar/eliminar |
