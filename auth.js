const SUPABASE_URL = "https://styskdmjtfbbbrjjkfxe.supabase.co";
const SUPABASE_KEY = "sb_publishable_1IvvlwE_CVoFzV8R6LkSnA_nATdDE7l";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  // Save name locally
  localStorage.setItem("chat_name", name);

  window.location.href = "chat.html";
}
