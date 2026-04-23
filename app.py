<!DOCTYPE html>
<html>
<head>
  <title>Let's Talk 💞</title>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #eef2f3, #f9fafb);
}

.container {
  max-width: 520px;
  margin: auto;
  padding: 20px;
}

.card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(12px);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6b7280, #374151);
  color: white;
  border: none;
  border-radius: 12px;
}

.chat {
  height: 420px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg {
  padding: 12px;
  border-radius: 16px;
  max-width: 75%;
}

.me {
  background: #e5e7eb;
  align-self: flex-end;
}

.other {
  background: white;
  align-self: flex-start;
}

.time {
  font-size: 10px;
  opacity: 0.6;
  text-align: right;
}

.header {
  text-align: center;
}
  </style>
</head>

<body>

<div class="container">

  <!-- LOGIN -->
  <div id="login" class="card">
    <h2>💬 Private Space</h2>
    <input id="name" placeholder="Your name">
    <input id="pass" placeholder="Password" type="password">
    <button onclick="login()">Enter</button>
    <p id="error" style="color:red;"></p>
  </div>

  <!-- CHAT -->
  <div id="chatUI" class="card" style="display:none;">
    
    <div class="header">
      <h2>💞 Our Space</h2>
      <p>Talk gently. You’re on the same team.</p>
    </div>

    <div id="chat" class="chat"></div>

    <input id="msg" placeholder="Type something kind..." />
    <button onclick="send()">Send</button>

  </div>

</div>

<script>
const SUPABASE_URL = "https://styskdmjtfbbbrjjkfxe.supabase.co";
const SUPABASE_KEY = "sb_publishable_1IvvlwE_CVoFzV8R6LkSnA_nATdDE7l";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const PASSWORD = "loveyou";
const COUPLE_ID = "Yours";

let currentUser = "";

// LOGIN
function login() {
  const name = document.getElementById("name").value;
  const pass = document.getElementById("pass").value;

  if (!name) {
    document.getElementById("error").innerText = "Enter name";
    return;
  }

  if (pass !== PASSWORD) {
    document.getElementById("error").innerText = "Wrong password";
    return;
  }

  currentUser = name;

  document.getElementById("login").style.display = "none";
  document.getElementById("chatUI").style.display = "block";

  loadMessages();
  listenRealtime();
}

// LOAD OLD MESSAGES
async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("couple_id", COUPLE_ID)
    .order("created_at");

  document.getElementById("chat").innerHTML = "";
  data.forEach(addMessage);
}

// ADD MESSAGE UI
function addMessage(m) {
  const div = document.createElement("div");
  const isMe = m.sender === currentUser;

  div.className = "msg " + (isMe ? "me" : "other");

  const time = new Date(m.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  div.innerHTML = `
    <b>${m.sender}</b><br>
    ${m.message}
    <div class="time">${time}</div>
  `;

  document.getElementById("chat").appendChild(div);
  div.scrollIntoView({ behavior: "smooth" });
}

// SEND MESSAGE
async function send() {
  const msg = document.getElementById("msg").value;

  if (!msg) return;

  await supabase.from("messages").insert({
    couple_id: COUPLE_ID,
    sender: currentUser,
    message: msg
  });

  document.getElementById("msg").value = "";
}

// REALTIME
function listenRealtime() {
  supabase.channel("chat")
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages"
    }, payload => {
      addMessage(payload.new);
    })
    .subscribe();
}
</script>

</body>
</html>
