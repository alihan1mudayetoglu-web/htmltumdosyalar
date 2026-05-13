const bird = document.getElementById("bird");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let birdTop = 200;
let gravity = 2;
let jumpPower = 40;
let isGameOver = false;
let score = 0;
let gameLoop, pipeSpawner;
let started = false;

function fall() {
  if (isGameOver) return;

  birdTop += gravity;
  bird.style.top = birdTop + "px";

  if (birdTop > gameContainer.offsetHeight - bird.offsetHeight) {
    endGame();
  }
}

function jump() {
  if (isGameOver || !started) return;
  birdTop -= jumpPower;
  if (birdTop < 0) birdTop = 0;
  bird.style.top = birdTop + "px";
}

function endGame() {
  isGameOver = true;
  clearInterval(gameLoop);
  clearInterval(pipeSpawner);
  alert("💥 Oyun Bitti! Skor: " + score);
}

function createPipe() {
  if (isGameOver) return;

  const pipeGap = 120;
  const pipeWidth = 60;
  const pipeTopHeight = Math.floor(Math.random() * 250) + 50;
  const pipeBottomHeight = 500 - pipeTopHeight - pipeGap;

  const pipeTop = document.createElement("div");
  pipeTop.classList.add("pipe");
  pipeTop.style.height = pipeTopHeight + "px";
  pipeTop.style.top = "0px";
  pipeTop.style.left = "400px";

  const pipeBottom = document.createElement("div");
  pipeBottom.classList.add("pipe");
  pipeBottom.style.height = pipeBottomHeight + "px";
  pipeBottom.style.bottom = "0px";
  pipeBottom.style.left = "400px";

  gameContainer.appendChild(pipeTop);
  gameContainer.appendChild(pipeBottom);

  let pipeLeft = 400;
  const moveInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(moveInterval);
      pipeTop.remove();
      pipeBottom.remove();
      return;
    }

    pipeLeft -= 2;
    pipeTop.style.left = pipeLeft + "px";
    pipeBottom.style.left = pipeLeft + "px";

    // Çarpışma
    if (
      pipeLeft < 120 && pipeLeft + pipeWidth > 80 &&
      (birdTop < pipeTopHeight || birdTop + 40 > 500 - pipeBottomHeight)
    ) {
      endGame();
    }

    // Skor
    if (pipeLeft === 79) {
      score++;
      scoreDisplay.textContent = score;
    }

    if (pipeLeft < -60) {
      clearInterval(moveInterval);
      pipeTop.remove();
      pipeBottom.remove();
    }
  }, 20);
}

startBtn.addEventListener("click", () => {
  if (started) {
    location.reload();
    return;
  }

  started = true;
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = score;
  startBtn.textContent = "🔁 Yeniden Başlat";

  gameLoop = setInterval(fall, 20);
  pipeSpawner = setInterval(createPipe, 2000);
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

document.addEventListener("click", () => {
  jump();
});
