const SUPABASE_URL = "https://styskdmjtfbbbrjjkfxe.supabase.co";
const SUPABASE_KEY = "sb_publishable_1IvvlwE_CVoFzV8R6LkSnA_nATdDE7l";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser;

// Get logged user
async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  currentUser = data.user;
}
getUser();

// Send message
async function sendMessage() {
  const text = document.getElementById("message").value;
  const receiverEmail = document.getElementById("receiverEmail").value;

  const { data: receiver } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("email", receiverEmail)
    .single();

  await supabaseClient.from("messages").insert([
    {
      sender: currentUser.id,
      receiver: receiver.id,
      content: text
    }
  ]);
}

// Load messages
async function loadMessages() {
  const receiverEmail = document.getElementById("receiverEmail").value;

  if (!receiverEmail) return;

  const { data: receiver } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("email", receiverEmail)
    .single();

  const { data } = await supabaseClient
    .from("messages")
    .select("*")
    .or(`sender.eq.${currentUser.id},receiver.eq.${currentUser.id}`)
    .order("created_at", { ascending: true });

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  data.forEach(msg => {
    if (
      (msg.sender === currentUser.id && msg.receiver === receiver.id) ||
      (msg.sender === receiver.id && msg.receiver === currentUser.id)
    ) {
      chat.innerHTML += `<div class="msg">${msg.content}</div>`;
    }
  });
}

// Realtime
supabaseClient
  .channel("chat")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    payload => {
      loadMessages();
    }
  )
  .subscribe();

// Reload when receiver changes
document.getElementById("receiverEmail").addEventListener("input", loadMessages);
