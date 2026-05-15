const game = document.getElementById("game");
const restartBtn = document.getElementById("restart");

const size = 10;
const mineCount = 15;

let cells = [];
let gameOver = false;

function createGrid() {
  game.innerHTML = "";
  cells = [];
  gameOver = false;

  for (let i = 0; i < size * size; i++) {

    const div = document.createElement("div");
    div.className = "cell";
    div.dataset.index = i;
    div.addEventListener("click", () => handleClick(i));

    game.appendChild(div);

    cells.push({
      element: div,
      hasMine: false,
      revealed: false,
      count: 0
    });

  }

  placeMines();
  calculateCounts();
}

function placeMines() {

  let placed = 0;

  while (placed < mineCount) {

    const i = Math.floor(Math.random() * (size * size));

    if (!cells[i].hasMine) {
      cells[i].hasMine = true;
      placed++;
    }

  }

}

function getNeighbors(i) {

  const neighbors = [];

  const x = i % size;
  const y = Math.floor(i / size);

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {

      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        neighbors.push(ny * size + nx);
      }

    }
  }

  return neighbors;

}

function calculateCounts() {

  cells.forEach((cell, i) => {

    if (cell.hasMine) return;

    const neighbors = getNeighbors(i);

    cell.count = neighbors.filter(j => cells[j].hasMine).length;

  });

}

function reveal(i) {

  const cell = cells[i];

  if (cell.revealed || gameOver) return;

  cell.revealed = true;

  cell.element.classList.add("revealed");

  if (cell.hasMine) {

    cell.element.textContent = "💣";
    cell.element.classList.add("bomb");

    gameOver = true;

    alert("BOOM! Oyunu kaybettin!");

    return;

  }

  if (cell.count > 0) {
    cell.element.textContent = cell.count;
  } else {
    getNeighbors(i).forEach(reveal);
  }

}

function handleClick(i) {
  reveal(i);
}

restartBtn.addEventListener("click", createGrid);

createGrid();
