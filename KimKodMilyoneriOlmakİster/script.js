const questions = [
  {
    question: "HTML'de bir sayfada en büyük başlık için hangi etiket kullanılır?",
    answers: [
      "<h6>",
      "<h1>",
      "<title>",
      "<header>"
    ],
    correct: 1
  },
  {
    question: "CSS'te yazı rengini değiştirmek için hangi özellik kullanılır?",
    answers: [
      "font-color",
      "text-style",
      "color",
      "background"
    ],
    correct: 2
  },
  {
    question: "JavaScript'te bir mesaj kutusu göstermek için hangisi kullanılır?",
    answers: [
      "alert()",
      "message()",
      "show()",
      "popup()"
    ],
    correct: 0
  },
  {
    question: "HTML'de bir liste oluşturmak için hangi etiket kullanılır?",
    answers: [
      "<list>",
      "<ul>",
      "<li>",
      "<table>"
    ],
    correct: 1
  },
  {
    question: "CSS'te bir elementi gizlemek için hangisi kullanılabilir?",
    answers: [
      "display:none",
      "visible:false",
      "hide:true",
      "opacity:2"
    ],
    correct: 0
  },
  {
    question: "JavaScript'te bir değişken tanımlamak için hangisi kullanılabilir?",
    answers: [
      "variable",
      "let",
      "make",
      "create"
    ],
    correct: 1
  },
  {
    question: "HTML'de kullanıcıdan veri almak için hangi etiket kullanılır?",
    answers: [
      "<form>",
      "<data>",
      "<input>",
      "<field>"
    ],
    correct: 2
  },
  {
    question: "CSS'te bir elementin arka plan rengini değiştirmek için hangisi kullanılır?",
    answers: [
      "bgcolor",
      "background-color",
      "color-background",
      "style-bg"
    ],
    correct: 1
  },
  {
    question: "JavaScript'te bir sayfanın tamamen yüklendiğini anlamak için hangi olay kullanılabilir?",
    answers: [
      "onstart",
      "onload",
      "onready",
      "onopen"
    ],
    correct: 1
  },
  {
    question: "HTML'de bir resmi tıklanınca başka sayfaya gitmesi için genelde ne yapılır?",
    answers: [
      "Resmi <a> etiketi içine koymak",
      "Resme onclick yazmak",
      "Resmi <link> içine koymak",
      "Resmi <goto> etiketiyle kullanmak"
    ],
    correct: 0
  }
];

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let lifelines = {
  fifty: 1,
  phone: 1,
  audience: 1
};

// elementler
const questionNumber = document.getElementById("questionNumber");
const scoreText = document.getElementById("scoreText");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const messageBox = document.getElementById("messageBox");

const fiftyEl = document.getElementById("fifty");
const phoneEl = document.getElementById("phone");
const audienceEl = document.getElementById("audience");

function updateUI() {
  fiftyEl.textContent = "🃏 " + lifelines.fifty;
  phoneEl.textContent = "📞 " + lifelines.phone;
  audienceEl.textContent = "👥 " + lifelines.audience;
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;

  const q = questions[currentQuestionIndex];

  questionNumber.textContent = "Soru " + (currentQuestionIndex + 1);
  scoreText.textContent = "Skor: " + score;
  questionText.textContent = q.question;

  answersContainer.innerHTML = "";

  q.answers.forEach((a, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = a;

    btn.onclick = () => selectAnswer(i, btn);

    answersContainer.appendChild(btn);
  });

  messageBox.textContent = "Cevabını seç veya joker kullan.";
  updateUI();
}

function selectAnswer(i, btn) {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((b, index) => {
    b.disabled = true;

    if (index === q.correct) {
      b.classList.add("correct");
    }
  });

  if (i === q.correct) {
    btn.classList.add("correct");
    score++;
    messageBox.textContent = "✔ Doğru cevap!";
    nextBtn.disabled = false;
  } else {
    btn.classList.add("wrong");
    messageBox.textContent = "❌ Yanlış! Oyun sıfırlanıyor...";
    setTimeout(resetGame, 1500);
  }

  scoreText.textContent = "Skor: " + score;
}

// 🔥 50:50
function useFifty() {
  if (lifelines.fifty <= 0 || answered) return;
  lifelines.fifty--;

  const q = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-btn");

  let wrongIndexes = [];

  buttons.forEach((btn, i) => {
    if (i !== q.correct) wrongIndexes.push(i);
  });

  // rastgele 2 yanlış kaldır
  wrongIndexes.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 2; i++) {
    buttons[wrongIndexes[i]].style.visibility = "hidden";
  }

  updateUI();
}

// 📞 TELEFON
function usePhone() {
  if (lifelines.phone <= 0 || answered) return;
  lifelines.phone--;

  const q = questions[currentQuestionIndex];

  let guess;

  if (Math.random() < 0.7) {
    guess = q.answers[q.correct];
  } else {
    guess = q.answers[Math.floor(Math.random() * q.answers.length)];
  }

  messageBox.textContent = "📞 Telefon: Bence cevap → " + guess;

  updateUI();
}

// 👥 SEYİRCİ
function useAudience() {
  if (lifelines.audience <= 0 || answered) return;
  lifelines.audience--;

  const q = questions[currentQuestionIndex];

  let results = [];

  for (let i = 0; i < q.answers.length; i++) {
    if (i === q.correct) {
      results.push(60 + Math.floor(Math.random() * 30)); // doğru en yüksek
    } else {
      results.push(Math.floor(Math.random() * 40));
    }
  }

  let maxIndex = results.indexOf(Math.max(...results));

  messageBox.textContent =
    `👥 Seyirci: En yüksek oy → "${q.answers[maxIndex]}" (%${results[maxIndex]})`;

  updateUI();
}

// NEXT
nextBtn.onclick = () => {
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    messageBox.textContent = "🎉 Oyun bitti!";
    nextBtn.disabled = true;
    return;
  }

  loadQuestion();
};

// RESTART
restartBtn.onclick = resetGame;

function resetGame() {
  currentQuestionIndex = 0;
  score = 0;

  lifelines = {
    fifty: 1,
    phone: 1,
    audience: 1
  };

  loadQuestion();
}

loadQuestion();
