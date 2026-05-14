const gameContainer = document.getElementById('game-container');
const restartBtn = document.getElementById('restart-btn');
const statusText = document.createElement('p');
document.body.insertBefore(statusText, gameContainer);

const rewards = [
  { emoji: '🍬', rarity: 'common' },
  { emoji: '🧦', rarity: 'common' },
  { emoji: '🍕', rarity: 'common' },
  { emoji: '🎮', rarity: 'rare' },
  { emoji: '🎁', rarity: 'rare' },
  { emoji: '📱', rarity: 'rare' },
  { emoji: '💎', rarity: 'epic' },
  { emoji: '🚗', rarity: 'epic' },
  { emoji: '🏆', rarity: 'epic' }
];

let openedCount = 0;

function createBoxes() {
  gameContainer.innerHTML = '';
  openedCount = 0;
  restartBtn.style.display = 'none';
  updateStatus();

  for (let i = 0; i < 9; i++) {
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = '<span class="lid">🎁</span>';
    box.addEventListener('click', () => openBox(box));
    gameContainer.appendChild(box);
  }
}

function openBox(box) {
  if (box.classList.contains('opened')) return;

  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  box.classList.add('opened', reward.rarity);
  box.innerHTML = `<span class="reward">${reward.emoji}</span><div class="rarity">${reward.rarity.toUpperCase()}</div>`;

  openedCount++;
  updateStatus();

  if (openedCount === 9) {
    restartBtn.style.display = 'inline-block';
  }
}

function updateStatus() {
  statusText.textContent = `Kalan Kutu: ${9 - openedCount}`;
}

restartBtn.addEventListener('click', createBoxes);

// Başlat
createBoxes();
