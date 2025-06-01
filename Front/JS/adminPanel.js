import api from "./api.js";

const BACKEND_URL = "https://web2iua-back.onrender.com"; // Ajusta si cambia tu backend

function getImgUrl(imgPath) {
    if (!imgPath) return '';
    if (imgPath.startsWith('/uploads/')) {
        return BACKEND_URL + imgPath;
    }
    return imgPath;
}

export function cargarUsuarios(adminContent) {
    adminContent.innerHTML = "<div class='text-center my-4'>Cargando usuarios...</div>";
    api.get('/users')
        .then(res => {
            const usuarios = res.data.sort((a, b) => a.id - b.id);
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
            const productos = res.data.sort((a, b) => a.id - b.id);
            if (!productos.length) {
                adminContent.innerHTML = "<p>No hay productos registrados.</p>";
                return;
            }
            adminContent.innerHTML = `
                <button class="btn btn-success mb-3" id="btn-crear-producto">Crear producto</button>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Imagen</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Oferta</th>
                            <th>Tags</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(p => `
                            <tr>
                                <td>${p.id}</td>
                                <td>${p.name}</td>
                                <td><img src="${getImgUrl(p.img)}" alt="${p.name}" style="width:60px;max-height:60px;object-fit:cover;"></td>
                                <td>${p.description ?? ''}</td>
                                <td>${p.price}</td>
                                <td>${p.stock ?? '-'}</td>
                                <td>${p.offert ?? '-'}</td>
                                <td>${Array.isArray(p.tags) ? p.tags.join(', ') : ''}</td>
                                <td>${p.type}</td>
                                <td>
                                    <button class="btn btn-info btn-sm" onclick="verDetalle('producto', ${p.id})">Ver</button>
                                    <button class="btn btn-warning btn-sm" onclick="editarElemento('producto', ${p.id})">Editar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            document.getElementById('btn-crear-producto').onclick = () => {
                const formHtml = `
                    <form id="create-product-form">
                        <div class="mb-2">
                            <label>Nombre</label>
                            <input class="form-control" name="name" required>
                        </div>
                        <div class="mb-2">
                            <label>Descripción</label>
                            <textarea class="form-control" name="description"></textarea>
                        </div>
                        <div class="mb-2">
                            <label>Precio</label>
                            <input class="form-control" name="price" type="number" step="0.01" required>
                        </div>
                        <div class="mb-2">
                            <label>Stock</label>
                            <input class="form-control" name="stock" type="number" value="0">
                        </div>
                        <div class="mb-2">
                            <label>Oferta</label>
                            <input class="form-control" name="offert" type="number" step="0.1" value="0">
                        </div>
                        <div class="mb-2">
                            <label>Tags (separados por coma)</label>
                            <input class="form-control" name="tags">
                        </div>
                        <div class="mb-2">
                            <label>Tipo</label>
                            <input class="form-control" name="type" required>
                        </div>
                        <div class="mb-2">
                            <label>Imagen</label>
                            <input class="form-control" name="img" type="file" accept="image/*" required>
                        </div>
                        <div class="mb-2">
                            <label>Modal ID(Recomendado: modal+nombreProducto)</label>
                            <input class="form-control" name="modalId" required>
                        </div>
                        <div class="mb-2">
                            <label>Modal Descripción(Descripcion extensa)</label>
                            <input class="form-control" name="modalDescription" required>
                        </div>
                        <button class="btn btn-primary" type="submit">Crear</button>
                    </form>
                `;
                mostrarModal('Crear Producto', formHtml, (modal, bsModal) => {
                    const form = document.getElementById('create-product-form');
                    form.onsubmit = async function(e) {
                        e.preventDefault();
                        const formData = new FormData(this);
                        let imgUrl = '';
                        if (formData.get('img') && formData.get('img').size > 0) {
                            const imgForm = new FormData();
                            imgForm.append('imagen', formData.get('img'));
                            const uploadRes = await api.post('/products/upload', imgForm, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            imgUrl = uploadRes.data.imageUrl;
                        }
                        const createData = {
                            name: formData.get('name'),
                            description: formData.get('description'),
                            price: formData.get('price'),
                            stock: formData.get('stock'),
                            offert: formData.get('offert'),
                            tags: formData.get('tags').split(',').map(t => t.trim()),
                            type: formData.get('type'),
                            img: imgUrl,
                            modalId: formData.get('modalId'),
                            modalDescription: formData.get('modalDescription')
                        };
                        await api.post('/products/newProduct', createData);
                        bsModal.hide();
                        cargarProductos(document.getElementById('admin-content'));
                    };
                });
            };
        })
        .catch(() => {
            adminContent.innerHTML = "<div class='text-danger'>Error al cargar productos.</div>";
        });
}

export function cargarOrdenes(adminContent) {
    adminContent.innerHTML = "<div class='text-center my-4'>Cargando órdenes...</div>";
    api.get('/orders')
        .then(res => {
            const ordenes = res.data.sort((a, b) => a.id - b.id);
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
                            <th>Estado</th>
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
                                <td>${o.state ?? 'pendiente'}</td>
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

export function editarElemento(tipo, id) {
    if (tipo === 'producto') {
        api.get(`/products/${id}`).then(res => {
            const p = res.data;
            const formHtml = `
                <form id="edit-product-form">
                    <div class="mb-2">
                        <label>Nombre</label>
                        <input class="form-control" name="name" value="${p.name}" required>
                    </div>
                    <div class="mb-2">
                        <label>Descripción</label>
                        <textarea class="form-control" name="description">${p.description ?? ''}</textarea>
                    </div>
                    <div class="mb-2">
                        <label>Precio</label>
                        <input class="form-control" name="price" type="number" step="0.01" value="${p.price}" required>
                    </div>
                    <div class="mb-2">
                        <label>Stock</label>
                        <input class="form-control" name="stock" type="number" value="${p.stock ?? 0}">
                    </div>
                    <div class="mb-2">
                        <label>Oferta</label>
                        <input class="form-control" name="offert" type="number" step="0.1" value="${p.offert ?? 0}">
                    </div>
                    <div class="mb-2">
                        <label>Tags (separados por coma)</label>
                        <input class="form-control" name="tags" value="${Array.isArray(p.tags) ? p.tags.join(',') : ''}">
                    </div>
                    <div class="mb-2">
                        <label>Tipo</label>
                        <input class="form-control" name="type" value="${p.type}" required>
                    </div>
                    <div class="mb-2">
                        <label>Imagen actual</label><br>
                        <img src="${getImgUrl(p.img)}" alt="Imagen actual" style="width:100px;max-height:100px;object-fit:cover;">
                    </div>
                    <div class="mb-2">
                        <label>Nueva imagen (opcional)</label>
                        <input class="form-control" name="img" type="file" accept="image/*">
                    </div>
                    <button class="btn btn-primary" type="submit">Guardar</button>
                </form>
            `;
            mostrarModal('Editar Producto', formHtml, async (modal, bsModal) => {
                const form = document.getElementById('edit-product-form');
                form.onsubmit = async function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    let imgUrl = p.img;
                    if (formData.get('img') && formData.get('img').size > 0) {
                        const imgForm = new FormData();
                        imgForm.append('imagen', formData.get('img'));
                        const uploadRes = await api.post('/products/upload', imgForm, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        imgUrl = uploadRes.data.imageUrl;
                    }
                    const updateData = {
                        name: formData.get('name'),
                        description: formData.get('description'),
                        price: formData.get('price'),
                        stock: formData.get('stock'),
                        offert: formData.get('offert'),
                        tags: formData.get('tags').split(',').map(t => t.trim()),
                        type: formData.get('type'),
                        img: imgUrl
                    };
                    await api.put(`/products/${id}`, updateData);
                    bsModal.hide();
                    cargarProductos(document.getElementById('admin-content'));
                };
            });
        });
    } else if (tipo === 'usuario') {
        api.get(`/users/${id}`).then(res => {
            const u = res.data;
            const formHtml = `
                <form id="edit-user-form">
                    <div class="mb-2">
                        <label>Usuario</label>
                        <input class="form-control" name="username" value="${u.username}" required>
                    </div>
                    <div class="mb-2">
                        <label>Teléfono</label>
                        <input class="form-control" name="tel" value="${u.tel}" required>
                    </div>
                    <div class="mb-2">
                        <label>Rol</label>
                        <select class="form-control" name="role">
                            <option value="client" ${u.role === 'client' ? 'selected' : ''}>Cliente</option>
                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrador</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit">Guardar</button>
                </form>
            `;
            mostrarModal('Editar Usuario', formHtml, async (modal, bsModal) => {
                const form = document.getElementById('edit-user-form');
                form.onsubmit = async function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const updateData = {
                        username: formData.get('username'),
                        telefono: formData.get('tel'),
                        role: formData.get('role')
                    };
                    await api.put(`/users/${id}`, updateData);
                    bsModal.hide();
                    cargarUsuarios(document.getElementById('admin-content'));
                };
            });
        });
    } else if (tipo === 'orden') {
        api.get(`/orders/${id}`).then(res => {
            const o = res.data;
            const formHtml = `
                <form id="edit-order-form">
                    <div class="mb-2">
                        <label>Usuario</label>
                        <input class="form-control" name="usuario" value="${o.usuario ?? ''}" required>
                    </div>
                    <div class="mb-2">
                        <label>Fecha</label>
                        <input class="form-control" name="fecha" value="${o.fecha ?? ''}" required>
                    </div>
                    <div class="mb-2">
                        <label>Total</label>
                        <input class="form-control" name="total" type="number" value="${o.total ?? 0}" required>
                    </div>
                    <div class="mb-2">
                        <label>Estado</label>
                        <select class="form-control" name="state" required>
                            <option value="pendiente" ${o.state === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="confirmado" ${o.state === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                            <option value="en_preparacion" ${o.state === 'en_preparacion' ? 'selected' : ''}>En preparación</option>
                            <option value="enviado" ${o.state === 'enviado' ? 'selected' : ''}>Enviado</option>
                            <option value="entregado" ${o.state === 'entregado' ? 'selected' : ''}>Entregado</option>
                            <option value="cancelado" ${o.state === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                            <option value="devuelto" ${o.state === 'devuelto' ? 'selected' : ''}>Devuelto</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" type="submit">Guardar</button>
                </form>
            `;
            mostrarModal('Editar Orden', formHtml, async (modal, bsModal) => {
                const form = document.getElementById('edit-order-form');
                form.onsubmit = async function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const updateData = {
                        usuario: formData.get('usuario'),
                        fecha: formData.get('fecha'),
                        total: formData.get('total'),
                        state: formData.get('state')
                    };
                    await api.put(`/orders/${id}`, updateData);
                    bsModal.hide();
                    cargarOrdenes(document.getElementById('admin-content'));
                };
            });
        });
    } else {
        alert('Tipo no soportado');
    }
}

export function verDetalle(tipo, id) {
    if (tipo === 'producto') {
        api.get(`/products/${id}`).then(res => {
            const p = res.data;
            const html = `
                <div>
                    <div class="mb-2"><strong>Nombre:</strong> ${p.name}</div>
                    <div class="mb-2"><strong>Descripción:</strong> ${p.description ?? ''}</div>
                    <div class="mb-2"><strong>Precio:</strong> $${p.price}</div>
                    <div class="mb-2"><strong>Stock:</strong> ${p.stock ?? '-'}</div>
                    <div class="mb-2"><strong>Oferta:</strong> ${p.offert ?? '-'}</div>
                    <div class="mb-2"><strong>Tags:</strong> ${Array.isArray(p.tags) ? p.tags.join(', ') : ''}</div>
                    <div class="mb-2"><strong>Tipo:</strong> ${p.type}</div>
                    <div class="mb-2"><strong>Imagen:</strong><br>
                        <img src="${getImgUrl(p.img)}" alt="Imagen actual" style="width:100px;max-height:100px;object-fit:cover;">
                    </div>
                </div>
            `;
            mostrarModal('Detalle de Producto', html);
        });
    } else if (tipo === 'usuario') {
        api.get(`/users/${id}`).then(res => {
            const u = res.data;
            const html = `
                <div>
                    <div class="mb-2"><strong>Usuario:</strong> ${u.username}</div>
                    <div class="mb-2"><strong>Teléfono:</strong> ${u.tel}</div>
                    <div class="mb-2"><strong>Rol:</strong> ${u.role}</div>
                </div>
            `;
            mostrarModal('Detalle de Usuario', html);
        });
    } else if (tipo === 'orden') {
        api.get(`/orders/${id}`).then(res => {
            const o = res.data;
            const html = `
                <div>
                    <div class="mb-2"><strong>Usuario:</strong> ${o.usuario ?? ''}</div>
                    <div class="mb-2"><strong>Fecha:</strong> ${o.fecha ?? ''}</div>
                    <div class="mb-2"><strong>Total:</strong> $${o.total ?? 0}</div>
                    <div class="mb-2"><strong>Estado:</strong> ${o.state ?? 'pendiente'}</div>
                </div>
            `;
            mostrarModal('Detalle de Orden', html);
        });
    } else {
        alert('Tipo no soportado');
    }
}

// Utilidad para mostrar un modal reutilizable
function mostrarModal(titulo, contenido, onShow) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'editGenericModal';
    modal.tabIndex = -1;
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">${titulo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">${contenido}</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', () => modal.remove());

    if (typeof onShow === 'function') onShow(modal, bsModal);
}