const canvas = document.getElementById('asteroids-canvas');
const ctx = canvas.getContext('2d');

const SHIP_SIZE = 30;
const TURN_SPEED = 360; // grados por segundo
const SHIP_THRUST = 5;
const FRICTION = 0.7; // 0 = sin fricción, 1 = mucha fricción
const ASTEROID_NUM = 5;
const ASTEROID_SIZE = 50;
const ASTEROID_SPEED = 1.5;
const ASTEROID_VERT = 10;
const ASTEROID_JAG = 0.4;
const LASER_MAX = 10;
const LASER_SPEED = 8;
const LASER_DIST = 0.6; // fracción de ancho de pantalla

let ship, asteroids, lasers, score, gameLoop, keys = {};

function degToRad(deg) {
  return deg * Math.PI / 180;
}

function randomAsteroid(x, y, r) {
  let a = {
    x: x,
    y: y,
    xv: Math.random() * ASTEROID_SPEED * (Math.random() < 0.5 ? 1 : -1),
    yv: Math.random() * ASTEROID_SPEED * (Math.random() < 0.5 ? 1 : -1),
    r: r,
    a: Math.random() * Math.PI * 2,
    vert: Math.floor(Math.random() * (ASTEROID_VERT + 1) + ASTEROID_VERT / 2),
    offs: []
  };
  for (let i = 0; i < a.vert; i++) {
    a.offs.push(Math.random() * ASTEROID_JAG * 2 + 1 - ASTEROID_JAG);
  }
  return a;
}

function createAsteroids() {
  asteroids = [];
  for (let i = 0; i < ASTEROID_NUM; i++) {
    let x, y;
    do {
      x = Math.random() * canvas.width;
      y = Math.random() * canvas.height;
    } while (distBetweenPoints(ship.x, ship.y, x, y) < ASTEROID_SIZE * 2 + SHIP_SIZE);
    asteroids.push(randomAsteroid(x, y, Math.ceil(ASTEROID_SIZE / 2 + Math.random() * ASTEROID_SIZE / 2)));
  }
}

function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function drawShip(x, y, a, thrusting) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    x + 4/3 * ship.r * Math.cos(a),
    y - 4/3 * ship.r * Math.sin(a)
  );
  ctx.lineTo(
    x - ship.r * (2/3 * Math.cos(a) + Math.sin(a)),
    y + ship.r * (2/3 * Math.sin(a) - Math.cos(a))
  );
  ctx.lineTo(
    x - ship.r * (2/3 * Math.cos(a) - Math.sin(a)),
    y + ship.r * (2/3 * Math.sin(a) + Math.cos(a))
  );
  ctx.closePath();
  ctx.stroke();

  // Fuego del motor
  if (thrusting) {
    ctx.strokeStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(
      x - ship.r * (2/3 * Math.cos(a) + 0.5 * Math.sin(a)),
      y + ship.r * (2/3 * Math.sin(a) - 0.5 * Math.cos(a))
    );
    ctx.lineTo(
      x - ship.r * 1.2 * Math.cos(a),
      y + ship.r * 1.2 * Math.sin(a)
    );
    ctx.lineTo(
      x - ship.r * (2/3 * Math.cos(a) - 0.5 * Math.sin(a)),
      y + ship.r * (2/3 * Math.sin(a) + 0.5 * Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
  }
}

function drawAsteroids() {
  ctx.strokeStyle = "#BDBDBD";
  ctx.lineWidth = 2;
  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];
    ctx.beginPath();
    ctx.moveTo(
      a.x + a.r * a.offs[0] * Math.cos(a.a),
      a.y + a.r * a.offs[0] * Math.sin(a.a)
    );
    for (let j = 1; j < a.vert; j++) {
      ctx.lineTo(
        a.x + a.r * a.offs[j] * Math.cos(a.a + j * Math.PI * 2 / a.vert),
        a.y + a.r * a.offs[j] * Math.sin(a.a + j * Math.PI * 2 / a.vert)
      );
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function drawLasers() {
  ctx.strokeStyle = "#0ff";
  ctx.lineWidth = 2;
  for (let i = 0; i < lasers.length; i++) {
    ctx.beginPath();
    ctx.arc(lasers[i].x, lasers[i].y, 2, 0, Math.PI*2, false);
    ctx.stroke();
  }
}

function update() {
  // Fondo
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Nave
  drawShip(ship.x, ship.y, ship.a, ship.thrusting);

  // Asteroides
  drawAsteroids();

  // Lasers
  drawLasers();

  // Score
  document.getElementById('asteroids-score').textContent = score;

  // Rotación nave
  if (ship.rot !== 0) {
    ship.a += ship.rot;
  }

  // Thrust
  if (ship.thrusting) {
    ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / 60;
    ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / 60;
  } else {
    ship.thrust.x -= FRICTION * ship.thrust.x / 60;
    ship.thrust.y -= FRICTION * ship.thrust.y / 60;
  }

  // Movimiento nave
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;

  // Pantalla infinita
  if (ship.x < 0 - ship.r) ship.x = canvas.width + ship.r;
  else if (ship.x > canvas.width + ship.r) ship.x = 0 - ship.r;
  if (ship.y < 0 - ship.r) ship.y = canvas.height + ship.r;
  else if (ship.y > canvas.height + ship.r) ship.y = 0 - ship.r;

  // Movimiento asteroides
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].x += asteroids[i].xv;
    asteroids[i].y += asteroids[i].yv;

    // Pantalla infinita
    if (asteroids[i].x < 0 - asteroids[i].r) asteroids[i].x = canvas.width + asteroids[i].r;
    else if (asteroids[i].x > canvas.width + asteroids[i].r) asteroids[i].x = 0 - asteroids[i].r;
    if (asteroids[i].y < 0 - asteroids[i].r) asteroids[i].y = canvas.height + asteroids[i].r;
    else if (asteroids[i].y > canvas.height + asteroids[i].r) asteroids[i].y = 0 - asteroids[i].r;
  }

  // Movimiento lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].x += lasers[i].xv;
    lasers[i].y += lasers[i].yv;
    lasers[i].dist += Math.sqrt(lasers[i].xv**2 + lasers[i].yv**2);

    // Eliminar si salen de pantalla o superan distancia
    if (
      lasers[i].x < 0 || lasers[i].x > canvas.width ||
      lasers[i].y < 0 || lasers[i].y > canvas.height ||
      lasers[i].dist > LASER_DIST * canvas.width
    ) {
      lasers.splice(i, 1);
      continue;
    }

    // Colisión laser-asteroide
    for (let j = asteroids.length - 1; j >= 0; j--) {
      if (distBetweenPoints(lasers[i].x, lasers[i].y, asteroids[j].x, asteroids[j].y) < asteroids[j].r) {
        // Destruir asteroide
        let r = asteroids[j].r;
        if (r > ASTEROID_SIZE / 4) {
          asteroids.push(randomAsteroid(asteroids[j].x, asteroids[j].y, r / 2));
          asteroids.push(randomAsteroid(asteroids[j].x, asteroids[j].y, r / 2));
        }
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        score += 20;
        break;
      }
    }
  }

  // Colisión nave-asteroide
  for (let i = 0; i < asteroids.length; i++) {
    if (distBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.r + asteroids[i].r) {
      clearInterval(gameLoop);
      alert("¡Game Over! Puntuación: " + score);
      return;
    }
  }

  // Win
  if (asteroids.length === 0) {
    clearInterval(gameLoop);
    alert("¡Felicidades! Has destruido todos los asteroides :)");
    return;
  }
}

function keyDown(e) {
  if (e.code === "ArrowLeft") {
    ship.rot = degToRad(TURN_SPEED / 60) * 1;
  } else if (e.code === "ArrowRight") {
    ship.rot = -degToRad(TURN_SPEED / 60) * 1;
  } else if (e.code === "ArrowUp") {
    ship.thrusting = true;
  } else if (e.code === "Space") {
    // Disparo
    if (lasers.length < LASER_MAX) {
      lasers.push({
        x: ship.x + 4/3 * ship.r * Math.cos(ship.a),
        y: ship.y - 4/3 * ship.r * Math.sin(ship.a),
        xv: LASER_SPEED * Math.cos(ship.a),
        yv: -LASER_SPEED * Math.sin(ship.a),
        dist: 0
      });
    }
  }
}

function keyUp(e) {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    ship.rot = 0;
  } else if (e.code === "ArrowUp") {
    ship.thrusting = false;
  }
}

function startAsteroidsGame() {
  ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: SHIP_SIZE / 2,
    a: degToRad(90),
    rot: 0,
    thrusting: false,
    thrust: {x: 0, y: 0}
  };
  lasers = [];
  score = 0;
  createAsteroids();

  document.removeEventListener("keydown", keyDown);
  document.removeEventListener("keyup", keyUp);
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, 1000/60);
}

// Botón de nuevo juego
document.getElementById('start-btn').onclick = () => {
  startAsteroidsGame();
};

// Iniciar al cargar
window.onload = () => {
  score = 0;
  ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: SHIP_SIZE / 2,
    a: degToRad(90),
    rot: 0,
    thrusting: false,
    thrust: {x: 0, y: 0}
  };
  lasers = [];
  createAsteroids();
  update();
};