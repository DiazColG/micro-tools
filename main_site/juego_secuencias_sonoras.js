// Juego: Secuencias Sonoras
// Para niños de 3 a 6 años
// Escuchar y repetir secuencias de sonidos

const sonidos = [
  { nombre: 'Vaca', emoji: '🐮', src: 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae2e2.mp3' },
  { nombre: 'Pato', emoji: '🦆', src: 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae2e3.mp3' },
  { nombre: 'Gato', emoji: '🐱', src: 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae2e4.mp3' },
  { nombre: 'Perro', emoji: '🐶', src: 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae2e5.mp3' }
];

let secuencia = [];
let respuesta = [];
let jugando = false;

function playSound(idx) {
  const audio = new Audio(sonidos[idx].src);
  audio.play();
}

function reproducirSecuencia(i = 0) {
  if (i >= secuencia.length) {
    jugando = true;
    return;
  }
  const idx = secuencia[i];
  const btn = document.querySelectorAll('.sonido-btn')[idx];
  btn.classList.add('active');
  playSound(idx);
  setTimeout(() => {
    btn.classList.remove('active');
    setTimeout(() => reproducirSecuencia(i + 1), 400);
  }, 800);
}

function nuevaSecuencia() {
  secuencia = [];
  for (let i = 0; i < 3; i++) {
    secuencia.push(Math.floor(Math.random() * sonidos.length));
  }
  respuesta = [];
  jugando = false;
  reproducirSecuencia();
}

function renderSecuenciasSonoras() {
  const game = document.getElementById('game-secuencias-sonoras');
  game.innerHTML = '';
  const btns = document.createElement('div');
  btns.style.display = 'flex';
  btns.style.gap = '2rem';
  btns.style.justifyContent = 'center';
  sonidos.forEach((s, idx) => {
    const btn = document.createElement('button');
    btn.className = 'sonido-btn';
    btn.style.fontSize = '2.5rem';
    btn.style.padding = '1.2rem';
    btn.style.borderRadius = '50%';
    btn.style.border = '2px solid #888';
    btn.style.background = '#fff';
    btn.style.cursor = 'pointer';
    btn.innerText = s.emoji;
    btn.title = s.nombre;
    btn.addEventListener('click', () => {
      if (!jugando) return;
      playSound(idx);
      respuesta.push(idx);
      if (respuesta[respuesta.length - 1] !== secuencia[respuesta.length - 1]) {
        jugando = false;
        setTimeout(() => {
          alert('¡Intenta de nuevo!');
          nuevaSecuencia();
        }, 400);
      } else if (respuesta.length === secuencia.length) {
        jugando = false;
        setTimeout(() => {
          alert('¡Muy bien! Has repetido la secuencia.');
          nuevaSecuencia();
        }, 400);
      }
    });
    btns.appendChild(btn);
  });
  game.appendChild(btns);
  const startBtn = document.createElement('button');
  startBtn.innerText = 'Escuchar secuencia';
  startBtn.style.marginTop = '2rem';
  startBtn.style.fontSize = '1.2rem';
  startBtn.style.padding = '0.7rem 2rem';
  startBtn.style.borderRadius = '8px';
  startBtn.style.background = '#4CAF50';
  startBtn.style.color = '#fff';
  startBtn.style.border = 'none';
  startBtn.style.cursor = 'pointer';
  startBtn.addEventListener('click', () => {
    nuevaSecuencia();
  });
  game.appendChild(startBtn);
}

window.addEventListener('DOMContentLoaded', renderSecuenciasSonoras);
