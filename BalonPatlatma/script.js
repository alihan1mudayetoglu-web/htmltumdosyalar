const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const comboEl = document.getElementById("combo");
const panel = document.getElementById("panel");
const startBtn = document.getElementById("startBtn");

const state = {
  running: false,
  score: 0,
  time: 30,
  combo: 1,
  balloons: [],
  pops: [],
  spawnTimer: 0,
  last: 0,
  clock: 0
};

function updateHud() {
  scoreEl.textContent = state.score;
  timeEl.textContent = state.time;
  comboEl.textContent = state.combo + "x";
}

function startGame() {
  state.running = true;
  state.score = 0;
  state.time = 30;
  state.combo = 1;
  state.balloons = [];
  state.pops = [];
  state.spawnTimer = 0;
  state.clock = 0;
  state.last = 0;
  panel.classList.add("hidden");
  updateHud();
  requestAnimationFrame(loop);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnBalloon() {
  const colors = ["#e63946", "#ffbe0b", "#8338ec", "#2a9d8f", "#fb5607"];
  const r = rand(22, 42);
  state.balloons.push({
    x: rand(r, canvas.width - r),
    y: canvas.height + r,
    r,
    vy: rand(1.7, 3.8),
    color: colors[Math.floor(rand(0, colors.length))]
  });
}

function popBalloon(balloon) {
  balloon.dead = true;
  state.score += 10 * state.combo;
  state.combo = Math.min(9, state.combo + 1);
  for (let i = 0; i < 16; i++) {
    state.pops.push({
      x: balloon.x,
      y: balloon.y,
      vx: rand(-3, 3),
      vy: rand(-3, 3),
      life: 24,
      color: balloon.color
    });
  }
  updateHud();
}

function update(delta) {
  state.spawnTimer += delta;
  state.clock += delta;
  if (state.spawnTimer > Math.max(260, 760 - state.score / 3)) {
    spawnBalloon();
    state.spawnTimer = 0;
  }
  if (state.clock > 1000) {
    state.time--;
    state.clock = 0;
    if (state.time <= 0) endGame();
  }
  state.balloons.forEach((balloon) => balloon.y -= balloon.vy);
  state.balloons.forEach((balloon) => {
    if (balloon.y < -balloon.r && !balloon.dead) {
      balloon.dead = true;
      state.combo = 1;
    }
  });
  state.pops.forEach((pop) => {
    pop.x += pop.vx;
    pop.y += pop.vy;
    pop.life--;
  });
  state.balloons = state.balloons.filter((balloon) => !balloon.dead);
  state.pops = state.pops.filter((pop) => pop.life > 0);
  updateHud();
}

function draw() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#a8dadc");
  sky.addColorStop(1, "#f1faee");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.beginPath();
  ctx.arc(120, 90, 28, 0, Math.PI * 2);
  ctx.arc(155, 90, 38, 0, Math.PI * 2);
  ctx.arc(195, 90, 28, 0, Math.PI * 2);
  ctx.fill();
  state.balloons.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.r * 0.82, b.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.28, b.r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#495057";
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + b.r);
    ctx.lineTo(b.x, b.y + b.r + 28);
    ctx.stroke();
  });
  state.pops.forEach((p) => {
    ctx.globalAlpha = p.life / 24;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 5, 5);
    ctx.globalAlpha = 1;
  });
}

function endGame() {
  state.running = false;
  panel.classList.remove("hidden");
  panel.querySelector("h1").textContent = "Sure Bitti";
  panel.querySelector("p").textContent = "Skorun: " + state.score;
  startBtn.textContent = "Tekrar Oyna";
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

canvas.addEventListener("pointerdown", (event) => {
  if (!state.running) return;
  const point = getCanvasPoint(event);
  const hit = [...state.balloons].reverse().find((b) => Math.hypot(point.x - b.x, point.y - b.y) <= b.r);
  if (hit) popBalloon(hit);
  else state.combo = 1;
});

function loop(time) {
  if (!state.running) return;
  const delta = time - state.last || 16;
  state.last = time;
  update(delta);
  draw();
  requestAnimationFrame(loop);
}

startBtn.addEventListener("click", startGame);
draw();
