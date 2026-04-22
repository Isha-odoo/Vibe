function login() {
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  if (!name || !password) {
    alert("Please fill all fields");
    return;
  }

  // SINGLE SHARED PASSWORD FOR BOTH PEOPLE
  const SECRET_PASSWORD = "ourlove";

  if (password !== SECRET_PASSWORD) {
    alert("Wrong password 💔");
    return;
  }

  localStorage.setItem("user", name);
  localStorage.setItem("room", "couple-room");

  window.location.href = "chat.html";
}
