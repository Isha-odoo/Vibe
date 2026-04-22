const user = localStorage.getItem("user");
const room = "Our Spce";

const chatBox = document.getElementById("chat-box");

load();

function send() {
  const input = document.getElementById("msg");
  if (!input.value) return;

  let messages = JSON.parse(localStorage.getItem(room)) || [];

  messages.push({
    user,
    msg: input.value,
    time: new Date().toLocaleTimeString()
  });

  localStorage.setItem(room, JSON.stringify(messages));

  input.value = "";
  render();
}

function load() {
  render();
}

function render() {
  chatBox.innerHTML = "";

  let messages = JSON.parse(localStorage.getItem(room)) || [];

  messages.forEach(m => {
    const div = document.createElement("div");
    div.className = m.user === user ? "msg me" : "msg you";

    div.innerHTML = `
      <b>${m.user}</b><br>
      ${m.msg}<br>
      <small>${m.time}</small>
    `;

    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}
