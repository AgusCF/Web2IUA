export function showToast(message) {
  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
      <div class="toast-body text-center">
        <button type="button" class="btn btn-primary btn-sm ms-2" data-bs-dismiss="toast">OK</button>
      </div>
    </div>
  `;
  const container = document.getElementById("toast-container");
  container.insertAdjacentHTML("beforeend", toastHtml);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

export function showModalNotificacion(mensaje, titulo = "Notificación") {
  // Cierra cualquier modal abierto de Bootstrap
  document.querySelectorAll('.modal.show').forEach(modalEl => {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
  });

  // Espera a que se cierren los modales anteriores antes de mostrar la notificación
  setTimeout(() => {
    document.getElementById('notificacionModalLabel').textContent = titulo;
    document.getElementById('notificacionModalBody').textContent = mensaje;
    const modal = new bootstrap.Modal(document.getElementById('notificacionModal'), {
      backdrop: 'static',
      focus: true
    });
    modal.show();
  }, 300); // 300ms para animación de cierre
}