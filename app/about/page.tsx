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
  Zap,
  Shield,
  Heart,
  Award,
  Users,
  MapPin,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const team = [
    { name: "Enrico Dela Pena", role: "Founder & CEO, Lead Technician", initials: "ER", color: "#d97706" },
    { name: "Juanmateo Pangilinan", role: "Technician", initials: "MS", color: "#7c3aed" },
    { name: "Jun Reyes", role: "Lead Technician", initials: "JR", color: "#0891b2" },
    { name: "Ana Bautista", role: "Customer Success", initials: "AB", color: "#059669" },
  ];

  const values = [
    { icon: <Zap size={22} color="#d97706" />, title: "Efficiency First", desc: "We only carry inverter-rated and energy-certified units. Saving electricity isn't optional — it's the standard." },
    { icon: <Shield size={22} color="#d97706" />, title: "Honest Warranties", desc: "No fine print, no runaround. Every unit ships with a minimum 2-year comprehensive warranty, backed by us directly." },
    { icon: <Heart size={22} color="#d97706" />, title: "Filipino by Design", desc: "Our inventory is curated for the Philippine climate — hot, humid, and tropical. Not sourced from a generic global catalog." },
    { icon: <Wrench size={22} color="#d97706" />, title: "End-to-End Service", desc: "We don't hand you a box and wave goodbye. Our certified technicians handle installation, gas charging, and follow-up." },
  ];

  const milestones = [
    { year: "2022", event: "Founded in Baliuag", detail: "Rico started Emeren out of his garage after struggling to find reliable AC suppliers for his family's real estate properties." },
    { year: "2024", event: "First 100 installs", detail: "Despite the pandemic, demand for home cooling surged. Emeren completed its first 100 installations across Bulacan." },
    { year: "2025", event: "500+ units sold", detail: "Reached half a thousand satisfied customers — with a 98% satisfaction rate and a growing team of certified technicians." },
    { year: "2026", event: "Online store launched", detail: "We built our e-commerce platform so customers across Luzon could browse, compare, and order without leaving home." },

  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
        @keyframes drift1    { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-30px) scale(1.07)} 70%{transform:translate(-30px,40px) scale(0.96)} }
        @keyframes drift2    { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-60px,25px) scale(1.09)} 70%{transform:translate(40px,-50px) scale(0.94)} }
        @keyframes drift3    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,60px) scale(1.05)} }
        @keyframes shimmer   { 0%,100%{opacity:.3} 50%{opacity:.55} }
        @keyframes starFloat { 0%,100%{opacity:.08;transform:translateY(0)} 50%{opacity:.2;transform:translateY(-5px)} }
        @keyframes rotateSlow{ to { transform: rotate(360deg); } }
        @keyframes pulse     { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes lineGrow  { from { width: 0; } to { width: 100%; } }

        .aurora1 { animation: drift1 20s ease-in-out infinite, shimmer 12s ease-in-out infinite; }
        .aurora2 { animation: drift2 25s ease-in-out infinite, shimmer 15s ease-in-out infinite 2s; }
        .aurora3 { animation: drift3 18s ease-in-out infinite, shimmer 10s ease-in-out infinite 4s; }

        .hero-title    { font-family: 'Outfit', sans-serif; letter-spacing: -0.03em; }
        .section-label { font-family: 'Outfit', sans-serif; letter-spacing: 0.12em; }
        .brand         { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .stat-num      { font-family: 'Outfit', sans-serif; letter-spacing: -0.04em; }

        body, p, a, span, li, button, input {
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

        .feat-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px;
          transition: border-color .25s, background .25s, box-shadow .25s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .feat-card:hover {
          border-color: rgba(217,119,6,.3);
          background: #fffbf2;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .team-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: transform .25s, box-shadow .25s, border-color .25s;
        }
        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
          border-color: rgba(217,119,6,.25);
        }

        .timeline-item { position: relative; padding-left: 32px; }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 28px;
          bottom: -24px;
          width: 1px;
          background: rgba(217,119,6,0.2);
        }
        .timeline-item:last-child::before { display: none; }

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

        @media (max-width: 767px) {
          .story-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .team-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── Background aurora ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, #fef3c7 0%, #f8f7f4 65%)" }} />
        <div className="aurora1" style={{ position: "absolute", top: "-8%", left: "-5%", width: "65vw", height: "65vw", borderRadius: "60% 40% 55% 45%/45% 55% 40% 60%", background: "radial-gradient(ellipse at 40% 40%, #ddd6fe 0%, transparent 65%)", filter: "blur(80px)", opacity: 0.5 }} />
        <div className="aurora2" style={{ position: "absolute", bottom: "-10%", right: "-8%", width: "60vw", height: "60vw", borderRadius: "45% 55% 40% 60%/55% 45% 60% 40%", background: "radial-gradient(ellipse at 55% 55%, #bfdbfe 0%, #d1fae5 40%, transparent 70%)", filter: "blur(90px)", opacity: 0.55 }} />
        <div className="aurora3" style={{ position: "absolute", top: "35%", right: "8%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 50%, #fde68a 0%, transparent 65%)", filter: "blur(100px)", opacity: 0.45 }} />
        {[...Array(24)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: i % 5 === 0 ? "3px" : "2px", height: i % 5 === 0 ? "3px" : "2px", top: `${(i * 41 + 7) % 100}%`, left: `${(i * 57 + 13) % 100}%`, borderRadius: "50%", background: "#d97706", animation: `starFloat ${4 + (i % 5)}s ease-in-out infinite`, animationDelay: `${(i * 0.35) % 5}s`, opacity: 0.15 }} />
        ))}
      </div>

      {/* ── Navbar ── */}
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
                  style={{ color: label === "About Us" ? "#d97706" : "#6b7280", fontSize: "14px", fontWeight: label === "About Us" ? 600 : 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = label === "About Us" ? "#d97706" : "#6b7280")}
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
                { label: "Contact Us",  href: "/contact",  icon: <MapPin size={16} color="#d97706" /> },
                { label: "About",    href: "/about",    icon: <Users size={16} color="#d97706" /> },
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

      {/* ── Hero ── */}
      <section style={{ position: "relative", zIndex: 1, paddingTop: "140px", paddingBottom: "72px", paddingLeft: "24px", paddingRight: "24px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.3)", marginBottom: "24px", animation: "fadeIn 0.6s ease both" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ color: "#d97706", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Our Story</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: "clamp(38px, 7vw, 76px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2px", margin: "0 0 22px", color: "#1a1a2e", animation: "fadeUp 0.7s ease both", animationDelay: "0.1s" }}>
            Built for the{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#d97706" }}>Philippine</span>
              <svg style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "6px" }} viewBox="0 0 200 6" fill="none">
                <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity=".6" />
              </svg>
            </span>
            {" "}heat
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#6b7280", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 36px", fontWeight: 300, animation: "fadeUp 0.7s ease both", animationDelay: "0.2s" }}>
            Emeren started as a Baliuag family business frustrated by overpriced, unreliable AC suppliers. Today we serve hundreds of Filipino homes and businesses across Luzon.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.7s ease both", animationDelay: "0.3s" }}>
            <Link href="/shop" className="cta-btn" style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px" }}>
              Browse Products <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="ghost-btn" style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="reveal" style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.6)", padding: "0 24px" }}>
        <div className="stats-grid" style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { num: "500+", label: "Units Sold", sub: "Across Luzon" },
            { num: "12",   label: "Top Brands",   sub: "Curated selection" },
            { num: "98%",  label: "Satisfaction", sub: "Customer rated" },
            { num: "2019", label: "Founded",      sub: "Baliuag, Bulacan" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "40px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
              <div className="stat-num" style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: "#d97706", lineHeight: 1 }}>{s.num}</div>
              <div style={{ color: "#1a1a2e", fontWeight: 600, fontSize: "14px", marginTop: "8px" }}>{s.label}</div>
              <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "3px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Our Story ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "96px 24px" }}>
        <div className="story-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          {/* Text */}
          <div>
            <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>Who We Are</p>
            <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 20px", color: "#1a1a2e", lineHeight: 1.15 }}>
              A team that actually knows air conditioning
            </h2>
            <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.8, margin: "0 0 16px" }}>
              Emeren was founded in 2022 by Enrico Dela Pena, a Baliuag-based entrepreneur who spent years dealing with mediocre AC suppliers at Saudi Arabia. The mission was simple: build the store he always wished existed.
            </p>
            <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.8, margin: "0 0 28px" }}>
              We're not a marketplace. We hand-pick every unit in our catalog, train our technicians in-house, and stand behind every warranty ourselves. No passing the buck to manufacturers.
            </p>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <div style={{ display: "flex" }}>
                {["RD", "MS", "JR", "AB"].map((init, i) => (
                  <div key={i} style={{ width: "36px", height: "36px", borderRadius: "50%", background: ["#d97706", "#7c3aed", "#0891b2", "#059669"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", marginLeft: i > 0 ? "-10px" : 0, border: "2px solid #f8f7f4" }}>{init}</div>
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>Meet the team below ↓</span>
            </div>
          </div>

          {/* Illustration card */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: "24px", overflow: "hidden", background: "linear-gradient(135deg, #fffbf2 0%, #fef3c7 50%, #e0f2fe 100%)", border: "1px solid rgba(217,119,6,0.2)", padding: "48px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              {/* Rotating ring */}
              <div style={{ position: "absolute", top: "20px", right: "20px", width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(217,119,6,0.2)", animation: "rotateSlow 20s linear infinite" }}>
                <div style={{ position: "absolute", top: "-3px", left: "50%", transform: "translateX(-50%)", width: "6px", height: "6px", borderRadius: "50%", background: "#d97706" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                <span style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Triangle size={15} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e" }}>EMEREN</span>
              </div>
              <p className="hero-title" style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#1a1a2e", lineHeight: 1.3, margin: "0 0 20px" }}>
                "Every Filipino home deserves reliable, efficient cooling."
              </p>
              <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>— Enrico Dela Pena, Founder</p>

              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: "24px" }}>
                {[{ icon: <MapPin size={14} color="#d97706" />, text: "Baliuag, Bulacan" }, { icon: <Award size={14} color="#d97706" />, text: "Est. 2019" }].map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6b7280" }}>{b.icon}{b.text}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 96px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>What We Stand For</p>
            <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", margin: 0, color: "#1a1a2e" }}>Our values, in plain terms</h2>
          </div>
          <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {values.map((v, i) => (
              <div key={i} className="feat-card" style={{ padding: "28px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px" }}>{v.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 10px", color: "#1a1a2e" }}>{v.title}</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.75, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 96px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>How We Got Here</p>
            <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", margin: 0, color: "#1a1a2e" }}>
              Four years, one mission
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                {/* dot */}
                <div style={{ position: "absolute", left: 0, top: "4px", width: "15px", height: "15px", borderRadius: "50%", background: "#fff", border: `2px solid ${i === milestones.length - 1 ? "#d97706" : "rgba(217,119,6,0.4)"}`, boxShadow: i === milestones.length - 1 ? "0 0 0 4px rgba(217,119,6,0.12)" : "none" }} />
                <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", background: "rgba(217,119,6,0.1)", padding: "2px 8px", borderRadius: "6px", letterSpacing: "0.05em" }}>{m.year}</span>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e" }}>{m.event}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 96px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>The People</p>
            <h2 className="hero-title" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", margin: 0, color: "#1a1a2e" }}>Meet the team</h2>
          </div>
          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: member.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 auto 16px", fontFamily: "'Outfit', sans-serif", boxShadow: `0 4px 16px ${member.color}40` }}>
                  {member.initials}
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>{member.name}</h3>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>{member.role}</p>
              </div>
            ))}
          </div>

          {/* Hiring nudge */}
          <div style={{ marginTop: "24px", borderRadius: "16px", padding: "20px 28px", background: "rgba(217,119,6,0.05)", border: "1px dashed rgba(217,119,6,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={18} color="#d97706" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>We're growing</p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Open roles in installation and sales</p>
              </div>
            </div>
            <Link href="/careers" className="ghost-btn" style={{ padding: "9px 20px", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              View Openings <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ borderRadius: "24px", padding: "clamp(40px, 6vw, 72px) clamp(28px, 6vw, 72px)", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #fffbf2 0%, #fef3c7 40%, #e0f2fe 100%)", border: "1px solid rgba(217,119,6,0.2)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
            <div style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(217,119,6,0.15)", animation: "rotateSlow 30s linear infinite" }}>
              <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", width: "6px", height: "6px", borderRadius: "50%", background: "#d97706" }} />
            </div>
            <div style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(217,119,6,0.08)", animation: "rotateSlow 20s linear infinite reverse" }} />
            <div style={{ position: "relative", maxWidth: "560px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <TrendingUp size={14} color="#d97706" />
                <p className="section-label" style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>Ready to Stay Cool?</p>
              </div>
              <h2 className="hero-title" style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.15, color: "#1a1a2e" }}>
                Get ₱3,000 off your<br />first AC purchase
              </h2>
              <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.65, margin: "0 0 28px" }}>
                {user
                  ? "Welcome back! Browse our latest units and enjoy exclusive member pricing."
                  : "Sign up and receive an exclusive discount. Free installation on orders over ₱25,000."}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {user ? (
                  <Link href="/shop" className="cta-btn" style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px" }}>Browse Products<ArrowRight size={14} /></Link>
                ) : (
                  <>
                    <Link href="/auth/signup" className="cta-btn" style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px" }}>Claim Discount<ArrowRight size={14} /></Link>
                    <Link href="/shop" className="ghost-btn" style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Browse First</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.07)", padding: "60px 24px 36px", background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "40px", marginBottom: "48px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}><Triangle size={11} color="#fff" fill="#fff" /></span>
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
              { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Press", href: "/press" }, { label: "Contact Us", href: "/contact" }] },
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