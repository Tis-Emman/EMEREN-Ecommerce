"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, SlidersHorizontal, ChevronDown, Check,
  Loader2, RefreshCw, AlertCircle, X,
} from "lucide-react";

interface OrderItem { product_name: string; quantity: number; price: number; brand: string; variant_hp: string; }
interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  promo_discount: number;
  delivery_fee: number;
  delivery_address: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
  order_items: OrderItem[];
  profiles: { email: string; full_name: string | null } | null;
}

const STATUSES = ["all", "pending", "confirmed", "delivered", "installed", "cancelled"];

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24", dot: "#f59e0b" },
  confirmed: { bg: "rgba(59,130,246,0.12)",  color: "#60a5fa", dot: "#3b82f6" },
  delivered: { bg: "rgba(34,197,94,0.12)",   color: "#4ade80", dot: "#22c55e" },
  installed: { bg: "rgba(99,102,241,0.12)",  color: "#818cf8", dot: "#6366f1" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   color: "#f87171", dot: "#ef4444" },
};

const fmt = (n: number) => `₱${n.toLocaleString()}`;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchOrders = async (status = filterStatus) => {
    setLoading(true);
    const url = status === "all" ? "/api/admin/orders" : `/api/admin/orders?status=${status}`;
    const res = await fetch(url);
    const json = await res.json();
    setOrders(json.orders ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    fetchOrders(status);
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    setStatusDropdown(null);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    const json = await res.json();
    if (json.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setToast({ msg: `Order status updated to "${newStatus}"`, type: "success" });
    } else {
      setToast({ msg: json.error ?? "Failed to update status", type: "error" });
    }
    setUpdating(null);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return (
      o.id.includes(q) ||
      (o.profiles?.email ?? "").toLowerCase().includes(q) ||
      o.delivery_address.toLowerCase().includes(q) ||
      o.order_items.some(i => i.product_name.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .order-row { padding: 14px 16px; border-radius: 10px; transition: background .15s; cursor: pointer; }
        .order-row:hover { background: rgba(255,255,255,0.03); }
        .status-dropdown { position: absolute; top: calc(100% + 6px); right: 0; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 6px; min-width: 160px; z-index: 50; animation: slideDown .15s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
        .status-opt { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .12s; border: none; background: none; width: 100%; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; color: #94a3b8; text-transform: capitalize; }
        .status-opt:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
        .detail-panel { background: rgba(255,255,255,0.025); border-top: 1px solid rgba(255,255,255,0.06); padding: 16px; animation: fadeUp .2s ease; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 100, padding: "12px 18px", borderRadius: "12px", background: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, color: toast.type === "success" ? "#4ade80" : "#f87171", fontSize: "13px", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: "8px", animation: "fadeUp .2s ease" }}>
          {toast.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="outfit" style={{ fontSize: "24px", fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Orders</h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{orders.length} total orders</p>
        </div>
        <button onClick={() => fetchOrders()} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)"; e.currentTarget.style.color = "#fbbf24"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            placeholder="Search orders, emails, products…"
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

        {/* Status filter pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {STATUSES.map(s => {
            const c = STATUS_COLORS[s];
            const active = filterStatus === s;
            return (
              <button key={s} onClick={() => handleFilterChange(s)} style={{ padding: "7px 14px", borderRadius: "100px", border: `1px solid ${active ? (c?.dot ?? "#d97706") : "rgba(255,255,255,0.08)"}`, background: active ? (c?.bg ?? "rgba(217,119,6,0.12)") : "transparent", color: active ? (c?.color ?? "#fbbf24") : "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize", transition: "all .15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
        {/* Header row */}
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 130px 90px 130px 120px", gap: "12px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          {["Order ID", "Customer", "Items", "Total", "Status", "Action"].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
            <Loader2 size={24} color="#d97706" style={{ animation: "spin .8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "48px", color: "#475569", fontSize: "14px" }}>No orders found.</p>
        ) : (
          <div>
            {filtered.map(order => {
              const c = STATUS_COLORS[order.status];
              const date = new Date(order.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
              const itemNames = order.order_items.map(i => `${i.product_name} ×${i.quantity}`).join(", ");
              const isExpanded = expandedId === order.id;

              return (
                <div key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {/* Main row */}
                  <div
                    className="order-row"
                    style={{ display: "grid", gridTemplateColumns: "160px 1fr 130px 90px 130px 120px", gap: "12px", alignItems: "center" }}
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>{date}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.profiles?.email ?? "—"}
                      </p>
                      {order.profiles?.full_name && (
                        <p style={{ fontSize: "10px", color: "#475569", marginTop: "1px" }}>{order.profiles.full_name}</p>
                      )}
                    </div>
                    <p style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemNames}</p>
                    <p className="outfit" style={{ fontSize: "13px", fontWeight: 800, color: "#f1f5f9" }}>{fmt(order.total)}</p>

                    {/* Status badge */}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, background: c?.bg, color: c?.color, textTransform: "capitalize", whiteSpace: "nowrap", width: "fit-content" }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: c?.dot, flexShrink: 0 }} />
                      {order.status}
                    </span>

                    {/* Status updater */}
                    <div style={{ position: "relative" }} ref={statusDropdown === order.id ? dropdownRef : undefined} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setStatusDropdown(statusDropdown === order.id ? null : order.id)}
                        disabled={updating === order.id}
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all .15s", whiteSpace: "nowrap" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)"; e.currentTarget.style.color = "#fbbf24"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
                      >
                        {updating === order.id
                          ? <Loader2 size={11} style={{ animation: "spin .8s linear infinite" }} />
                          : <><SlidersHorizontal size={11} /> Update <ChevronDown size={10} /></>}
                      </button>

                      {statusDropdown === order.id && (
                        <div className="status-dropdown">
                          {STATUSES.filter(s => s !== "all" && s !== order.status).map(s => {
                            const sc = STATUS_COLORS[s];
                            return (
                              <button key={s} className="status-opt" onClick={() => updateStatus(order.id, s)}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sc?.dot, flexShrink: 0 }} />
                                <span style={{ color: sc?.color }}>{s}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="detail-panel">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                        {/* Items */}
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>Items</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {order.order_items.map((item, i) => (
                              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                                <div>
                                  <p style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: 600 }}>{item.product_name}</p>
                                  <p style={{ fontSize: "10px", color: "#475569" }}>{item.brand} · {item.variant_hp} · ×{item.quantity}</p>
                                </div>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", flexShrink: 0 }}>{fmt(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery */}
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>Delivery</p>
                          <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}>{order.delivery_address}</p>
                          <p style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>Payment: <span style={{ color: "#94a3b8", textTransform: "capitalize" }}>{order.payment_method.replace("_", " ")}</span></p>
                          {order.notes && <p style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Notes: <span style={{ color: "#94a3b8" }}>{order.notes}</span></p>}
                        </div>

                        {/* Totals */}
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>Breakdown</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {[
                              { label: "Subtotal",        value: fmt(order.subtotal) },
                              ...(order.promo_discount > 0 ? [{ label: "Promo discount", value: `−${fmt(order.promo_discount)}` }] : []),
                              { label: "Delivery",        value: order.delivery_fee === 0 ? "FREE" : fmt(order.delivery_fee) },
                            ].map(row => (
                              <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "12px", color: "#475569" }}>{row.label}</span>
                                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{row.value}</span>
                              </div>
                            ))}
                            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span className="outfit" style={{ fontSize: "13px", fontWeight: 800, color: "#f1f5f9" }}>Total</span>
                              <span className="outfit" style={{ fontSize: "13px", fontWeight: 900, color: "#fbbf24" }}>{fmt(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
