"use client";

import { useState, useEffect } from "react";
import { Search, X, Mail, Phone, Briefcase, Calendar, AlertCircle, RefreshCw, Download } from "lucide-react";

interface Application {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: string;
  submitted_at: string;
}

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  "AC Technician":         { bg: "rgba(56,189,248,0.12)",  color: "#38bdf8" },
  "Delivery Rider":        { bg: "rgba(34,197,94,0.12)",   color: "#4ade80" },
  "Sales Representative":  { bg: "rgba(217,119,6,0.12)",   color: "#fbbf24" },
  "Customer Support":      { bg: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
  "Admin Staff":           { bg: "rgba(251,146,60,0.12)",  color: "#fb923c" },
};

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/careers");
    const json = await res.json();
    if (json.error) { setError(json.error); setLoading(false); return; }
    setApplications(json.applications ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

  const roles = ["all", ...Array.from(new Set(applications.map(a => a.role)))];

  const filtered = applications.filter(a => {
    const q = search.toLowerCase();
    const matchSearch =
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.contact.includes(q) ||
      a.role.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const exportCSV = () => {
    const header = "Name,Email,Contact,Role,Submitted At";
    const rows = filtered.map(a =>
      `"${a.name}","${a.email}","${a.contact}","${a.role}","${new Date(a.submitted_at).toLocaleString("en-PH")}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `emeren-careers-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .app-card { background: #1e293b; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 18px 20px; transition: border-color .15s, background .15s; animation: fadeUp .3s ease both; }
        .app-card:hover { border-color: rgba(217,119,6,0.2); background: rgba(255,255,255,0.02); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="outfit" style={{ fontSize: "24px", fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Career Applications</h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{applications.length} total submissions</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={fetchApplications} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)"; e.currentTarget.style.color = "#fbbf24"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={exportCSV} disabled={filtered.length === 0} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", borderRadius: "10px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.1)", color: "#fbbf24", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(217,119,6,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(217,119,6,0.1)"; }}
          >
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            placeholder="Search name, email, contact, role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 34px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex" }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {roles.map(r => {
            const c = ROLE_COLORS[r];
            const active = roleFilter === r;
            return (
              <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: "7px 13px", borderRadius: "100px", border: `1px solid ${active ? (c?.color ?? "#d97706") + "60" : "rgba(255,255,255,0.08)"}`, background: active ? (c?.bg ?? "rgba(217,119,6,0.12)") : "transparent", color: active ? (c?.color ?? "#fbbf24") : "#64748b", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>
                {r === "all" ? "All Roles" : r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary chips */}
      {applications.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Array.from(new Set(applications.map(a => a.role))).map(role => {
            const count = applications.filter(a => a.role === role).length;
            const c = ROLE_COLORS[role];
            return (
              <div key={role} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: c?.bg ?? "rgba(255,255,255,0.06)", border: `1px solid ${c?.color ?? "#64748b"}30` }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: c?.color ?? "#94a3b8" }}>{role}</span>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>×{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
          <AlertCircle size={16} color="#f87171" />
          <p style={{ color: "#f87171", fontSize: "13px" }}>{error}</p>
        </div>
      )}

      {/* Cards grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.2)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <Briefcase size={36} color="#334155" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#475569", fontSize: "14px" }}>No applications found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
          {filtered.map((app, i) => {
            const c = ROLE_COLORS[app.role];
            const date = new Date(app.submitted_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
            const time = new Date(app.submitted_at).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={app.id} className="app-card" style={{ animationDelay: `${i * 0.04}s` }}>
                {/* Top: name + role */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: c?.bg ?? "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                      {app.name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0" }}>{app.name}</p>
                    </div>
                  </div>
                  <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, background: c?.bg ?? "rgba(255,255,255,0.06)", color: c?.color ?? "#94a3b8", whiteSpace: "nowrap", border: `1px solid ${c?.color ?? "#64748b"}30` }}>
                    {app.role}
                  </span>
                </div>

                {/* Contact info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <a href={`mailto:${app.email}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={12} color="#64748b" />
                    </div>
                    <span style={{ fontSize: "12px", color: "#94a3b8", transition: "color .15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                    >{app.email}</span>
                  </a>
                  <a href={`tel:${app.contact}`} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Phone size={12} color="#64748b" />
                    </div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{app.contact}</span>
                  </a>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Calendar size={12} color="#64748b" />
                    </div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{date} · {time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <a href={`mailto:${app.email}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "8px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", color: "#fbbf24", fontSize: "11px", fontWeight: 700, textDecoration: "none", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,119,6,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(217,119,6,0.1)")}
                  >
                    <Mail size={11} /> Email Applicant
                  </a>
                  <a href={`tel:${app.contact}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "11px", fontWeight: 700, textDecoration: "none", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  >
                    <Phone size={11} /> Call
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
