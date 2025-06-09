// Utilidad para mostrar un modal reutilizable
function mostrarModal(titulo, contenido, onShow) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'editGenericModal';
    modal.tabIndex = -1;
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">${titulo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">${contenido}</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', () => modal.remove());

    if (typeof onShow === 'function') onShow(modal, bsModal);
}