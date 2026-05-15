const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const bestEl = document.getElementById("best");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const state = {
  running: false,
  score: 0,
  lives: 3,
  best: Number(localStorage.getItem("meteor-best") || 0),
  speed: 3,
  keys: new Set(),
  player: {
    x: 420,
    y: 470,
    width: 54,
    height: 58,
    velocity: 0
  },
  meteors: [],
  stars: [],
  particles: [],
  lastTime: 0,
  meteorTimer: 0,
  starTimer: 0
};

bestEl.textContent = state.best;

function resetGame() {
  state.running = true;
  state.score = 0;
  state.lives = 3;
  state.speed = 3;
  state.meteors = [];
  state.stars = [];
  state.particles = [];
  state.meteorTimer = 0;
  state.starTimer = 0;
  state.player.x = canvas.width / 2 - state.player.width / 2;
  updateStats();
  overlay.classList.add("hidden");
  requestAnimationFrame(gameLoop);
}

function updateStats() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  bestEl.textContent = state.best;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnMeteor() {
  const size = randomBetween(28, 58);

  state.meteors.push({
    x: randomBetween(0, canvas.width - size),
    y: -size,
    size: size,
    speed: randomBetween(state.speed, state.speed + 3),
    spin: randomBetween(0, Math.PI)
  });
}

function spawnStar() {
  const size = randomBetween(20, 32);

  state.stars.push({
    x: randomBetween(0, canvas.width - size),
    y: -size,
    size: size,
    speed: randomBetween(2, 4)
  });
}

function addParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x: x,
      y: y,
      radius: randomBetween(2, 5),
      vx: randomBetween(-3, 3),
      vy: randomBetween(-4, 2),
      life: 36,
      color: color
    });
  }
}

function movePlayer() {
  const player = state.player;
  const left = state.keys.has("ArrowLeft") || state.keys.has("a");
  const right = state.keys.has("ArrowRight") || state.keys.has("d");

  if (left && !right) {
    player.velocity = -8;
  } else if (right && !left) {
    player.velocity = 8;
  } else {
    player.velocity *= 0.78;
  }

  player.x += player.velocity;
  player.x = Math.max(10, Math.min(canvas.width - player.width - 10, player.x));
}

function updateObjects(delta) {
  state.meteorTimer += delta;
  state.starTimer += delta;

  if (state.meteorTimer > Math.max(260, 780 - state.score * 8)) {
    spawnMeteor();
    state.meteorTimer = 0;
  }

  if (state.starTimer > 1050) {
    spawnStar();
    state.starTimer = 0;
  }

  state.meteors.forEach(function (meteor) {
    meteor.y += meteor.speed;
    meteor.spin += 0.05;
  });

  state.stars.forEach(function (star) {
    star.y += star.speed;
  });

  state.particles.forEach(function (particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.12;
    particle.life -= 1;
  });

  state.meteors = state.meteors.filter(function (meteor) {
    return meteor.y < canvas.height + meteor.size;
  });

  state.stars = state.stars.filter(function (star) {
    return star.y < canvas.height + star.size;
  });

  state.particles = state.particles.filter(function (particle) {
    return particle.life > 0;
  });
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function checkCollisions() {
  const player = state.player;

  state.meteors = state.meteors.filter(function (meteor) {
    const hitbox = {
      x: meteor.x + 6,
      y: meteor.y + 6,
      width: meteor.size - 12,
      height: meteor.size - 12
    };

    if (rectsOverlap(player, hitbox)) {
      state.lives -= 1;
      addParticles(player.x + player.width / 2, player.y + 18, "#d94f4f", 16);
      updateStats();

      if (state.lives <= 0) {
        endGame();
      }

      return false;
    }

    return true;
  });

  state.stars = state.stars.filter(function (star) {
    const hitbox = {
      x: star.x,
      y: star.y,
      width: star.size,
      height: star.size
    };

    if (rectsOverlap(player, hitbox)) {
      state.score += 10;
      state.speed = Math.min(8, state.speed + 0.12);
      addParticles(star.x + star.size / 2, star.y + star.size / 2, "#e9b44c", 12);
      updateStats();
      return false;
    }

    return true;
  });
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1d3f5f");
  gradient.addColorStop(0.62, "#234f66");
  gradient.addColorStop(1, "#2d9c9c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
  for (let i = 0; i < 70; i++) {
    const x = (i * 113) % canvas.width;
    const y = (i * 47 + state.score * 0.4) % canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.fillStyle = "#14323f";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, canvas.height - 58);
  ctx.lineTo(110, canvas.height - 100);
  ctx.lineTo(210, canvas.height - 42);
  ctx.lineTo(340, canvas.height - 92);
  ctx.lineTo(480, canvas.height - 48);
  ctx.lineTo(620, canvas.height - 110);
  ctx.lineTo(760, canvas.height - 54);
  ctx.lineTo(canvas.width, canvas.height - 92);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();
}

function drawPlayer() {
  const p = state.player;

  ctx.save();
  ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
  ctx.rotate(p.velocity * 0.015);

  ctx.fillStyle = "#f4efe6";
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(24, 24);
  ctx.lineTo(0, 12);
  ctx.lineTo(-24, 24);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#e9b44c";
  ctx.beginPath();
  ctx.moveTo(-11, 22);
  ctx.lineTo(0, 38 + Math.sin(Date.now() / 90) * 4);
  ctx.lineTo(11, 22);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#2d9c9c";
  ctx.beginPath();
  ctx.arc(0, -8, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawMeteor(meteor) {
  ctx.save();
  ctx.translate(meteor.x + meteor.size / 2, meteor.y + meteor.size / 2);
  ctx.rotate(meteor.spin);

  ctx.fillStyle = "#5f4235";
  ctx.beginPath();
  ctx.arc(0, 0, meteor.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#d94f4f";
  ctx.beginPath();
  ctx.arc(-meteor.size * 0.12, -meteor.size * 0.08, meteor.size * 0.14, 0, Math.PI * 2);
  ctx.arc(meteor.size * 0.16, meteor.size * 0.12, meteor.size * 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStar(star) {
  const cx = star.x + star.size / 2;
  const cy = star.y + star.size / 2;
  const spikes = 5;
  const outer = star.size / 2;
  const inner = outer / 2.4;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Date.now() / 400);
  ctx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / spikes;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  ctx.closePath();
  ctx.fillStyle = "#e9b44c";
  ctx.fill();
  ctx.restore();
}

function drawParticles() {
  state.particles.forEach(function (particle) {
    ctx.globalAlpha = particle.life / 36;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function draw() {
  drawBackground();
  state.stars.forEach(drawStar);
  state.meteors.forEach(drawMeteor);
  drawParticles();
  drawPlayer();
}

function endGame() {
  state.running = false;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem("meteor-best", state.best);
  updateStats();

  overlay.classList.remove("hidden");
  overlay.querySelector("h1").textContent = "Oyun Bitti";
  overlay.querySelector("p").textContent = "Skorun: " + state.score;
  startBtn.textContent = "Tekrar Oyna";
}

function gameLoop(timestamp) {
  if (!state.running) return;

  const delta = timestamp - state.lastTime || 16;
  state.lastTime = timestamp;

  movePlayer();
  updateObjects(delta);
  checkCollisions();
  draw();

  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", function () {
  state.lastTime = 0;
  resetGame();
});

window.addEventListener("keydown", function (event) {
  state.keys.add(event.key);

  if (event.key === " " && !state.running) {
    resetGame();
  }
});

window.addEventListener("keyup", function (event) {
  state.keys.delete(event.key);
});

function holdButton(button, key) {
  function press() {
    state.keys.add(key);
  }

  function release() {
    state.keys.delete(key);
  }

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
}

holdButton(leftBtn, "ArrowLeft");
holdButton(rightBtn, "ArrowRight");

draw();
