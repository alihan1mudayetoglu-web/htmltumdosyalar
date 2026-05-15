const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const livesEl = document.getElementById("lives");
const panel = document.getElementById("panel");
const startBtn = document.getElementById("startBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const state = {
  running: false,
  score: 0,
  lives: 3,
  roadSpeed: 5,
  keys: new Set(),
  lineOffset: 0,
  player: { x: 210, y: 560, w: 58, h: 98, vx: 0 },
  cars: [],
  timer: 0,
  last: 0
};

function updateHud() {
  scoreEl.textContent = state.score;
  speedEl.textContent = Math.floor(state.roadSpeed);
  livesEl.textContent = state.lives;
}

function startGame() {
  state.running = true;
  state.score = 0;
  state.lives = 3;
  state.roadSpeed = 5;
  state.lineOffset = 0;
  state.cars = [];
  state.timer = 0;
  state.last = 0;
  state.player.x = canvas.width / 2 - state.player.w / 2;
  panel.classList.add("hidden");
  updateHud();
  requestAnimationFrame(loop);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnCar() {
  const lanes = [90, 210, 330];
  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  state.cars.push({ x: lane, y: -120, w: 58, h: 98, color: ["#e63946", "#2a9d8f", "#f4a261"][Math.floor(rand(0, 3))] });
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function update(delta) {
  const p = state.player;
  const left = state.keys.has("ArrowLeft") || state.keys.has("a");
  const right = state.keys.has("ArrowRight") || state.keys.has("d");
  if (left && !right) p.vx = -7;
  else if (right && !left) p.vx = 7;
  else p.vx *= 0.82;
  p.x = Math.max(42, Math.min(canvas.width - p.w - 42, p.x + p.vx));

  state.score += Math.floor(state.roadSpeed / 5);
  state.roadSpeed = Math.min(13, 5 + state.score / 420);
  state.lineOffset = (state.lineOffset + state.roadSpeed) % 80;
  state.timer += delta;

  if (state.timer > Math.max(520, 1100 - state.roadSpeed * 45)) {
    spawnCar();
    state.timer = 0;
  }

  state.cars.forEach((car) => car.y += state.roadSpeed);
  state.cars.forEach((car) => {
    if (!car.hit && overlap(p, car)) {
      car.hit = true;
      state.lives--;
      if (state.lives <= 0) endGame();
    }
  });
  state.cars = state.cars.filter((car) => car.y < canvas.height + 130 && !car.hit);
  updateHud();
}

function drawCar(car, isPlayer) {
  ctx.fillStyle = isPlayer ? "#ffca3a" : car.color;
  ctx.fillRect(car.x, car.y, car.w, car.h);
  ctx.fillStyle = "#17202a";
  ctx.fillRect(car.x + 10, car.y + 14, car.w - 20, 18);
  ctx.fillRect(car.x + 10, car.y + car.h - 32, car.w - 20, 18);
  ctx.fillStyle = "#111";
  ctx.fillRect(car.x - 6, car.y + 14, 8, 24);
  ctx.fillRect(car.x + car.w - 2, car.y + 14, 8, 24);
  ctx.fillRect(car.x - 6, car.y + car.h - 38, 8, 24);
  ctx.fillRect(car.x + car.w - 2, car.y + car.h - 38, 8, 24);
}

function draw() {
  ctx.fillStyle = "#2f3438";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#4f5b62";
  ctx.fillRect(28, 0, 18, canvas.height);
  ctx.fillRect(canvas.width - 46, 0, 18, canvas.height);
  ctx.fillStyle = "#fff8e1";
  for (let y = -80; y < canvas.height; y += 80) {
    ctx.fillRect(canvas.width / 2 - 6, y + state.lineOffset, 12, 44);
  }
  state.cars.forEach((car) => drawCar(car, false));
  drawCar(state.player, true);
}

function endGame() {
  state.running = false;
  panel.classList.remove("hidden");
  panel.querySelector("h1").textContent = "Kaza Yaptin";
  panel.querySelector("p").textContent = "Skorun: " + state.score;
  startBtn.textContent = "Tekrar Oyna";
}

function loop(time) {
  if (!state.running) return;
  const delta = time - state.last || 16;
  state.last = time;
  update(delta);
  draw();
  requestAnimationFrame(loop);
}

startBtn.addEventListener("click", startGame);
window.addEventListener("keydown", (e) => state.keys.add(e.key));
window.addEventListener("keyup", (e) => state.keys.delete(e.key));
leftBtn.addEventListener("pointerdown", () => state.keys.add("ArrowLeft"));
leftBtn.addEventListener("pointerup", () => state.keys.delete("ArrowLeft"));
rightBtn.addEventListener("pointerdown", () => state.keys.add("ArrowRight"));
rightBtn.addEventListener("pointerup", () => state.keys.delete("ArrowRight"));
draw();
