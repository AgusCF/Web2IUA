import api from "./api.js";
import { showToast } from "./toast.js";

function getImgUrl(imgPath) {
    const BACKEND_URL = "https://web2iua-back.onrender.com"; // Corregir URL
    if (!imgPath) return '';
    if (imgPath.startsWith('/uploads/')) {
        return BACKEND_URL + imgPath;
    }
    return imgPath;
}

export async function mostrarCarrito() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual")); // Corregir parseo
    const carritoContenido = document.getElementById("carrito-contenido");
    if (!usuario) {
        carritoContenido.innerHTML = "<div class='text-danger'>Debes iniciar sesión para ver tu carrito.</div>";
        return;
    }
    // Obtener el id del usuario
    const resUser = await api.get(`/users/by-tel?tel=${usuario.tel || usuario.telefono}`);
    const user = Array.isArray(resUser.data) ? resUser.data[0] : resUser.data;
    if (!user || !user.id) {
        carritoContenido.innerHTML = "<div class='text-danger'>No se pudo identificar el usuario.</div>";
        return;
    }
    // Obtener el carrito
    const res = await api.get(`/cart/${user.id}`);
    const items = res.data;
    if (!items.length) {
        carritoContenido.innerHTML = "<p>No tienes productos en el carrito.</p>";
        return;
    }
    let total = 0;
    carritoContenido.innerHTML = `
        <div class="table-responsive">
        <table class="table align-middle">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Imagen</th>
                    <th>Precio</th>
                    <th class="text-center">Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => {
                    const subtotal = item.price * item.quantity;
                    total += subtotal;
                    // Deshabilitar "+" si cantidad >= stock
                    const deshabilitarSumar = item.quantity >= item.stock ? 'disabled' : '';
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td><img src="${getImgUrl(item.img)}" alt="${item.name}" style="width:50px;max-height:50px;object-fit:cover;"></td>
                            <td>$${item.price}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary btn-sumar" data-id="${item.id}" ${deshabilitarSumar}>+</button>
                                </div>
                            </td>
                            <td>$${subtotal}</td>
                            <td>
                                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-end fw-bold">Total:</td>
                    <td class="fw-bold">$${total}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger mb-2" id="btn-vaciar-carrito">Vaciar</button>
                        <button class="btn btn-sm btn-success" id="btn-realizar-pedido">Realizar pedido</button>
                    </td>
                </tr>
            </tfoot>
        </table>
        </div>
    `;

    // Handlers para sumar/restar/eliminar/vaciar
    carritoContenido.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            // Buscar el item actual
            const item = items.find(i => i.id == id);
            if (!item) return;
            // Verificar si hay stock disponible
            if (item.quantity >= item.stock) {
                showToast("No hay suficiente stock disponible");
                return;
            }
            const nuevaCantidad = item.quantity + 1;
            await api.put(`/cart/update/${id}`, { quantity: nuevaCantidad });
            localStorage.setItem('carrito', JSON.stringify(items)); // Corregir seteo de carrito
            renderizarCarrito();
            mostrarCarrito();
        };
    });
    carritoContenido.querySelectorAll('.btn-restar').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            // Buscar el item actual
            const item = items.find(i => i.id == id);
            if (!item) return;
            const nuevaCantidad = item.quantity - 1;
            await api.put(`/cart/update/${id}`, { quantity: nuevaCantidad });
            localStorage.setItem('carrito', JSON.stringify(items)); // Corregir seteo de carrito
            renderizarCarrito();
            mostrarCarrito();
        };
    });
    carritoContenido.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            await api.delete(`/cart/remove/${id}`);
            localStorage.setItem('carrito', JSON.stringify(items)); // Corregir seteo de carrito
            renderizarCarrito();
            mostrarCarrito();
        };
    });
    const btnVaciar = carritoContenido.querySelector('#btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.onclick = async function() {
            await api.delete(`/cart/clear/${user.id}`);
            localStorage.setItem('carrito', JSON.stringify([])); // Corregir seteo de carrito
            renderizarCarrito();
            mostrarCarrito();
        };
    }
    const btnRealizarPedido = carritoContenido.querySelector('#btn-realizar-pedido');
    if (btnRealizarPedido) {
        btnRealizarPedido.onclick = async function() {
            // Simulación de grabado de orden
            try {
                const pedido = {
                    user_id: user.id,
                    items: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total
                };
                // Ajusta la ruta según tu backend
                await api.post('/orders/newOrder', pedido);
                showToast("Pedido simulado realizado");
                await api.delete(`/cart/clear/${user.id}`);
                localStorage.setItem('carrito', JSON.stringify([])); // Corregir seteo de carrito
                renderizarCarrito();
                mostrarCarrito();
            } catch (err) {
                showToast("Error al realizar el pedido");
            }
        };
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Espera a que el navbar esté cargado
    const esperarNavbar = setInterval(() => {
        const carritoLink = document.getElementById("carrito-link");
        const carritoModal = document.getElementById("carritoModal");
        if (carritoLink && carritoModal && window.bootstrap) {
            clearInterval(esperarNavbar);
            carritoLink.addEventListener("click", function (e) {
                e.preventDefault();
                mostrarCarrito();
                const modal = new bootstrap.Modal(carritoModal);
                modal.show();
            });
        }
    }, 100);
});

function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-muted">El carrito está vacío.</p>';
        return;
    }

    let total = 0;
    let html = '<ul class="list-group mb-3">';
    carrito.forEach((producto, idx) => {
        total += producto.precio * producto.cantidad;
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${producto.nombre}</strong><br>
                    <small>Cantidad: ${producto.cantidad}</small>
                </div>
                <div>
                    $${(producto.precio * producto.cantidad).toFixed(2)}
                    <button class="btn btn-sm btn-danger ms-2" onclick="eliminarDelCarrito(${idx})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
    html += `</ul>
        <div class="text-end fw-bold">Total: $${total.toFixed(2)}</div>
    `;
    contenedor.innerHTML = html;
}

function eliminarDelCarrito(idx) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length > idx) {
        carrito.splice(idx, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }
}