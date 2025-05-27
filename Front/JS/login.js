// login.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    // Si aún no existe la base de usuarios en localStorage, se crea con dos usuarios pre-cargados:
    // - Admin: { usuario: "Agus", telefono: "1234567890", rol: "admin" }
    // - Usuario Común: { usuario: "Comun", telefono: "0987654321", rol: "usuario" }
    let usuarios = localStorage.getItem("usuarios");
    if (!usuarios) {
      const preloaded = [
        { usuario: "Agus", telefono: "1234567890", rol: "admin" },
        { usuario: "Comun", telefono: "0987654321", rol: "usuario" }
      ];
      localStorage.setItem("usuarios", JSON.stringify(preloaded));
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener valores de los inputs y limpiar espacios en blanco
        const nombre = document.getElementById("usuario").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const telefonoConfirm = document.getElementById("telefonoConfirm").value.trim();
        const errorDiv = document.getElementById("login-error");
        errorDiv.innerText = "";

        // Validaciones básicas: campos obligatorios
        if (nombre === "" || telefono === "" || telefonoConfirm === "") {
          errorDiv.innerText = "Todos los campos son obligatorios.";
          return;
        }

        // Validación: los teléfonos deben coincidir
        if (telefono !== telefonoConfirm) {
          errorDiv.innerText = "Los números de teléfono no coinciden.";
          return;
        }

        // Validación simple del formato del teléfono: sólo dígitos y 10 dígitos de largo.
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(telefono)) {
          errorDiv.innerText = "El número de teléfono debe contener 10 dígitos.";
          return;
        }

        // Obtener la "base de datos" de usuarios y verificar si el teléfono ya está registrado
        let usuariosDB = JSON.parse(localStorage.getItem("usuarios"));
        const userFound = usuariosDB.find(u => u.telefono === telefono);

        if (userFound) {
          // Si el teléfono ya está registrado, chequear que el nombre coincida (evitamos duplicados con distinto nombre)
          if (userFound.usuario.toLowerCase() !== nombre.toLowerCase()) {
            errorDiv.innerText = "El teléfono ya está registrado con otro nombre.";
            return;
          }
          // Si coinciden, se procede con el login usando el usuario existente
          localStorage.setItem("usuarioActual", JSON.stringify(userFound));
        } else {
          // Si el teléfono no se encuentra, se registra el nuevo usuario como "usuario" común
          const newUser = { usuario: nombre, telefono: telefono, rol: "usuario" };
          usuariosDB.push(newUser);
          localStorage.setItem("usuarios", JSON.stringify(usuariosDB));
          localStorage.setItem("usuarioActual", JSON.stringify(newUser));
        }

        // Cerrar el modal de login
        const loginModalElem = document.getElementById("loginModal");
        const loginModal = bootstrap.Modal.getInstance(loginModalElem);
        loginModal.hide();

        alert(`Bienvenido, ${nombre}`);

        // Aquí podrías invocar funciones adicionales que habiliten el carrito o cambien la interfaz
      });
    }
  });
})();
