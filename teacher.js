const API_BASE = "http://127.0.0.1:8000";

const form = document.getElementById("registerForm");
const resultDiv = document.getElementById("registerResult");
const studentList = document.getElementById("studentList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value);


  const response = await fetch(`${API_BASE}/teacher/register-student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      age: age
    })
  });

  const data = await response.json();

  if (response.ok) {
   console.log("API RESPONSE:", data);
   resultDiv.innerHTML = `
  <div style="margin-top:10px;">
      ✅ <b>Student Registered!</b><br>
      <b>ID:</b> ${data.student_id}<br><br>
      <b>Student Login QR:</b><br><br>
      <img 
        src="data:image/png;base64,${data.qr_code_base64}" 
        alt="Student QR Code"
        style="border:1px solid #ccc; padding:10px; width:200px;"
      />
    </div>
`;

    addStudentToList(name, data.student_id);
    form.reset();
  } else {
    resultDiv.innerHTML = "❌ Error registering student";
  }
});

function addStudentToList(name, id) {
  const li = document.createElement("li");
  li.innerHTML = `<b>${name}</b><br>ID: ${id}`;
  studentList.appendChild(li);
}
