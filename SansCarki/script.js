let currentRotation = 0;

function spinWheel() {
  const wheel = document.getElementById("wheel");
  const result = document.getElementById("result");

  const randomDeg = Math.floor(Math.random() * 360) + 360 * 5; // 5 tur + rastgele
  currentRotation += randomDeg;

  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // Hangi ödül geldiğini hesapla
  setTimeout(() => {
    const deg = currentRotation % 360;
    const segment = Math.floor(deg / 60); // 6 segment var
    const rewards = ["🎁 Ödül 1", "💎 Ödül 2", "🎮 Ödül 3", "🚫 Boş", "💰 Ödül 4", "🎉 Ödül 5"];
    result.textContent = `Kazandın: ${rewards[5 - segment]}`; // Dönüş yönü ters
  }, 4000);
}
