const SUPABASE_URL = "https://styskdmjtfbbbrjjkfxe.supabase.co";
const SUPABASE_KEY = "sb_publishable_1IvvlwE_CVoFzV8R6LkSnA_nATdDE7l";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const myName = localStorage.getItem("chat_name");

// 🔥 MUST CHECK LOGIN
supabaseClient.auth.getSession().then(({ data }) => {
  if (!data.session) {
    window.location.href = "login.html";
  }
});

// Format time
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Add message to UI
function addMessage(msg) {
  const chat = document.getElementById("chat");

  const type = msg.sender === myName ? "sent" : "received";

  const div = document.createElement("div");
  div.className = `msg ${type}`;

  div.innerHTML = `
    ${msg.content}
    <div class="time">${formatTime(msg.created_at)}</div>
  `;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Load messages
async function loadMessages() {
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  data.forEach(addMessage);
}

// Send message
async function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();

  if (!text) return;

  const { error } = await supabaseClient.from("messages").insert([
    {
      sender: myName,
      content: text
    }
  ]);

  if (error) {
    console.error(error);
  }

  input.value = "";
}

// Realtime FIX (MOST IMPORTANT)
supabaseClient
  .channel("chat-room")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages"
    },
    (payload) => {
      addMessage(payload.new);
    }
  )
  .subscribe();

// INIT
loadMessages();
