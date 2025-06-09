import api from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (showRegister && showLogin && loginModal && registerModal) {
        showRegister.onclick = function(e) {
            e.preventDefault();
            // Oculta el modal de login y muestra el de registro
            const bsLogin = bootstrap.Modal.getInstance(loginModal) || new bootstrap.Modal(loginModal);
            bsLogin.hide();
            setTimeout(() => {
                // Mostrar el formulario de registro
                registerForm.style.display = "block";
                const bsRegister = bootstrap.Modal.getInstance(registerModal) || new bootstrap.Modal(registerModal);
                bsRegister.show();
            }, 300); // Espera a que termine la animación de cierre
        };
        showLogin.onclick = function(e) {
            e.preventDefault();
            // Oculta el modal de registro y muestra el de login
            registerForm.style.display = "none";
            const bsRegister = bootstrap.Modal.getInstance(registerModal) || new bootstrap.Modal(registerModal);
            bsRegister.hide();
            setTimeout(() => {
                const bsLogin = bootstrap.Modal.getInstance(loginModal) || new bootstrap.Modal(loginModal);
                bsLogin.show();
            }, 300);
        };
    }

    // Manejar registro
    registerForm && registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const tel = document.getElementById("reg-telefono").value;
        const username = "user"+tel; // Generar un nombre de usuario simple basado en el teléfono
        if (!tel || tel.length < 10) {
            document.getElementById("register-error").textContent = "Por favor, ingresa un número de teléfono válido.";
            return;
        }
        if (!/^\d+$/.test(tel)) {
            document.getElementById("register-error").textContent = "El número de teléfono solo debe contener dígitos.";
            return;
        }
        if (tel.length < 10 || tel.length > 15) {
            document.getElementById("register-error").textContent = "El número de teléfono debe tener entre 10 y 15 dígitos.";
            return;
        }
        document.getElementById("register-error").textContent = ""; // Limpiar mensajes de error
        const password = tel;
        const telefono = tel;
        try {
            const res = await api.post("/users/newUser", { username, telefono, password });
            if (res.status === 201 || res.status === 200) {
                document.getElementById("register-error").textContent = "¡Registrado correctamente! Ahora puedes iniciar sesión.";
                setTimeout(() => {
                    registerForm.style.display = "none";
                    loginForm.style.display = "block";
                }, 1500);
            } else {
                document.getElementById("register-error").textContent = res.data?.message || "Error al registrar";
            }
        } catch (err) {
            document.getElementById("register-error").textContent = err.response?.data?.message || "Error de conexión";
        }
    });
});