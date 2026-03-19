"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Triangle, LayoutDashboard, ShoppingBag, Briefcase,
  Package, LogOut, Menu, X, ChevronRight, CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/admin",          label: "Dashboard",    icon: <LayoutDashboard size={16} /> },
  { href: "/admin/orders",   label: "Orders",       icon: <ShoppingBag size={16} /> },
  { href: "/admin/bookings", label: "Bookings",     icon: <CalendarCheck size={16} /> },
  { href: "/admin/careers",  label: "Careers",      icon: <Briefcase size={16} /> },
  { href: "/admin/products", label: "Products",     icon: <Package size={16} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/auth/signin"); return; }
    const isAdmin =
      user.app_metadata?.role === "admin" ||
      (user.user_metadata as Record<string, unknown>)?.role === "admin";
    if (!isAdmin) { router.replace("/"); return; }
    setAuthChecked(true);
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.3)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
        .brand  { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .outfit { font-family: 'Outfit', sans-serif; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 600;
          text-decoration: none; transition: all .15s;
          color: #94a3b8; cursor: pointer; border: none; background: none;
          width: 100%; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
        .nav-item.active { background: rgba(217,119,6,0.15); color: #fbbf24; }
        .nav-item.active svg { color: #f59e0b; }
        .mobile-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px); z-index: 30;
          animation: fadeIn .2s ease;
        }
        .sidebar {
          width: 240px; background: #1e293b;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed; left: 0; top: 0; bottom: 0;
            z-index: 40; transform: translateX(-100%);
            transition: transform .25s ease;
          }
          .sidebar.open { transform: translateX(0); }
        }
        .main-content { flex: 1; overflow-y: auto; }
        .top-bar {
          background: #1e293b; border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 24px; height: 60px; display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          position: sticky; top: 0; z-index: 10;
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "4px" }}>
            <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Triangle size={12} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize: "18px", fontWeight: 800, color: "#f1f5f9" }}>EMEREN</span>
          </Link>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.12em", textTransform: "uppercase", paddingLeft: "36px" }}>Admin Panel</span>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
              {isActive(item.href) && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: "10px 14px", marginBottom: "4px" }}>
            <p style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Signed in as</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="nav-item"
            style={{ color: "#f87171" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#fca5a5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#f87171"; }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Top bar */}
        <header className="top-bar">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ display: "none", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", cursor: "pointer", color: "#94a3b8" }}
            className="mobile-menu-btn"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Admin</span>
            {pathname !== "/admin" && (
              <>
                <ChevronRight size={12} color="#475569" />
                <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, textTransform: "capitalize" }}>
                  {pathname.split("/").pop()}
                </span>
              </>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/shop" style={{ fontSize: "12px", color: "#64748b", textDecoration: "none", transition: "color .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
            >
              ← View Store
            </Link>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#fff" }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: "28px 28px 60px", animation: "fadeIn .3s ease" }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
