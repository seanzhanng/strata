"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Strata Chat</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-2xl p-3 rounded-lg ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-neutral-800 text-neutral-100"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-neutral-800 text-neutral-400 p-3 rounded-lg">
            Thinking...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about NYC taxi data..."
          className="flex-1 p-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}