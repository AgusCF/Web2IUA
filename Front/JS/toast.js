export function showToast(message, type = "info") {
    const toastId = "toast-" + Date.now();
    const colors = {
        info: "bg-primary text-white",
        success: "bg-success text-white",
        error: "bg-danger text-white",
        warning: "bg-warning text-dark"
    };
    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center ${colors[type] || colors.info}" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3500">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
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