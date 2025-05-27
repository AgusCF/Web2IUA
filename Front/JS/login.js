// login.js
document.getElementById("login-link").addEventListener("click", function (e) {
    e.preventDefault();
    const loginModalElement = document.getElementById("loginModal");
    const loginModal = new bootstrap.Modal(loginModalElement);
    loginModal.show();
});
// login.js

// Definimos la variable global que almacenará al usuario logueado.
var usuarioActual = null;

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");
  const loginForm = document.getElementById("login-form");

  // Verifica si los elementos de login existen antes de asignar los eventos.
  if (loginLink && loginForm) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      const loginModalElem = document.getElementById("loginModal");
      const loginModal = new bootstrap.Modal(loginModalElem);
      loginModal.show();
    });

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombreInput = document.getElementById("usuario");
      const telefonoInput = document.getElementById("telefono");

      const nombre = nombreInput.value.trim();
      const telefono = telefonoInput.value.trim();

      // Validación básica: verificación de campo no vacío.
      if (nombre === "") {
        alert("El nombre no puede estar vacío");
        return;
      }

      // Validación simple del teléfono: solo dígitos y longitud mínima de 8.
      const phoneRegex = /^[0-9]{8,}$/;
      if (!phoneRegex.test(telefono)) {
        alert("El número de teléfono debe contener solo dígitos y tener al menos 8 caracteres");
        return;
      }

      usuarioActual = {
        nombre,
        telefono,
        rol: nombre.toLowerCase() === "admin" ? "admin" : "usuario"
      };

      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

      const loginModalElem = document.getElementById("loginModal");
      const loginModal = bootstrap.Modal.getInstance(loginModalElem);
      loginModal.hide();
      alert(`Bienvenido, ${usuarioActual.nombre}`);
    });
  }
});
