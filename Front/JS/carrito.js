import api from "./api.js";
import { showModalNotificacion } from "./toast.js";

function getImgUrl(imgPath) {
    const BACKEND_URL = "https://web2iua-back.onrender.com";
    if (!imgPath) return '';
    if (imgPath.startsWith('/uploads/')) {
        return BACKEND_URL + imgPath;
    }
    return imgPath;
}

// Obtiene los datos del carrito y el stock de cada producto
export async function obtenerDatosCarrito() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) return { user: null, items: [], stockMap: {} };

    const resUser = await api.get(`/users/by-tel?tel=${usuario.tel || usuario.telefono}`);
    const user = Array.isArray(resUser.data) ? resUser.data[0] : resUser.data;
    if (!user || !user.id) return { user: null, items: [], stockMap: {} };

    const res = await api.get(`/cart/${user.id}`);
    const items = res.data;
    if (!items.length) return { user, items: [], stockMap: {} };

    // Obtener el stock de cada producto en paralelo
    const stockMap = {};
    await Promise.all(items.map(async item => {
        const resProd = await api.get(`/products/${item.product_id}`);
        stockMap[item.product_id] = resProd.data.stock;
    }));

    return { user, items, stockMap };
}

// Renderiza el HTML del carrito
export function renderizarCarrito({ items, stockMap }) {
    const carritoContenido = document.getElementById("carrito-contenido");
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
                    const stock = stockMap[item.product_id];
                    const deshabilitarSumar = item.quantity >= stock ? 'disabled' : '';
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td><img src="${getImgUrl(item.img)}" alt="${item.name}" style="width:50px;max-height:50px;object-fit:cover;"></td>
                            <td>$${item.price}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary btn-sumar ${item.quantity >= stock ? 'btn-danger text-red' : ''}" data-id="${item.id}" ${deshabilitarSumar}>+</button>
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
}

// Lógica de modificación y recarga del carrito
export async function mostrarCarrito() {
    const carritoContenido = document.getElementById("carrito-contenido");
    const { user, items, stockMap } = await obtenerDatosCarrito();

    if (!user) {
        carritoContenido.innerHTML = "<div class='text-danger'>Debes iniciar sesión para ver tu carrito.</div>";
        return;
    }
    renderizarCarrito({ items, stockMap });

    // Handlers para sumar/restar/eliminar/vaciar
    carritoContenido.onclick = async function(e) {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = btn.getAttribute("data-id");
        if (btn.classList.contains("btn-sumar")) {
            const item = items.find(i => i.id == id);
            if (!item) return;
            const stock = stockMap[item.product_id];
            const nuevaCantidad = item.quantity + 1;
            if (nuevaCantidad > stock) {
                //showModalNotificacion("No puedes agregar más de lo disponible en stock.", "Notificación", false);
                return;
            }
            await api.put(`/cart/update/${id}`, { quantity: nuevaCantidad });
            await mostrarCarrito();
            //showModalNotificacion(`Agregaste ${item.name} al carrito`, "Notificación", false);
        } else if (btn.classList.contains("btn-restar")) {
            const item = items.find(i => i.id == id);
            if (!item) return;
            const nuevaCantidad = item.quantity - 1;
            await api.put(`/cart/update/${id}`, { quantity: nuevaCantidad });
            await mostrarCarrito();
            //showModalNotificacion(`Restaste ${item.name} del carrito`, "Notificación", false);
        } else if (btn.classList.contains("btn-eliminar")) {
            await api.delete(`/cart/remove/${id}`);
            await mostrarCarrito();
            //showModalNotificacion("Producto eliminado del carrito", "Notificación", false);
        } else if (btn.id === "btn-vaciar-carrito") {
            await api.delete(`/cart/clear/${user.id}`);
            await mostrarCarrito();
            //showModalNotificacion("Carrito vaciado", "Notificación", false);
        } else if (btn.id === "btn-realizar-pedido") {
            try {
                const pedido = {
                    user_id: user.id,
                    items: items.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0)
                };
                await api.post('/orders/newOrder', pedido);
                //showModalNotificacion("Pedido simulado realizado", "Notificación", false);
                await api.delete(`/cart/clear/${user.id}`);
                await mostrarCarrito();
                //showModalNotificacion("Carrito vaciado tras realizar el pedido", "Notificación", false);
            } catch (err) {
                //showModalNotificacion("Error al realizar el pedido", "ERROR", false);
            }
        }
    };
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