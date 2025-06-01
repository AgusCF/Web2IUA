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
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Imagen</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => {
                    const subtotal = item.price * item.quantity;
                    total += subtotal;
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td><img src="${getImgUrl(item.img)}" alt="${item.name}" style="width:60px;max-height:60px;object-fit:cover;"></td>
                            <td>$${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>$${subtotal}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-end fw-bold">Total:</td>
                    <td class="fw-bold">$${total}</td>
                </tr>
            </tfoot>
        </table>
    `;
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