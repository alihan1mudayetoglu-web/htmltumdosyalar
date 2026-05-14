const rewards = ["common", "rare", "legendary"];
const boxes = document.querySelectorAll(".box");
let leftCount = boxes.length;

function getRandomReward() {
  const chance = Math.random();
  if (chance < 0.6) return "common";       // %60
  else if (chance < 0.9) return "rare";    // %30
  else return "legendary";                 // %10
}

function openBox(box) {
  if (box.classList.contains("opened")) return;

  const reward = getRandomReward();
  box.classList.add("opened", reward);
  box.innerText = reward.toUpperCase();

  leftCount--;
  document.getElementById("left").textContent = leftCount;

  if (leftCount === 0) {
    setTimeout(() => alert("🎉 Tüm kutuları açtın!"), 200);
  }
}

function resetGame() {
  boxes.forEach(box => {
    box.className = "box";
    box.innerText = "";
  });
  leftCount = boxes.length;
  document.getElementById("left").textContent = leftCount;
}
