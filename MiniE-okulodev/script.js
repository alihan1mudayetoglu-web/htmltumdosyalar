let role = "";

let teacherAccount = {
  name: "Alihan",
  pass: "1234"
};

let students = ["Alihan", "Taylan", "BozdoğanBey", "Muhammet"];

let lessons = ["Matematik", "Türkçe", "Fen", "İngilizce", "Arapça"];

let grades = JSON.parse(localStorage.getItem("grades")) || [
  { student: "Alihan", lesson: "Matematik", grade: 95 },
  { student: "Alihan", lesson: "Fen", grade: 92 },
  { student: "Taylan", lesson: "Türkçe", grade: 90 },
  { student: "BozdoğanBey", lesson: "İngilizce", grade: 88 },
  { student: "Muhammet", lesson: "Arapça", grade: 93 }
];

function save() {
  localStorage.setItem("grades", JSON.stringify(grades));
}

function hidePanels() {
  document.getElementById("teacherPanel").classList.add("hidden");
  document.getElementById("studentPanel").classList.add("hidden");
}

function showLogin(r) {
  hidePanels();

  role = r;

  document.getElementById("loginCard").classList.remove("hidden");

  document.getElementById("loginTitle").innerText =
    r === "teacher" ? "Öğretmen Girişi" : "Öğrenci Girişi";
}

function login() {
  let name = document.getElementById("loginName").value;
  let pass = document.getElementById("loginPass").value;

  hidePanels();

  if (role === "teacher") {
    if (name === teacherAccount.name && pass === teacherAccount.pass) {
      document.getElementById("teacherPanel").classList.remove("hidden");

      loadSelects();
      renderTeacherTable();
    } else {
      alert("Hatalı giriş");
    }
  }

  if (role === "student") {
    if (students.includes(name) && pass === "1234") {
      document.getElementById("studentPanel").classList.remove("hidden");

      loadSelects();

      document.getElementById("studentView").value = name;

      showStudentGrades();
    } else {
      alert("Hatalı giriş");
    }
  }
}

function loadSelects() {
  let s1 = document.getElementById("studentSelect");
  let s2 = document.getElementById("studentView");
  let l = document.getElementById("lessonSelect");

  s1.innerHTML = "";
  s2.innerHTML = "";
  l.innerHTML = "";

  students.forEach(st => {
    s1.innerHTML += `<option>${st}</option>`;
    s2.innerHTML += `<option>${st}</option>`;
  });

  lessons.forEach(le => {
    l.innerHTML += `<option>${le}</option>`;
  });
}

function addGrade() {
  let student = document.getElementById("studentSelect").value;
  let lesson = document.getElementById("lessonSelect").value;
  let grade = Number(document.getElementById("gradeInput").value);

  if (!grade) return;

  grades.push({ student, lesson, grade });

  save();

  renderTeacherTable();
}

function renderTeacherTable() {
  let table = document.getElementById("teacherTable");

  table.innerHTML = "";

  grades.forEach((g, i) => {
    let c = "";

    if (g.grade >= 85) c = "good";
    if (g.grade < 50) c = "bad";

    table.innerHTML += `
      <tr>
        <td>${g.student}</td>
        <td>${g.lesson}</td>
        <td class="${c}">${g.grade}</td>
        <td>
          <button onclick="deleteGrade(${i})">Sil</button>
        </td>
      </tr>
    `;
  });
}

function deleteGrade(i) {
  grades.splice(i, 1);

  save();

  renderTeacherTable();
}

function showStudentGrades() {
  let student = document.getElementById("studentView").value;

  let table = document.getElementById("studentTable");

  table.innerHTML = "";

  let list = grades.filter(g => g.student === student);

  let total = 0;

  list.forEach(g => {
    total += g.grade;

    let c = "";

    if (g.grade >= 85) c = "good";
    if (g.grade < 50) c = "bad";

    table.innerHTML += `
      <tr>
        <td>${g.lesson}</td>
        <td class="${c}">${g.grade}</td>
      </tr>
    `;
  });

  let avg = list.length ? (total / list.length).toFixed(1) : "0.0";

  let result = avg >= 70 ? "Başarılı 🎉" : "Geliştirilmeli 📚";

  table.innerHTML += `
    <tr>
      <td><b>Ortalama</b></td>
      <td><b>${avg}</b></td>
    </tr>
    <tr>
      <td colspan="2"><b>${result}</b></td>
    </tr>
  `;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

loadSelects();
