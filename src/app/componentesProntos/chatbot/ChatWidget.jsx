"use client";

import { useState } from "react";
import "./Chatbot.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  function toggleChat() {
    setOpen(!open);
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erro na API:", errorText);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Ocorreu um erro ao processar sua mensagem.",
        },
      ]);

      return;
    }

    const data = await res.json();
    const botMsg = { from: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  }

  return (
    <>
      <button className="chatbot-button" onClick={toggleChat}>
        💬
      </button>

      {open && (
        <div className="chatbot-container">
          <div className="chatbot-header">Assistente Virtual</div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "message-user" : "message-bot"}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Digite sua pergunta..."
            />

            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}
