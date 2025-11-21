"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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
      { from: "bot", text: "Ocorreu um erro ao processar sua mensagem." }
    ]);

    return; 
  }

  const data = await res.json();

  const botMsg = { from: "bot", text: data.reply };
  setMessages((prev) => [...prev, botMsg]);

  setInput("");
}


  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 320,
        padding: 12,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 0 12px rgba(0,0,0,0.2)",
        fontFamily: "sans-serif"
      }}
    >
      <div
        style={{
          height: 250,
          overflowY: "auto",
          padding: 8,
          marginBottom: 8,
          border: "1px solid #ddd",
          borderRadius: 8
        }}
      >
        {messages.map((m, i) => (
          <p key={i} style={{ marginBottom: 10 }}>
            <strong>{m.from === "user" ? "Você" : "Assistente"}:</strong>{" "}
            {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Digite sua pergunta..."
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 8,
          border: "1px solid #ccc"
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginTop: 8,
          width: "100%",
          padding: 8,
          borderRadius: 8,
          background: "#3b82f6",
          color: "#fff",
          border: "none"
        }}
      >
        Enviar
      </button>
    </div>
  );
}
