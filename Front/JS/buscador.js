// buscador.js
(function () {
  function iniciarBuscador() {
    const buscador = document.getElementById("buscador");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
      const termino = this.value.trim().toLowerCase();
      const cards = document.querySelectorAll(".card");

      // Si el campo está vacío, restauramos la vista de todas las tarjetas y tags
      if (termino === "") {
        cards.forEach(card => {
          card.parentElement.style.display = "";
          card.querySelectorAll(".product-tag").forEach(tagElem => {
            const tagOriginal = tagElem.getAttribute("data-tag-original");
            tagElem.innerHTML = "#" + tagOriginal;
            tagElem.style.display = "";
          });
        });
        return;
      }

      // Creamos una expresión regular para filtrar las tarjetas a partir del inicio de alguna palabra en el atributo data-tags
      const regex = new RegExp("\\b" + termino, "i");

      cards.forEach(card => {
        // Filtramos la tarjeta según sus tags (guardados en data-tags)
        const tags = card.getAttribute("data-tags") || "";
        if (regex.test(tags)) {
          card.parentElement.style.display = "";
        } else {
          card.parentElement.style.display = "none";
        }
        
        // Procesamos cada etiqueta interna de la tarjeta para resaltar coincidencias
        card.querySelectorAll(".product-tag").forEach(tagElem => {
          const tagOriginal = tagElem.getAttribute("data-tag-original");
          // Si la etiqueta contiene el término (sin considerar mayúsculas/minúsculas)
          if (tagOriginal.toLowerCase().indexOf(termino) !== -1) {
            // Se crea una expresión regular para resaltar la parte coincidente
            const highlightRegex = new RegExp("(" + termino + ")", "gi");
            tagElem.innerHTML = "#" + tagOriginal.replace(highlightRegex, "<strong>$1</strong>");
            tagElem.style.display = "";
          } else {
            tagElem.style.display = "none";
          }
        });
      });
    });
  }

  // Espera a que el DOM y el navbar estén listos
  document.addEventListener("DOMContentLoaded", function () {
    // Si el buscador está en el navbar cargado por fetch, espera a que exista
    const esperarBuscador = setInterval(() => {
      if (document.getElementById("buscador")) {
        clearInterval(esperarBuscador);
        iniciarBuscador();
      }
    }, 100);
  });
})();
