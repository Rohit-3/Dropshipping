"use client";
import { useState, useRef } from "react";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "AIzaSyD-cCt2iDbmZebHWoT0ZbKp9BITlMt2I0E";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GOOGLE_API_KEY;

export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm EasyBuy AI. Ask me anything about our products, your orders, or shopping help!" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: "user", text: input }]);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }],
        }),
      });
      const data = await res.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't find an answer.";
      setMessages(msgs => [...msgs, { role: "assistant", text: aiText }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { role: "assistant", text: "Sorry, there was an error. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    }
  }

  return (
    <div>
      {/* Floating chat button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:bg-blue-800 transition"
        onClick={() => setOpen(o => !o)}
        aria-label="Open AI Chat Assistant"
      >
        💬
      </button>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          <div className="p-4 border-b font-bold text-blue-700 flex items-center justify-between">
            EasyBuy AI Assistant
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">×</button>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span className={msg.role === "user" ? "inline-block bg-blue-100 text-blue-900 rounded-lg px-3 py-2 my-1" : "inline-block bg-gray-100 text-gray-800 rounded-lg px-3 py-2 my-1"}>
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm">EasyBuy AI is typing...</div>}
          </div>
          <form
            className="flex border-t"
            onSubmit={() => {
              sendMessage();
            }}
          >
            <input
              className="flex-1 px-3 py-2 rounded-bl-xl outline-none"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded-br-xl hover:bg-blue-800 disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 