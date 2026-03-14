"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Triangle,
  User,
  LogOut,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Wrench,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { email: data.user.email ?? "" } : null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email ?? "" } : null);
    });
    return () => subscription.unsubscribe();
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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileNavOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    // Simulate API call — replace with your actual endpoint
    await new Promise((r) => setTimeout(r, 1400));
    setFormState("sent");
  };

  const inputStyle = (name: string) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === name ? "rgba(217,119,6,0.6)" : "rgba(0,0,0,0.1)"}`,
    background: focused === name ? "rgba(217,119,6,0.03)" : "#fff",
    fontSize: "14px",
    color: "#1a1a2e",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: "none",
    transition: "border-color .2s, background .2s, box-shadow .2s",
    boxShadow: focused === name ? "0 0 0 3px rgba(217,119,6,0.1)" : "none",
  });

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes drift1   { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-30px) scale(1.07)} 70%{transform:translate(-30px,40px) scale(0.96)} }
        @keyframes drift2   { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-60px,25px) scale(1.09)} 70%{transform:translate(40px,-50px) scale(0.94)} }
        @keyframes drift3   { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,60px) scale(1.05)} }
        @keyframes shimmer  { 0%,100%{opacity:.3} 50%{opacity:.55} }
        @keyframes starFloat{ 0%,100%{opacity:.08;transform:translateY(0)} 50%{opacity:.2;transform:translateY(-5px)} }
        @keyframes rotateSlow { to { transform: rotate(360deg); } }
        @keyframes pulse    { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes checkPop { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.15) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }

        .aurora1 { animation: drift1 20s ease-in-out infinite, shimmer 12s ease-in-out infinite; }
        .aurora2 { animation: drift2 25s ease-in-out infinite, shimmer 15s ease-in-out infinite 2s; }
        .aurora3 { animation: drift3 18s ease-in-out infinite, shimmer 10s ease-in-out infinite 4s; }

        .hero-title    { font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; }
        .section-label { font-family: 'Outfit', sans-serif; letter-spacing: 0.12em; }
        .brand         { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }

        body, p, a, span, li, button, input, textarea, select {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }

        .cta-btn {
          background: #d97706;
          color: #fff;
          font-weight: 700;
          border-radius: 12px;
          transition: background .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35);
        }
        .cta-btn:hover { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.45); }
        .cta-btn:active { background: #92400e; transform: translateY(0); }
        .cta-btn:disabled { background: #e5a44a; cursor: not-allowed; transform: none; box-shadow: none; }

        .ghost-btn {
          background: transparent;
          border: 1.5px solid rgba(0,0,0,0.15);
          color: #374151;
          border-radius: 12px;
          transition: border-color .15s, background .15s, color .15s;
        }
        .ghost-btn:hover { border-color: rgba(217,119,6,.6); background: rgba(217,119,6,.06); color: #d97706; }

        .glass {
          background: rgba(248,247,244,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.07);
        }

        .reveal { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }

        .contact-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: border-color .25s, box-shadow .25s, transform .25s;
        }
        .contact-card:hover {
          border-color: rgba(217,119,6,.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.09);
          transform: translateY(-4px);
        }

        .topic-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: border-color .2s, background .2s, box-shadow .2s;
          text-decoration: none;
          color: #1a1a2e;
        }
        .topic-card:hover {
          border-color: rgba(217,119,6,.35);
          background: #fffbf2;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }

        /* Hide on mobile, show on desktop */
        .desktop-only { display: none !important; }
        .nav-bar { display: flex; align-items: center; justify-content: space-between; }
        @media (min-width: 768px) {
          .desktop-only { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .nav-bar { display: grid; grid-template-columns: 1fr auto 1fr; }
        }

        /* ── Mobile Nav Drawer ── */
        .mobile-nav-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          z-index: 45; animation: fadeIn .2s ease both;
        }
        .mobile-nav {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(320px, 88vw); background: #faf9f6; z-index: 50;
          display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(0,0,0,0.14);
          animation: slideInRight .25s cubic-bezier(.22,1,.36,1) both;
          overflow-y: auto;
        }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .mobile-nav-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.07); flex-shrink: 0;
        }
        .mobile-nav-links { flex: 1; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; }
        .mobile-nav-link {
          display: flex; align-items: center; gap: 12px; padding: 13px 12px;
          border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 600; color: #374151; text-decoration: none;
          transition: background .15s, color .15s; cursor: pointer;
          background: none; border: none; width: 100%; text-align: left;
        }
        .mobile-nav-link:hover { background: rgba(217,119,6,0.07); color: #d97706; }
        .mobile-nav-link .link-icon {
          width: 34px; height: 34px; border-radius: 9px; background: rgba(0,0,0,0.04);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .15s;
        }
        .mobile-nav-link:hover .link-icon { background: rgba(217,119,6,0.12); }
        .mobile-nav-footer {
          padding: 16px 20px 28px; border-top: 1px solid rgba(0,0,0,0.07);
          display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;
        }
        .mobile-nav-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 4px 12px; }

        .success-icon { animation: checkPop .5s cubic-bezier(.34,1.56,.64,1) both; }

        @media (max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Background aurora (identical to landing) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, #fef3c7 0%, #f8f7f4 65%)" }} />
        <div className="aurora1" style={{ position: "absolute", top: "-8%", left: "-5%", width: "65vw", height: "65vw", borderRadius: "60% 40% 55% 45%/45% 55% 40% 60%", background: "radial-gradient(ellipse at 40% 40%, #ddd6fe 0%, transparent 65%)", filter: "blur(80px)", opacity: 0.5 }} />
        <div className="aurora2" style={{ position: "absolute", bottom: "-10%", right: "-8%", width: "60vw", height: "60vw", borderRadius: "45% 55% 40% 60%/55% 45% 60% 40%", background: "radial-gradient(ellipse at 55% 55%, #bfdbfe 0%, #d1fae5 40%, transparent 70%)", filter: "blur(90px)", opacity: 0.55 }} />
        <div className="aurora3" style={{ position: "absolute", top: "35%", right: "8%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, #fde68a 0%, transparent 65%)", filter: "blur(100px)", opacity: 0.45 }} />
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: i % 5 === 0 ? "3px" : "2px", height: i % 5 === 0 ? "3px" : "2px", top: `${(i * 41 + 7) % 100}%`, left: `${(i * 57 + 13) % 100}%`, borderRadius: "50%", background: "#d97706", animation: `starFloat ${4 + (i % 5)}s ease-in-out infinite`, animationDelay: `${(i * 0.35) % 5}s`, opacity: 0.15 }} />
        ))}
      </div>

      {/* ── Navbar (identical to landing) ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .3s" }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent" }}>
          <div className="nav-bar" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "68px", gap: "16px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>EMEREN</span>
            </Link>

            <nav className="desktop-only" style={{ alignItems: "center", gap: "28px", justifyContent: "center" }}>
              {([["Shop", "/shop"], ["Services", "/services"], ["Contact Us", "/contact"], ["About Us", "/about"]] as [string, string][]).map(([label, href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: label === "Contact Us" ? "#d97706" : "#6b7280", fontSize: "14px", fontWeight: label === "Contact Us" ? 600 : 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = label === "Contact Us" ? "#d97706" : "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
              {user ? (
                <div style={{ position: "relative" }} ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen((v) => !v)}
                    className="desktop-only"
                    style={{ alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: "200px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email.split("@")[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100 }}>
                      <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "6px" }}>
                        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                      <Link href="/shop" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")} onClick={() => setUserMenuOpen(false)}>Browse Shop</Link>
                      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")} onClick={() => setUserMenuOpen(false)}><User size={14} /> My Profile</Link>
                      <button onClick={handleSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444", fontFamily: "'Plus Jakarta Sans', sans-serif" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}><LogOut size={14} /> Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" className="ghost-btn desktop-only" style={{ alignItems: "center", padding: "8px 18px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
                  <Link href="/auth/signup" className="cta-btn desktop-only" style={{ alignItems: "center", gap: "6px", padding: "9px 20px", fontSize: "13px", textDecoration: "none" }}>Get Started<ArrowRight size={13} /></Link>
                </>
              )}
              <button className="mobile-menu-btn" onClick={() => setMobileNavOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer" }} aria-label="Toggle menu">
                {mobileNavOpen ? <X size={18} color="#1a1a2e" /> : <Menu size={18} color="#1a1a2e" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Drawer ── */}
      {mobileNavOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
          <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="mobile-nav-header">
              <Link href="/" onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Triangle size={12} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ color: "#1a1a2e", fontSize: "18px", fontWeight: 800 }}>EMEREN</span>
              </Link>
              <button onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent", cursor: "pointer" }} aria-label="Close menu">
                <X size={17} color="#374151" />
              </button>
            </div>

            {user && (
              <div style={{ margin: "12px 20px 4px", padding: "12px 14px", borderRadius: "12px", background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={16} color="#fff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Signed in as</p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
              </div>
            )}

            <nav className="mobile-nav-links">
              {([
                { label: "Shop",     href: "/shop",     icon: <ArrowRight size={16} color="#d97706" /> },
                { label: "Services", href: "/services", icon: <Wrench size={16} color="#d97706" /> },
                { label: "Contact",  href: "/contact",  icon: <Phone size={16} color="#d97706" /> },
                { label: "About Us",    href: "/about",    icon: <MapPin size={16} color="#d97706" /> },
              ]).map(({ label, href, icon }) => (
                <Link key={label} href={href} className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                  <span className="link-icon">{icon}</span>{label}
                </Link>
              ))}
              {user && (
                <>
                  <div className="mobile-nav-divider" />
                  <Link href="/profile" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                    <span className="link-icon"><User size={16} color="#d97706" /></span>My Profile
                  </Link>
                </>
              )}
            </nav>

            <div className="mobile-nav-footer">
              {!user ? (
                <>
                  <Link href="/auth/signup" className="cta-btn" onClick={() => setMobileNavOpen(false)}
                    style={{ padding: "13px 20px", fontSize: "14px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                    Get Started <ArrowRight size={14} />
                  </Link>
                  <Link href="/auth/signin" className="ghost-btn" onClick={() => setMobileNavOpen(false)}
                    style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Sign In
                  </Link>
                </>
              ) : (
                <button onClick={() => { handleSignOut(); setMobileNavOpen(false); }}
                  style={{ width: "100%", padding: "13px 20px", fontSize: "14px", fontWeight: 600, border: "1.5px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "12px", background: "rgba(239,68,68,0.04)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <LogOut size={15} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Page Hero ── */}
      <section style={{ position: "relative", zIndex: 1, paddingTop: "140px", paddingBottom: "64px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.3)", marginBottom: "24px", animation: "fadeIn 0.6s ease both" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#d97706", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>We're Here to Help</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 20px", color: "#1a1a2e", animation: "fadeUp 0.7s ease both", animationDelay: "0.1s" }}>
            Get in{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#d97706" }}>Touch</span>
              <svg style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "6px" }} viewBox="0 0 200 6" fill="none">
                <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity=".6" />
              </svg>
            </span>
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#6b7280", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto", fontWeight: 300, animation: "fadeUp 0.7s ease both", animationDelay: "0.2s" }}>
            Questions about an AC unit, need help with installation, or want a custom quote? Our team is ready.
          </p>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 64px" }}>
        <div className="info-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          {[
            {
              icon: <Phone size={20} color="#d97706" />,
              label: "Call Us",
              value: "+63 961 742 8532",
              sub: "Mon – Sat, 8AM – 6PM",
              href: "tel:+63441234567",
            },
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="#d97706"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
              label: "Facebook",
              value: "Emeren Aircon and Refrigeration Services",
              sub: "Message us on Facebook",
              href: "https://facebook.com/emeren.ph",
            },
            {
              icon: <MapPin size={20} color="#d97706" />,
              label: "Visit Us",
              value: "Sabang, Baliuag, Bulacan",
              sub: "Showroom open daily",
              href: "https://maps.google.com",
            },
            {
              icon: <Clock size={20} color="#d97706" />,
              label: "Business Hours",
              value: "8AM – 6PM",
              sub: "Monday to Saturday",
              href: null,
            },
          ].map((card, i) => (
            <div key={i} className="contact-card" style={{ padding: "28px 24px" }}>
              {card.href ? (
                <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  <ContactCardInner {...card} />
                </a>
              ) : (
                <ContactCardInner {...card} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Contact Grid: Form + Sidebar ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 100px" }}>
        <div className="contact-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>

          {/* ── Contact Form ── */}
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "24px", padding: "clamp(28px, 5vw, 48px)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ marginBottom: "32px" }}>
              <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>Send a Message</p>
              <h2 className="hero-title" style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-0.5px", margin: 0, color: "#1a1a2e" }}>How can we help you?</h2>
            </div>

            {formState === "sent" ? (
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <div className="success-icon" style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(217,119,6,0.1)", border: "2px solid rgba(217,119,6,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M7 16.5L13 22.5L25 10" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="hero-title" style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 10px" }}>Message Sent!</h3>
                <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.7, margin: "0 0 28px" }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setFormState("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }} className="ghost-btn" style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 600, cursor: "pointer", border: "1.5px solid rgba(0,0,0,0.15)" }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", letterSpacing: "0.02em" }}>Full Name</label>
                    <input required type="text" placeholder="Juan dela Cruz" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} style={inputStyle("name")} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", letterSpacing: "0.02em" }}>Email Address</label>
                    <input required type="email" placeholder="juan@email.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} style={inputStyle("email")} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", letterSpacing: "0.02em" }}>Subject</label>
                  <select required value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)} style={{ ...inputStyle("subject"), appearance: "none", cursor: "pointer" }}>
                    <option value="" disabled>Select a topic…</option>
                    <option value="product">Product Inquiry</option>
                    <option value="installation">Installation Help</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="quote">Request a Quote</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px", letterSpacing: "0.02em" }}>Message</label>
                  <textarea required placeholder="Tell us what you need — model, room size, location, or anything else that helps…" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} onFocus={() => setFocused("message")} onBlur={() => setFocused(null)} rows={5} style={{ ...inputStyle("message"), resize: "vertical", minHeight: "120px" }} />
                </div>

                <button type="submit" disabled={formState === "sending"} className="cta-btn" style={{ padding: "14px 28px", fontSize: "14px", cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
                  {formState === "sending" ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "rotateSlow 1s linear infinite" }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="2" /><path d="M8 2a6 6 0 0 1 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                      Sending…
                    </>
                  ) : (
                    <>Send Message<Send size={14} /></>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Quick topics */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Quick Links</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { icon: <ShoppingBag size={16} color="#d97706" />, label: "Browse the Shop", sub: "Inverter, cassette, VRF units", href: "/shop" },
                  { icon: <Wrench size={16} color="#d97706" />, label: "Book Installation", sub: "Schedule a certified technician", href: "/services" },
                  { icon: <MessageCircle size={16} color="#d97706" />, label: "Live Chat", sub: "7 days a week, 8AM – 6PM", href: "#chat" },
                ].map((t) => (
                  <Link key={t.label} href={t.href} className="topic-card">
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {t.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e" }}>{t.label}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{t.sub}</div>
                    </div>
                    <ChevronRight size={14} color="#d1d5db" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ height: "180px", background: "radial-gradient(ellipse at 40% 60%, rgba(217,119,6,0.12) 0%, #f8f7f4 70%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {/* Stylised map pin illustration */}
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="56" fill="rgba(217,119,6,0.06)" stroke="rgba(217,119,6,0.15)" strokeWidth="1" />
                  <circle cx="60" cy="60" r="36" fill="rgba(217,119,6,0.08)" stroke="rgba(217,119,6,0.2)" strokeWidth="1" />
                  <path d="M60 28C48.954 28 40 36.954 40 48c0 15 20 44 20 44s20-29 20-44c0-11.046-8.954-20-20-20z" fill="#d97706" opacity="0.9" />
                  <circle cx="60" cy="47" r="7" fill="#fff" />
                </svg>
                <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af" }}>Baliuag, Bulacan, Philippines</span>
                </div>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="ghost-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, textDecoration: "none", width: "100%" }}>
                  <MapPin size={13} color="#374151" />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Response time badge */}
            <div style={{ borderRadius: "16px", padding: "18px 20px", background: "linear-gradient(135deg, #fffbf2 0%, #fef3c7 100%)", border: "1px solid rgba(217,119,6,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s ease-in-out infinite", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e" }}>Typically replies within 2 hours</span>
              </div>
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0 20px", lineHeight: 1.5 }}>Our team is online Mon–Sat, 8AM–6PM PHT.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (identical to landing) ── */}
      <footer id="contact" style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.07)", padding: "60px 24px 36px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "40px", marginBottom: "48px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Triangle size={11} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ color: "#1a1a2e", fontSize: "18px", fontWeight: 800 }}>EMEREN</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: "0 0 20px", maxWidth: "220px" }}>Premium air conditioning systems for Philippine homes and businesses.</p>
              <div style={{ display: "flex", gap: "10px" }}>
                {[{ label: "FB", href: "https://facebook.com" }, { label: "IG", href: "https://instagram.com" }, { label: "TW", href: "https://twitter.com" }].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "10px", fontWeight: 700, textDecoration: "none", transition: "border-color .2s, color .2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)"; e.currentTarget.style.color = "#d97706"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.color = "#9ca3af"; }}>{s.label}</a>
                ))}
              </div>
            </div>
            {[
              { title: "Products", links: [{ label: "Split-Type", href: "/shop?type=split" }, { label: "Cassette", href: "/shop?type=cassette" }, { label: "Ducted", href: "/shop?type=ducted" }, { label: "Portable", href: "/shop?type=portable" }, { label: "Multi-Split", href: "/shop?type=multi-split" }] },
              { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Contact", href: "/contact" }] },
              { title: "Support", links: [{ label: "Installation", href: "/support/installation" }, { label: "Warranty", href: "/support/warranty" }, { label: "Returns", href: "/support/returns" }, { label: "FAQ", href: "/faq" }] },
            ].map((col) => (
              <div key={col.title}>
                <p style={{ color: "#1a1a2e", fontSize: "13px", fontWeight: 700, marginBottom: "14px", letterSpacing: "0.03em" }}>{col.title}</p>
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href} style={{ display: "block", color: "#9ca3af", fontSize: "13px", marginBottom: "9px", textDecoration: "none", transition: "color .2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>{l.label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "24px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#d1d5db", fontSize: "12px", margin: 0 }}>© {new Date().getFullYear()} Emeren. All rights reserved.</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Cookie Policy", href: "/cookies" }].map((l) => (
                <Link key={l.label} href={l.href} style={{ color: "#d1d5db", fontSize: "12px", textDecoration: "none", transition: "color .2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")} onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}>{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Small helper to avoid repeating card inner layout
function ContactCardInner({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string; href: string | null }) {
  return (
    <>
      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
        {icon}
      </div>
      <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>{value}</p>
      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{sub}</p>
    </>
  );
}