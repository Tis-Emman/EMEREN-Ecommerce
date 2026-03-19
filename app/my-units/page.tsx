"use client";

// SQL — run in Supabase SQL Editor before using this page:
// CREATE TABLE user_units (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   brand TEXT NOT NULL,
//   type TEXT NOT NULL,
//   hp TEXT NOT NULL,
//   room_name TEXT NOT NULL,
//   install_date DATE,
//   last_serviced DATE,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
// ALTER TABLE user_units ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users manage own units" ON user_units FOR ALL TO authenticated
//   USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import {
  Triangle, AirVent, Plus, Trash2, Wrench,
  CalendarDays, Clock, ShoppingCart, User, Menu, X,
  LogOut, ArrowRight, CheckCircle, AlertTriangle, AlertCircle, HelpCircle,
} from "lucide-react";

const BRANDS  = ["AUX","Daikin","Samsung","TCL","American Home","Carrier","Midea","Other"];
const TYPES   = ["Split-Type","Window Type","Cassette","Portable","Floor-Mounted"];
const HPS     = ["0.5 HP","0.75 HP","1.0 HP","1.5 HP","2.0 HP","2.5 HP","3.0 HP"];

interface UserUnit {
  id: string;
  brand: string;
  type: string;
  hp: string;
  room_name: string;
  install_date: string | null;
  last_serviced: string | null;
  created_at: string;
}

type Status = "Good" | "Due Soon" | "Overdue" | "Never Serviced";

function getStatus(lastServiced: string | null): Status {
  if (!lastServiced) return "Never Serviced";
  const days = (Date.now() - new Date(lastServiced).getTime()) / 86400000;
  if (days > 180) return "Overdue";
  if (days > 90)  return "Due Soon";
  return "Good";
}

const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string; icon: React.ReactNode; tip: string }> = {
  "Good":           { color: "#16a34a", bg: "rgba(22,163,74,0.08)",   border: "rgba(22,163,74,0.2)",   icon: <CheckCircle  size={13} />, tip: "Cleaned within 3 months" },
  "Due Soon":       { color: "#d97706", bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)",   icon: <AlertTriangle size={13} />, tip: "3–6 months since last service" },
  "Overdue":        { color: "#dc2626", bg: "rgba(220,38,38,0.08)",   border: "rgba(220,38,38,0.2)",   icon: <AlertCircle  size={13} />, tip: "More than 6 months — needs service" },
  "Never Serviced": { color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)", icon: <HelpCircle   size={13} />, tip: "No service recorded yet" },
};

function getNextService(lastServiced: string | null): string {
  if (!lastServiced) return "Book now";
  const next = new Date(lastServiced);
  next.setMonth(next.getMonth() + 3);
  return next <= new Date()
    ? "Book now"
    : next.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

export default function MyUnitsPage() {
  const router = useRouter();

  // Auth
  const { profileName } = useAuth();
  const [authUser,     setAuthUser]     = useState<{ email: string } | null>(null);
  const [cartCount,    setCartCount]    = useState(0);
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileNav,    setMobileNav]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Data
  const [units,      setUnits]      = useState<UserUnit[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError,  setFormError]  = useState("");

  const [form, setForm] = useState({
    room_name: "", brand: "Daikin", type: "Split-Type",
    hp: "1.0 HP", install_date: "", last_serviced: "",
  });

  // ── Auth + data load ────────────────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace("/auth/signin"); return; }
      setAuthUser({ email: data.user.email ?? "" });
      const { data: rows } = await supabase.from("cart_items").select("quantity").eq("user_id", data.user.id);
      setCartCount(rows?.reduce((s, r) => s + r.quantity, 0) ?? 0);
      loadUnits(supabase);
    });
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  async function loadUnits(supabase: ReturnType<typeof createClient>) {
    setLoading(true);
    const { data } = await (supabase.from("user_units") as any).select("*").order("created_at", { ascending: false });
    setUnits((data ?? []) as UserUnit[]);
    setLoading(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const name = form.room_name.trim();

    // Basic validation
    if (!name) { setFormError("Room name is required."); return; }
    if (name.length < 2) { setFormError("Room name is too short."); return; }
    if (name.length > 50) { setFormError("Room name must be 50 characters or less."); return; }
    if (/(.)\1{3,}/.test(name)) { setFormError("Please enter a valid room name."); return; }
    if (/^[^a-zA-Z0-9]+$/.test(name)) { setFormError("Room name must contain letters or numbers."); return; }

    // Cap at 10 units per user
    if (units.length >= 10) {
      setFormError("You can register up to 10 units. Remove an existing unit to add a new one.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth/signin"); return; }
    const { error } = await (supabase.from("user_units") as any).insert({
      user_id: user.id,
      brand: form.brand, type: form.type, hp: form.hp,
      room_name: form.room_name.trim(),
      install_date: form.install_date || null,
      last_serviced: form.last_serviced || null,
    });
    if (error) { setFormError(error.message); setSubmitting(false); return; }
    setForm({ room_name: "", brand: "Daikin", type: "Split-Type", hp: "1.0 HP", install_date: "", last_serviced: "" });
    setShowForm(false);
    loadUnits(supabase);
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this unit?")) return;
    setDeletingId(id);
    const supabase = createClient();
    await (supabase.from("user_units") as any).delete().eq("id", id);
    setUnits((p) => p.filter((u) => u.id !== id));
    setDeletingId(null);
  }

  // Stats
  const statuses = units.map((u) => getStatus(u.last_serviced));
  const good     = statuses.filter((s) => s === "Good").length;
  const dueSoon  = statuses.filter((s) => s === "Due Soon").length;
  const overdue  = statuses.filter((s) => s === "Overdue" || s === "Never Serviced").length;

  // ── Input/label shared styles ───────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "14px",
    fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1a1a2e",
    background: "#fff", outline: "none", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontSize: "11px", fontWeight: 700, color: "#6b7280",
    textTransform: "uppercase", letterSpacing: "0.07em",
    display: "block", marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { from { opacity:0; transform:scale(0.97) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
        .brand { font-family:'Outfit',sans-serif; }
        .glass { background:rgba(248,247,244,0.9); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .nav-link { color:#6b7280; font-size:14px; font-weight:500; text-decoration:none; transition:color .2s; position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover { color:#1a1a2e; }
        .nav-link:hover::after { width:100%; }
        @media (min-width:768px) { .mobile-menu-btn { display:none !important; } }
        .cta-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 22px; background:#d97706; color:#fff; border:none; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; text-decoration:none; transition:background .15s,transform .15s,box-shadow .15s; box-shadow:0 2px 8px rgba(217,119,6,0.3); }
        .cta-btn:hover { background:#b45309; transform:translateY(-1px); box-shadow:0 4px 14px rgba(217,119,6,0.4); }
        .ghost-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 20px; background:transparent; color:#374151; border:1.5px solid rgba(0,0,0,0.15); border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; text-decoration:none; transition:all .15s; }
        .ghost-btn:hover { border-color:#d97706; color:#d97706; background:rgba(217,119,6,0.04); }
        .unit-card { background:#fff; border-radius:18px; box-shadow:0 2px 12px rgba(0,0,0,0.06); border:1px solid rgba(0,0,0,0.06); overflow:hidden; transition:box-shadow .2s,transform .2s; animation:fadeUp .35s ease both; }
        .unit-card:hover { box-shadow:0 8px 28px rgba(0,0,0,0.1); transform:translateY(-2px); }
        .menu-item { display:flex; align-items:center; gap:8px; padding:9px 12px; border-radius:9px; font-size:13px; font-weight:600; color:#374151; text-decoration:none; transition:background .15s; cursor:pointer; border:none; background:none; width:100%; font-family:'Plus Jakarta Sans',sans-serif; }
        .menu-item:hover { background:rgba(0,0,0,0.04); }
        .inp-focus:focus { border-color:#d97706 !important; }
        @media (max-width: 768px) {
          .desktop-only { display:none !important; }
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .unit-grid  { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display:none !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .3s" }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "68px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800, whiteSpace: "nowrap" }}>EMEREN</span>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: "28px", justifyContent: "center" }}>
              {([["Shop","/shop"],["Services","/services"],["Contact","/contact"],["About Us","/about"]] as [string,string][]).map(([label,href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
              <Link href="/cart" style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.4)"; e.currentTarget.style.background = "#fffbf2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.background = "#fff"; }}
              >
                <ShoppingCart size={17} color="#374151" />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: "-5px", right: "-5px", minWidth: "17px", height: "17px", borderRadius: "999px", background: "#d97706", color: "#fff", fontSize: "9px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #f8f7f4" }}>{cartCount}</span>
                )}
              </Link>
              {/* User dropdown */}
              <div style={{ position: "relative" }} ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={13} color="#fff" />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {profileName ?? authUser?.email?.split("@")[0] ?? "Account"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100 }}>
                    <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "6px" }}>
                      <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{authUser?.email}</p>
                    </div>
                    <Link href="/shop"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none", transition: "background .15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      onClick={() => setUserMenuOpen(false)}
                    >Browse Shop</Link>
                    <Link href="/my-units"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#d97706", textDecoration: "none", transition: "background .15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(217,119,6,0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      onClick={() => setUserMenuOpen(false)}
                    ><AirVent size={14} /> My Units</Link>
                    <Link href="/profile"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none", transition: "background .15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      onClick={() => setUserMenuOpen(false)}
                    ><User size={14} /> My Profile</Link>
                    <button
                      onClick={handleSignOut}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background .15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    ><LogOut size={14} /> Sign Out</button>
                  </div>
                )}
              </div>
              {/* Mobile hamburger */}
              <button className="mobile-menu-btn" onClick={() => setMobileNav((v) => !v)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer", marginLeft: "4px" }}>
                {mobileNav ? <X size={18} color="#1a1a2e" /> : <Menu size={18} color="#1a1a2e" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileNav && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(248,247,244,0.97)", backdropFilter: "blur(20px)", zIndex: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px" }}>
          <button onClick={() => setMobileNav(false)} style={{ position: "absolute", top: "20px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer" }}>
            <X size={18} color="#1a1a2e" />
          </button>
          {[["Shop","/shop"],["Services","/services"],["My Units","/my-units"],["Contact","/contact"],["About Us","/about"]].map(([label,href]) => (
            <Link key={href} href={href} onClick={() => setMobileNav(false)}
              style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 700, color: href === "/my-units" ? "#d97706" : "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>
              {label}
            </Link>
          ))}
          <button onClick={() => { handleSignOut(); setMobileNav(false); }} style={{ padding: "11px 24px", fontSize: "14px", fontWeight: 600, border: "1.5px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "12px", background: "transparent", cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 24px 80px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
              Maintenance Tracker
            </p>
            <h1 className="brand" style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: "8px" }}>
              My AC Units
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", fontWeight: 400 }}>
              Track service history and get reminded when your units need attention.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="cta-btn"
            style={{ flexShrink: 0, opacity: units.length >= 10 && !showForm ? 0.5 : 1, cursor: units.length >= 10 && !showForm ? "not-allowed" : "pointer" }}
            disabled={units.length >= 10 && !showForm}
            title={units.length >= 10 ? "Maximum 10 units reached" : ""}
          >
            <Plus size={16} />
            {showForm ? "Cancel" : `Add Unit ${!loading ? `(${units.length}/10)` : ""}`}
          </button>
        </div>

        {/* Stats bar */}
        {units.length > 0 && (
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "32px" }}>
            {[
              { label: "Total Units",    value: units.length, color: "#1a1a2e",  bg: "#fff",                      border: "rgba(0,0,0,0.08)" },
              { label: "Good",           value: good,         color: "#16a34a",  bg: "rgba(22,163,74,0.06)",      border: "rgba(22,163,74,0.15)" },
              { label: "Due Soon",       value: dueSoon,      color: "#d97706",  bg: "rgba(217,119,6,0.06)",      border: "rgba(217,119,6,0.15)" },
              { label: "Needs Service",  value: overdue,      color: "#dc2626",  bg: "rgba(220,38,38,0.06)",      border: "rgba(220,38,38,0.15)" },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "14px", padding: "18px 20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{label}</p>
                <p className="brand" style={{ fontSize: "28px", fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add unit form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "18px", boxShadow: "0 4px 28px rgba(0,0,0,0.08)", border: "1px solid rgba(217,119,6,0.15)", marginBottom: "32px", overflow: "hidden", animation: "popIn .2s ease both" }}>
            {/* Form header */}
            <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "rgba(217,119,6,0.03)", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AirVent size={18} color="#d97706" />
              </div>
              <div>
                <h2 className="brand" style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a2e" }}>Register New AC Unit</h2>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>Add your unit to start tracking its maintenance schedule</p>
              </div>
            </div>

            <form onSubmit={handleAdd} style={{ padding: "24px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Room / Location <span style={{ color: "#ef4444" }}>*</span></label>
                  <input className="inp-focus" type="text" placeholder="e.g. Master Bedroom, Living Room" value={form.room_name}
                    onChange={(e) => setForm((p) => ({ ...p, room_name: e.target.value }))} style={inp} required />
                </div>

                <div>
                  <label style={lbl}>Brand</label>
                  <select className="inp-focus" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} style={inp}>
                    {BRANDS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label style={lbl}>Type</label>
                  <select className="inp-focus" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} style={inp}>
                    {TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={lbl}>Horsepower</label>
                  <select className="inp-focus" value={form.hp} onChange={(e) => setForm((p) => ({ ...p, hp: e.target.value }))} style={inp}>
                    {HPS.map((h) => <option key={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label style={lbl}>Install Date <span style={{ color: "#9ca3af", fontWeight: 500, textTransform: "none", letterSpacing: 0, fontSize: "11px" }}>(optional)</span></label>
                  <input className="inp-focus" type="date" value={form.install_date} onChange={(e) => setForm((p) => ({ ...p, install_date: e.target.value }))} style={inp} />
                </div>

                <div>
                  <label style={lbl}>Last Serviced <span style={{ color: "#9ca3af", fontWeight: 500, textTransform: "none", letterSpacing: 0, fontSize: "11px" }}>(optional)</span></label>
                  <input className="inp-focus" type="date" value={form.last_serviced} onChange={(e) => setForm((p) => ({ ...p, last_serviced: e.target.value }))} style={inp} />
                </div>
              </div>

              {formError && (
                <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 600, marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertCircle size={14} /> {formError}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={submitting} className="cta-btn" style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Saving…" : <><CheckCircle size={15} /> Save Unit</>}
                </button>
                <button type="button" className="ghost-btn" onClick={() => { setShowForm(false); setFormError(""); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.15)", borderTopColor: "#d97706", animation: "spin .8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>Loading your units…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && units.length === 0 && !showForm && (
          <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", padding: "72px 32px", textAlign: "center", border: "1px dashed rgba(0,0,0,0.1)" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "22px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "1px solid rgba(217,119,6,0.12)" }}>
              <AirVent size={40} color="#d97706" />
            </div>
            <h2 className="brand" style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e", marginBottom: "10px" }}>No units registered yet</h2>
            <p style={{ fontSize: "15px", color: "#6b7280", maxWidth: "380px", margin: "0 auto 28px", lineHeight: 1.65 }}>
              Add your AC units to track cleaning schedules, service history, and get reminders when maintenance is due.
            </p>
            <button className="cta-btn" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Register First Unit
            </button>
          </div>
        )}

        {/* Units grid */}
        {!loading && units.length > 0 && (
          <div className="unit-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {units.map((unit, i) => {
              const status     = getStatus(unit.last_serviced);
              const cfg        = STATUS_CONFIG[status];
              const nextSvc    = getNextService(unit.last_serviced);
              const isBookNow  = nextSvc === "Book now";

              return (
                <div key={unit.id} className="unit-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  {/* Colored top strip */}
                  <div style={{ height: "4px", background: cfg.color, opacity: 0.7 }} />

                  <div style={{ padding: "22px 22px 20px" }}>
                    {/* Card header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 className="brand" style={{ fontSize: "20px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {unit.room_name}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>
                          {unit.brand} · {unit.hp} · {unit.type}
                        </p>
                      </div>
                      {/* Status badge */}
                      <span style={{ flexShrink: 0, marginLeft: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 11px", borderRadius: "999px", background: cfg.bg, color: cfg.color, fontSize: "11px", fontWeight: 700, border: `1px solid ${cfg.border}`, whiteSpace: "nowrap" }}>
                        {cfg.icon} {status}
                      </span>
                    </div>

                    {/* Info rows */}
                    <div style={{ background: "#f8f7f4", borderRadius: "12px", padding: "14px 16px", marginBottom: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {unit.install_date && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <CalendarDays size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Installed</p>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{fmtDate(unit.install_date)}</p>
                          </div>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Wrench size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Last Serviced</p>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{unit.last_serviced ? fmtDate(unit.last_serviced) : "Never"}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Clock size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Next Service</p>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: isBookNow ? cfg.color : "#374151" }}>{nextSvc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href="/services"
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 14px", borderRadius: "10px", background: isBookNow ? cfg.color : "#d97706", color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none", transition: "opacity .15s", boxShadow: `0 2px 8px ${isBookNow ? cfg.color : "#d97706"}33` }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <Wrench size={13} />
                        {isBookNow ? "Book Now" : "Book Service"}
                        <ArrowRight size={12} />
                      </Link>
                      <button
                        onClick={() => handleDelete(unit.id)}
                        disabled={deletingId === unit.id}
                        title="Remove unit"
                        style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)", color: "#dc2626", cursor: deletingId === unit.id ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deletingId === unit.id ? 0.4 : 1, transition: "all .15s", flexShrink: 0 }}
                        onMouseEnter={(e) => { if (deletingId !== unit.id) { e.currentTarget.style.background = "rgba(220,38,38,0.12)"; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(220,38,38,0.06)"; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
