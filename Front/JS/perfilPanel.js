import api from "./api.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Cargar navbar
    fetch('navbar.html')
        .then(res => res.text())
        .then(html => { document.getElementById('navbar').innerHTML = html; });

    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const perfilInfo = document.getElementById("perfil-info");
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
            const response = await api.get(`/orders/usuario=${encodeURIComponent(tel)}`);
            const ordenes = response.data;
            const lista = document.getElementById("lista-ordenes");
            if (ordenes.length === 0) {
                lista.innerHTML = "<p>No tienes órdenes registradas.</p>";
            } else {
                lista.innerHTML = `
                    <ul class="list-group">
                        ${ordenes.map(o => `
                            <li class="list-group-item">
                                <strong>ID:</strong> ${o.id} |
                                <strong>Fecha:</strong> ${o.fecha ?? '-'} |
                                <strong>Total:</strong> $${o.total ?? '-'} |
                                <strong>Estado:</strong> ${o.state ?? 'pendiente'}
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
});