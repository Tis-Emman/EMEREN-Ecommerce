"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Zap,
  Smartphone,
  Wrench,
  Shield,
  Truck,
  MessageCircle,
  Plus,
  Diamond,
  Triangle,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LandingPage() {
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

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Close mobile nav on resize to desktop
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

  // Wire up reveal animation via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "#f8f7f4",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#1a1a2e",
      }}
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
        @keyframes ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }

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

        .product-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          transition: transform .25s, border-color .25s, box-shadow .25s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .product-card:hover {
          transform: translateY(-6px);
          border-color: rgba(217,119,6,.35);
          box-shadow: 0 20px 48px rgba(0,0,0,0.12);
        }

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

        .ticker-wrap { overflow: hidden; }
        .ticker-inner { display:flex; width:max-content; animation: ticker 28s linear infinite; }

        .glass {
          background: rgba(248,247,244,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.07);
        }

        .reveal { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }

        .mobile-nav {
          position: fixed;
          inset: 0;
          background: rgba(248,247,244,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }
        .mobile-nav a {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          text-decoration: none;
          letter-spacing: -0.5px;
          transition: color .2s;
        }
        .mobile-nav a:hover { color: #d97706; }

        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      {/* ── Background aurora ── */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, #fef3c7 0%, #f8f7f4 65%)",
          }}
        />
        <div
          className="aurora1"
          style={{
            position: "absolute",
            top: "-8%",
            left: "-5%",
            width: "65vw",
            height: "65vw",
            borderRadius: "60% 40% 55% 45%/45% 55% 40% 60%",
            background:
              "radial-gradient(ellipse at 40% 40%, #ddd6fe 0%, transparent 65%)",
            filter: "blur(80px)",
            opacity: 0.5,
          }}
        />
        <div
          className="aurora2"
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-8%",
            width: "60vw",
            height: "60vw",
            borderRadius: "45% 55% 40% 60%/55% 45% 60% 40%",
            background:
              "radial-gradient(ellipse at 55% 55%, #bfdbfe 0%, #d1fae5 40%, transparent 70%)",
            filter: "blur(90px)",
            opacity: 0.55,
          }}
        />
        <div
          className="aurora3"
          style={{
            position: "absolute",
            top: "35%",
            right: "8%",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 50%, #fde68a 0%, transparent 65%)",
            filter: "blur(100px)",
            opacity: 0.45,
          }}
        />
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 5 === 0 ? "3px" : "2px",
              height: i % 5 === 0 ? "3px" : "2px",
              top: `${(i * 41 + 7) % 100}%`,
              left: `${(i * 57 + 13) % 100}%`,
              borderRadius: "50%",
              background: "#d97706",
              animation: `starFloat ${4 + (i % 5)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.35) % 5}s`,
              opacity: 0.15,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,.12) 30%, rgba(217,119,6,.15) 50%, rgba(20,184,166,.12) 70%, transparent)",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <header
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .3s" }}
      >
        <div
          className={scrolled ? "glass" : ""}
          style={{
            transition: "all .3s",
            borderBottom: scrolled
              ? "1px solid rgba(0,0,0,0.07)"
              : "1px solid transparent",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
              height: "68px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}
            >
              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "#d97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span
                className="brand"
                style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}
              >
                EMEREN
              </span>
            </Link>

            {/* Nav links — desktop */}
            <nav
              style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1, justifyContent: "center" }}
              className="hidden md:flex"
            >
              {[
                { label: "Features", href: "/#features" },
                { label: "About",    href: "/about" },
                { label: "Contact",  href: "/contact" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="nav-link"
                  style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                >
                  {label}
                </a>
              ))}
              <Link href="/shop" className="nav-link"
                style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >Shop</Link>
              <Link href="/services" className="nav-link"
                style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >Services</Link>
            </nav>

            {/* Auth buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {user ? (
                <div style={{ position: "relative" }} ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: "200px" }}
                  >
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email.split("@")[0]}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100 }}>
                      <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "6px" }}>
                        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                      <Link href="/shop"
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none", transition: "background .15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Browse Shop
                      </Link>
                      <Link href="/profile"
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none", transition: "background .15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={14} /> My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background .15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="ghost-btn hidden sm:flex"
                    style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="cta-btn"
                    style={{ padding: "9px 20px", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    Get Started
                    <ArrowRight size={13} />
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileNavOpen((v) => !v)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer", marginLeft: "4px" }}
                aria-label="Toggle menu"
              >
                {mobileNavOpen ? <X size={18} color="#1a1a2e" /> : <Menu size={18} color="#1a1a2e" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Overlay ── */}
      {mobileNavOpen && (
        <div className="mobile-nav">
          <button
            onClick={() => setMobileNavOpen(false)}
            style={{ position: "absolute", top: "20px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer" }}
            aria-label="Close menu"
          >
            <X size={18} color="#1a1a2e" />
          </button>
          <a href="/#features" onClick={() => setMobileNavOpen(false)}>Features</a>
          <a href="/about" onClick={() => setMobileNavOpen(false)}>About</a>
          <a href="/contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
          <Link href="/shop" onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>Shop</Link>
          <Link href="/services" onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>Services</Link>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {!user && (
              <>
                <Link href="/auth/signin" className="ghost-btn" onClick={() => setMobileNavOpen(false)} style={{ padding: "11px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
                <Link href="/auth/signup" className="cta-btn" onClick={() => setMobileNavOpen(false)} style={{ padding: "11px 24px", fontSize: "14px", textDecoration: "none" }}>Get Started</Link>
              </>
            )}
            {user && (
              <button onClick={() => { handleSignOut(); setMobileNavOpen(false); }} className="ghost-btn" style={{ padding: "11px 24px", fontSize: "14px", fontWeight: 600, border: "1.5px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "12px", background: "transparent", cursor: "pointer" }}>
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section
        style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px" }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>

          {/* Badge */}
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.3)", marginBottom: "28px", animation: "fadeIn 0.6s ease both" }}
          >
            <span
              style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }}
            />
            <span style={{ color: "#d97706", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Premium Air Conditioning
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-title"
            style={{ fontSize: "clamp(42px, 8vw, 84px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", margin: "0 0 24px", animation: "fadeUp 0.7s ease both", animationDelay: "0.1s", color: "#1a1a2e" }}
          >
            Cool Comfort,{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ color: "#d97706" }}>Engineered</span>
              <svg
                style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "6px" }}
                viewBox="0 0 200 6"
                fill="none"
              >
                <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#d97706" strokeWidth="2" strokeLinecap="round" opacity=".6" />
              </svg>
            </span>
            {" "}for<br />the Filipino Climate
          </h1>

          {/* Subtext */}
          <p
            style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#6b7280", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 40px", fontWeight: 300, animation: "fadeUp 0.7s ease both", animationDelay: "0.2s" }}
          >
            From ultra-quiet inverter split-types to full VRF commercial systems — browse, compare, and order with free Baliuag delivery.
          </p>

          {/* CTA row */}
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", animation: "fadeUp 0.7s ease both", animationDelay: "0.3s" }}
          >
            <Link
              href="/shop"
              className="cta-btn"
              style={{ padding: "14px 32px", fontSize: "15px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Browse Products
              <ArrowRight size={15} />
            </Link>
            <a
              href="#features"
              className="ghost-btn"
              style={{ padding: "14px 32px", fontSize: "15px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Learn More
              <ChevronDown size={15} />
            </a>
          </div>

          {/* Trust badges */}
          <div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px", marginTop: "52px", animation: "fadeUp 0.7s ease both", animationDelay: "0.45s" }}
          >
            {[
              { icon: <Truck size={15} color="#d97706" />, text: "Free Delivery Metro Manila" },
              { icon: <Wrench size={15} color="#d97706" />, text: "Professional Installation" },
              { icon: <Shield size={15} color="#d97706" />, text: "2-Year Warranty" },
              { icon: <Zap size={15} color="#d97706" />, text: "Inverter Certified" },
            ].map((b) => (
              <div
                key={b.text}
                style={{ display: "flex", alignItems: "center", gap: "7px", color: "#6b7280", fontSize: "13px" }}
              >
                {b.icon}
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.4 }}
        >
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#1a1a2e", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, #1a1a2e, transparent)" }} />
        </div>
      </section>

      {/* ── Stats ticker ── */}
      <div
        style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "18px 0", background: "rgba(255,255,255,0.6)", overflow: "hidden" }}
      >
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} style={{ display: "flex", alignItems: "center", gap: "0" }}>
                {[
                  "12+ AC Brands",  "2-Year Warranty", "Inverter & Non-Inverter", "Cassette & Ducted Systems", "Portable Units", "VRF Multi-Split", "Professional Installation", "24/7 Support", "Energy Certified",
                ].map((item, i) => (
                  <span
                    key={i}
                    style={{ display: "inline-flex", alignItems: "center", gap: "20px", padding: "0 32px", color: "#9ca3af", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap" }}
                  >
                    <Diamond size={8} color="#d97706" fill="#d97706" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2px" }}
        >
          {[
            { num: "500+", label: "Units Sold", sub: "Across Luzon" },
            { num: "12", label: "Top Brands", sub: "Curated selection" },
            { num: "98%", label: "Satisfaction", sub: "Customer rated" },
            { num: "48hr", label: "Delivery", sub: "Metro Manila" },
          ].map((s, i) => (
            <div
              key={i}
              style={{ padding: "40px 32px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(0,0,0,0.08)" : "none" }}
            >
              <div
                className="stat-num"
                style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 900, color: "#d97706", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}
              >
                {s.num}
              </div>
              <div style={{ color: "#1a1a2e", fontWeight: 600, fontSize: "15px", marginTop: "8px" }}>{s.label}</div>
              <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="reveal" style={{ position: "relative", zIndex: 1, padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p
              className="section-label"
              style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}
            >
              Why Emeren
            </p>
            <h2
              className="hero-title"
              style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", margin: 0, color: "#1a1a2e" }}
            >
              Everything you need,<br />nothing you don't
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              { icon: <Zap size={22} color="#d97706" />, title: "Inverter Technology", desc: "Save up to 60% on electricity vs standard units. Our inverter lineup adjusts compressor speed for precise, efficient cooling." },
              { icon: <Smartphone size={22} color="#d97706" />, title: "Smart Home Ready", desc: "Wi-Fi enabled units compatible with Google Home, Alexa, and native apps. Control your AC from anywhere." },
              { icon: <Wrench size={22} color="#d97706" />, title: "Pro Installation", desc: "Every purchase includes scheduling with our certified technicians. We handle everything from mounting to gas charging." },
              { icon: <Shield size={22} color="#d97706" />, title: "Warranty Covered", desc: "All units come with a minimum 2-year comprehensive warranty. Extended plans available at checkout." },
              { icon: <Truck size={22} color="#d97706" />, title: "Fast Delivery", desc: "Same-day dispatch for orders before 12PM. Free delivery within Metro Manila, affordable rates nationwide." },
              { icon: <MessageCircle size={22} color="#d97706" />, title: "Expert Advice", desc: "Not sure which unit fits your room? Our AC specialists are on chat 7 days a week to help you decide." },
            ].map((f, i) => (
              <div key={i} className="feat-card" style={{ padding: "28px" }}>
                <div
                  style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "#1a1a2e" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section id="products" className="reveal" style={{ position: "relative", zIndex: 1, padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
            <div>
              <p
                className="section-label"
                style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}
              >
                Top Picks
              </p>
              <h2
                className="hero-title"
                style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", margin: 0, color: "#1a1a2e" }}
              >
                Featured Units
              </h2>
            </div>
            <Link
              href="/shop"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#d97706", fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", transition: "background .2s" }}
            >
              View all products
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {[
              { name: "AUX 1.0HP Q-Series", brand: "AUX", price: "₱21,500", orig: "₱25,000", btu: "9K BTU", sqm: "~16m²", tag: "Inverter", badge: "Best Seller" },
              { name: "AUX 1.5HP Q-Series", brand: "AUX", price: "₱26,000", orig: "₱32,000", btu: "12K BTU", sqm: "~22m²", tag: "Inverter", badge: "Featured" },
              { name: "Daikin 1.5HP", brand: "PolarMax", price: "₱72,000", orig: "₱80,000", btu: "24K BTU", sqm: "~45m²", tag: "Inverter", badge: "Commercial" },
              { name: "FrostLine VRF 8HP", brand: "FrostLine", price: "₱185,000", orig: "₱210,000", btu: "72K BTU", sqm: "~120m²", tag: "Inverter", badge: "Premium" },
            ].map((p, i) => (
              <div key={i} className="product-card" style={{ overflow: "hidden" }}>
                {/* Image */}
                <div
                  style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "radial-gradient(ellipse at center, rgba(217,119,6,0.08) 0%, #f8f7f4 70%)" }}
                >
                  <span
                    style={{ position: "absolute", top: "12px", left: "12px", padding: "3px 10px", borderRadius: "6px", background: "#d97706", color: "#fff", fontSize: "10px", fontWeight: 700 }}
                  >
                    {p.badge}
                  </span>
                  {/* SVG AC unit placeholder */}
                  <svg width="110" height="72" viewBox="0 0 110 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.15))" }}>
                    <rect x="4" y="8" width="102" height="46" rx="8" fill="#fff" stroke="rgba(217,119,6,0.25)" strokeWidth="1.5"/>
                    <rect x="12" y="16" width="86" height="30" rx="5" fill="#f8f7f4" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
                    <rect x="18" y="22" width="6" height="18" rx="2" fill="rgba(217,119,6,0.25)"/>
                    <rect x="28" y="22" width="6" height="18" rx="2" fill="rgba(217,119,6,0.18)"/>
                    <rect x="38" y="22" width="6" height="18" rx="2" fill="rgba(217,119,6,0.12)"/>
                    <rect x="48" y="22" width="6" height="18" rx="2" fill="rgba(217,119,6,0.08)"/>
                    <circle cx="85" cy="31" r="7" fill="rgba(217,119,6,0.12)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
                    <circle cx="85" cy="31" r="3" fill="#d97706" opacity="0.6"/>
                    <rect x="20" y="58" width="70" height="6" rx="3" fill="rgba(0,0,0,0.06)"/>
                  </svg>
                </div>
                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <p style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>{p.brand}</p>
                  <h3 style={{ color: "#1a1a2e", fontSize: "14px", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>{p.name}</h3>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                    {[p.btu, p.sqm, p.tag].map((t) => (
                      <span
                        key={t}
                        style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "11px", color: "#6b7280", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "18px", fontWeight: 800, color: "#1a1a2e" }}>{p.price}</span>
                      <span style={{ fontSize: "11px", color: "#d1d5db", textDecoration: "line-through", marginLeft: "6px" }}>{p.orig}</span>
                    </div>
                    <Link
                      href="/shop"
                      className="cta-btn"
                      style={{ padding: "7px 14px", fontSize: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Plus size={12} />
                      Add
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{ borderRadius: "24px", padding: "clamp(40px, 6vw, 72px) clamp(28px, 6vw, 72px)", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #fffbf2 0%, #fef3c7 40%, #e0f2fe 100%)", border: "1px solid rgba(217,119,6,0.2)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
          >
            {/* Decorative ring */}
            <div
              style={{ position: "absolute", right: "-60px", top: "50%", transform: "translateY(-50%)", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(217,119,6,0.15)", animation: "rotateSlow 30s linear infinite" }}
            >
              <div
                style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", width: "6px", height: "6px", borderRadius: "50%", background: "#d97706" }}
              />
            </div>
            <div
              style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(217,119,6,0.08)", animation: "rotateSlow 20s linear infinite reverse" }}
            />

            <div style={{ position: "relative", maxWidth: "560px" }}>
              <p
                className="section-label"
                style={{ color: "#d97706", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}
              >
                Limited Time
              </p>
              <h2
                className="hero-title"
                style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.15, color: "#1a1a2e" }}
              >
                Get ₱3,000 off your<br />first AC purchase
              </h2>
              <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.65, margin: "0 0 32px" }}>
                {user
                  ? "Welcome back! Browse our latest AC units and enjoy exclusive member pricing."
                  : "Sign up today and receive an exclusive discount on any unit. Free installation included for orders over ₱25,000."}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {user ? (
                  <Link
                    href="/shop"
                    className="cta-btn"
                    style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px" }}
                  >
                    Browse Products
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="cta-btn"
                      style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px" }}
                    >
                      Claim Discount
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/shop"
                      className="ghost-btn"
                      style={{ padding: "13px 28px", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                    >
                      Browse First
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        id="contact"
        style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.07)", padding: "60px 24px 36px", background: "#fff" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "40px", marginBottom: "48px" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span
                  style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Triangle size={11} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ color: "#1a1a2e", fontSize: "18px", fontWeight: 800 }}>
                  EMEREN
                </span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: "0 0 20px", maxWidth: "220px" }}>
                Premium air conditioning systems for Philippine homes and businesses.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { label: "FB", href: "https://facebook.com" },
                  { label: "IG", href: "https://instagram.com" },
                  { label: "TW", href: "https://twitter.com" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "10px", fontWeight: 700, cursor: "pointer", textDecoration: "none", transition: "border-color .2s, color .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)"; e.currentTarget.style.color = "#d97706"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)"; e.currentTarget.style.color = "#9ca3af"; }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Products", links: [
                { label: "Split-Type", href: "/shop?type=split" },
                { label: "Cassette", href: "/shop?type=cassette" },
                { label: "Ducted", href: "/shop?type=ducted" },
                { label: "Portable", href: "/shop?type=portable" },
                { label: "Multi-Split", href: "/shop?type=multi-split" },
              ]},
              { title: "Company", links: [
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Press", href: "/press" },
                { label: "Contact", href: "/contact" },
              ]},
              { title: "Support", links: [
                { label: "Installation", href: "/support/installation" },
                { label: "Warranty", href: "/support/warranty" },
                { label: "Returns", href: "/support/returns" },
                { label: "FAQ", href: "/faq" },
              ]},
            ].map((col) => (
              <div key={col.title}>
                <p style={{ color: "#1a1a2e", fontSize: "13px", fontWeight: 700, marginBottom: "14px", letterSpacing: "0.03em" }}>{col.title}</p>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    style={{ display: "block", color: "#9ca3af", fontSize: "13px", marginBottom: "9px", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "24px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}
          >
            <p style={{ color: "#d1d5db", fontSize: "12px", margin: 0 }}>© {new Date().getFullYear()} Emeren. All rights reserved.</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ color: "#d1d5db", fontSize: "12px", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}