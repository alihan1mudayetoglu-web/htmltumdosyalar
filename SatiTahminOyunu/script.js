let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
  const guess = parseInt(document.getElementById("guessInput").value);
  const message = document.getElementById("message");
  attempts++;

  if (guess < 1 || guess > 100 || isNaN(guess)) {
    message.textContent = "Lütfen 1 ile 100 arasında bir sayı gir!";
  } else if (guess < secretNumber) {
    message.textContent = "Daha büyük bir sayı dene ⬆️";
  } else if (guess > secretNumber) {
    message.textContent = "Daha küçük bir sayı dene ⬇️";
  } else {
    message.textContent = `🎉 Tebrikler! ${attempts} denemede bildin!`;
  }
}

function resetGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  document.getElementById("message").textContent = "";
  document.getElementById("guessInput").value = "";
}
