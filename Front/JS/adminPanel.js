import api from "./api.js";

export function cargarUsuarios(adminContent) {
    adminContent.innerHTML = "<div class='text-center my-4'>Cargando usuarios...</div>";
    api.get('/users')
        .then(res => {
            const usuarios = res.data;
            if (!usuarios.length) {
                adminContent.innerHTML = "<p>No hay usuarios registrados.</p>";
                return;
            }
            adminContent.innerHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuarios.map(u => `
                            <tr>
                                <td>${u.id}</td>
                                <td>${u.username}</td>
                                <td>${u.tel}</td>
                                <td>${u.role}</td>
                                <td>
                                    <button class="btn btn-info btn-sm" onclick="verDetalle('usuario', ${u.id})">Ver</button>
                                    <button class="btn btn-warning btn-sm" onclick="editarElemento('usuario', ${u.id})">Editar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        })
        .catch(() => {
            adminContent.innerHTML = "<div class='text-danger'>Error al cargar usuarios.</div>";
        });
}

export function cargarProductos(adminContent) {
    adminContent.innerHTML = "<div class='text-center my-4'>Cargando productos...</div>";
    api.get('/products')
        .then(res => {
            const productos = res.data;
            if (!productos.length) {
                adminContent.innerHTML = "<p>No hay productos registrados.</p>";
                return;
            }
            adminContent.innerHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(p => `
                            <tr>
                                <td>${p.id}</td>
                                <td>${p.nombre}</td>
                                <td>${p.precio}</td>
                                <td>${p.stock ?? '-'}</td>
                                <td>
                                    <button class="btn btn-info btn-sm" onclick="verDetalle('producto', ${p.id})">Ver</button>
                                    <button class="btn btn-warning btn-sm" onclick="editarElemento('producto', ${p.id})">Editar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        })
        .catch(() => {
            adminContent.innerHTML = "<div class='text-danger'>Error al cargar productos.</div>";
        });
}

export function cargarOrdenes(adminContent) {
    adminContent.innerHTML = "<div class='text-center my-4'>Cargando órdenes...</div>";
    api.get('/orders')
        .then(res => {
            const ordenes = res.data;
            if (!ordenes.length) {
                adminContent.innerHTML = "<p>No hay órdenes registradas.</p>";
                return;
            }
            adminContent.innerHTML = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordenes.map(o => `
                            <tr>
                                <td>${o.id}</td>
                                <td>${o.usuario ?? '-'}</td>
                                <td>${o.fecha ?? '-'}</td>
                                <td>${o.total ?? '-'}</td>
                                <td>
                                    <button class="btn btn-info btn-sm" onclick="verDetalle('orden', ${o.id})">Ver</button>
                                    <button class="btn btn-warning btn-sm" onclick="editarElemento('orden', ${o.id})">Editar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        })
        .catch(() => {
            adminContent.innerHTML = "<div class='text-danger'>Error al cargar órdenes.</div>";
        });
}