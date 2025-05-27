// buscador.js (Si le das a buscar te manda a la pesta(ni)a de productos)
document.getElementById("buscador").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const valor = this.value.trim().toLowerCase();
    if (valor) {
      window.location.href = `QueHacemos.html?buscar=${encodeURIComponent(valor)}`;
    }
  }
});// buscador.js

document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.getElementById("buscador");
  if (buscador) {
    // Filtrado en tiempo real de productos
    buscador.addEventListener("input", function () {
      const termino = this.value.toLowerCase();
      const cards = document.querySelectorAll(".card");

      cards.forEach(card => {
        const nombre = card.querySelector(".card-title").textContent.toLowerCase();
        const descripcion = card.querySelector(".card-text").textContent.toLowerCase();
        const tags = card.getAttribute("data-tags") || "";
        // Se muestra la tarjeta si el término se encuentra en el nombre, descripción o tags.
        card.parentElement.style.display = (nombre.includes(termino) || descripcion.includes(termino) || tags.includes(termino)) ? "" : "none";
      });
    });

    // Opcional: redirige al pulsar Enter, similar a lo implementado en index.html
    buscador.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const valor = this.value.trim().toLowerCase();
        if (valor) {
          window.location.href = `QueHacemos.html?buscar=${encodeURIComponent(valor)}`;
        }
      }
    });
  }
});
