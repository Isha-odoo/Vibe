const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Load messages
async function loadMessages() {
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  data.forEach(msg => {
    chat.innerHTML += `<div class="msg">${msg.user_email}: ${msg.content}</div>`;
  });

  chat.scrollTop = chat.scrollHeight;
}

// Send message
async function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value;

  if (!text) return;

  await supabaseClient.from("messages").insert([
    {
      content: text,
      user_email: "user@example.com"
    }
  ]);

  input.value = "";
}

// Button click
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Realtime listener
supabaseClient
  .channel("messages-channel")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    payload => {
      const chat = document.getElementById("chat");
      const msg = payload.new;

      chat.innerHTML += `<div class="msg">${msg.user_email}: ${msg.content}</div>`;
      chat.scrollTop = chat.scrollHeight;
    }
  )
  .subscribe();

// Initial load
loadMessages();
