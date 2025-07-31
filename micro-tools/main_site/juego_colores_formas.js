// Juego: Colores y Formas
// Desarrollado para niños de 3 a 6 años
// Arrastrar figuras a su silueta correspondiente

const figuras = [
  { color: 'red', shape: 'circle', label: 'Círculo rojo' },
  { color: 'blue', shape: 'square', label: 'Cuadrado azul' },
  { color: 'yellow', shape: 'triangle', label: 'Triángulo amarillo' }
];

const siluetas = [
  { shape: 'circle', color: 'red' },
  { shape: 'square', color: 'blue' },
  { shape: 'triangle', color: 'yellow' }
];

function createShape(shape, color, size = 80) {
  const el = document.createElement('div');
  el.className = `shape ${shape}`;
  el.style.background = color;
  el.style.width = el.style.height = size + 'px';
  if (shape === 'triangle') {
    el.style.background = 'none';
    el.style.width = '0';
    el.style.height = '0';
    el.style.borderLeft = size/2 + 'px solid transparent';
    el.style.borderRight = size/2 + 'px solid transparent';
    el.style.borderBottom = size + 'px solid ' + color;
  }
  return el;
}

function renderGame() {
  const game = document.getElementById('game-colores-formas');
  game.innerHTML = '';
  game.style.display = 'flex';
  game.style.flexDirection = 'row';
  game.style.justifyContent = 'space-around';
  game.style.alignItems = 'center';
  game.style.flexWrap = 'wrap';
  // Figuras para arrastrar
  const dragZone = document.createElement('div');
  dragZone.style.display = 'flex';
  dragZone.style.flexDirection = 'column';
  dragZone.style.gap = '2rem';
  dragZone.style.alignItems = 'center';
  dragZone.style.margin = '1rem';
  figuras.forEach((fig, idx) => {
    const figEl = createShape(fig.shape, fig.color);
    figEl.setAttribute('draggable', 'true');
    figEl.setAttribute('data-shape', fig.shape);
    figEl.setAttribute('data-color', fig.color);
    figEl.title = fig.label;
    figEl.style.cursor = 'grab';
    figEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    figEl.addEventListener('dragstart', e => {
      e.dataTransfer.setData('shape', fig.shape);
      e.dataTransfer.setData('color', fig.color);
      setTimeout(() => figEl.style.opacity = '0.5', 0);
    });
    figEl.addEventListener('dragend', e => {
      figEl.style.opacity = '1';
    });
    dragZone.appendChild(figEl);
  });
  // Siluetas destino
  const dropZone = document.createElement('div');
  dropZone.style.display = 'flex';
  dropZone.style.flexDirection = 'column';
  dropZone.style.gap = '2rem';
  dropZone.style.alignItems = 'center';
  dropZone.style.margin = '1rem';
  siluetas.forEach((silueta, idx) => {
    const silEl = createShape(silueta.shape, '#eee');
    silEl.setAttribute('data-shape', silueta.shape);
    silEl.setAttribute('data-color', silueta.color);
    silEl.style.border = '3px dashed ' + silueta.color;
    silEl.style.background = '#eee';
    silEl.style.opacity = '0.7';
    silEl.style.position = 'relative';
    silEl.addEventListener('dragover', e => e.preventDefault());
    silEl.addEventListener('drop', function(e) {
      e.preventDefault();
      const shape = e.dataTransfer.getData('shape');
      const color = e.dataTransfer.getData('color');
      if (shape === silueta.shape && color === silueta.color) {
        silEl.style.background = color;
        silEl.style.opacity = '1';
        silEl.innerHTML = '<span style="position:absolute;top:30%;left:30%;font-size:2rem;">✔️</span>';
        silEl.style.pointerEvents = 'none';
        // Quitar la figura arrastrada
        [...dragZone.children].forEach(child => {
          if (child.getAttribute('data-shape') === shape && child.getAttribute('data-color') === color) {
            child.style.visibility = 'hidden';
          }
        });
        checkWin();
      } else {
        silEl.style.background = '#eee';
        silEl.style.opacity = '0.7';
      }
    });
    dropZone.appendChild(silEl);
  });
  game.appendChild(dragZone);
  game.appendChild(dropZone);
}

function checkWin() {
  const done = [...document.querySelectorAll('#game-colores-formas .shape')].filter(el => el.innerHTML.includes('✔️')).length;
  if (done === siluetas.length) {
    setTimeout(() => {
      alert('¡Muy bien! Has completado el juego.');
      renderGame();
    }, 400);
  }
}

window.addEventListener('DOMContentLoaded', renderGame);
