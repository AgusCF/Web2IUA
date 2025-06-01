import api from "./api.js";

function getImgUrl(imgPath) {
    const BACKEND_URL = "https://web2iua-back.onrender.com";
    if (!imgPath) return '';
    if (imgPath.startsWith('/uploads/')) {
        return BACKEND_URL + imgPath;
    }
    return imgPath;
}

function agregarAlCarrito(productId) {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
        // Mostrar el modal de login si no está logueado
        const loginModal = document.getElementById("loginModal");
        if (loginModal && window.bootstrap) {
            const modal = new bootstrap.Modal(loginModal);
            modal.show();
        } else {
            alert("Debes iniciar sesión para agregar productos al carrito.");
        }
        return;
    }
    // El backend espera user_id (id numérico, no teléfono)
    api.get(`/users/by-tel?tel=${usuario.tel || usuario.telefono}`)
        .then(res => {
            const user = Array.isArray(res.data) ? res.data[0] : res.data;
            if (!user || !user.id) {
                alert("No se pudo identificar el usuario.");
                return;
            }
            return api.post("/cart/add", {
                user_id: user.id,
                product_id: productId,
                quantity: 1
            });
        })
        .then(res => {
            if (res && res.data && res.data.message) {
                alert(res.data.message);
            }
        })
        .catch(() => {
            alert("Error al agregar al carrito.");
        });
}

function renderProductos(productos) {
    const contenedor = document.getElementById("productos-todos");
    if (!contenedor) return;

    contenedor.innerHTML = ""; // Limpiar antes de renderizar

    // Obtener tipos únicos
    const tiposUnicos = [...new Set(productos.map(p => p.type))];
    let usarFondoClaro = true;

    tiposUnicos.forEach(tipo => {
        const productosPorTipo = productos.filter(p => p.type === tipo);
        const seccion = document.createElement("section");
        seccion.id = tipo ? tipo.toLowerCase() : "";
        seccion.className = usarFondoClaro ? "seccion-clara py-5" : "seccion-oscura py-5";

        let html = `
            <div class="container">
                <h2 class="text-center display-5 mb-4 fw-semibold">${tipo}</h2>
                <div class="row row-cols-1 row-cols-md-3 g-4">
        `;
        productosPorTipo.forEach(producto => {
            html += `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0" data-id="${producto.id}" data-tags="${(producto.tags || []).map(tag => tag.toLowerCase()).join(' ')}">
                        <img src="${getImgUrl(producto.img)}" class="card-img-top product-img" alt="${producto.name}" data-bs-toggle="modal" data-bs-target="#${producto.modalid}" loading="lazy">
                        <div class="card-body">
                            <h5 class="card-title">${producto.name}</h5>
                            <p class="card-text">${producto.description ?? ''}</p>
                        </div>
                        <div class="card-footer bg-transparent d-flex justify-content-between">
                            <span class="fw-bold text-muted">$${producto.price}</span>
                            <button class="btn btn-outline-dark btn-add-cart" data-product-id="${producto.id}">Agregar al carrito</button>
                        </div>
                        <div class="tags-container mt-2">
                            ${(producto.tags || [])
                                .map(
                                    tag =>
                                        `<span class="badge bg-secondary me-1 product-tag" data-tag-original="${tag}">#${tag}</span>`
                                )
                                .join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
        seccion.innerHTML = html;
        contenedor.appendChild(seccion);
        usarFondoClaro = !usarFondoClaro;
    });

    // Asignar eventos a los botones de agregar al carrito
    contenedor.querySelectorAll(".btn-add-cart").forEach(btn => {
        btn.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            agregarAlCarrito(productId);
        });
    });
}

function renderModals(productos) {
    const contenedorModales = document.getElementById("modales-container");
    if (!contenedorModales) return;
    contenedorModales.innerHTML = "";
    productos.forEach(producto => {
        const modal = document.createElement("div");
        modal.innerHTML = `
            <div class="modal fade" id="${producto.modalid}" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${producto.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <img src="${getImgUrl(producto.img)}" alt="${producto.name}" class="img-fluid mb-3" loading="lazy" />
                            <p>${producto.modaldescription ?? ''}</p>
                        </div>
                        <div class="modal-footer">
                            <span class="fw-bold me-auto">$${producto.price}</span>
                            <button class="btn btn-dark btn-add-cart-modal" data-product-id="${producto.id}">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedorModales.appendChild(modal);
    });

    // Asignar eventos a los botones de agregar al carrito en los modales
    contenedorModales.querySelectorAll(".btn-add-cart-modal").forEach(btn => {
        btn.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            agregarAlCarrito(productId);
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await api.get("/products");
        const productos = res.data;
        renderProductos(productos);
        renderModals(productos);
        window.productos = productos; // Para el buscador
    } catch (err) {
        const contenedor = document.getElementById("productos-todos");
        if (contenedor) contenedor.innerHTML = "<div class='text-danger'>Error al cargar productos.</div>";
    }
});