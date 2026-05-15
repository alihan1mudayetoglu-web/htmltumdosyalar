let correctCount = 0;

document.querySelectorAll('img[draggable="true"]').forEach(img => {
  img.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
});

document.querySelectorAll(".drop").forEach(drop => {
  drop.addEventListener("dragover", e => e.preventDefault());

  drop.addEventListener("drop", e => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text");
    if (drop.dataset.id === draggedId && drop.children.length === 0) {
      const draggedEl = document.getElementById(draggedId);
      drop.appendChild(draggedEl);
      correctCount++;
      if (correctCount === 3) {
        document.getElementById("message").textContent = "🎉 Tebrikler! Puzzle Tamamlandı!";
      }
    }
  });
});
