const API = "http://127.0.0.1:8000";

// 1️⃣ Login student using ID
async function loginStudent() {
  const studentId = document.getElementById("studentId").value;

  const res = await fetch(`${API}/student/profile/${studentId}`);

  if (!res.ok) {
    alert("Invalid Student ID");
    return;
  }

  const student = await res.json();
  localStorage.setItem("student_id", studentId);

  document.getElementById("profile").innerHTML = `
    <h3>Welcome ${student.name}</h3>
    Level: ${student.level}<br>
    Accuracy: ${student.accuracy}%<br>
    Status: ${student.status}<br><br>
    <button onclick="getQuestion()">Start Quiz</button>
  `;
}

// 2️⃣ Get adaptive question
async function getQuestion() {
  const studentId = localStorage.getItem("student_id");

  const res = await fetch(`${API}/quiz/next/${studentId}?subject=math`);
  const q = await res.json();

  document.getElementById("quiz").innerHTML = `
    <h4>${q.question}</h4>
    ${q.options.map(opt =>
      `<button onclick="submitAnswer('${opt}', '${q.correct_answer}', ${q.difficulty})">
        ${opt}
      </button>`
    ).join("<br>")}
  `;
}

// 3️⃣ Submit answer
async function submitAnswer(selected, correct, difficulty) {
  const studentId = localStorage.getItem("student_id");

  const res = await fetch(`${API}/quiz/submit`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      student_id: studentId,
      selected_answer: selected,
      correct_answer: correct,
      difficulty: difficulty
    })
  });

  const result = await res.json();
  alert(result.correct ? "Correct!" : "Wrong!");

  await refreshProfile(studentId);

  // Get next adaptive question
  getQuestion();
}

async function refreshProfile(studentId) {
  const res = await fetch(`${API}/student/profile/${studentId}`);
  const student = await res.json();

  document.getElementById("profile").innerHTML = `
    <h3>Welcome ${student.name}</h3>
    Level: ${student.level}<br>
    Accuracy: ${student.accuracy}%<br>
    Status: ${student.status}<br><br>
    <button onclick="getQuestion()">Continue Quiz</button>
  `;
}

