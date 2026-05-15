function rollDice() {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;

  document.getElementById("dice1").src = `https://upload.wikimedia.org/wikipedia/commons/${dice1}-Dice.svg`;
  document.getElementById("dice2").src = `https://upload.wikimedia.org/wikipedia/commons/${dice2}-Dice.svg`;

  const result = document.getElementById("result");
  if (dice1 > dice2) {
    result.textContent = "🎉 Oyuncu 1 Kazandı!";
  } else if (dice2 > dice1) {
    result.textContent = "🎉 Oyuncu 2 Kazandı!";
  } else {
    result.textContent = "🤝 Berabere!";
  }
}
