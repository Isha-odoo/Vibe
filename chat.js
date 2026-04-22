const SUPABASE_URL = "https://anprzuxycbmnikgnjcut.supabase.co";
const SUPABASE_KEY = "sb_publishable_c8CLCw8ss_7kDAJfkCFjhg_v9Hk78ZE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// SEND MESSAGE
async function send() {
  const input = document.getElementById("msg");
  if (!input.value) return;

  await supabaseClient
    .from("messages")
    .insert([{
      user_name: localStorage.getItem("user"),
      message: input.value
    }]);

  input.value = "";
}

// LOAD + REALTIME
function loadMessages() {
  supabaseClient
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .then(({ data }) => render(data));

  supabaseClient
    .channel("room")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      payload => {
        loadMessages();
      }
    )
    .subscribe();
}

function render(messages) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  messages.forEach(m => {
    const div = document.createElement("div");
    div.className = m.user_name === localStorage.getItem("user") ? "msg me" : "msg you";
    div.innerHTML = `<b>${m.user_name}</b><br>${m.message}`;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}
