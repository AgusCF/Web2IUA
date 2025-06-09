import api from "./api.js";
import { mostrarModal } from "./adminModal.js";


const BACKEND_URL = "https://web2iua-back.onrender.com"; // Ajusta si cambia tu backend

function getImgUrl(imgPath) {
    if (!imgPath) return '';
    if (imgPath.startsWith('/uploads/')) {
        return BACKEND_URL + imgPath;
    }
    return imgPath;
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
export function editarProducto(id) {
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
}
export function verDetalleProducto(id) {
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
}