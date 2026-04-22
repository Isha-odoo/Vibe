from flask import Flask, render_template, request, redirect, session
import sqlite3

app = Flask(__name__)
app.secret_key = "couple_secret_key"

PASSWORD = "Isha"   # shared password

# ---------------- DB ----------------
def init_db():
    conn = sqlite3.connect("chat.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            message TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# ---------------- ROUTES ----------------

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form["name"]
        password = request.form["password"]

        if password != PASSWORD:
            return "Wrong password 💔"

        session["user"] = name
        return redirect("/chat")

    return render_template("login.html")


@app.route("/chat", methods=["GET", "POST"])
def chat():
    if "user" not in session:
        return redirect("/")

    conn = sqlite3.connect("chat.db")
    c = conn.cursor()

    if request.method == "POST":
        msg = request.form["message"]
        c.execute("INSERT INTO messages (user, message) VALUES (?, ?)",
                  (session["user"], msg))
        conn.commit()

    c.execute("SELECT user, message FROM messages")
    messages = c.fetchall()
    conn.close()

    return render_template("chat.html",
                           user=session["user"],
                           messages=messages)


if __name__ == "__main__":
    app.run(debug=True)
