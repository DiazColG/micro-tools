const canvas = document.getElementById('arkanoid-canvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 12;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

const ballRadius = 8;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 60;
const brickHeight = 18;
const brickPadding = 8;
const brickOffsetTop = 30;
const brickOffsetLeft = 20;

let score = 0;
let bricks = [];
let arkanoidGameLoop;

function initBricks() {
  bricks = [];
  for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBricks() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      if(bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#FF9800";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#2196F3";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
  ctx.fillStyle = "#4CAF50";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  document.getElementById('arkanoid-score').textContent = score;
}

function collisionDetection() {
  for(let c = 0; c < brickColumnCount; c++) {
    for(let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status === 1) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 10;
          drawScore();
          if(score === brickRowCount * brickColumnCount * 10) {
            clearInterval(arkanoidGameLoop);
            alert("¡Felicidades! Has ganado :)");
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Rebote con paredes laterales
  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // Rebote con el techo
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  // Rebote con la paleta
  else if(y + dy > canvas.height - paddleHeight - 5 - ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      // Efecto de ángulo según dónde golpea la paleta
      let hitPoint = (x - (paddleX + paddleWidth/2)) / (paddleWidth/2);
      dx = dx + hitPoint;
      if(dx > 4) dx = 4;
      if(dx < -4) dx = -4;
    }
    else if(y + dy > canvas.height - ballRadius) {
      clearInterval(arkanoidGameLoop);
      alert("¡Game Over! Puntuación: " + score);
    }
  }

  x += dx;
  y += dy;

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function keyDownHandler(e) {
  if(e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function startArkanoidGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  drawScore();
  initBricks();

  document.removeEventListener("keydown", keyDownHandler);
  document.removeEventListener("keyup", keyUpHandler);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  if (arkanoidGameLoop) clearInterval(arkanoidGameLoop);
  arkanoidGameLoop = setInterval(draw, 16);
}

// Botón de nuevo juego
document.getElementById('start-btn').onclick = () => {
  startArkanoidGame();
};

// Iniciar al cargar
window.onload = () => {
  drawScore();
  initBricks();
  draw();
};