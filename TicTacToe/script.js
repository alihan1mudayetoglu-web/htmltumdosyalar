const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");

let currentPlayer = "X";
let gameActive = true;
let cells = Array(9).fill("");

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Yatay
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dikey
  [0, 4, 8], [2, 4, 6]             // Çapraz
];

// Tahta oluştur
function createBoard() {
  board.innerHTML = "";
  cells = Array(9).fill("");
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    board.appendChild(cell);
  }
}

createBoard();

// Hücre tıklama
board.addEventListener("click", (e) => {
  if (!gameActive) return;
  const target = e.target;
  const index = target.dataset.index;

  if (!index || cells[index] !== "") return;

  cells[index] = currentPlayer;
  target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `🎉 Kazanan: ${currentPlayer}`;
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell !== "")) {
    statusText.textContent = "🤝 Beraberlik!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Sıra: ${currentPlayer}`;
});

// Kazanan kontrolü
function checkWin() {
  return winningCombinations.some(combo => {
    const [a, b, c] = combo;
    return (
      cells[a] &&
      cells[a] === cells[b] &&
      cells[a] === cells[c]
    );
  });
}

// Sıfırlama
resetButton.addEventListener("click", () => {
  createBoard();
  currentPlayer = "X";
  statusText.textContent = "Sıra: X";
  gameActive = true;
});
