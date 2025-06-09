import api from "./api.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Cargar navbar
    fetch('navbar.html')
        .then(res => res.text())
        .then(html => { 
            document.getElementById('navbar').innerHTML = html;
            // Carga el script de login después de insertar el navbar
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'JS/login.js';
            document.body.appendChild(script);
        });

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const perfilInfo = document.getElementById("perfil-info");
    let lista; // <--- DECLARAR AQUÍ

    if (usuario) {
        perfilInfo.innerHTML = `
            <p><strong>Usuario:</strong> ${usuario.usuario || usuario.username || ''}</p>
            <p><strong>Teléfono:</strong> ${usuario.tel || usuario.telefono || ''}</p>
            <div id="ordenes-usuario" class="mt-4">
                <h5>Mis Órdenes</h5>
                <div id="lista-ordenes">Cargando órdenes...</div>
            </div>
        `;
        // Obtener órdenes del usuario
        try {
            const tel = usuario.tel || usuario.telefono;
            const response = await api.get(`/orders/client=${encodeURIComponent(tel)}`);
            const ordenes = response.data;
            lista = document.getElementById("lista-ordenes"); // <--- ASIGNAR AQUÍ
            if (ordenes.length === 0) {
                lista.innerHTML = "<p>No tienes órdenes registradas.</p>";
            } else {
                lista.innerHTML = `
                    <ul class="list-group">
                        ${ordenes.map(o => `
                            <li class="list-group-item">
                                <strong>ID:</strong> ${o.id} |
                                <strong>Fecha:</strong> ${
                                    o.order_date
                                        ? new Date(o.order_date).toLocaleString('es-AR', {
                                            hour12: false,
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })
                                        : '-'
                                } |
                                <strong>Total:</strong> $${o.total ?? '-'} |
                                <strong>Estado:</strong> ${o.state ?? 'pendiente'}
                                <button class="btn btn-primary btn-sm btn-ver-detalle" data-id="${o.id}">Ver Detalle</button>
                            </li>
                        `).join('')}
                    </ul>
                `;
            }
        } catch (err) {
            document.getElementById("lista-ordenes").innerHTML = "<span class='text-danger'>Error al cargar órdenes.</span>";
        }
    } else {
        perfilInfo.innerHTML = "<p>No has iniciado sesión.</p>";
    }
    document.getElementById("logout-btn").onclick = function () {
        localStorage.removeItem("usuarioActual");
        window.location.href = "/";
    };

    // Después de renderizar la lista
    // Solo ejecuta si lista existe
    if (lista) {
        lista.querySelectorAll('.btn-ver-detalle').forEach(btn => {
            btn.onclick = async function() {
                const orderId = this.getAttribute('data-id');
                try {
                    const res = await api.get(`/orders/${orderId}`);
                    const orden = res.data;

                    // Formatear fecha y hora a formato argentino
                    let fechaFormateada = '-';
                    if (orden.order_date) {
                        const fecha = new Date(orden.order_date);
                        fechaFormateada = fecha.toLocaleString('es-AR', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                    }

                    document.getElementById("detalle-orden-body").innerHTML = `
                        <p><strong>ID:</strong> ${orden.id}</p>
                        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                        <p><strong>Total:</strong> $${orden.total ?? '-'}</p>
                        <p><strong>Estado:</strong> ${orden.state ?? 'pendiente'}</p>
                        <h6>Productos:</h6>
                        <ul>
                            ${(orden.items && orden.items.length > 0) ? orden.items.map(item => `
                                <li>${item.name} x${item.quantity} - $${item.price}</li>
                            `).join('') : '<li>No hay productos en esta orden.</li>'}
                        </ul>
                    `;
                    const modal = new bootstrap.Modal(document.getElementById('detalleOrdenModal'));
                    modal.show();
                } catch (err) {
                    document.getElementById("detalle-orden-body").innerHTML = "<span class='text-danger'>Error al cargar el detalle.</span>";
                }
            };
        });
    }
});