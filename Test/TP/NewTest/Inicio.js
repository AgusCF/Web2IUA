document.addEventListener("DOMContentLoaded", function () {
    const margenSup = document.querySelector('.margenSup');
    const logo = document.querySelector('.logo');

    // Mostrar imagen superior después de 0.5s
    setTimeout(() => {
        margenSup.classList.add('visible');
    }, 500);

    // Mostrar logo después de 2.5s
    setTimeout(() => {
        logo.classList.add('visible');
    }, 2500);

    // Redireccionar al login después de 7.5s
    setTimeout(() => {
        window.location.href = "Login.html";
    }, 7500);
});
