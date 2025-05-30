import api from "./api.js";

// login.js
(function () {
    document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const telefono = document.getElementById("telefono").value.trim();
            const password = document.getElementById("password").value.trim();
            const errorDiv = document.getElementById("login-error");
            errorDiv && (errorDiv.innerText = "");

            // Validaciones básicas
            if (telefono === "" || password === "") {
            errorDiv && (errorDiv.innerText = "Todos los campos son obligatorios.");
            return;
            }

            try {
            const response = await api.post("/api/login", { telefono, password });
            const data = response.data;

            if (data.success) {
                // Guardar usuario en localStorage si lo deseas
                localStorage.setItem("usuarioActual", JSON.stringify(data.usuario));
                // Cerrar el modal
                const loginModalElem = document.getElementById("loginModal");
                const loginModal = bootstrap.Modal.getInstance(loginModalElem);
                loginModal && loginModal.hide();
                alert(`Bienvenido, ${data.usuario.usuario}`);
                // Aquí puedes redirigir o actualizar la UI
            } else {
                errorDiv && (errorDiv.innerText = data.message || "Credenciales incorrectas.");
            }
            } catch (err) {
            errorDiv && (errorDiv.innerText = "Error de conexión con el servidor.");
            }
        });
        }
    });
})();