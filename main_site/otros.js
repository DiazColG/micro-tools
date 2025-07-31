document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tool-anotador-truco').addEventListener('click', e => {
    e.preventDefault();
    showModal('Anotador de Truco', anotadorTrucoHTML(), anotadorTrucoLogic, true);
  });
});

function anotadorTrucoHTML() {
  return `<iframe src="Anotador de truco v2/index.html" style="width:100%;height:80vh;border:none;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.1);"></iframe>`;
}

function anotadorTrucoLogic() {
  // No se requiere lógica adicional, el iframe es autosuficiente
}

// --- Modal reutilizable (simple) ---
function showModal(titulo, contenido, onReady, fullscreen) {
  let modal = document.createElement('div');
  modal.className = 'modal-bg';
  modal.innerHTML = `
    <div class="modal-window" style="max-width:900px;${fullscreen?"width:90vw;height:90vh;":""}">
      <div class="modal-header">
        <h2>${titulo}</h2>
        <button class="modal-close">✖</button>
      </div>
      <div class="modal-content">${typeof contenido === 'function' ? contenido() : contenido}</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').onclick = () => modal.remove();
  if (onReady) onReady();
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
}
