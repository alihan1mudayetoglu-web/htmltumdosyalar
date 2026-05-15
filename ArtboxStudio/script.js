const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const bgColorPicker = document.getElementById("bgColorPicker");
const fillBgBtn = document.getElementById("fillBg");
const clearCanvasBtn = document.getElementById("clearCanvas");
const addDrawingPostBtn = document.getElementById("addDrawingPost");
const postTitle = document.getElementById("postTitle");
const postDescription = document.getElementById("postDescription");
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const clock = document.getElementById("clock");

let isDrawing = false;

// Başlangıç zemin
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("tr-TR");
}
setInterval(updateClock, 1000);
updateClock();

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
});

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function startDrawing(event) {
  isDrawing = true;
  draw(event);
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function draw(event) {
  if (!isDrawing) return;

  const pos = getMousePosition(event);

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = colorPicker.value;

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("mousemove", draw);

fillBgBtn.addEventListener("click", function () {
  ctx.fillStyle = bgColorPicker.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

clearCanvasBtn.addEventListener("click", function () {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Beğeni ve silme butonları için toggle
function addCardActions(card) {
  const likeBtn = card.querySelector(".like-btn");
  const deleteBtn = card.querySelector(".delete-btn");

  let liked = false; // toggle durumu

  likeBtn.addEventListener("click", function () {
    liked = !liked; // her tıkta tersine çevir
    likeBtn.textContent = liked ? "❤️ 1" : "❤️ 0";
  });

  deleteBtn.addEventListener("click", function () {
    card.remove();
  });
}

// Mevcut kartlar varsa onlara da ekle
document.querySelectorAll(".post-card").forEach(addCardActions);

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
  postCard.setAttribute("data-title", title.toLowerCase());

  postCard.innerHTML = `
    <img src="${imageData}" alt="Çizim gönderisi">
    <div class="post-body">
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="post-actions">
        <button class="like-btn">❤️ 0</button>
        <button class="delete-btn">🗑 Sil</button>
      </div>
    </div>
  `;

  gallery.prepend(postCard);
  addCardActions(postCard);

  postTitle.value = "";
  postDescription.value = "";

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

searchInput.addEventListener("input", function () {
  const searchText = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".post-card");

  cards.forEach(function (card) {
    const title =
      card.getAttribute("data-title") ||
      card.querySelector("h3").textContent.toLowerCase();

    if (title.includes(searchText)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});
