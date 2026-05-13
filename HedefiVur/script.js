let score = 0;
let timeLeft = 30;
let gameStarted = false;
let timer;

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const gameArea = document.getElementById("gameArea");
const startBtn = document.getElementById("startBtn");

function randomPosition() {
  const x = Math.random() * (gameArea.clientWidth - 50);
  const y = Math.random() * (gameArea.clientHeight - 50);
  return { x, y };
}

function createTarget() {
  const target = document.createElement("div");
  target.classList.add("target");

  const { x, y } = randomPosition();
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.onclick = () => {
    score++;
    scoreEl.textContent = score;
    target.remove();
    createTarget();
  };

  gameArea.appendChild(target);
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  gameArea.innerHTML = "";

  createTarget();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      gameArea.innerHTML = `<h2>⏰ Süre doldu!</h2><p>Skorun: ${score}</p>`;
      gameStarted = false;
    }
  }, 1000);
}
startBtn.addEventListener("click", startGame);
const clickSound = new Audio("click.mp3");
target.onclick = () => {
  clickSound.currentTime = 0; // Baştan başlat
  clickSound.play(); // 🔊 Ses çal
  score++;
  scoreEl.textContent = score;
  target.remove();
  createTarget();
  clickSound.volume = 0.3; // %30 sesle çalsın
};
const highScoreEl = document.getElementById("highScore");
let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;
if (score > highScore) {
  highScore = score;
  localStorage.setItem("highScore", highScore);
  highScoreEl.textContent = highScore;
}
gameArea.innerHTML = `
  <h2>⏰ Süre doldu!</h2>
  <p>Skorun: ${score}</p>
  <p>🥇 En Yüksek Skor: ${highScore}</p>
`;
