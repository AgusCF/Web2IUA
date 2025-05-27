// buscador.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador");
    if (!buscador) return;

    buscador.addEventListener("input", function () {
      const termino = this.value.trim().toLowerCase();

      // Si no se ha escrito nada, se muestran todas las tarjetas
      if (termino === "") {
        document.querySelectorAll(".card").forEach(card => {
          card.parentElement.style.display = "";
        });
        return;
      }

      // Creamos una expresión regular que busque el comienzo de cualquier palabra con el término ingresado.
      // Ejemplo: si termino es "cho", la regex será: /\bcho/i
      const regex = new RegExp("\\b" + termino, "i");

      // Seleccionamos todas las tarjetas generadas (los elementos con clase "card")
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => {
        // Obtenemos la cadena de tags ya en minúscula desde data-tags.
        // Se asume que los tags se guardaron correctamente con el join(' ') en el renderizado.
        const tags = card.getAttribute("data-tags") || "";
        // La tarjeta se mostrará si alguna palabra (definida por un límite de palabra) en los tags comienza 
        // con el término ingresado.
        if (regex.test(tags)) {
          card.parentElement.style.display = "";
        } else {
          card.parentElement.style.display = "none";
        }
      });
    });
  });
})();
