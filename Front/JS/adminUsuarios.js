import api from "./api.js";
import { mostrarModal } from "./adminModal.js";

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
export function editarUsuario(id) {
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
}
export function verDetalleUsuario(id) {
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
}