// buscador.js
(function () {
  // Espera a que el navbar esté cargado dinámicamente
  function initBuscador() {
    const buscador = document.getElementById("buscador");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
      const termino = this.value.trim();
      // Si no estamos en QueHacemos.html, redirigimos con el término
      if (!window.location.pathname.endsWith("QueHacemos.html")) {
        if (termino.length > 0) {
          window.location.href = `QueHacemos.html?buscar=${encodeURIComponent(termino)}`;
        }
        return;
      }

      // --- Lógica normal del buscador ---
      const terminoLower = termino.toLowerCase();
      const cards = document.querySelectorAll(".card");

      if (terminoLower === "") {
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

      const regex = new RegExp("\\b" + terminoLower, "i");

      cards.forEach(card => {
        const tags = card.getAttribute("data-tags") || "";
        if (regex.test(tags)) {
          card.parentElement.style.display = "";
        } else {
          card.parentElement.style.display = "none";
        }
        card.querySelectorAll(".product-tag").forEach(tagElem => {
          const tagOriginal = tagElem.getAttribute("data-tag-original");
          if (tagOriginal.toLowerCase().indexOf(terminoLower) !== -1) {
            const highlightRegex = new RegExp("(" + terminoLower + ")", "gi");
            tagElem.innerHTML = "#" + tagOriginal.replace(highlightRegex, "<strong>$1</strong>");
            tagElem.style.display = "";
          } else {
            tagElem.style.display = "none";
          }
        });
      });
    });

    // Si estamos en QueHacemos.html y hay un parámetro de búsqueda, rellenar y disparar el evento
    if (window.location.pathname.endsWith("QueHacemos.html")) {
      const params = new URLSearchParams(window.location.search);
      const buscar = params.get("buscar");
      if (buscar) {
        buscador.value = buscar;
        // Disparar el evento input para filtrar automáticamente
        buscador.dispatchEvent(new Event("input"));
      }
    }
  }

  // Espera a que el navbar esté en el DOM
  document.addEventListener("DOMContentLoaded", function () {
    const esperarNavbar = setInterval(() => {
      if (document.getElementById("buscador")) {
        clearInterval(esperarNavbar);
        initBuscador();
      }
    }, 50);
  });
})();
