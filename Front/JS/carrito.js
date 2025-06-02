import api from "./api.js";

function getImgUrl(imgPath) {
    const BACKEND_URL = "https://web2iua-back.onrender.com";
    if (!imgPath) return '';
    if (imgPath.startsWith('/uploads/')) {
        return BACKEND_URL + imgPath;
    }
    return imgPath;
}

async function mostrarCarrito() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
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
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td><img src="${getImgUrl(item.img)}" alt="${item.name}" style="width:50px;max-height:50px;object-fit:cover;"></td>
                            <td>$${item.price}</td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary btn-sumar" data-id="${item.id}">+</button>
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
            await api.put(`/cart/update/${id}`, { quantity: 1 }); // El backend debe sumar 1
            mostrarCarrito();
        };
    });
    carritoContenido.querySelectorAll('.btn-restar').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            await api.put(`/cart/update/${id}`, { quantity: -1 }); // El backend debe restar 1
            mostrarCarrito();
        };
    });
    carritoContenido.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            await api.delete(`/cart/remove/${id}`);
            mostrarCarrito();
        };
    });
    const btnVaciar = carritoContenido.querySelector('#btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.onclick = async function() {
            await api.delete(`/cart/clear/${user.id}`);
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
                alert("Pedido simulado realizado");
                await api.delete(`/cart/clear/${user.id}`);
                mostrarCarrito();
            } catch (err) {
                alert("Error al realizar el pedido");
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