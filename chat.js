const SUPABASE_URL = "https://styskdmjtfbbbrjjkfxe.supabase.co";
const SUPABASE_KEY = "sb_publishable_1IvvlwE_CVoFzV8R6LkSnA_nATdDE7l";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const myName = localStorage.getItem("chat_name");

// Format time
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Append message (IMPORTANT)
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

// Load messages once
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

  data.forEach(msg => addMessage(msg));
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
    alert("Message failed");
  }

  input.value = "";
}

// Realtime (IMPORTANT FIX)
supabaseClient
  .channel("room")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    payload => {
      addMessage(payload.new);
    }
  )
  .subscribe();

// Initial load
loadMessages();
