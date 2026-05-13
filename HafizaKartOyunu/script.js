const emojis = ['🍕', '🍔', '🍟', '🌭', '🍣', '🍩', '🍎', '🍇'];
let cards = [];
let flippedCards = [];
let lockBoard = false;

const board = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

function shuffleAndCreateCards() {
  // Temizle
  board.innerHTML = '';
  message.textContent = '';
  restartBtn.style.display = 'none';
  flippedCards = [];
  lockBoard = false;

  // Karıştır
  cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  // Oluştur
  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this.classList.contains('flipped')) return;

  this.textContent = this.dataset.emoji;
  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;
  const [card1, card2] = flippedCards;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    flippedCards = [];
    lockBoard = false;
    checkWin();
  } else {
    setTimeout(() => {
      card1.textContent = '';
      card2.textContent = '';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

function checkWin() {
  const allFlipped = document.querySelectorAll('.card.flipped');
  if (allFlipped.length === cards.length) {
    message.textContent = '🎉 Tebrikler! Tüm eşleşmeleri buldun!';
    restartBtn.style.display = 'inline-block';
  }
}

// Yeniden başla
restartBtn.addEventListener('click', () => {
  shuffleAndCreateCards();
});

// İlk başlat
shuffleAndCreateCards();
