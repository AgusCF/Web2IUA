import api from "./api.js";
import { mostrarModal } from "./adminModal.js";

export async function cargarOrdenes(adminContent) {
    adminContent.innerHTML = "<div class='text-center my-4'>Cargando órdenes...</div>";
    try {
        const res = await api.get('/orders');
        const ordenes = res.data.sort((a, b) => a.id - b.id);
        if (!ordenes.length) {
            adminContent.innerHTML = "<p>No hay órdenes registradas.</p>";
            return;
        }

        // Obtener teléfonos de usuarios para cada orden
        const telefonos = await Promise.all(
            ordenes.map(async o => {
                try {
                    const userRes = await api.get(`/users/${o.user_id}`);
                    return userRes.data.tel || '-';
                } catch {
                    return '-';
                }
            })
        );

        adminContent.innerHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${ordenes.map((o, idx) => {
                        let fechaFormateada = '-';
                        if (o.order_date) {
                            const fecha = new Date(o.order_date);
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
                        return `
                            <tr>
                                <td>${o.id}</td>
                                <td>${telefonos[idx]}</td>
                                <td>${fechaFormateada}</td>
                                <td>${o.total ?? '-'}</td>
                                <td>${o.state ?? 'pendiente'}</td>
                                <td>
                                    <button class="btn btn-info btn-sm" onclick="verDetalle('orden', ${o.id})">Ver</button>
                                    <button class="btn btn-warning btn-sm" onclick="editarElemento('orden', ${o.id})">Editar</button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        adminContent.innerHTML = "<div class='text-danger'>Error al cargar órdenes.</div>";
    }
}
export function editarOrden(id) {
    api.get(`/orders/${id}`).then(async res => {
        const o = res.data;
        // Obtener datos del usuario por user_id
        let telefono = '-';
        try {
            const userRes = await api.get(`/users/${o.user_id}`);
            telefono = userRes.data.tel || '-';
        } catch {
            telefono = '-';
        }

        // Formatear fecha
        let fechaFormateada = '-';
        if (o.order_date) {
            const fecha = new Date(o.order_date);
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

        // Opciones de estado
        const estados = [
            'pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado', 'devuelto'
        ];

        // Productos
        const productosHtml = (o.items && o.items.length)
            ? `<ul>${o.items.map(item =>
                `<li>${item.name} x${item.quantity} - $${item.price}</li>`
            ).join('')}</ul>`
            : '<p>No hay productos en esta orden.</p>';

        // Select de estado
        const selectEstado = `
            <select class="form-select" id="select-estado-orden">
                ${estados.map(e => `<option value="${e}" ${o.state === e ? 'selected' : ''}>${e}</option>`).join('')}
            </select>
        `;

        const html = `
            <div>
                <div class="mb-2"><strong>Teléfono del usuario:</strong> ${telefono}</div>
                <div class="mb-2"><strong>Fecha:</strong> ${fechaFormateada}</div>
                <div class="mb-2"><strong>Total:</strong> $${o.total ?? 0}</div>
                <div class="mb-2"><strong>Estado:</strong> ${selectEstado}</div>
                <div class="mb-2"><strong>Productos:</strong> ${productosHtml}</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-success" id="btn-actualizar-estado">Actualizar estado</button>
                    <button class="btn btn-primary" id="btn-contactar-cliente">Contactar</button>
                </div>
            </div>
        `;
        mostrarModal('Detalle de Orden', html, (modal, bsModal) => {
            // Handler para actualizar estado
            const select = modal.querySelector('#select-estado-orden');
            const btnActualizar = modal.querySelector('#btn-actualizar-estado');
            let estadoOriginal = o.state;
            btnActualizar.onclick = async () => {
                const nuevoEstado = select.value;
                if (nuevoEstado !== estadoOriginal) {
                    await api.put(`/orders/${o.id}`, {
                        user_id: o.user_id,
                        total: o.total,
                        state: nuevoEstado
                    });
                    alert("Estado modificado avidado");
                    bsModal.hide();
                } else {
                    alert("No hay cambios en el estado.");
                }
            };
            // Handler para contactar cliente
            modal.querySelector('#btn-contactar-cliente').onclick = () => {
                alert("Cliente contactado");
            };
        });
    });
}
export function verDetalleOrden(id) {
    api.get(`/orders/${id}`).then(async res => {
        const o = res.data;
        // Obtener datos del usuario por user_id
        let telefono = '-';
        try {
            const userRes = await api.get(`/users/${o.user_id}`);
            telefono = userRes.data.tel || '-';
        } catch {
            telefono = '-';
        }

        // Formatear fecha
        let fechaFormateada = '-';
        if (o.order_date) {
            const fecha = new Date(o.order_date);
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

        // Productos
        const productosHtml = (o.items && o.items.length)
            ? `<ul>${o.items.map(item =>
                `<li>${item.name} x${item.quantity} - $${item.price}</li>`
            ).join('')}</ul>`
            : '<p>No hay productos en esta orden.</p>';

        const html = `
            <div>
                <div class="mb-2"><strong>Teléfono del usuario:</strong> ${telefono}</div>
                <div class="mb-2"><strong>Fecha:</strong> ${fechaFormateada}</div>
                <div class="mb-2"><strong>Total:</strong> $${o.total ?? 0}</div>
                <div class="mb-2"><strong>Estado:</strong> ${o.state ?? 'pendiente'}</div>
                <div class="mb-2"><strong>Productos:</strong> ${productosHtml}</div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" id="btn-contactar-cliente">Contactar</button>
                </div>
            </div>
        `;
        mostrarModal('Detalle de Orden', html, (modal, bsModal) => {
            // Handler para contactar cliente
            modal.querySelector('#btn-contactar-cliente').onclick = () => {
                alert("Cliente contactado");
            };
        });
    });
}