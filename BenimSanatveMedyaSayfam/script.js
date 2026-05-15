const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushValue = document.getElementById("brushValue");
const brushType = document.getElementById("brushType");

const clearCanvasBtn = document.getElementById("clearCanvas");
const addDrawingPostBtn = document.getElementById("addDrawingPost");
const eraserBtn = document.getElementById("eraserBtn");
const undoBtn = document.getElementById("undoBtn");
const downloadBtn = document.getElementById("downloadBtn");

const postTitle = document.getElementById("postTitle");
const postDescription = document.getElementById("postDescription");
const gallery = document.getElementById("gallery");

const activeToolText = document.getElementById("activeToolText");
const strokeCounter = document.getElementById("strokeCounter");

const colorSwatches = document.querySelectorAll(".color-swatch");

let isDrawing = false;
let isErasing = false;
let drawCount = 0;
let history = [];

function fillCanvasWhite() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

fillCanvasWhite();
saveState();

function saveState() {
  history.push(canvas.toDataURL());
  if (history.length > 20) {
    history.shift();
  }
}

function updateBrushValue() {
  brushValue.textContent = `${brushSize.value} px`;
}

updateBrushValue();

brushSize.addEventListener("input", updateBrushValue);

function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function applyBrushStyle() {
  ctx.lineWidth = brushSize.value;
  ctx.strokeStyle = isErasing ? "#ffffff" : colorPicker.value;

  if (brushType.value === "square") {
    ctx.lineCap = "square";
    ctx.shadowBlur = 0;
  } else if (brushType.value === "neon") {
    ctx.lineCap = "round";
    ctx.shadowColor = isErasing ? "#ffffff" : colorPicker.value;
    ctx.shadowBlur = 12;
  } else {
    ctx.lineCap = "round";
    ctx.shadowBlur = 0;
  }
}

function startDrawing(e) {
  isDrawing = true;
  const { x, y } = getCoordinates(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    ctx.beginPath();
    saveState();
    drawCount++;
    strokeCounter.textContent = drawCount;
  }
}

function draw(e) {
  if (!isDrawing) return;

  const { x, y } = getCoordinates(e);
  applyBrushStyle();
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("mousemove", draw);

colorSwatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    colorPicker.value = swatch.dataset.color;
    if (isErasing) {
      isErasing = false;
      eraserBtn.classList.remove("active");
      activeToolText.textContent = "Fırça";
    }
  });
});

eraserBtn.addEventListener("click", () => {
  isErasing = !isErasing;
  eraserBtn.classList.toggle("active");

  activeToolText.textContent = isErasing ? "Silgi" : "Fırça";
});

clearCanvasBtn.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fillCanvasWhite();
  saveState();
});

undoBtn.addEventListener("click", () => {
  if (history.length <= 1) return;

  history.pop();
  const previousState = history[history.length - 1];
  const img = new Image();

  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };

  img.src = previousState;
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "cizimim.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

addDrawingPostBtn.addEventListener("click", function () {
  const title = postTitle.value.trim();
  const description = postDescription.value.trim();

  if (title === "" || description === "") {
    alert("Lütfen başlık ve açıklama alanlarını doldurun!");
    return;
  }

  const imageData = canvas.toDataURL("image/png");

  const postCard = document.createElement("div");
  postCard.className = "post-card";

  postCard.innerHTML = `
    <img src="${imageData}" alt="Öğrenci çizimi">
    <div class="post-content">
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;

  gallery.prepend(postCard);

  postTitle.value = "";
  postDescription.value = "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fillCanvasWhite();
  saveState();
});
