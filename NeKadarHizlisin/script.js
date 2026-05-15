let startTime, isGreen = false, timeout;

function startGame() {
  document.getElementById("result").textContent = "";
  const box = document.getElementById("game-box");
  box.textContent = "Hazırlan...";
  box.style.backgroundColor = "gray";
  isGreen = false;

  const randomTime = Math.floor(Math.random() * 3000) + 2000;

  timeout = setTimeout(() => {
    box.textContent = "ŞİMDİ TIKLA!";
    box.style.backgroundColor = "green";
    startTime = new Date().getTime();
    isGreen = true;
  }, randomTime);
}

document.getElementById("game-box").addEventListener("click", () => {
  if (!isGreen) {
    clearTimeout(timeout);
    document.getElementById("game-box").textContent = "ÇOK ERKEN!";
    document.getElementById("game-box").style.backgroundColor = "red";
  } else {
    const reactionTime = new Date().getTime() - startTime;
    document.getElementById("result").textContent = `Tepki Süresi: ${reactionTime} ms`;
    document.getElementById("game-box").textContent = "Hazır mısın?";
    document.getElementById("game-box").style.backgroundColor = "gray";
    isGreen = false;
  }
});
