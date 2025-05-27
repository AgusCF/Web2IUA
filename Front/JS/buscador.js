(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
      const termino = this.value.trim().toLowerCase();

      // Seleccionamos todas las tarjetas generadas (los elementos con clase "card")
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => {
        // Obtenemos la cadena de tags ya en minúscula desde data-tags
        const tags = card.getAttribute("data-tags") || "";
        // Se mostrará la tarjeta si se encuentra el término en los tags
        if (tags.indexOf(termino) !== -1) {
          // Mostramos el contenedor de la tarjeta (la columna)
          card.parentElement.style.display = "";
        } else {
          // Si el término no coincide, se oculta el contenedor completo de la tarjeta
          card.parentElement.style.display = "none";
        }
      });
    });
  });
})();
