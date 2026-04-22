const SUPABASE_URL = "https://styskdmjtfbbbrjjkfxe.supabase.co";
const SUPABASE_KEY = "sb_publishable_1IvvlwE_CVoFzV8R6LkSnA_nATdDE7l";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const myName = localStorage.getItem("chat_name");

// Send
async function sendMessage() {
  const text = document.getElementById("message").value;
  if (!text) return;

  await supabaseClient.from("messages").insert([
    {
      sender: myName,
      content: text
    }
  ]);

  document.getElementById("message").value = "";
}

// Load
async function loadMessages() {
  const { data } = await supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  data.forEach(msg => {
    const type = msg.sender === myName ? "sent" : "received";

    chat.innerHTML += `
      <div class="msg ${type}">
        <b>${msg.sender}</b><br>
        ${msg.content}
      </div>
    `;
  });

  chat.scrollTop = chat.scrollHeight;
}

// Realtime
supabaseClient
  .channel("room")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    () => loadMessages()
  )
  .subscribe();

loadMessages();
