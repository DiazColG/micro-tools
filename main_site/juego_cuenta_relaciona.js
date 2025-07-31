// Juego: Cuenta y Relaciona
// Para niños de 3 a 6 años
// Contar objetos y seleccionar el número correcto

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderCuentaRelaciona() {
  const game = document.getElementById('game-cuenta-relaciona');
  game.innerHTML = '';
  // Generar cantidad aleatoria de objetos (2 a 6)
  const cantidad = getRandomInt(2, 6);
  const objeto = ['🐶','🐱','🐭','🐰','🐻'][getRandomInt(0,4)];
  const objetosDiv = document.createElement('div');
  objetosDiv.style.fontSize = '2.5rem';
  objetosDiv.style.margin = '2rem 0 1rem 0';
  for (let i = 0; i < cantidad; i++) {
    const span = document.createElement('span');
    span.innerText = objeto;
    objetosDiv.appendChild(span);
  }
  game.appendChild(objetosDiv);
  // Opciones de respuesta
  const opciones = [];
  while (opciones.length < 3) {
    let n = getRandomInt(2, 6);
    if (!opciones.includes(n)) opciones.push(n);
  }
  if (!opciones.includes(cantidad)) opciones[getRandomInt(0,2)] = cantidad;
  opciones.sort((a,b) => a-b);
  const opcionesDiv = document.createElement('div');
  opcionesDiv.style.display = 'flex';
  opcionesDiv.style.gap = '2rem';
  opcionesDiv.style.justifyContent = 'center';
  opciones.forEach(num => {
    const btn = document.createElement('button');
    btn.innerText = num;
    btn.style.fontSize = '2rem';
    btn.style.padding = '1rem 2rem';
    btn.style.borderRadius = '10px';
    btn.style.border = '2px solid #888';
    btn.style.background = '#fff';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      if (num === cantidad) {
        btn.style.background = '#c8f7c5';
        setTimeout(() => {
          alert('¡Muy bien!');
          renderCuentaRelaciona();
        }, 400);
      } else {
        btn.style.background = '#f7c5c5';
        setTimeout(() => {
          btn.style.background = '#fff';
        }, 600);
      }
    });
    opcionesDiv.appendChild(btn);
  });
  game.appendChild(opcionesDiv);
}

window.addEventListener('DOMContentLoaded', renderCuentaRelaciona);
