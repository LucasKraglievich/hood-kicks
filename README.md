# Hood Kicks 🖤👟

Tienda de zapatillas urbanas desarrollada como proyecto final del curso de JavaScript en Coderhouse. Simula una tienda online completa con carrito de compras, filtros por marca y proceso de checkout.

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

- HTML5
- CSS3
- JavaScript ES6+

## Librerías externas

- [SweetAlert2](https://sweetalert2.github.io/) — modales de confirmación y formulario de checkout
- [Toastify JS](https://apvarun.github.io/toastify-js/) — notificaciones al agregar al carrito

## Cómo correrlo localmente

Abrir el proyecto con una extensión tipo `Live Server` para que el `fetch` al archivo `data.json` funcione sin error de CORS.

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
