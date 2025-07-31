// Juego: Encuentra el Par
// Para niños de 3 a 6 años
// Memoria visual: encontrar pares de imágenes

const imagenesPares = [
  { id: 1, emoji: '🍎' },
  { id: 2, emoji: '🍌' },
  { id: 3, emoji: '🍓' },
  { id: 4, emoji: '🍊' }
];

let cartas = [];
let seleccionadas = [];
let bloqueado = false;

function mezclarCartas() {
  const arr = [...imagenesPares, ...imagenesPares];
  return arr.map(a => [Math.random(), a]).sort().map(a => a[1]);
}

function renderPares() {
  const game = document.getElementById('game-pares');
  game.innerHTML = '';
  cartas = mezclarCartas();
  seleccionadas = [];
  bloqueado = false;
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(4, 60px)';
  grid.style.gap = '1rem';
  grid.style.justifyContent = 'center';
  grid.style.margin = '2rem auto';
  cartas.forEach((carta, idx) => {
    const card = document.createElement('button');
    card.className = 'par-card';
    card.style.width = '60px';
    card.style.height = '60px';
    card.style.fontSize = '2rem';
    card.style.background = '#fff';
    card.style.border = '2px solid #aaa';
    card.style.borderRadius = '10px';
    card.style.cursor = 'pointer';
    card.innerText = '';
    card.addEventListener('click', () => {
      if (bloqueado || card.innerText !== '') return;
      card.innerText = carta.emoji;
      seleccionadas.push({ idx, carta, card });
      if (seleccionadas.length === 2) {
        bloqueado = true;
        setTimeout(() => {
          if (seleccionadas[0].carta.id === seleccionadas[1].carta.id) {
            seleccionadas[0].card.style.background = '#c8f7c5';
            seleccionadas[1].card.style.background = '#c8f7c5';
            seleccionadas[0].card.disabled = true;
            seleccionadas[1].card.disabled = true;
            checkWin();
          } else {
            seleccionadas[0].card.innerText = '';
            seleccionadas[1].card.innerText = '';
          }
          seleccionadas = [];
          bloqueado = false;
        }, 800);
      }
    });
    grid.appendChild(card);
  });
  game.appendChild(grid);
}

function checkWin() {
  const cards = document.querySelectorAll('.par-card');
  let ganaste = true;
  cards.forEach(card => {
    if (!card.disabled) ganaste = false;
  });
  if (ganaste) {
    setTimeout(() => {
      alert('¡Muy bien! Has encontrado todos los pares.');
      renderPares();
    }, 400);
  }
}

window.addEventListener('DOMContentLoaded', renderPares);
