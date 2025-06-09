import { verDetalleUsuario, editarUsuario, cargarUsuarios } from "./adminUsuarios.js";
import { verDetalleProducto, editarProducto, cargarProductos } from "./adminProductos.js";
import { verDetalleOrden, editarOrden, cargarOrdenes } from "./adminOrdenes.js";

// Función para cargar el panel de administración
window.cargarPanelAdmin = function() {
    if (tipo === "usuarios") return cargarUsuarios(document.getElementById("admin-content"));
    if (tipo === "productos") return cargarProductos(document.getElementById("admin-content"));
    if (tipo === "ordenes") return cargarOrdenes(document.getElementById("admin-content"));
    alert("Tipo de panel no soportado");
}

// Definir como funciones normales
function verDetalle(tipo, id) {
    if (tipo === "usuario") return verDetalleUsuario(id);
    if (tipo === "producto") return verDetalleProducto(id);
    if (tipo === "orden") return verDetalleOrden(id);
    alert("Tipo no soportado");
}

function editarElemento(tipo, id) {
    if (tipo === "usuario") return editarUsuario(id);
    if (tipo === "producto") return editarProducto(id);
    if (tipo === "orden") return editarOrden(id);
    alert("Tipo no soportado");
}

// Asignar a window para los onclick dinámicos
window.verDetalle = verDetalle;
window.editarElemento = editarElemento;

export { cargarUsuarios, cargarProductos, cargarOrdenes, editarElemento, verDetalle };

