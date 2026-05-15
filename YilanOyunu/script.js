const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const panel = document.getElementById("panel");
const startBtn = document.getElementById("startBtn");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const size = 24;
const cells = canvas.width / size;
let timer;
const state = {
  running: false,
  score: 0,
  best: Number(localStorage.getItem("snake-best") || 0),
  snake: [],
  food: { x: 10, y: 10 },
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  speed: 120
};
bestEl.textContent = state.best;

function startGame() {
  clearInterval(timer);
  state.running = true;
  state.score = 0;
  state.speed = 120;
  state.snake = [{ x: 8, y: 12 }, { x: 7, y: 12 }, { x: 6, y: 12 }];
  state.dir = { x: 1, y: 0 };
  state.nextDir = { x: 1, y: 0 };
  placeFood();
  panel.classList.add("hidden");
  updateHud();
  timer = setInterval(tick, state.speed);
  draw();
}

function updateHud() {
  scoreEl.textContent = state.score;
  bestEl.textContent = state.best;
}

function placeFood() {
  do {
    state.food = { x: Math.floor(Math.random() * cells), y: Math.floor(Math.random() * cells) };
  } while (state.snake.some((part) => part.x === state.food.x && part.y === state.food.y));
}

function setDirection(x, y) {
  if (state.dir.x + x === 0 && state.dir.y + y === 0) return;
  state.nextDir = { x, y };
}

function tick() {
  state.dir = state.nextDir;
  const head = state.snake[0];
  const next = { x: head.x + state.dir.x, y: head.y + state.dir.y };

  const hitWall = next.x < 0 || next.x >= cells || next.y < 0 || next.y >= cells;
  const hitSelf = state.snake.some((part) => part.x === next.x && part.y === next.y);
  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  state.snake.unshift(next);
  if (next.x === state.food.x && next.y === state.food.y) {
    state.score += 10;
    placeFood();
    if (state.score % 50 === 0 && state.speed > 65) {
      state.speed -= 10;
      clearInterval(timer);
      timer = setInterval(tick, state.speed);
    }
  } else {
    state.snake.pop();
  }
  updateHud();
  draw();
}

function draw() {
  ctx.fillStyle = "#081c15";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      if ((x + y) % 2 === 0) {
        ctx.fillStyle = "#0f2a20";
        ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }
  ctx.fillStyle = "#ef476f";
  ctx.beginPath();
  ctx.arc(state.food.x * size + size / 2, state.food.y * size + size / 2, size / 2.8, 0, Math.PI * 2);
  ctx.fill();
  state.snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#b7e4c7" : "#52b788";
    ctx.fillRect(part.x * size + 2, part.y * size + 2, size - 4, size - 4);
  });
}

function endGame() {
  clearInterval(timer);
  state.running = false;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem("snake-best", state.best);
  updateHud();
  panel.classList.remove("hidden");
  panel.querySelector("h1").textContent = "Oyun Bitti";
  panel.querySelector("p").textContent = "Skorun: " + state.score;
  startBtn.textContent = "Tekrar Oyna";
}

startBtn.addEventListener("click", startGame);
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") setDirection(0, -1);
  if (e.key === "ArrowDown" || e.key === "s") setDirection(0, 1);
  if (e.key === "ArrowLeft" || e.key === "a") setDirection(-1, 0);
  if (e.key === "ArrowRight" || e.key === "d") setDirection(1, 0);
});
upBtn.addEventListener("click", () => setDirection(0, -1));
downBtn.addEventListener("click", () => setDirection(0, 1));
leftBtn.addEventListener("click", () => setDirection(-1, 0));
rightBtn.addEventListener("click", () => setDirection(1, 0));
draw();
