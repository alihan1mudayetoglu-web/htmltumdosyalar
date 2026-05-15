const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const livesEl = document.getElementById("lives");
const panel = document.getElementById("panel");
const startBtn = document.getElementById("startBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

const gravity = 0.65;
const state = {
  running: false,
  score: 0,
  coins: 0,
  lives: 3,
  keys: new Set(),
  camera: 0,
  player: { x: 80, y: 350, w: 42, h: 54, vx: 0, vy: 0, grounded: false },
  platforms: [],
  coinsList: []
};

function updateHud() {
  scoreEl.textContent = state.score;
  coinsEl.textContent = state.coins;
  livesEl.textContent = state.lives;
}

function createWorld() {
  state.platforms = [{ x: 0, y: 500, w: 260, h: 28 }];
  state.coinsList = [];
  for (let i = 1; i < 22; i++) {
    const x = i * 190 + Math.random() * 70;
    const y = 430 - (i % 4) * 58 + Math.random() * 20;
    state.platforms.push({ x, y, w: 145, h: 24 });
    state.coinsList.push({ x: x + 58, y: y - 36, r: 13, taken: false });
  }
}

function startGame() {
  state.running = true;
  state.score = 0;
  state.coins = 0;
  state.lives = 3;
  state.camera = 0;
  state.player = { x: 80, y: 350, w: 42, h: 54, vx: 0, vy: 0, grounded: false };
  createWorld();
  panel.classList.add("hidden");
  updateHud();
  requestAnimationFrame(loop);
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function jump() {
  if (state.player.grounded) {
    state.player.vy = -14;
    state.player.grounded = false;
  }
}

function update() {
  const p = state.player;
  const left = state.keys.has("ArrowLeft") || state.keys.has("a");
  const right = state.keys.has("ArrowRight") || state.keys.has("d");
  if (left && !right) p.vx = -5.4;
  else if (right && !left) p.vx = 5.4;
  else p.vx *= 0.82;
  if (state.keys.has(" ") || state.keys.has("ArrowUp") || state.keys.has("w")) jump();

  p.x += p.vx;
  p.y += p.vy;
  p.vy += gravity;
  p.grounded = false;

  state.platforms.forEach((plat) => {
    const wasAbove = p.y + p.h - p.vy <= plat.y;
    if (overlap(p, plat) && p.vy >= 0 && wasAbove) {
      p.y = plat.y - p.h;
      p.vy = 0;
      p.grounded = true;
    }
  });

  state.coinsList.forEach((coin) => {
    const dx = p.x + p.w / 2 - coin.x;
    const dy = p.y + p.h / 2 - coin.y;
    if (!coin.taken && Math.hypot(dx, dy) < coin.r + 26) {
      coin.taken = true;
      state.coins++;
      state.score += 25;
    }
  });

  state.camera = Math.max(0, p.x - 220);
  state.score = Math.max(state.score, Math.floor(p.x / 12));

  if (p.y > canvas.height + 160) {
    state.lives--;
    if (state.lives <= 0) endGame();
    p.x = Math.max(80, state.camera + 40);
    p.y = 260;
    p.vy = 0;
  }
  updateHud();
}

function draw() {
  ctx.fillStyle = "#88d8d0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#5aa469";
  ctx.fillRect(0, 500, canvas.width, 40);
  ctx.save();
  ctx.translate(-state.camera, 0);
  state.platforms.forEach((plat) => {
    ctx.fillStyle = "#2f6f53";
    ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    ctx.fillStyle = "#8bd450";
    ctx.fillRect(plat.x, plat.y, plat.w, 7);
  });
  state.coinsList.forEach((coin) => {
    if (coin.taken) return;
    ctx.fillStyle = "#e9c46a";
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.r, 0, Math.PI * 2);
    ctx.fill();
  });
  const p = state.player;
  ctx.fillStyle = "#f4a261";
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = "#264653";
  ctx.fillRect(p.x + 9, p.y + 12, 8, 8);
  ctx.fillRect(p.x + 26, p.y + 12, 8, 8);
  ctx.restore();
}

function endGame() {
  state.running = false;
  panel.classList.remove("hidden");
  panel.querySelector("h1").textContent = "Oyun Bitti";
  panel.querySelector("p").textContent = "Skorun: " + state.score;
  startBtn.textContent = "Tekrar Oyna";
}

function loop() {
  if (!state.running) return;
  update();
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
jumpBtn.addEventListener("pointerdown", jump);
createWorld();
draw();
