const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const panel = document.getElementById("panel");
const startBtn = document.getElementById("startBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");

const state = {
  running: false,
  score: 0,
  lives: 3,
  level: 1,
  keys: new Set(),
  player: { x: 420, y: 470, w: 60, h: 44, vx: 0 },
  bullets: [],
  enemies: [],
  sparks: [],
  enemyTimer: 0,
  fireTimer: 0,
  last: 0
};

function updateHud() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  levelEl.textContent = state.level;
}

function startGame() {
  state.running = true;
  state.score = 0;
  state.lives = 3;
  state.level = 1;
  state.bullets = [];
  state.enemies = [];
  state.sparks = [];
  state.enemyTimer = 0;
  state.fireTimer = 0;
  state.last = 0;
  state.player.x = canvas.width / 2 - state.player.w / 2;
  updateHud();
  panel.classList.add("hidden");
  requestAnimationFrame(loop);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnEnemy() {
  const size = rand(34, 58);
  state.enemies.push({
    x: rand(10, canvas.width - size - 10),
    y: -size,
    w: size,
    h: size,
    vy: rand(2.2, 3.5 + state.level * 0.45)
  });
}

function shoot() {
  if (state.fireTimer > 0) return;
  state.bullets.push({ x: state.player.x + state.player.w / 2 - 4, y: state.player.y - 10, w: 8, h: 20, vy: -9 });
  state.fireTimer = 180;
}

function addSparks(x, y, color) {
  for (let i = 0; i < 14; i++) {
    state.sparks.push({ x, y, vx: rand(-3, 3), vy: rand(-3, 3), life: 28, color });
  }
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
  p.x = Math.max(8, Math.min(canvas.width - p.w - 8, p.x + p.vx));

  if (state.keys.has(" ") || state.keys.has("Enter")) shoot();
  state.fireTimer = Math.max(0, state.fireTimer - delta);
  state.enemyTimer += delta;
  state.level = Math.floor(state.score / 120) + 1;

  if (state.enemyTimer > Math.max(330, 900 - state.level * 70)) {
    spawnEnemy();
    state.enemyTimer = 0;
  }

  state.bullets.forEach((b) => b.y += b.vy);
  state.enemies.forEach((e) => e.y += e.vy);
  state.sparks.forEach((s) => { s.x += s.vx; s.y += s.vy; s.life--; });

  state.enemies.forEach((enemy) => {
    if (overlap(p, enemy)) {
      enemy.dead = true;
      state.lives--;
      addSparks(p.x + p.w / 2, p.y, "#ef476f");
      if (state.lives <= 0) endGame();
    }
  });

  state.bullets.forEach((bullet) => {
    state.enemies.forEach((enemy) => {
      if (!enemy.dead && overlap(bullet, enemy)) {
        bullet.dead = true;
        enemy.dead = true;
        state.score += 20;
        addSparks(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#ffd166");
      }
    });
  });

  state.enemies.forEach((enemy) => {
    if (enemy.y > canvas.height && !enemy.dead) {
      enemy.dead = true;
      state.lives--;
      if (state.lives <= 0) endGame();
    }
  });

  state.bullets = state.bullets.filter((b) => !b.dead && b.y > -30);
  state.enemies = state.enemies.filter((e) => !e.dead);
  state.sparks = state.sparks.filter((s) => s.life > 0);
  updateHud();
}

function drawShip(x, y, w, h) {
  ctx.fillStyle = "#f2f0e6";
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w / 2, y + h - 12);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#4ecdc4";
  ctx.fillRect(x + w / 2 - 8, y + 16, 16, 12);
}

function draw() {
  ctx.fillStyle = "#090d1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 80; i++) ctx.fillRect((i * 97) % canvas.width, (i * 53 + state.score) % canvas.height, 2, 2);
  drawShip(state.player.x, state.player.y, state.player.w, state.player.h);
  ctx.fillStyle = "#ffd166";
  state.bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.w, b.h));
  state.enemies.forEach((e) => {
    ctx.fillStyle = "#ef476f";
    ctx.beginPath();
    ctx.arc(e.x + e.w / 2, e.y + e.h / 2, e.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2b1020";
    ctx.fillRect(e.x + e.w * 0.25, e.y + e.h * 0.45, e.w * 0.5, 6);
  });
  state.sparks.forEach((s) => {
    ctx.globalAlpha = s.life / 28;
    ctx.fillStyle = s.color;
    ctx.fillRect(s.x, s.y, 4, 4);
    ctx.globalAlpha = 1;
  });
}

function endGame() {
  state.running = false;
  panel.classList.remove("hidden");
  panel.querySelector("h1").textContent = "Oyun Bitti";
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
fireBtn.addEventListener("pointerdown", () => shoot());
draw();
