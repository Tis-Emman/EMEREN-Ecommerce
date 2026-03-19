"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, RefreshCw, Trash2, Reply } from "lucide-react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  created_at: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  unread:  { bg: "rgba(239,68,68,0.12)",   color: "#ef4444",  label: "Unread" },
  read:    { bg: "rgba(100,116,139,0.12)",  color: "#94a3b8",  label: "Read" },
  replied: { bg: "rgba(34,197,94,0.12)",    color: "#22c55e",  label: "Replied" },
};

export default function AdminMessagesPage() {
  const [messages, setMessages]       = useState<Message[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState<Message | null>(null);
  const [filter, setFilter]           = useState<"all" | "unread" | "read" | "replied">("all");
  const [updating, setUpdating]       = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: status as Message["status"] } : m));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: status as Message["status"] } : null);
    setUpdating(null);
  };

  const handleOpen = (msg: Message) => {
    setSelected(msg);
    if (msg.status === "unread") updateStatus(msg.id, "read");
  };

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div style={{ display: "flex", gap: "24px", height: "calc(100vh - 116px)" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .msg-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 12px; cursor: pointer; border: 1px solid transparent; transition: all .15s; }
        .msg-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); }
        .msg-row.active { background: rgba(217,119,6,0.1); border-color: rgba(217,119,6,0.25); }
        .filter-tab { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; transition: all .15s; font-family: inherit; }
        .status-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
      `}</style>

      {/* Left — message list */}
      <div style={{ width: "360px", flexShrink: 0, background: "#1e293b", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Messages</h2>
              {unreadCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "2px 7px", borderRadius: "10px" }}>{unreadCount}</span>
              )}
            </div>
            <button onClick={fetchMessages} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: "4px" }}>
              <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            </button>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(["all", "unread", "read", "replied"] as const).map((f) => (
              <button key={f} className="filter-tab"
                onClick={() => setFilter(f)}
                style={{ background: filter === f ? "rgba(217,119,6,0.15)" : "rgba(255,255,255,0.05)", color: filter === f ? "#fbbf24" : "#64748b" }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid rgba(217,119,6,0.3)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "40px", color: "#475569", fontSize: "13px" }}>No messages</div>
          ) : filtered.map((msg) => (
            <div key={msg.id} className={`msg-row ${selected?.id === msg.id ? "active" : ""}`} onClick={() => handleOpen(msg)}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                {msg.status === "unread" ? <Mail size={15} color="#fbbf24" /> : <MailOpen size={15} color="#64748b" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <span style={{ fontSize: "13px", fontWeight: msg.status === "unread" ? 700 : 600, color: msg.status === "unread" ? "#f1f5f9" : "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.name}</span>
                  <span style={{ fontSize: "10px", color: "#475569", flexShrink: 0, marginLeft: "8px" }}>{new Date(msg.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 3px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject}</p>
                <p style={{ fontSize: "11px", color: "#475569", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — message detail */}
      <div style={{ flex: 1, background: "#1e293b", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#475569" }}>
            <Mail size={40} strokeWidth={1.5} />
            <p style={{ fontSize: "14px", fontWeight: 600 }}>Select a message to read</p>
          </div>
        ) : (
          <>
            {/* Detail header */}
            <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>{selected.subject}</h3>
                <span className="status-badge" style={{ background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].color, flexShrink: 0 }}>
                  {STATUS_COLORS[selected.status].label}
                </span>
              </div>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>From</p>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{selected.name} — <a href={`mailto:${selected.email}`} style={{ color: "#d97706", textDecoration: "none" }}>{selected.email}</a></p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>Received</p>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>{new Date(selected.created_at).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
              </div>
            </div>

            {/* Message body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <p style={{ fontSize: "15px", color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>{selected.message}</p>
            </div>

            {/* Actions */}
            <div style={{ padding: "16px 28px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                onClick={() => updateStatus(selected.id, "replied")}
                style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", background: "#d97706", color: "#fff", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none", transition: "background .15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
              >
                <Reply size={14} /> Reply via Email
              </a>
              {selected.status !== "replied" && (
                <button
                  onClick={() => updateStatus(selected.id, "replied")}
                  disabled={updating === selected.id}
                  style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Mark as Replied
                </button>
              )}
              {selected.status !== "read" && selected.status !== "replied" && (
                <button
                  onClick={() => updateStatus(selected.id, "read")}
                  disabled={updating === selected.id}
                  style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 18px", background: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.2)", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
