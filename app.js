// ============================================
//  STEPUP | Tienda de Zapatillas Urbanas
//  app.js - Lógica principal de la aplicación
// ============================================

const API_URL = './data.json';

// Estado de la aplicación
let zapatillas = [];
let carrito = [];
let filtroActual = 'todos';

// Referencias al DOM
const gridProductos = document.querySelector('#grid-productos');
const tablaCarritoBody = document.querySelector('#lista-carrito tbody');
const btnVaciarCarrito = document.querySelector('#vaciar-carrito');
const btnFinalizarCompra = document.querySelector('#finalizar-compra');
const btnCarrito = document.querySelector('#btn-carrito');
const carritoCount = document.querySelector('#carrito-count');
const carritoPanel = document.querySelector('#carrito-panel');
const carritoCerrar = document.querySelector('#carrito-cerrar');
const carritoOverlay = document.querySelector('#carrito-overlay');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

// -----------------------------------------------
// INICIALIZACIÓN (cuando el DOM está listo)
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    cargarZapatillas();
    cargarCarritoDelLocalStorage();

    // Eventos de filtros
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', filtrarProductos);
    });

    // Eventos del carrito
    btnCarrito.addEventListener('click', abrirCarrito);
    carritoCerrar.addEventListener('click', cerrarCarrito);
    carritoOverlay.addEventListener('click', cerrarCarrito);
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    btnFinalizarCompra.addEventListener('click', irAFinalizarCompra);
});

// -----------------------------------------------
// CARGA DE DATOS DESDE data.json (async/await)
// -----------------------------------------------
async function cargarZapatillas() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        zapatillas = await respuesta.json();
        renderizarProductos(zapatillas);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar productos',
            text: 'No se pudieron cargar los productos. Asegurate de usar Live Server.',
            confirmButtonColor: '#FFE600',
            background: '#111111',
            color: '#F0F0F0'
        });
    }
}

// -----------------------------------------------
// RENDERIZADO DE PRODUCTOS EN EL GRID
// -----------------------------------------------
function renderizarProductos(productosAMostrar) {
    gridProductos.innerHTML = '';

    productosAMostrar.forEach(producto => {
        // Calculo el porcentaje de descuento con reduce-like logic
        const descuento = Math.round(
            ((producto.precioOriginal - producto.precio) / producto.precioOriginal) * 100
        );

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        tarjeta.innerHTML = `
            <div class="tarjeta-img-wrapper">
                <img src="${producto.imagen}" alt="${producto.nombre}" title="${producto.nombre}" loading="lazy">
                <span class="descuento-badge">-${descuento}%</span>
            </div>
            <div class="tarjeta-contenido">
                <span class="tarjeta-marca">${producto.marca}</span>
                <h3 class="tarjeta-nombre">${producto.nombre}</h3>
                <p class="tarjeta-descripcion">${producto.descripcion}</p>
                <div class="tarjeta-precios">
                    <span class="precio-original">$${producto.precioOriginal.toLocaleString('es-AR')}</span>
                    <span class="precio-actual">$${producto.precio.toLocaleString('es-AR')}</span>
                </div>
                <div class="tarjeta-acciones">
                    <button class="btn-agregar agregar-carrito" data-id="${producto.id}" title="Agregar al carrito">
                        + Agregar
                    </button>
                    <button class="btn-favorito" title="Guardar en favoritos">🤍</button>
                </div>
            </div>
        `;

        gridProductos.appendChild(tarjeta);
    });

    // Asigno eventos a los botones de agregar recién creados
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

// -----------------------------------------------
// FILTRADO DE PRODUCTOS POR MARCA (usando .filter())
// -----------------------------------------------
function filtrarProductos(e) {
    filtroActual = e.target.dataset.filter;

    // Actualizo visualmente el botón activo
    botonesFiltro.forEach(btn => btn.classList.remove('activo'));
    e.target.classList.add('activo');

    // Filtro el array según la marca seleccionada
    const productosFiltrados = filtroActual === 'todos'
        ? zapatillas
        : zapatillas.filter(p => p.marca === filtroActual);

    renderizarProductos(productosFiltrados);
}

// -----------------------------------------------
// CARRITO - AGREGAR PRODUCTO (usando .find())
// -----------------------------------------------
function agregarAlCarrito(e) {
    e.preventDefault();
    const idProducto = parseInt(e.target.dataset.id, 10);
    const producto = zapatillas.find(p => p.id === idProducto);

    if (!producto) return;

    const productoEnCarrito = carrito.find(p => p.id === idProducto);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    renderizarCarrito();

    Toastify({
        text: `✓ ${producto.nombre} agregado`,
        duration: 2500,
        gravity: 'top',
        position: 'right',
        style: {
            background: 'linear-gradient(135deg, #FFE600, #F59E0B)',
            color: '#000',
            fontWeight: '700',
            borderRadius: '4px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px'
        },
        stopOnFocus: true
    }).showToast();
}

// -----------------------------------------------
// CARRITO - ELIMINAR PRODUCTO (usando .filter())
// -----------------------------------------------
function eliminarDelCarrito(e) {
    const idProducto = parseInt(e.target.dataset.id, 10);
    carrito = carrito.filter(p => p.id !== idProducto);
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    renderizarCarrito();
}

// -----------------------------------------------
// CARRITO - VACIAR (con confirmación SweetAlert2)
// -----------------------------------------------
function vaciarCarrito(e) {
    e.preventDefault();

    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#FF4444',
        cancelButtonColor: '#FFE600',
        background: '#111111',
        color: '#F0F0F0'
    }).then(result => {
        if (result.isConfirmed) {
            carrito = [];
            localStorage.removeItem('carritoStepup');
            actualizarContadorCarrito();
            renderizarCarrito();

            Swal.fire({
                icon: 'success',
                title: 'Carrito vaciado',
                timer: 1800,
                showConfirmButton: false,
                background: '#111111',
                color: '#F0F0F0'
            });
        }
    });
}

// -----------------------------------------------
// CARRITO - RENDERIZAR TABLA
// -----------------------------------------------
function renderizarCarrito() {
    tablaCarritoBody.innerHTML = '';

    if (carrito.length === 0) {
        const filaVacia = document.createElement('tr');
        filaVacia.innerHTML = `
            <td colspan="3" style="text-align: center; color: #888; padding: 32px; font-size: 14px;">
                Tu carrito está vacío
            </td>
        `;
        tablaCarritoBody.appendChild(filaVacia);
        return;
    }

    carrito.forEach(producto => {
        const totalProducto = producto.precio * producto.cantidad;
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <strong style="display:block; font-size: 13px;">${producto.nombre}</strong>
                <small style="color: #888;">x${producto.cantidad}</small>
            </td>
            <td style="font-family: 'Space Mono', monospace; color: #FFE600;">
                $${totalProducto.toLocaleString('es-AR')}
            </td>
            <td>
                <button class="btn-eliminar" data-id="${producto.id}" title="Eliminar">✕</button>
            </td>
        `;
        tablaCarritoBody.appendChild(fila);
    });

    // Fila del total (usando .reduce())
    const total = carrito.reduce((acumulado, p) => acumulado + p.precio * p.cantidad, 0);
    const filaTotal = document.createElement('tr');
    filaTotal.className = 'fila-total';
    filaTotal.innerHTML = `
        <td>TOTAL</td>
        <td>$${total.toLocaleString('es-AR')}</td>
        <td></td>
    `;
    tablaCarritoBody.appendChild(filaTotal);

    // Asigno eventos a los botones de eliminar recién creados
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(btn => btn.addEventListener('click', eliminarDelCarrito));
}

// -----------------------------------------------
// CARRITO - ACTUALIZAR CONTADOR DEL ÍCONO
// -----------------------------------------------
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    carritoCount.textContent = totalItems;
}

// -----------------------------------------------
// CARRITO - ABRIR / CERRAR PANEL
// -----------------------------------------------
function abrirCarrito() {
    carritoPanel.classList.add('abierto');
    carritoOverlay.classList.add('activo');
}

function cerrarCarrito() {
    carritoPanel.classList.remove('abierto');
    carritoOverlay.classList.remove('activo');
}

// -----------------------------------------------
// FINALIZAR COMPRA - FORMULARIO CON SWAL
// -----------------------------------------------
function irAFinalizarCompra(e) {
    e.preventDefault();

    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agregá productos antes de continuar.',
            confirmButtonColor: '#FFE600',
            background: '#111111',
            color: '#F0F0F0'
        });
        return;
    }

    Swal.fire({
        title: 'Completá tus datos',
        html: `
            <div style="text-align: left; margin-top: 8px;">
                <label style="display:block; margin-bottom:6px; font-size:13px; color:#FFE600; font-family:'Space Mono',monospace; letter-spacing:1px;">NOMBRE</label>
                <input type="text" id="swal-nombre" class="swal2-input" placeholder="Tu nombre completo" style="margin-bottom: 16px;">
                <label style="display:block; margin-bottom:6px; font-size:13px; color:#FFE600; font-family:'Space Mono',monospace; letter-spacing:1px;">EMAIL</label>
                <input type="email" id="swal-email" class="swal2-input" placeholder="tu@email.com">
            </div>
        `,
        icon: 'shopping_bag',
        showCancelButton: true,
        confirmButtonText: 'Confirmar pedido',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#FFE600',
        cancelButtonColor: '#333',
        background: '#111111',
        color: '#F0F0F0',
        preConfirm: () => {
            const nombre = document.querySelector('#swal-nombre').value.trim();
            const email = document.querySelector('#swal-email').value.trim();

            if (!nombre) {
                Swal.showValidationMessage('Por favor ingresá tu nombre');
                return false;
            }
            if (!email || !email.includes('@')) {
                Swal.showValidationMessage('Por favor ingresá un email válido');
                return false;
            }

            return { nombre, email };
        }
    }).then(result => {
        if (result.isConfirmed) {
            procesarCompra(result.value.nombre, result.value.email);
        }
    });
}

// -----------------------------------------------
// PROCESAR COMPRA - SIMULACIÓN DEL PAGO
// -----------------------------------------------
function procesarCompra(nombre, email) {
    const totalCompra = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const cantidadItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    // Simulación de carga
    Swal.fire({
        title: 'Procesando tu pedido...',
        allowOutsideClick: false,
        background: '#111111',
        color: '#F0F0F0',
        didOpen: () => Swal.showLoading()
    });

    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: '¡Pedido confirmado!',
            html: `
                <p style="margin: 12px 0; font-size: 16px;">Gracias, <strong>${nombre}</strong></p>
                <div style="background: rgba(255,230,0,0.08); border: 1px solid rgba(255,230,0,0.2); padding: 16px; border-radius: 6px; text-align: left; margin: 16px 0;">
                    <p style="margin: 6px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 6px 0; font-size: 14px;"><strong>Items:</strong> ${cantidadItems}</p>
                    <p style="margin: 6px 0; font-size: 14px; color: #FFE600;"><strong>Total:</strong> $${totalCompra.toLocaleString('es-AR')}</p>
                </div>
                <p style="font-size: 13px; color: #888;">Te enviamos el resumen a tu correo electrónico.</p>
            `,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#FFE600',
            background: '#111111',
            color: '#F0F0F0'
        }).then(() => {
            vaciarCarritoCompleto();
            cerrarCarrito();
        });
    }, 2000);
}

// -----------------------------------------------
// VACIAR CARRITO COMPLETO (post-compra)
// -----------------------------------------------
function vaciarCarritoCompleto() {
    carrito = [];
    localStorage.removeItem('carritoStepup');
    actualizarContadorCarrito();
    renderizarCarrito();
}

// -----------------------------------------------
// LOCALSTORAGE - GUARDAR Y CARGAR CARRITO
// -----------------------------------------------
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoStepup', JSON.stringify(carrito));
}

function cargarCarritoDelLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoStepup');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
        renderizarCarrito();
    }
}
