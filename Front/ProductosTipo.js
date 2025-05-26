//HardCode Productos~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const productos = [
  {
    nombre: "Alfajor Bonobón",
    descripcion: "Doble capa de dulce de leche...",
    precio: 8000,
    imagen: "CarruselInicio/AlfBonobon.png",
    modalId: "modalAlfBon",
    modalDescripcion: "Doble capa de dulce...",
    tipo: "Alfajores"
  },
  {
    nombre: "Lemonpie",
    descripcion: "Base de masa quebrada...",
    precio: 12000,
    imagen: "CarruselInicio/Lemonpie.png",
    modalId: "modalLemonpie",
    modalDescripcion: "Base crocante...",
    tipo: "Tortas"
  },
  {
    nombre: "Huevo Pascua Oreo",
    descripcion: "Chocolate relleno con oreo...",
    precio: 15000,
    imagen: "CarruselInicio/HuevoOreo.png",
    modalId: "modalHuevoOreo",
    modalDescripcion: "Chocolate relleno de oreo...",
    tipo: "Huevos"
  },
  {
    nombre: "Chocotorta",
    descripcion: "Capas de galletitas de chocolate y crema de dulce de leche con queso crema.",
    precio: 10000,
    imagen: "CarruselInicio/Chocotorta.png",
    modalId: "modalChocotorta",
    modalDescripcion: "Capas de galletitas de chocolate y crema de dulce de leche con queso crema.",
    tipo: "Tortas"
  },
  {
    nombre: "Torta Oreo",
    descripcion: "Base húmeda de chocolate con crema de Oreo y cobertura crocante.",
    precio: 11000,
    imagen: "CarruselInicio/TortaOreo.png",
    modalId: "modalOreo",
    modalDescripcion: "Torta húmeda con capas de crema de Oreo, base de chocolate y decoración crocante.",
    tipo: "Tortas"
  },
  {
    nombre: "Selva Negra",
    descripcion: "Bizcochuelo de chocolate, cerezas y crema.",
    precio: 10500,
    imagen: "CarruselInicio/SelvaNegra.png",
    modalId: "modalSelva",
    modalDescripcion: "Típica torta con capas de bizcochuelo de chocolate, cerezas y crema batida.",
    tipo: "Tortas"
  },
  {
    nombre: "Tarta Frutal",
    descripcion: "Base de masa con crema pastelera y frutas frescas.",
    precio: 9500,
    imagen: "CarruselInicio/TartaFrutal.png",
    modalId: "modalFrutal",
    modalDescripcion: "Tarta clásica con crema pastelera suave y frutas frescas de estación.",
    tipo: "Tortas"
  },
];
  //Generar Productos~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productos-todos");
  const tiposUnicos = [...new Set(productos.map(p => p.tipo))];
  let usarFondoClaro = true;

  tiposUnicos.forEach(tipo => {
    // Crear contenedor de sección
    const seccion = document.createElement("section");
    seccion.id = tipo.toLowerCase(); // Ej: alfajores
    seccion.className = usarFondoClaro ? "seccion-clara py-5" : "seccion-oscura py-5";

    const productosPorTipo = productos.filter(p => p.tipo === tipo);

    // Estructura de la sección
    seccion.innerHTML = `
      <div class="container">
        <h2 class="text-center display-5 mb-4 fw-semibold">${tipo}</h2>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          ${productosPorTipo.map(producto => `
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
          `).join('')}
        </div>
      </div>
    `;

    contenedor.appendChild(seccion);
    usarFondoClaro = !usarFondoClaro; // Alternar el fondo
  });
});
//Generar Modals~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const contenedorModales = document.getElementById("modales-container");

productos.forEach(producto => {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div class="modal fade" id="${producto.modalId}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${producto.nombre}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid mb-3" />
            <p>${producto.modalDescripcion}</p>
          </div>
          <div class="modal-footer">
            <span class="fw-bold me-auto">$${producto.precio}</span>
            <button class="btn btn-dark">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  `;
  contenedorModales.appendChild(modal);
});
