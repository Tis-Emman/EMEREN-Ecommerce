"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Triangle,
  ArrowRight,
  ShoppingCart,
  User,
  Package,
  Shield,
  MapPin,
  Bell,
  LogOut,
  ChevronRight,
  Edit3,
  Check,
  X,
  Star,
  Truck,
  Clock,
  Wrench,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: <User size={15} /> },
  { id: "orders", label: "Orders", icon: <Package size={15} /> },
  { id: "warranties", label: "Warranties", icon: <Shield size={15} /> },
  { id: "addresses", label: "Addresses", icon: <MapPin size={15} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  { id: "security", label: "Security", icon: <Lock size={15} /> },
];

const ORDERS = [
  { id: "ORD-2025-001", date: "March 5, 2025", items: ["FrostLine Pro 1.5HP"], total: 35000, status: "Delivered", statusColor: "#22c55e" },
  { id: "ORD-2025-002", date: "Feb 18, 2025", items: ["PolarMax Cassette 2.5HP", "ArcticBreeze Portable 1.0HP"], total: 90500, status: "Installed", statusColor: "#3b82f6" },
  { id: "ORD-2024-089", date: "Dec 12, 2024", items: ["FrostLine Pro 1.0HP"], total: 28500, status: "Delivered", statusColor: "#22c55e" },
  { id: "ORD-2024-071", date: "Nov 3, 2024", items: ["ArcticBreeze Split 1.0HP"], total: 22000, status: "Delivered", statusColor: "#22c55e" },
];

const WARRANTIES = [
  { id: 1, product: "FrostLine Pro 1.5HP", purchased: "March 5, 2025", expires: "March 5, 2027", status: "Active", daysLeft: 726 },
  { id: 2, product: "PolarMax Cassette 2.5HP", purchased: "Feb 18, 2025", expires: "Feb 18, 2027", status: "Active", daysLeft: 709 },
  { id: 3, product: "FrostLine Pro 1.0HP", purchased: "Dec 12, 2024", expires: "Dec 12, 2026", status: "Active", daysLeft: 641 },
  { id: 4, product: "ArcticBreeze Split 1.0HP", purchased: "Nov 3, 2024", expires: "Nov 3, 2026", status: "Active", daysLeft: 602 },
];

export default function ProfilePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    warrantyAlerts: true,
    promotions: false,
    newsletter: true,
    serviceReminders: true,
  });

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        // Not logged in — redirect to sign in
        router.push("/auth/signin");
        return;
      }

      const email = data.user.email ?? "";
      const meta = data.user.user_metadata ?? {};
      const fullName: string = meta.full_name ?? meta.name ?? "";
      const [firstName = "", ...rest] = fullName.split(" ");
      const lastName = rest.join(" ");

      const profileData = {
        firstName: firstName || email.split("@")[0],
        lastName: lastName || "",
        email,
        phone: meta.phone ?? "",
        address: meta.address ?? "",
      };

      setProfile(profileData);
      setTempProfile(profileData);
      setLoading(false);
    });
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.2)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const saveField = (field: string) => {
    setProfile((prev) => ({ ...prev, [field]: tempProfile[field as keyof typeof tempProfile] }));
    setEditingField(null);
  };

  const cancelEdit = (field: string) => {
    setTempProfile((prev) => ({ ...prev, [field]: profile[field as keyof typeof profile] }));
    setEditingField(null);
  };

  const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .brand  { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .outfit { font-family: 'Outfit', sans-serif; }

        .glass {
          background: rgba(248,247,244,0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }

        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }

        .sidebar-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all .2s;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sidebar-tab:hover { background: rgba(0,0,0,0.04); color: #1a1a2e; }
        .sidebar-tab.active { background: rgba(217,119,6,0.1); color: #d97706; }
        .sidebar-tab.active svg { color: #d97706; }

        .card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          animation: fadeUp .4s ease both;
        }

        .edit-input {
          flex: 1;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1.5px solid #d97706;
          background: #fff;
          font-size: 14px;
          color: #1a1a2e;
          outline: none;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          gap: 12px;
        }
        .field-row:last-child { border-bottom: none; }

        .edit-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          padding: 5px;
          border-radius: 7px;
          transition: color .15s, background .15s;
          flex-shrink: 0;
        }
        .edit-btn:hover { color: #d97706; background: rgba(217,119,6,0.08); }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }

        .order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.07);
          background: #fafafa;
          gap: 12px;
          transition: border-color .2s, background .2s;
          cursor: pointer;
        }
        .order-row:hover { border-color: rgba(217,119,6,.25); background: #fffbf2; }

        .toggle {
          width: 42px;
          height: 24px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: background .2s;
          position: relative;
          flex-shrink: 0;
        }
        .toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transition: left .2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .toggle.on { background: #d97706; }
        .toggle.on::after { left: 21px; }
        .toggle.off { background: #d1d5db; }
        .toggle.off::after { left: 3px; }

        .warranty-bar-bg {
          height: 6px;
          border-radius: 3px;
          background: rgba(0,0,0,0.07);
          overflow: hidden;
          margin-top: 8px;
        }
        .warranty-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #d97706, #fbbf24);
          transition: width .8s ease;
        }

        .save-btn {
          padding: 7px 14px;
          border-radius: 8px;
          background: #d97706;
          color: #fff;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background .15s;
        }
        .save-btn:hover { background: #b45309; }

        .cancel-btn {
          padding: 7px 10px;
          border-radius: 8px;
          background: transparent;
          color: #9ca3af;
          border: 1.5px solid rgba(0,0,0,0.1);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all .15s;
        }
        .cancel-btn:hover { border-color: rgba(0,0,0,0.2); color: #374151; }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? undefined : "1px solid transparent" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800 }}>EMEREN</span>
            </Link>

            <nav style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
              {[["Products", "/shop"], ["Features", "/#features"], ["About", "/#about"], ["Contact", "/#contact"]].map(([label, href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/cart" style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.4)"; e.currentTarget.style.background = "#fffbf2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.background = "#fff"; }}
              >
                <ShoppingCart size={17} color="#374151" />
              </Link>
              {/* Profile avatar (active state) */}
              <Link href="/profile" style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 3px 10px rgba(217,119,6,0.3)", border: "2px solid #d97706", textDecoration: "none" }}>
                {profile.firstName ? profile.firstName[0].toUpperCase() : <User size={16} color="#fff" />}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 24px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px", alignItems: "start" }}>

        {/* ── Sidebar ── */}
        <div style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "6px" }}>

          {/* Profile card */}
          <div className="card" style={{ textAlign: "center", marginBottom: "8px", padding: "20px" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: "12px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 auto", boxShadow: "0 4px 14px rgba(217,119,6,0.3)" }}>
                {profile.firstName ? profile.firstName[0].toUpperCase() : "?"}
              </div>
              <button style={{ position: "absolute", bottom: 0, right: 0, width: "22px", height: "22px", borderRadius: "50%", background: "#d97706", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={10} color="#fff" />
              </button>
            </div>
            <p className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a2e", marginBottom: "2px" }}>{profile.firstName} {profile.lastName}</p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{profile.email}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "8px", padding: "3px 10px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}>
              <Star size={10} color="#d97706" fill="#d97706" />
              <span style={{ fontSize: "11px", color: "#d97706", fontWeight: 700 }}>Member</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="card" style={{ padding: "8px" }}>
            {TABS.map((tab) => (
              <button key={tab.id} className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sign out */}
          <button className="sidebar-tab" style={{ marginTop: "4px", color: "#ef4444" }}
            onClick={handleSignOut}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#ef4444"; }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", animation: "fadeUp .4s ease both" }}>
                {[
                  { icon: <Package size={18} color="#d97706" />, label: "Total Orders", value: "4" },
                  { icon: <Shield size={18} color="#3b82f6" />, label: "Active Warranties", value: "4" },
                  { icon: <Truck size={18} color="#22c55e" />, label: "Delivered", value: "3" },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: "14px", animationDelay: `${i * 0.08}s` }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal info */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>Personal Information</h2>
                </div>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>Manage your personal details</p>

                {[
                  { key: "firstName", label: "First Name", icon: <User size={14} color="#9ca3af" /> },
                  { key: "lastName", label: "Last Name", icon: <User size={14} color="#9ca3af" /> },
                  { key: "email", label: "Email", icon: <Mail size={14} color="#9ca3af" /> },
                  { key: "phone", label: "Phone", icon: <Phone size={14} color="#9ca3af" /> },
                ].map(({ key, label, icon }) => (
                  <div key={key} className="field-row">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "130px" }}>
                      {icon}
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                    </div>
                    {editingField === key ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        <input
                          className="edit-input"
                          value={tempProfile[key as keyof typeof tempProfile]}
                          onChange={(e) => setTempProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                          autoFocus
                        />
                        <button className="save-btn" onClick={() => saveField(key)}><Check size={12} /> Save</button>
                        <button className="cancel-btn" onClick={() => cancelEdit(key)}><X size={12} /></button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "14px", color: "#1a1a2e", fontWeight: 500 }}>{profile[key as keyof typeof profile]}</span>
                        <button className="edit-btn" onClick={() => { setEditingField(key); setTempProfile({ ...profile }); }}>
                          <Edit3 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} style={{ fontSize: "12px", color: "#d97706", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {ORDERS.slice(0, 2).map((order) => (
                    <div key={order.id} className="order-row">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginBottom: "3px" }}>{order.id}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af" }}>{order.items.join(", ")}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="status-badge" style={{ background: `${order.statusColor}15`, color: order.statusColor, border: `1px solid ${order.statusColor}30`, marginBottom: "4px", display: "inline-flex" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: order.statusColor }} />
                          {order.status}
                        </span>
                        <p className="outfit" style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a2e" }}>{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Orders ── */}
          {activeTab === "orders" && (
            <div className="card">
              <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Order History</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>All your past and current orders</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {ORDERS.map((order, i) => (
                  <div key={order.id} className="order-row" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(217,119,6,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "22px" }}>❄️</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginBottom: "2px" }}>{order.id}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                        <p style={{ fontSize: "12px", color: "#6b7280" }}>{order.items.join(", ")}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span className="status-badge" style={{ background: `${order.statusColor}15`, color: order.statusColor, border: `1px solid ${order.statusColor}30`, marginBottom: "6px", display: "inline-flex" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: order.statusColor }} />
                        {order.status}
                      </span>
                      <p className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>{formatPrice(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Warranties ── */}
          {activeTab === "warranties" && (
            <div className="card">
              <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Warranty Tracker</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>All units under warranty coverage</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {WARRANTIES.map((w, i) => (
                  <div key={w.id} style={{ padding: "16px", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa", animationDelay: `${i * 0.07}s` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: "18px" }}>❄️</span>
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e", marginBottom: "2px" }}>{w.product}</p>
                          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Purchased {w.purchased}</p>
                        </div>
                      </div>
                      <span className="status-badge" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                        {w.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>Expires {w.expires}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706" }}>{w.daysLeft} days left</span>
                    </div>
                    <div className="warranty-bar-bg">
                      <div className="warranty-bar-fill" style={{ width: `${Math.min((w.daysLeft / 730) * 100, 100)}%` }} />
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                      <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", color: "#d97706", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <Wrench size={12} /> Request Service
                      </button>
                      <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(0,0,0,0.1)", color: "#6b7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Addresses ── */}
          {activeTab === "addresses" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Saved Addresses</h2>
                  <p style={{ fontSize: "13px", color: "#9ca3af" }}>Manage your delivery addresses</p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "#d97706", color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                  + Add Address
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Home", address: "123 Rizal St., Barangay Pinyahan, Quezon City, Metro Manila 1100", default: true },
                  { label: "Office", address: "45F BGC Tower, 32nd St., Bonifacio Global City, Taguig, Metro Manila 1634", default: false },
                ].map((addr, i) => (
                  <div key={i} style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${addr.default ? "rgba(217,119,6,0.3)" : "rgba(0,0,0,0.07)"}`, background: addr.default ? "rgba(217,119,6,0.03)" : "#fafafa" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e" }}>{addr.label}</span>
                        {addr.default && (
                          <span style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", fontSize: "10px", fontWeight: 700, color: "#d97706" }}>Default</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className="edit-btn"><Edit3 size={13} /></button>
                        {!addr.default && <button className="edit-btn" style={{ color: "#d1d5db" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}><X size={13} /></button>}
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>{addr.address}</p>
                    {!addr.default && (
                      <button style={{ marginTop: "10px", fontSize: "12px", color: "#d97706", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Set as default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <div className="card">
              <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Notification Preferences</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>Choose what updates you want to receive</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { key: "orderUpdates", label: "Order Updates", desc: "Shipping, delivery, and installation status" },
                  { key: "warrantyAlerts", label: "Warranty Alerts", desc: "Expiry reminders and service due dates" },
                  { key: "serviceReminders", label: "Service Reminders", desc: "Annual maintenance and cleaning reminders" },
                  { key: "promotions", label: "Promotions & Deals", desc: "Exclusive member discounts and flash sales" },
                  { key: "newsletter", label: "Newsletter", desc: "Monthly tips, product launches, and news" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="field-row">
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", marginBottom: "2px" }}>{label}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>{desc}</p>
                    </div>
                    <button
                      className={`toggle ${notifications[key as keyof typeof notifications] ? "on" : "off"}`}
                      onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {activeTab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="card">
                <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Change Password</h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>Keep your account secure</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "Current Password", placeholder: "Enter current password" },
                    { label: "New Password", placeholder: "Min. 8 characters" },
                    { label: "Confirm New Password", placeholder: "Repeat new password" },
                  ].map(({ label, placeholder }, i) => (
                    <div key={i}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{label}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder={placeholder}
                          style={{ width: "100%", padding: "11px 40px 11px 14px", borderRadius: "11px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "14px", color: "#1a1a2e", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "border-color .2s" }}
                          onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                          onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
                        />
                        {i === 0 && (
                          <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button style={{ marginTop: "4px", padding: "12px", borderRadius: "12px", background: "#d97706", color: "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 14px rgba(217,119,6,0.3)", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
                  >
                    Update Password
                  </button>
                </div>
              </div>

              <div className="card">
                <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Account Actions</h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>Manage your account status</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "2px" }}>Download My Data</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>Export all your orders and account data</p>
                    </div>
                    <button style={{ padding: "7px 14px", borderRadius: "9px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Export</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.03)" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "2px" }}>Delete Account</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>Permanently remove your account and data</p>
                    </div>
                    <button style={{ padding: "7px 14px", borderRadius: "9px", border: "1.5px solid rgba(239,68,68,0.3)", background: "transparent", fontSize: "12px", fontWeight: 600, color: "#ef4444", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Triangle size={11} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>EMEREN</span>
          </div>
          <p style={{ fontSize: "12px", color: "#d1d5db" }}>© 2025 Emeren. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" style={{ fontSize: "12px", color: "#d1d5db", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}