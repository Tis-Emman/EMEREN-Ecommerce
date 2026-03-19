"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag, Users, TrendingUp, Clock,
  CheckCircle, Package, Briefcase, ArrowRight,
  AlertCircle,
} from "lucide-react";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
  deliveredCount: number;
  totalUsers: number;
  totalCareers: number;
  monthlyRevenue: { month: string; revenue: number }[];
  statusCounts: { status: string; count: number }[];
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  created_at: string;
  delivery_address: string;
  order_items: { product_name: string; quantity: number }[];
  profiles: { email: string; full_name: string | null } | null;
}

const STATUS_COLORS: Record<string, { bg: string; color: string; dot: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24", dot: "#f59e0b" },
  confirmed: { bg: "rgba(59,130,246,0.12)",  color: "#60a5fa", dot: "#3b82f6" },
  delivered: { bg: "rgba(34,197,94,0.12)",   color: "#4ade80", dot: "#22c55e" },
  installed: { bg: "rgba(99,102,241,0.12)",  color: "#818cf8", dot: "#6366f1" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   color: "#f87171", dot: "#ef4444" },
};

const fmt = (n: number) => `₱${n.toLocaleString()}`;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/orders").then(r => r.json()),
    ]).then(([statsJson, ordersJson]) => {
      if (statsJson.error) { setError(statsJson.error); return; }
      setStats(statsJson);
      setRecentOrders((ordersJson.orders ?? []).slice(0, 5));
    }).catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.2)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ padding: "24px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
      <AlertCircle size={18} color="#f87171" />
      <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>
    </div>
  );

  // Chart: find max revenue for bar scaling
  const maxRevenue = Math.max(...(stats?.monthlyRevenue.map(m => m.revenue) ?? [1]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page title */}
      <div>
        <h1 className="outfit" style={{ fontSize: "26px", fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Dashboard</h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>Welcome back. Here's what's happening with EMEREN.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {[
          { label: "Total Revenue",    value: fmt(stats?.totalRevenue ?? 0), icon: <TrendingUp size={18} />,  color: "#d97706", bg: "rgba(217,119,6,0.12)" },
          { label: "Total Orders",     value: stats?.totalOrders ?? 0,       icon: <ShoppingBag size={18} />, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
          { label: "Pending Orders",   value: stats?.pendingCount ?? 0,      icon: <Clock size={18} />,       color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
          { label: "Delivered",        value: stats?.deliveredCount ?? 0,    icon: <CheckCircle size={18} />, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
          { label: "Registered Users", value: stats?.totalUsers ?? 0,        icon: <Users size={18} />,       color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
          { label: "Career Applications", value: stats?.totalCareers ?? 0,  icon: <Briefcase size={18} />,   color: "#38bdf8", bg: "rgba(56,189,248,0.12)" },
        ].map((card, i) => (
          <div key={i} style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.5px" }}>{card.value}</p>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" }}>

        {/* Revenue chart */}
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "22px" }}>
          <h2 className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#f1f5f9", marginBottom: "20px" }}>Revenue — Last 6 Months</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "140px" }}>
            {stats?.monthlyRevenue.map((m) => {
              const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                    <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: pct > 0 ? "linear-gradient(180deg, #f59e0b, #d97706)" : "rgba(255,255,255,0.06)", height: `${Math.max(pct, 3)}%`, transition: "height .6s ease", position: "relative" }}>
                      {pct > 0 && (
                        <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", color: "#fbbf24", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {m.revenue >= 1000 ? `₱${(m.revenue / 1000).toFixed(0)}k` : `₱${m.revenue}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600 }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by status */}
        <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "22px" }}>
          <h2 className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#f1f5f9", marginBottom: "16px" }}>Orders by Status</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats?.statusCounts.map((s) => {
              const c = STATUS_COLORS[s.status];
              const total = stats.totalOrders || 1;
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "12px", color: c?.color ?? "#94a3b8", fontWeight: 600, textTransform: "capitalize" }}>{s.status}</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>{s.count}</span>
                  </div>
                  <div style={{ height: "5px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "3px", background: c?.dot ?? "#94a3b8", width: `${pct}%`, transition: "width .6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h2 className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#f1f5f9" }}>Recent Orders</h2>
          <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#d97706", textDecoration: "none", fontWeight: 600 }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", padding: "24px 0" }}>No orders yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 100px 90px", gap: "12px", padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "4px" }}>
              {["Order ID", "Customer", "Items", "Total", "Status"].map(h => (
                <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              ))}
            </div>
            {recentOrders.map((order) => {
              const c = STATUS_COLORS[order.status];
              const date = new Date(order.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
              const items = order.order_items.map(i => i.product_name).join(", ");
              return (
                <div key={order.id} style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 100px 90px", gap: "12px", padding: "12px", borderRadius: "10px", transition: "background .15s", cursor: "default" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>{date}</p>
                  </div>
                  <p style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", alignSelf: "center" }}>
                    {order.profiles?.email ?? "—"}
                  </p>
                  <p style={{ fontSize: "11px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", alignSelf: "center" }}>{items}</p>
                  <p className="outfit" style={{ fontSize: "13px", fontWeight: 800, color: "#f1f5f9", alignSelf: "center" }}>{fmt(order.total)}</p>
                  <div style={{ alignSelf: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 9px", borderRadius: "100px", fontSize: "10px", fontWeight: 700, background: c?.bg, color: c?.color, textTransform: "capitalize" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: c?.dot }} />
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { href: "/admin/orders",  label: "Manage Orders",       sub: "Update statuses, view details",       icon: <ShoppingBag size={20} />, color: "#d97706" },
          { href: "/admin/careers", label: "Career Applications", sub: "Review submitted applications",       icon: <Briefcase size={20} />,   color: "#38bdf8" },
        ].map((link) => (
          <Link key={link.href} href={link.href} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 20px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", textDecoration: "none", transition: "border-color .15s, background .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "#1e293b"; }}
          >
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${link.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", color: link.color, flexShrink: 0 }}>
              {link.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0" }}>{link.label}</p>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{link.sub}</p>
            </div>
            <ArrowRight size={16} color="#475569" />
          </Link>
        ))}
      </div>
    </div>
  );
}
