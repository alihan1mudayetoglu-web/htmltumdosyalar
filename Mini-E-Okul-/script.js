let grades = [
  { student: "Alihan", lesson: "Matematik", grade: 100 },
  { student: "Taylan", lesson: "Türkçe", grade: 87 },
  { student: "BozdoğanBey", lesson: "Fen Bilimleri", grade: 85 },
  
function selectRole(role) {
  const teacherPanel = document.getElementById("teacherPanel");
  const studentPanel = document.getElementById("studentPanel");
  const selectedRoleText = document.getElementById("selectedRoleText");

  if (role === "teacher") {
    teacherPanel.classList.remove("hidden");
    studentPanel.classList.add("hidden");
    selectedRoleText.textContent = "Seçilen giriş türü: Öğretmen";
    renderTeacherTable();
  } else {
    studentPanel.classList.remove("hidden");
    teacherPanel.classList.add("hidden");
    selectedRoleText.textContent = "Seçilen giriş türü: Öğrenci";
    showStudentGrades();
  }
}

function addGrade() {
  const student = document.getElementById("studentSelect").value;
  const lesson = document.getElementById("lessonSelect").value;
  const gradeValue = document.getElementById("gradeInput").value;

  if (gradeValue === "") {
    alert("Lütfen bir not girin.");
    return;
  }

  const numericGrade = Number(gradeValue);

  if (numericGrade < 0 || numericGrade > 100) {
    alert("Not 0 ile 100 arasında olmalıdır.");
    return;
  }

  grades.push({
    student: student,
    lesson: lesson,
    grade: numericGrade
  });

  document.getElementById("gradeInput").value = "";

  renderTeacherTable();
  showStudentGrades();
}

function renderTeacherTable() {
  const teacherTableBody = document.getElementById("teacherTableBody");
  teacherTableBody.innerHTML = "";

  grades.forEach(function(item) {
    const row = `
      <tr>
        <td>${item.student}</td>
        <td>${item.lesson}</td>
        <td>${item.grade}</td>
      </tr>
    `;
    teacherTableBody.innerHTML += row;
  });
}

function showStudentGrades() {
  const selectedStudent = document.getElementById("studentViewSelect").value;
  const studentTableBody = document.getElementById("studentTableBody");
  const studentTitle = document.getElementById("studentTitle");

  studentTitle.textContent = selectedStudent + " adlı öğrencinin notları";
  studentTableBody.innerHTML = "";

  const filteredGrades = grades.filter(function(item) {
    return item.student === selectedStudent;
  });

  if (filteredGrades.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="2">Bu öğrenci için henüz not girilmemiş.</td>
      </tr>
    `;
    return;
  }

  filteredGrades.forEach(function(item) {
    const row = `
      <tr>
        <td>${item.lesson}</td>
        <td>${item.grade}</td>
      </tr>
    `;
    studentTableBody.innerHTML += row;
  });
}

function resetSystem() {
  const confirmDelete = confirm("Tüm notları silmek istediğinize emin misiniz?");
  
  if (!confirmDelete) {
    return;
  }

  grades = [];
  renderTeacherTable();
  showStudentGrades();
}

renderTeacherTable();
showStudentGrades();
