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