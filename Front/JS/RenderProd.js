(function () {
//HardCode Productos~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const productos = [
    //ALFAJORES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    nombre: "Alfajor Bonobón",
    id:0,
    descripcion: "Doble capa de dulce de leche...",
    precio: 8000,
    imagen: "CarruselInicio/AlfBonobon.png",
    modalId: "modalAlfBon",
    modalDescripcion: "Doble capa de dulce...",
    tipo: "Alfajores",
    tags: ["Alfajor", "Dulce de leche", "Chocolate", "Galletita"]
  },
  {
    nombre: "Alfajor Coco Dulce",
    id:1,
    descripcion: "Relleno de dulce de leche con cobertura de coco rallado.",
    precio: 7500,
    imagen: "CarruselInicio/AlfCocoDulce.png",
    modalId: "modalAlfCoco",
    modalDescripcion: "Un delicioso alfajor relleno de dulce de leche cubierto por una capa de coco rallado. Dulzura y frescura en un solo bocado.",
    tipo: "Alfajores",
    tags: ["Dulce de leche", "Coco", "Alfajores"]
  },
  {
    nombre: "Alfajor de Maicena",
    id:2,
    descripcion: "Galletas de maicena rellenas de dulce de leche y espolvoreadas con coco.",
    precio: 6800,
    imagen: "CarruselInicio/AlfMaicena.png",
    modalId: "modalMaicena",
    modalDescripcion: "Clásico alfajor argentino de maicena con dulce de leche y coco. Ideal para acompañar una merienda.",
    tipo: "Alfajores",
    tags: ["Maicena", "Dulce de leche", "Coco", "Alfajores"]
  },
  {
    nombre: "Alfajor Chocolate Amargo",
    id:3,
    descripcion: "Relleno de dulce de leche y bañado en chocolate 70%.",
    precio: 8200,
    imagen: "CarruselInicio/AlfChocoAmargo.png",
    modalId: "modalChocoAmargo",
    modalDescripcion: "Para los amantes del chocolate intenso: alfajor relleno con dulce de leche y cobertura de chocolate amargo al 70%.",
    tipo: "Alfajores",
    tags: ["Chocolate amargo", "Dulce de leche", "Alfajores"]
  },
  //TORTAS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    nombre: "Lemonpie",
    id:4,
    descripcion: "Base de masa quebrada...",
    precio: 12000,
    imagen: "CarruselInicio/Lemonpie.png",
    modalId: "modalLemonpie",
    modalDescripcion: "Base crocante...",
    tipo: "Tortas",
    tags: ["Limón", "Merengue", "Crema", "Masa"]
  },
  {
    nombre: "Chocotorta",
    id:5,
    descripcion: "Capas de galletitas de chocolate y crema de dulce de leche con queso crema.",
    precio: 10000,
    imagen: "CarruselInicio/Chocotorta.png",
    modalId: "modalChocotorta",
    modalDescripcion: "Capas de galletitas de chocolate y crema de dulce de leche con queso crema.",
    tipo: "Tortas",
    tags: ["Chocolate", "Dulce de leche", "Queso crema", "Galletitas"]
  },
  {
    nombre: "Torta Oreo",
    id:6,
    descripcion: "Base húmeda de chocolate con crema de Oreo y cobertura crocante.",
    precio: 11000,
    imagen: "CarruselInicio/TortaOreo.png",
    modalId: "modalOreo",
    modalDescripcion: "Torta húmeda con capas de crema de Oreo, base de chocolate y decoración crocante.",
    tipo: "Tortas",
    tags: ["Oreo", "Chocolate", "Crema", "Torta"]
  },
  {
    nombre: "Selva Negra",
    id:7,
    descripcion: "Bizcochuelo de chocolate, cerezas y crema.",
    precio: 10500,
    imagen: "CarruselInicio/SelvaNegra.png",
    modalId: "modalSelva",
    modalDescripcion: "Típica torta con capas de bizcochuelo de chocolate, cerezas y crema batida.",
    tipo: "Tortas",
    tags: ["Chocolate", "Cereza", "Crema", "Bizcochuelo"]
  },
  {
    nombre: "Tarta Frutal",
    id:8,
    descripcion: "Base de masa con crema pastelera y frutas frescas.",
    precio: 9500,
    imagen: "CarruselInicio/TartaFrutal.png",
    modalId: "modalFrutal",
    modalDescripcion: "Tarta clásica con crema pastelera suave y frutas frescas de estación.",
    tipo: "Tortas",
    tags: ["Frutas", "Crema pastelera", "Masa", "Tarta"]
  },
  {
  nombre: "Tiramisú Clásico",
  id:9,
  descripcion: "Bizcochuelo embebido en café con crema mascarpone.",
  precio: 12500,
  imagen: "CarruselInicio/TorTiramisu.png",
  modalId: "modalTiramisu",
  modalDescripcion: "Delicado postre italiano con capas de bizcochuelo al café y suave crema mascarpone.",
  tipo: "Tortas",
  tags: ["Torta", "Café", "Mascarpone", "Bizcochuelo", "Cacao"]
},
{
  nombre: "Red Velvet",
  id:10,
  descripcion: "Bizcochuelo rojo aterciopelado con crema de queso.",
  precio: 13000,
  imagen: "CarruselInicio/TorRedVelvet.png",
  modalId: "modalRedVelvet",
  modalDescripcion: "Elegante torta de color rojo intenso con crema de queso suave, ideal para ocasiones especiales.",
  tipo: "Tortas",
  tags: ["Torta", "Cacao", "Colorante", "Queso crema", "Vainilla"]
},
{
  nombre: "Cheesecake de Frutos Rojos",
  id:11,
  descripcion: "Base de galletitas con crema de queso y salsa de frutos rojos.",
  precio: 13500,
  imagen: "CarruselInicio/TortCheesecakeFrutosRojos.png",
  modalId: "modalCheesecakeRojos",
  modalDescripcion: "Cheesecake suave y cremoso con un toque ácido de frutos rojos frescos.",
  tipo: "Tortas",
  tags: ["Torta", "Queso crema", "Frutillas", "Arándanos", "Galletitas"]
},
  //HUEVOS DE PASCUA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    nombre: "Huevo Pascua Oreo",
    id:12,
    descripcion: "Chocolate relleno con oreo...",
    precio: 15000,
    imagen: "CarruselInicio/HueOreo.png",
    modalId: "modalHuevoOreo",
    modalDescripcion: "Chocolate relleno de oreo...",
    tipo: "Huevos",
    tags: ["Chocolate", "Oreo", "Pascua"]
  },
  {
  nombre: "Huevo Kinder",
  id:13,
  descripcion: "Chocolate con leche y centro cremoso estilo Kinder.",
  precio: 16000,
  imagen: "CarruselInicio/HueKinder.png",
  modalId: "modalKinder",
  modalDescripcion: "La textura suave del chocolate con leche y el sabor único del relleno tipo Kinder en forma de huevo.",
  tipo: "Huevos",
  tags: ["Chocolate con leche", "Relleno cremoso", "Kinder", "Huevo de Pascua"]
},
{
  nombre: "Huevo Nutella",
  id:14,
  descripcion: "Chocolate relleno con crema Nutella y crocante de avellanas.",
  precio: 17000,
  imagen: "CarruselInicio/HueNutella.png",
  modalId: "modalNutella",
  modalDescripcion: "Relleno irresistible de Nutella con crocante de avellanas dentro de un cascarón de chocolate.",
  tipo: "Huevos",
  tags: ["Nutella", "Chocolate", "Avellanas", "Huevo de Pascua"]
},
  //CUPCKAES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    {
    nombre: "Cupcake Red Velvet",
    id:15,
    descripcion: "Bizcocho rojo con frosting de queso crema.",
    precio: 4500,
    imagen: "CarruselInicio/CupRedVelvet.png",
    modalId: "modalCupRed",
    modalDescripcion: "Cupcake esponjoso de Red Velvet con un cremoso frosting de queso. Elegante y delicioso.",
    tipo: "Cupcakes",
    tags: ["Red velvet", "Queso crema", "Cupcake"]
  },
  {
  nombre: "Cupcake de Vainilla y Dulce de Leche",
  id:16,
  descripcion: "Bizcochuelo de vainilla con corazón de dulce de leche.",
  precio: 4000,
  imagen: "CarruselInicio/CupVainillaYDulceDLeche.png",
  modalId: "modalCupVainilla",
  modalDescripcion: "Delicioso y suave bizcochuelo con relleno de dulce de leche y cobertura cremosa.",
  tipo: "Cupcakes",
  tags: ["Vainilla", "Dulce de leche", "Cupcake", "Mini torta"]
},
{
  nombre: "Cupcake de Limón y Amapola",
  id:17,
  descripcion: "Bizcochuelo cítrico con semillas de amapola y glaseado.",
  precio: 4200,
  imagen: "CarruselInicio/CupLimonAmapola.png",
  modalId: "modalCupLimon",
  modalDescripcion: "Suave bizcochuelo con notas cítricas y textura única, ideal para la merienda.",
  tipo: "Cupcakes",
  tags: ["Limón", "Amapola", "Glaseado", "Cupcake"]
},
{
  nombre: "Cupcake de Chocolate Intenso",
  id:18,
  descripcion: "Bizcochuelo de cacao amargo con ganache de chocolate.",
  precio: 4300,
  imagen: "CarruselInicio/CupChocolateIntenso.png",
  modalId: "modalCupChoco",
  modalDescripcion: "Perfecto para amantes del chocolate: sabor intenso y textura húmeda.",
  tipo: "Cupcakes",
  tags: ["Chocolate", "Ganache", "Cacao amargo", "Cupcake"]
},
//BOMBONES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{
  nombre: "Bombón de Dulce de Leche",
  id:19,
  descripcion: "Chocolate con corazón de dulce de leche cremoso.",
  precio: 3500,
  imagen: "CarruselInicio/BomDulceLeche.png",
  modalId: "modalBombonDDL",
  modalDescripcion: "Pequeño placer relleno de dulce de leche artesanal, cubierto con chocolate semiamargo.",
  tipo: "Bombones",
  tags: ["Chocolate", "Dulce de leche", "Bombón"]
},
{
  nombre: "Bombón de Maracuyá",
  id:20,
  descripcion: "Relleno frutal ácido con cobertura de chocolate blanco.",
  precio: 3700,
  imagen: "CarruselInicio/BomMaracuya.png",
  modalId: "modalBombonMaracuya",
  modalDescripcion: "Explosión tropical de sabor con maracuyá fresco y cobertura blanca.",
  tipo: "Bombones",
  tags: ["Maracuyá", "Chocolate blanco", "Bombón", "Frutal"]
},
{
  nombre: "Bombón Crocante de Avellanas",
  id:21,
  descripcion: "Relleno de praliné y centro crocante de avellana.",
  precio: 3900,
  imagen: "CarruselInicio/BomCrocanteAvellana.png",
  modalId: "modalBombonAvellana",
  modalDescripcion: "Inspirado en los clásicos bombones europeos: textura crocante y sabor a nuez.",
  tipo: "Bombones",
  tags: ["Avellanas", "Praliné", "Chocolate", "Bombón"]
},
  //ESPECIALES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  {
    nombre: "Brownies con Nueces",
    id:22,
    descripcion: "Brownie de chocolate con trozos de nuez crocante.",
    precio: 8500,
    imagen: "CarruselInicio/EspBrownieNueces.png",
    modalId: "modalBrownieNuez",
    modalDescripcion: "Clásico brownie húmedo con trozos de nuez. Perfecto para los amantes del chocolate y lo crocante.",
    tipo: "Especiales",
    tags: ["Chocolate", "Nueces", "Brownie"]
  },
  {
  nombre: "Budín de Limón",
  id:23,
  descripcion: "Bizcochuelo húmedo con ralladura y glaseado de limón.",
  precio: 6000,
  imagen: "CarruselInicio/EspBudinLimon.png",
  modalId: "modalBudinLimon",
  modalDescripcion: "Budín casero con intenso sabor a limón y cobertura glaseada.",
  tipo: "Especiales",
  tags: ["Budín", "Limón", "Glaseado", "Horneado"]
},
{
  nombre: "Cookies Triple Chocolate",
  id:24,
  descripcion: "Galletas con chips de chocolate blanco, negro y con leche.",
  precio: 5500,
  imagen: "CarruselInicio/EspCookiesTripleChocolate.png",
  modalId: "modalCookiesTriple",
  modalDescripcion: "Galletas crujientes por fuera y suaves por dentro, con explosión de chocolates.",
  tipo: "Especiales",
  tags: ["Galletitas", "Chocolate", "Cookies", "Horneado"]
},
{
  nombre: "Cheesecake en Frasco",
  id:25,
  descripcion: "Crema de queso, base de galletitas y frutos rojos en frasco.",
  precio: 6500,
  imagen: "CarruselInicio/EspCheesecakeFrasco.png",
  modalId: "modalFrasco",
  modalDescripcion: "Versión práctica y deliciosa del cheesecake para llevar, en frasco de vidrio reutilizable.",
  tipo: "Especiales",
  tags: ["Queso crema", "Frutillas", "Postre individual", "Frasco"]
}
];

  // Función para renderizar los productos
  function renderProductos() {
    const contenedor = document.getElementById("productos-todos");
    if (!contenedor) return;

    const tiposUnicos = [...new Set(productos.map(p => p.tipo))];
    let usarFondoClaro = true;

    tiposUnicos.forEach(tipo => {
      const productosPorTipo = productos.filter(p => p.tipo === tipo);
      // Crear contenedor de sección
      const seccion = document.createElement("section");
      seccion.id = tipo.toLowerCase(); // ej: alfajores
      seccion.className = usarFondoClaro ? "seccion-clara py-5" : "seccion-oscura py-5";

      // Construir el HTML de la sección (usamos data-tags para la búsqueda)
      let html = `
        <div class="container">
          <h2 class="text-center display-5 mb-4 fw-semibold">${tipo}</h2>
          <div class="row row-cols-1 row-cols-md-3 g-4">
      `;
      productosPorTipo.forEach(producto => {
        html += `
          <div class="col">
            <div class="card h-100 shadow-sm border-0" data-id="${producto.id}" data-tags="${producto.tags.map(tag => tag.toLowerCase()).join(' ')}">
              <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.nombre}" data-bs-toggle="modal" data-bs-target="#${producto.modalId}" loading="lazy">
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
      });
      html += `</div></div>`;
      seccion.innerHTML = html;
      contenedor.appendChild(seccion);
      usarFondoClaro = !usarFondoClaro;
    });
  }

  // Función para renderizar los modals de cada producto
  function renderModals() {
    const contenedorModales = document.getElementById("modales-container");
    if (!contenedorModales) return;

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
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid mb-3" loading="lazy" />
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
  }

  // Inicializa el renderizado al cargar el DOM
  document.addEventListener("DOMContentLoaded", () => {
    renderProductos();
    renderModals();
  });

  // Exponemos la lista de productos para que otros módulos (como el buscador) puedan acceder
  window.productos = productos;
})();
