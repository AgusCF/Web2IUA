// productos.js
// productos.js
const productos = [
  {//Agregar Tag a todos los productos (Categoria)
    nombre: "Lemonpie",
    descripcion: "Base de masa quebrada rellena con crema de limón y merengue suizo.",
    precio: 12000,
    imagen: "CarruselInicio/Lemonpie.png",
    modalId: "modalLemonpie",
    modalDescripcion: "Base crocante de masa quebrada con crema de limón y cobertura de merengue suizo. Perfecta para los amantes del contraste entre dulce y ácido."
  },
  {
    nombre: "Chocotorta",
    descripcion: "Capas de galletitas de chocolate y crema de dulce de leche con queso crema.",
    precio: 10000,
    imagen: "CarruselInicio/Chocotorta.png",
    modalId: "modalChocotorta",
    modalDescripcion: "Capas de galletitas de chocolate y crema de dulce de leche con queso crema."
  },
  {
    nombre: "Alfajor Bonobón",
    descripcion: "Doble capa de dulce de leche con cobertura de chocolate y corazón de Bonobón.",
    precio: 8000,
    imagen: "CarruselInicio/AlfBonobon.png",
    modalId: "modalAlfBon",
    modalDescripcion: "Doble capa de dulce de leche con cobertura de chocolate y corazón de Bonobón."
  },
  {
    nombre: "Torta Oreo",
    descripcion: "Base húmeda de chocolate con crema de Oreo y cobertura crocante.",
    precio: 11000,
    imagen: "CarruselInicio/TortaOreo.png",
    modalId: "modalOreo",
    modalDescripcion: "Torta húmeda con capas de crema de Oreo, base de chocolate y decoración crocante."
  },
  {
    nombre: "Selva Negra",
    descripcion: "Bizcochuelo de chocolate, cerezas y crema.",
    precio: 10500,
    imagen: "CarruselInicio/SelvaNegra.png",
    modalId: "modalSelva",
    modalDescripcion: "Típica torta con capas de bizcochuelo de chocolate, cerezas y crema batida."
  },
  {
    nombre: "Tarta Frutal",
    descripcion: "Base de masa con crema pastelera y frutas frescas.",
    precio: 9500,
    imagen: "CarruselInicio/TartaFrutal.png",
    modalId: "modalFrutal",
    modalDescripcion: "Tarta clásica con crema pastelera suave y frutas frescas de estación."
  },
  {//Duplicados para ver que se vea lindo
    nombre: "Alfajor Bonobón",
    descripcion: "Doble capa de dulce de leche con cobertura de chocolate y corazón de Bonobón.",
    precio: 8000,
    imagen: "CarruselInicio/AlfBonobon.png",
    modalId: "modalAlfBon",
    modalDescripcion: "Doble capa de dulce de leche con cobertura de chocolate y corazón de Bonobón."
  },
  {
    nombre: "Torta Oreo",
    descripcion: "Base húmeda de chocolate con crema de Oreo y cobertura crocante.",
    precio: 11000,
    imagen: "CarruselInicio/TortaOreo.png",
    modalId: "modalOreo",
    modalDescripcion: "Torta húmeda con capas de crema de Oreo, base de chocolate y decoración crocante."
  },
  {
    nombre: "Selva Negra",
    descripcion: "Bizcochuelo de chocolate, cerezas y crema.",
    precio: 10500,
    imagen: "CarruselInicio/SelvaNegra.png",
    modalId: "modalSelva",
    modalDescripcion: "Típica torta con capas de bizcochuelo de chocolate, cerezas y crema batida."
  },
  {
    nombre: "Tarta Frutal",
    descripcion: "Base de masa con crema pastelera y frutas frescas.",
    precio: 9500,
    imagen: "CarruselInicio/TartaFrutal.png",
    modalId: "modalFrutal",
    modalDescripcion: "Tarta clásica con crema pastelera suave y frutas frescas de estación."
  },
  // Podés seguir agregando más productos
];

function renderizarProductos() {
  const seccionesContainer = document.getElementById("secciones-productos");
  const modalesContainer = document.getElementById("modales-productos");

  const productosPorSeccion = 6;
  let seccionActual = 0;

  for (let i = 0; i < productos.length; i += productosPorSeccion) {
    const productosGrupo = productos.slice(i, i + productosPorSeccion);
    const esOscura = seccionActual % 2 === 1;

    // Crear sección
    const seccion = document.createElement("section");
    seccion.className = esOscura ? "seccion-oscura py-5" : "py-5";
    seccion.innerHTML = `
      <div class="container">
        <h2 class="text-center display-5 mb-4 fw-semibold">${esOscura ? "Especiales" : "Clásicos"}</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          ${productosGrupo.map(p => generarCardHTML(p)).join("")}
        </div>
      </div>
    `;

    seccionesContainer.appendChild(seccion);

    // Agregar modales
    productosGrupo.forEach(p => {
      modalesContainer.innerHTML += generarModalHTML(p);
    });

    seccionActual++;
  }
}

function generarCardHTML(producto) {
  return `
    <div class="col">
      <div class="card h-100 shadow-sm border-0">
        <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.nombre}" data-bs-toggle="modal" data-bs-target="#${producto.modalId}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
        </div>
        <div class="card-footer bg-transparent d-flex justify-content-between">
          <span class="fw-bold text-muted">$${producto.precio}</span>
          <button class="btn btn-outline-dark">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `;
}

function generarModalHTML(producto) {
  return `
    <div class="modal fade" id="${producto.modalId}" tabindex="-1" aria-labelledby="${producto.modalId}Label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${producto.modalId}Label">${producto.nombre}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <img src="${producto.imagen}" class="img-fluid mb-3" alt="${producto.nombre}">
            <p>${producto.modalDescripcion}</p>
            <p class="fw-bold text-muted">Precio: $${producto.precio}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-dark">Agregar al carrito</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", renderizarProductos);