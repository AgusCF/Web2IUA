import api from "./api.js";
console.log("login.js cargado");

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

                if (data.token) {
                    // Login exitoso
                    localStorage.setItem("usuarioActual", JSON.stringify(data));
                    const loginModalElem = document.getElementById("loginModal");
                    const loginModal = bootstrap.Modal.getInstance(loginModalElem);
                    loginModal && loginModal.hide();
                    console.log("Login exitoso:", data.usuario); // <-- Agrega esto
                    alert(`Bienvenido, ${data.usuario.usuario}`);
                    // Aquí puedes redirigir o actualizar la UI
                    // window.location.href = "index.html"; // Si quieres redirigir
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