const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const box = 20; // Tamaño de cada celda
const canvasSize = 400; // 20x20 celdas

let snake, food, dx, dy, snakeScore, snakeGameLoop;

function startSnakeGame() {
  snake = [{x: 10, y: 10}];
  food = {x: 15, y: 15};
  dx = 0;
  dy = 0;
  snakeScore = 0;
  updateSnakeDisplay();

  if (snakeGameLoop) clearInterval(snakeGameLoop);
  snakeGameLoop = setInterval(gameLoop, 150);

  document.addEventListener('keydown', changeDirection);
}

function gameLoop() {
  if (dx === 0 && dy === 0) return;

  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  // Colisión con paredes
  if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
    gameOver();
    return;
  }

  // Colisión consigo mismo
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  // Comer comida
  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10;
    generateFood();
  } else {
    snake.pop();
  }

  updateSnakeDisplay();
  drawSnake();
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1; dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0; dy = -1;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1; dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0; dy = 1;
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * 20);
  food.y = Math.floor(Math.random() * 20);
}

function drawSnake() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Serpiente
  ctx.fillStyle = '#4CAF50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * box, segment.y * box, box - 2, box - 2);
  });

  // Comida
  ctx.fillStyle = '#FF5722';
  ctx.fillRect(food.x * box, food.y * box, box - 2, box - 2);
}

function gameOver() {
  clearInterval(snakeGameLoop);
  alert(`¡Game Over! Puntuación: ${snakeScore}`);
  document.removeEventListener('keydown', changeDirection);
}

function updateSnakeDisplay() {
  document.getElementById('snake-score').textContent = snakeScore;
  document.getElementById('snake-length').textContent = snake.length;
  document.getElementById('snake-speed').textContent = Math.floor(snakeScore / 50) + 1;
}

// Botón de nuevo juego
document.getElementById('start-btn').onclick = () => {
  document.removeEventListener('keydown', changeDirection);
  startSnakeGame();
};

// Iniciar al cargar
window.onload = () => {
  drawSnake();
};