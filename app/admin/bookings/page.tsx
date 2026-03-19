"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Phone, MapPin, Clock, Search, RefreshCw, ChevronDown } from "lucide-react";

type Booking = {
  id: string;
  service_name: string;
  service_price: string;
  customer_name: string;
  phone: string;
  street: string;
  province: string;
  municipality: string;
  barangay: string;
  address: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  admin_notes: string;
  user_email: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  created_at: string;
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:     { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", label: "Pending" },
  confirmed:   { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa", label: "Confirmed" },
  "in-progress":{ bg: "rgba(139,92,246,0.15)", color: "#a78bfa", label: "In Progress" },
  completed:   { bg: "rgba(34,197,94,0.15)",   color: "#4ade80", label: "Completed" },
  cancelled:   { bg: "rgba(239,68,68,0.15)",   color: "#f87171", label: "Cancelled" },
};

const STATUS_OPTIONS = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = (b: Booking) => {
    setSelected(b);
    setAdminNotes(b.admin_notes ?? "");
    setNewStatus(b.status);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, status: newStatus, notes: adminNotes }),
    });
    await load();
    setSelected(null);
    setUpdating(false);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.customer_name?.toLowerCase().includes(q) ||
      b.service_name?.toLowerCase().includes(q) ||
      b.user_email?.toLowerCase().includes(q) ||
      b.phone?.includes(q);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = bookings.filter((b) => b.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .booking-row { cursor: pointer; transition: background .15s; }
        .booking-row:hover { background: rgba(255,255,255,0.04) !important; }
        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .filter-btn { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); transition: all .15s; }
        .filter-btn.active { border-color: #d97706; background: rgba(217,119,6,0.15); color: #fbbf24; }
        .filter-btn:not(.active) { background: rgba(255,255,255,0.04); color: #64748b; }
        .filter-btn:not(.active):hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; }
        .detail-row { display: flex; gap: 8px; margin-bottom: 10px; }
        .detail-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; min-width: 110px; padding-top: 1px; }
        .detail-value { font-size: 13px; color: #e2e8f0; font-weight: 500; }
        textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e2e8f0; font-size: 13px; padding: 10px 12px; resize: vertical; font-family: inherit; outline: none; }
        textarea:focus { border-color: #d97706; }
        select { appearance: none; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e2e8f0; font-size: 13px; padding: 9px 12px; width: 100%; font-family: inherit; outline: none; cursor: pointer; }
        select:focus { border-color: #d97706; }
        select option { background: #1e293b; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(217,119,6,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CalendarCheck size={20} color="#f59e0b" />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Service Bookings</h1>
            <p style={{ fontSize: "13px", color: "#64748b" }}>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={load}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map((s) => {
          const st = STATUS_STYLES[s];
          return (
            <div key={s} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 20px", minWidth: "110px" }}>
              <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{st.label}</p>
              <p style={{ fontSize: "24px", fontWeight: 800, color: st.color }}>{counts[s] ?? 0}</p>
            </div>
          );
        })}
      </div>

      {/* Filters + Search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, service, email, phone…"
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e2e8f0", fontSize: "13px", padding: "9px 12px 9px 34px", outline: "none", fontFamily: "inherit" }}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <button className={`filter-btn ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilterStatus("all")}>All ({bookings.length})</button>
          {STATUS_OPTIONS.map((s) => (
            <button key={s} className={`filter-btn ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>
              {STATUS_STYLES[s].label} ({counts[s] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <CalendarCheck size={40} color="#334155" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", fontSize: "14px" }}>No bookings found</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Customer", "Service", "Date & Time", "Location", "Status", "Submitted"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const st = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
                return (
                  <tr
                    key={b.id}
                    className="booking-row"
                    onClick={() => openDetail(b)}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: "transparent" }}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", marginBottom: "2px" }}>{b.customer_name}</p>
                      <p style={{ fontSize: "11px", color: "#64748b" }}>{b.user_email}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 600 }}>{b.service_name}</p>
                      <p style={{ fontSize: "11px", color: "#64748b" }}>{b.service_price}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 600 }}>{b.preferred_date}</p>
                      <p style={{ fontSize: "11px", color: "#64748b" }}>{b.preferred_time}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>{b.municipality}, {b.province}</p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <p style={{ fontSize: "12px", color: "#64748b" }}>{new Date(b.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            {/* Modal header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9", marginBottom: "2px" }}>{selected.customer_name}</h2>
                <p style={{ fontSize: "12px", color: "#64748b" }}>Booking ID: {selected.id.slice(0, 8)}…</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              {/* Service */}
              <div style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", color: "#d97706", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Service Requested</p>
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#fbbf24", marginBottom: "2px" }}>{selected.service_name}</p>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>{selected.service_price}</p>
              </div>

              {/* Customer details */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Customer Details</p>
                <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{selected.user_email}</span></div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={12} color="#64748b" /> {selected.phone}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value" style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <MapPin size={12} color="#64748b" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span>{selected.street && `${selected.street}, `}{selected.barangay}, {selected.municipality}, {selected.province}</span>
                  </span>
                </div>
                {selected.address && (
                  <div className="detail-row"><span className="detail-label">Landmark</span><span className="detail-value">{selected.address}</span></div>
                )}
              </div>

              {/* Schedule */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Schedule</p>
                <div className="detail-row">
                  <span className="detail-label">Date</span>
                  <span className="detail-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CalendarCheck size={12} color="#64748b" /> {selected.preferred_date}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time</span>
                  <span className="detail-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={12} color="#64748b" /> {selected.preferred_time}
                  </span>
                </div>
              </div>

              {/* Customer notes */}
              {selected.notes && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Customer Notes</p>
                  <p style={{ fontSize: "13px", color: "#94a3b8", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 12px" }}>{selected.notes}</p>
                </div>
              )}

              {/* Admin controls */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px" }}>
                <p style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Admin Actions</p>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Update Status</label>
                  <div style={{ position: "relative" }}>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{STATUS_STYLES[s].label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }} />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Admin Notes</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes (not visible to customer)…"
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#d97706", border: "none", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: updating ? "not-allowed" : "pointer", opacity: updating ? 0.7 : 1 }}
                  >
                    {updating ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ padding: "10px 20px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
