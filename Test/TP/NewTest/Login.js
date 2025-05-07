document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('User');
    const passwordInput = document.getElementById('Contra');
    const loginButton = document.querySelector('button[type="submit"]');
    const form = document.querySelector('.login-form');

    // Desactivar botón al inicio
    loginButton.disabled = true;

    // Crear mensaje de error
    const errorMsg = document.createElement('p');
    errorMsg.style.color = 'red';
    errorMsg.style.fontSize = '14px';
    errorMsg.style.display = 'none';
    form.insertBefore(errorMsg, loginButton);

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarFormulario() {
        const emailValido = validarEmail(userInput.value);
        const passwordValida = passwordInput.value.length >= 8;

        if (!emailValido && userInput.value !== '') {
            errorMsg.textContent = 'Debe ingresar un correo válido.';
            errorMsg.style.display = 'block';
        } else {
            errorMsg.style.display = 'none';
        }

        loginButton.disabled = !(emailValido && passwordValida);
    }

    userInput.addEventListener('input', validarFormulario);
    passwordInput.addEventListener('input', validarFormulario);

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita que se envíe el formulario
        window.location.href = 'Billetera.html';
    });
});
