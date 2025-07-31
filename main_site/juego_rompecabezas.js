// Juego: Rompecabezas Simple
// Para niños de 3 a 6 años
// Arrastrar piezas para completar la imagen

const piezas = [
  { id: 1, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Puzzle_piece.svg/120px-Puzzle_piece.svg.png' },
  { id: 2, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Puzzle_piece.svg/120px-Puzzle_piece.svg.png' },
  { id: 3, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Puzzle_piece.svg/120px-Puzzle_piece.svg.png' },
  { id: 4, img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Puzzle_piece.svg/120px-Puzzle_piece.svg.png' }
];

function shuffle(arr) {
  return arr.map(a => [Math.random(), a]).sort().map(a => a[1]);
}

function renderRompecabezas() {
  const game = document.getElementById('game-rompecabezas');
  game.innerHTML = '';
  const puzzle = document.createElement('div');
  puzzle.style.display = 'grid';
  puzzle.style.gridTemplateColumns = 'repeat(2, 100px)';
  puzzle.style.gridTemplateRows = 'repeat(2, 100px)';
  puzzle.style.gap = '8px';
  puzzle.style.margin = '2rem auto';
  puzzle.style.background = '#eee';
  puzzle.style.borderRadius = '12px';
  puzzle.style.padding = '10px';
  puzzle.style.width = 'max-content';
  // Zona de piezas sueltas
  const piezasSueltas = document.createElement('div');
  piezasSueltas.style.display = 'flex';
  piezasSueltas.style.gap = '1.5rem';
  piezasSueltas.style.justifyContent = 'center';
  piezasSueltas.style.margin = '1.5rem 0';
  let piezasBarajadas = shuffle([...piezas]);
  piezasBarajadas.forEach((pieza, idx) => {
    const img = document.createElement('img');
    img.src = pieza.img;
    img.draggable = true;
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.cursor = 'grab';
    img.setAttribute('data-id', pieza.id);
    img.addEventListener('dragstart', e => {
      e.dataTransfer.setData('pieza', pieza.id);
      setTimeout(() => img.style.opacity = '0.5', 0);
    });
    img.addEventListener('dragend', e => {
      img.style.opacity = '1';
    });
    piezasSueltas.appendChild(img);
  });
  // Espacios del puzzle
  for (let i = 1; i <= 4; i++) {
    const drop = document.createElement('div');
    drop.style.width = '100px';
    drop.style.height = '100px';
    drop.style.background = '#fff';
    drop.style.border = '2px dashed #aaa';
    drop.style.borderRadius = '8px';
    drop.style.display = 'flex';
    drop.style.alignItems = 'center';
    drop.style.justifyContent = 'center';
    drop.setAttribute('data-id', i);
    drop.addEventListener('dragover', e => e.preventDefault());
    drop.addEventListener('drop', function(e) {
      e.preventDefault();
      const piezaId = e.dataTransfer.getData('pieza');
      if (parseInt(piezaId) === i && !drop.querySelector('img')) {
        const img = piezasSueltas.querySelector('img[data-id="' + piezaId + '"]');
        if (img) {
          drop.appendChild(img);
          img.style.cursor = 'default';
          img.draggable = false;
          checkWin();
        }
      }
    });
    puzzle.appendChild(drop);
  }
  game.appendChild(puzzle);
  game.appendChild(piezasSueltas);
}

function checkWin() {
  const drops = document.querySelectorAll('#game-rompecabezas div[data-id]');
  let completo = true;
  drops.forEach(drop => {
    if (!drop.querySelector('img')) completo = false;
  });
  if (completo) {
    setTimeout(() => {
      alert('¡Excelente! Has completado el rompecabezas.');
      renderRompecabezas();
    }, 400);
  }
}

window.addEventListener('DOMContentLoaded', renderRompecabezas);
