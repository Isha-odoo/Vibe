import gradio as gr

PASSWORD = "ourlove"

messages = []

def login(name, password):
    if password != PASSWORD:
        return "❌ Wrong password", gr.update(visible=False), gr.update(visible=True)

    return f"💖 Welcome {name}", gr.update(visible=True), gr.update(visible=False)


def send_message(user, msg):
    if not msg:
        return messages

    messages.append(f"{user}: {msg}")

    return "\n".join(messages)


with gr.Blocks() as app:

    gr.Markdown("# 💕 Private Couple Space")
    gr.Markdown("A safe place — just two people, just feelings.")

    # LOGIN
    with gr.Column(visible=True) as login_box:
        name = gr.Textbox(label="Your Name")
        password = gr.Textbox(label="Password", type="password")
        login_btn = gr.Button("Enter 💕")
        login_status = gr.Textbox(label="Status")

    # CHAT
    with gr.Column(visible=False) as chat_box:
        chat_display = gr.Textbox(label="Couple Chat", lines=10)
        msg = gr.Textbox(label="Write your thoughts...")
        send_btn = gr.Button("Send 💌")

        user_state = gr.State()

    # LOGIN ACTION
    def handle_login(n, p):
        status, show_chat, hide_login = login(n, p)
        return status, show_chat, hide_login, n

    login_btn.click(
        handle_login,
        inputs=[name, password],
        outputs=[login_status, chat_box, login_box, user_state]
    )

    # SEND MESSAGE
    send_btn.click(
        send_message,
        inputs=[user_state, msg],
        outputs=chat_display
    )

app.launch()
