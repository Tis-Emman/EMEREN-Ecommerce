"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "What HP do I need for my room?",
  "How much is AC cleaning?",
  "Do you offer free diagnosis?",
  "How do I book a service?",
];

export default function AiChatBubble() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(true);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.content ?? "Sorry, I couldn't get a response. Please try again." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (text: string) => {
    // Convert **bold** and basic line breaks
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <>
      <style>{`
        @keyframes bubblePop { from { opacity: 0; transform: scale(0.85) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .chat-window {
          position: fixed; bottom: 88px; right: 24px; z-index: 9999;
          width: min(380px, calc(100vw - 32px));
          background: #fff; border-radius: 20px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
          display: flex; flex-direction: column; overflow: hidden;
          animation: bubblePop .25s cubic-bezier(.22,1,.36,1) both;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          max-height: min(560px, calc(100vh - 120px));
        }
        .chat-header {
          background: linear-gradient(135deg, #d97706, #f59e0b);
          padding: 16px 18px; display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }
        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px;
          background: #f8f7f4;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .msg { animation: msgIn .2s ease both; max-width: 85%; line-height: 1.55; font-size: 13.5px; }
        .msg-user { align-self: flex-end; background: #d97706; color: #fff; padding: 10px 14px; border-radius: 16px 16px 4px 16px; }
        .msg-assistant { align-self: flex-start; background: #fff; color: #1a1a2e; padding: 10px 14px; border-radius: 16px 16px 16px 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .typing-dot { width: 7px; height: 7px; border-radius: 50%; background: #94a3b8; animation: pulse 1.2s ease infinite; }
        .typing-dot:nth-child(2) { animation-delay: .2s; }
        .typing-dot:nth-child(3) { animation-delay: .4s; }
        .chat-input-row {
          display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid #f0f0f0;
          background: #fff; flex-shrink: 0;
        }
        .chat-input {
          flex: 1; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 9px 12px;
          font-size: 13px; font-family: inherit; outline: none; color: #1a1a2e;
          transition: border-color .15s;
        }
        .chat-input:focus { border-color: #d97706; }
        .send-btn {
          width: 36px; height: 36px; border-radius: 10px; background: #d97706; border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background .15s; flex-shrink: 0;
        }
        .send-btn:hover { background: #b45309; }
        .send-btn:disabled { background: #e5e7eb; cursor: not-allowed; }
        .fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(217,119,6,0.45);
          display: flex; align-items: center; justify-content: center;
          transition: transform .2s, box-shadow .2s;
        }
        .fab:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(217,119,6,0.55); }
        .fab-badge {
          position: absolute; top: -2px; right: -2px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #ef4444; border: 2px solid #fff;
          font-size: 9px; font-weight: 800; color: #fff;
          display: flex; align-items: center; justify-content: center;
        }
        .suggestion-btn {
          padding: 6px 12px; border-radius: 20px; border: 1.5px solid #e5e7eb;
          background: #fff; font-size: 12px; color: #374151; cursor: pointer;
          font-family: inherit; font-weight: 600; transition: all .15s; white-space: nowrap;
        }
        .suggestion-btn:hover { border-color: #d97706; color: #d97706; background: rgba(217,119,6,0.05); }
      `}</style>

      {/* Chat window */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10a9.96 9.96 0 0 1-5.35-1.55L2 22l1.55-4.65A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: 800, color: "#fff", margin: 0 }}>EMEREN Assistant</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", margin: 0 }}>Powered by Gemini · Always here to help</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "8px", width: "28px", height: "28px", cursor: "pointer", color: "#fff", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {/* Welcome */}
            {messages.length === 0 && (
              <div style={{ animation: "msgIn .3s ease both" }}>
                <div className="msg msg-assistant" style={{ maxWidth: "100%" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Hi! I'm your EMEREN Assistant 👋</p>
                  <p style={{ margin: 0, color: "#4b5563" }}>I can help you find the right aircon, check our services, or answer any questions.</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} className="suggestion-btn" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "msg-user" : "msg-assistant"}`}>
                {m.content.split("\n").map((line, j) => (
                  <span key={j}>
                    {renderContent(line)}
                    {j < m.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="msg msg-assistant" style={{ display: "flex", gap: "5px", alignItems: "center", padding: "12px 14px" }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick links */}
          <div style={{ padding: "8px 14px", background: "#fff", borderTop: "1px solid #f0f0f0", display: "flex", gap: "8px", flexShrink: 0 }}>
            <Link href="/shop" onClick={() => setOpen(false)} style={{ fontSize: "11px", color: "#d97706", fontWeight: 700, textDecoration: "none", padding: "4px 10px", borderRadius: "6px", background: "rgba(217,119,6,0.08)" }}>🛒 Shop</Link>
            <Link href="/services" onClick={() => setOpen(false)} style={{ fontSize: "11px", color: "#d97706", fontWeight: 700, textDecoration: "none", padding: "4px 10px", borderRadius: "6px", background: "rgba(217,119,6,0.08)" }}>🔧 Services</Link>
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask me anything…"
            />
            <button className="send-btn" onClick={() => send(input)} disabled={loading || !input.trim()}>
              {loading
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" style={{ animation: "spin .8s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              }
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setOpen((o) => !o)} aria-label="Open chat assistant">
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10a9.96 9.96 0 0 1-5.35-1.55L2 22l1.55-4.65A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2z"/></svg>
        }
        {unread && !open && <span className="fab-badge">1</span>}
      </button>
    </>
  );
}
