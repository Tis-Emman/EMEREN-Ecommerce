"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Cookie, ChevronRight, Info, Settings, BarChart2,
  Shield, ToggleLeft, Phone, Mail, MapPin, HelpCircle
} from "lucide-react";

const SECTIONS = [
  { id: "what-are-cookies",  label: "What Are Cookies?" },
  { id: "how-we-use",        label: "How We Use Cookies" },
  { id: "types",             label: "Types of Cookies" },
  { id: "third-party",       label: "Third-Party Cookies" },
  { id: "managing",          label: "Managing Cookies" },
  { id: "do-not-track",      label: "Do Not Track" },
  { id: "updates",           label: "Policy Updates" },
  { id: "contact",           label: "Contact Us" },
];

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState("what-are-cookies");
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sectionEls = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i];
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileNavOpen(false);
  };

  const COOKIE_TYPES = [
    {
      icon: <Shield size={16} />,
      name: "Strictly Necessary",
      tag: "Always Active",
      tagColor: "#16a34a",
      tagBg: "rgba(34,197,94,0.1)",
      tagBorder: "rgba(34,197,94,0.25)",
      desc: "These cookies are essential for the website to function correctly. They enable core features such as session management, authentication, shopping cart state, and secure checkout. These cannot be disabled.",
      examples: ["Session token (keeps you logged in)", "Cart contents across pages", "CSRF protection tokens", "HTTPS security cookies"],
    },
    {
      icon: <Settings size={16} />,
      name: "Functional",
      tag: "Optional",
      tagColor: "#d97706",
      tagBg: "rgba(217,119,6,0.08)",
      tagBorder: "rgba(217,119,6,0.25)",
      desc: "These cookies remember your preferences to improve your experience on return visits. They are not strictly required for the site to work but enhance usability.",
      examples: ["Language or region preferences", "Previously viewed products", "Saved address for faster checkout", "Display preferences (e.g., list vs. grid view)"],
    },
    {
      icon: <BarChart2 size={16} />,
      name: "Performance & Analytics",
      tag: "Not Used",
      tagColor: "#6b7280",
      tagBg: "rgba(107,114,128,0.08)",
      tagBorder: "rgba(107,114,128,0.2)",
      desc: "We do not use any third-party analytics or performance tracking cookies (e.g., Google Analytics, Facebook Pixel). Basic server-side logs (IP, browser type, page path) are retained for security purposes only and are not tied to advertising.",
      examples: [],
    },
    {
      icon: <Cookie size={16} />,
      name: "Marketing & Advertising",
      tag: "Not Used",
      tagColor: "#6b7280",
      tagBg: "rgba(107,114,128,0.08)",
      tagBorder: "rgba(107,114,128,0.2)",
      desc: "We do not use advertising, retargeting, or marketing cookies of any kind. Emeren does not display ads, participate in ad networks, or allow third-party advertisers to place cookies on our website.",
      examples: [],
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#1a1a2e",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes drift1   { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-30px) scale(1.07)} 70%{transform:translate(-30px,40px) scale(0.96)} }
        @keyframes drift2   { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-60px,25px) scale(1.09)} 70%{transform:translate(40px,-50px) scale(0.94)} }
        @keyframes shimmer  { 0%,100%{opacity:.3} 50%{opacity:.55} }
        @keyframes starFloat{ 0%,100%{opacity:.08;transform:translateY(0)} 50%{opacity:.2;transform:translateY(-5px)} }

        .aurora1 { animation: drift1 20s ease-in-out infinite, shimmer 12s ease-in-out infinite; }
        .aurora2 { animation: drift2 25s ease-in-out infinite, shimmer 15s ease-in-out infinite 2s; }

        .brand  { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .outfit { font-family: 'Outfit', sans-serif; }

        .glass {
          background: rgba(248,247,244,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.07);
        }

        .reveal { opacity:0; transform:translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          text-decoration: none;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: background .15s, color .15s;
        }
        .sidebar-link:hover { background: rgba(217,119,6,0.07); color: #d97706; }
        .sidebar-link.active { background: rgba(217,119,6,0.1); color: #d97706; font-weight: 700; }

        .policy-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 36px 40px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          margin-bottom: 24px;
          scroll-margin-top: 100px;
        }

        .policy-card h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: -0.02em;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .policy-card p {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.75;
          margin: 0 0 14px;
        }
        .policy-card p:last-child { margin-bottom: 0; }

        .policy-card ul {
          list-style: none;
          padding: 0;
          margin: 0 0 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .policy-card ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #4b5563;
          font-size: 15px;
          line-height: 1.65;
        }

        .policy-card ul li::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d97706;
          flex-shrink: 0;
          margin-top: 9px;
        }

        .highlight-box {
          background: linear-gradient(135deg, #fffbf2 0%, #fef3c7 100%);
          border: 1px solid rgba(217,119,6,0.2);
          border-radius: 14px;
          padding: 20px 24px;
          margin: 16px 0;
        }
        .highlight-box p { color: #92400e !important; font-size: 14px !important; margin: 0 !important; }

        .info-box {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 14px;
          padding: 20px 24px;
          margin: 16px 0;
        }
        .info-box p { color: #1e40af !important; font-size: 14px !important; margin: 0 !important; }

        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(217,119,6,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d97706;
          flex-shrink: 0;
        }

        .cookie-type-card {
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          padding: 22px 24px;
          margin-bottom: 16px;
          transition: border-color .2s, box-shadow .2s;
        }
        .cookie-type-card:hover {
          border-color: rgba(217,119,6,0.25);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .cookie-type-card:last-child { margin-bottom: 0; }

        .cookie-example {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 8px;
          background: #f8f7f4;
          border: 1px solid rgba(0,0,0,0.07);
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          margin: 3px;
        }

        .browser-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.07);
          margin-bottom: 10px;
          background: #f8f7f4;
          transition: border-color .2s;
        }
        .browser-row:hover { border-color: rgba(217,119,6,0.3); }
        .browser-row:last-child { margin-bottom: 0; }

        .divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 20px 0;
        }

        .cta-btn {
          background: #d97706;
          color: #fff;
          font-weight: 700;
          border-radius: 12px;
          transition: background .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35);
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .cta-btn:hover { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.45); }

        @media (max-width: 1023px) {
          .sidebar { display: none !important; }
          .policy-card { padding: 28px 24px; }
          .main-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .policy-card { padding: 20px 16px; border-radius: 14px; }
          .policy-card h2 { font-size: 17px; gap: 10px; }
          .highlight-box, .info-box { padding: 14px 16px; border-radius: 10px; }
          .cookie-type-card { padding: 16px; }
          .browser-row { flex-direction: column; align-items: flex-start; gap: 4px; }
          .browser-row span:last-child { max-width: 100% !important; text-align: left !important; }
          .cookie-example { font-size: 11px; }
        }

        .mobile-nav-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 50;
          backdrop-filter: blur(4px);
        }
        .mobile-nav-overlay.open { display: block; }

        .mobile-nav-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 24px 24px 0 0;
          padding: 12px 20px 32px;
          z-index: 51;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
          box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
        }
        .mobile-nav-drawer.open { transform: translateY(0); }

        .mobile-toc-btn {
          display: none;
          position: fixed;
          bottom: 24px;
          right: 20px;
          z-index: 40;
          background: #d97706;
          color: #fff;
          border: none;
          border-radius: 100px;
          padding: 12px 18px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          gap: 8px;
          align-items: center;
          box-shadow: 0 4px 20px rgba(217,119,6,0.45);
          transition: background .15s, transform .15s;
        }
        .mobile-toc-btn:active { transform: scale(0.96); }

        @media (max-width: 1023px) {
          .mobile-toc-btn { display: flex; }
        }
      `}</style>

      {/* ── Aurora Background ── */}
      <div className="pointer-events-none" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, #fef3c7 0%, #f8f7f4 65%)" }} />
        <div className="aurora1" style={{ position: "absolute", top: "-8%", left: "-5%", width: "65vw", height: "65vw", borderRadius: "60% 40% 55% 45%/45% 55% 40% 60%", background: "radial-gradient(ellipse at 40% 40%, #ddd6fe 0%, transparent 65%)", filter: "blur(80px)", opacity: 0.4 }} />
        <div className="aurora2" style={{ position: "absolute", bottom: "-10%", right: "-8%", width: "60vw", height: "60vw", borderRadius: "45% 55% 40% 60%/55% 45% 60% 40%", background: "radial-gradient(ellipse at 55% 55%, #bfdbfe 0%, #d1fae5 40%, transparent 70%)", filter: "blur(90px)", opacity: 0.45 }} />
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{ position: "absolute", width: i % 5 === 0 ? "3px" : "2px", height: i % 5 === 0 ? "3px" : "2px", top: `${(i * 41 + 7) % 100}%`, left: `${(i * 57 + 13) % 100}%`, borderRadius: "50%", background: "#d97706", animation: `starFloat ${4 + (i % 5)}s ease-in-out infinite`, animationDelay: `${(i * 0.35) % 5}s`, opacity: 0.15 }} />
        ))}
      </div>

      {/* ── Navbar ── */}
      <header className="glass" style={{ position: "sticky", top: 0, zIndex: 40, transition: "box-shadow .3s", boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.08)" : "none" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="brand" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(217,119,6,0.35)" }}>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: 800 }}>E</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: "20px", color: "#1a1a2e" }}>EMEREN</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Cookie size={14} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>Cookie Policy</span>
          </div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#6b7280", textDecoration: "none", transition: "color .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Back to Home <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 48px" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px" }}>
            <Cookie size={13} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>Transparency First</span>
          </div>
          <h1 className="outfit" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.7, margin: "0 0 24px" }}>
            This policy explains what cookies are, which ones we use on the Emeren website, and how you can control them. We keep things simple — we only use what's necessary.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", rowGap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Effective: <strong style={{ color: "#4b5563" }}>January 1, 2025</strong></span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Updated: <strong style={{ color: "#4b5563" }}>June 2025</strong></span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>📍 <strong style={{ color: "#4b5563" }}>Philippines</strong></span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="main-layout" style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "40px", alignItems: "start" }}>

        {/* ── Sidebar ── */}
        <aside className="sidebar" style={{ position: "sticky", top: "84px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "18px", padding: "20px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 14px" }}>Contents</p>
            {SECTIONS.map((s) => (
              <button key={s.id} className={`sidebar-link${activeSection === s.id ? " active" : ""}`} onClick={() => scrollTo(s.id)}>
                {activeSection === s.id && <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: "#d97706", flexShrink: 0 }} />}
                {s.label}
              </button>
            ))}
          </div>

          {/* Quick summary card */}
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "18px", padding: "20px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginTop: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Cookie Summary</p>
            {[
              { label: "Strictly Necessary", status: "Active", color: "#16a34a", bg: "rgba(34,197,94,0.1)" },
              { label: "Functional", status: "Optional", color: "#d97706", bg: "rgba(217,119,6,0.08)" },
              { label: "Analytics", status: "Not Used", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
              { label: "Marketing", status: "Not Used", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", color: "#4b5563", fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: item.color, background: item.bg, padding: "2px 8px", borderRadius: "6px" }}>{item.status}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Content ── */}
        <main>

          {/* 1. What Are Cookies */}
          <div id="what-are-cookies" className="policy-card reveal">
            <h2><span className="section-icon"><HelpCircle size={18} /></span>What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide a better browsing experience.
            </p>
            <p>
              Cookies are set either by the website you are visiting (known as "first-party cookies") or by third-party services embedded on that site (known as "third-party cookies"). Each cookie has a name, a value, and an expiry date — some expire when you close your browser ("session cookies"), while others remain on your device for a set period ("persistent cookies").
            </p>
            <div className="info-box">
              <p>ℹ️ <strong>Cookies are not harmful.</strong> They cannot execute programs or carry viruses. They simply store small pieces of information to improve how a website works for you.</p>
            </div>
          </div>

          {/* 2. How We Use Cookies */}
          <div id="how-we-use" className="policy-card reveal">
            <h2><span className="section-icon"><Info size={18} /></span>How We Use Cookies</h2>
            <p>
              Emeren uses cookies in a minimal and purposeful way. Our goal is to keep your experience smooth and secure — nothing more. Specifically, we use cookies to:
            </p>
            <ul>
              <li>Keep you logged in during your session so you don't have to sign in repeatedly</li>
              <li>Maintain the contents of your shopping cart as you browse our product catalog</li>
              <li>Remember your service request details during multi-step booking flows</li>
              <li>Protect our forms and checkout process against cross-site request forgery (CSRF)</li>
              <li>Preserve basic display preferences you have set on the site</li>
            </ul>
            <div className="highlight-box">
              <p>🚫 <strong>What we do NOT do:</strong> We do not use cookies to track your behavior across other websites, serve you advertisements, or build a profile of your interests. No data collected via cookies is sold or shared with advertisers.</p>
            </div>
          </div>

          {/* 3. Types of Cookies */}
          <div id="types" className="policy-card reveal">
            <h2><span className="section-icon"><Cookie size={18} /></span>Types of Cookies We Use</h2>
            <p style={{ marginBottom: "24px" }}>Below is a breakdown of every category of cookie that may be present on the Emeren website:</p>

            {COOKIE_TYPES.map((ct) => (
              <div key={ct.name} className="cookie-type-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
                      {ct.icon}
                    </div>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "16px", color: "#1a1a2e" }}>{ct.name}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: ct.tagColor, background: ct.tagBg, border: `1px solid ${ct.tagBorder}`, padding: "3px 10px", borderRadius: "7px" }}>{ct.tag}</span>
                </div>
                <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: 1.7, margin: ct.examples.length > 0 ? "0 0 14px" : "0" }}>{ct.desc}</p>
                {ct.examples.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
                    {ct.examples.map((ex) => (
                      <span key={ex} className="cookie-example">• {ex}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 4. Third-Party Cookies */}
          <div id="third-party" className="policy-card reveal">
            <h2><span className="section-icon"><Shield size={18} /></span>Third-Party Cookies</h2>
            <p>
              Emeren does <strong>not</strong> embed third-party scripts, widgets, or services that place tracking cookies on your device. This means there are no cookies from:
            </p>
            <ul>
              <li>Social media platforms (Facebook, Instagram, TikTok, Twitter/X)</li>
              <li>Analytics providers (Google Analytics, Hotjar, Mixpanel)</li>
              <li>Advertising networks (Google Ads, Meta Ads, programmatic networks)</li>
              <li>Live chat or support tools that set persistent cookies</li>
            </ul>
            <p>
              The only potential third-party involvement is from our <strong>payment gateway</strong>, which may set its own session cookies strictly for the purpose of processing your payment securely. These cookies are governed by the payment provider's own privacy and cookie policy and are not accessible to Emeren.
            </p>
            <div className="highlight-box">
              <p>✅ <strong>Bottom line:</strong> Other than payment processing, all cookies on this site are first-party cookies set and controlled by Emeren alone.</p>
            </div>
          </div>

          {/* 5. Managing Cookies */}
          <div id="managing" className="policy-card reveal">
            <h2><span className="section-icon"><ToggleLeft size={18} /></span>Managing Cookies</h2>
            <p>
              You have the right to control and manage cookies on your device. Most modern browsers allow you to view, block, or delete cookies through their settings. Below are quick links to cookie management instructions for major browsers:
            </p>

            <div style={{ margin: "20px 0" }}>
              {[
                { name: "Google Chrome", path: "Settings → Privacy and security → Cookies and other site data" },
                { name: "Mozilla Firefox", path: "Settings → Privacy & Security → Cookies and Site Data" },
                { name: "Microsoft Edge", path: "Settings → Cookies and site permissions → Cookies and site data" },
                { name: "Apple Safari", path: "Preferences → Privacy → Manage Website Data" },
                { name: "Opera", path: "Settings → Advanced → Privacy & security → Site Settings → Cookies" },
              ].map((b) => (
                <div key={b.name} className="browser-row">
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a2e" }}>{b.name}</span>
                  <span style={{ fontSize: "12px", color: "#9ca3af", maxWidth: "55%", textAlign: "right", lineHeight: 1.4 }}>{b.path}</span>
                </div>
              ))}
            </div>

            <div className="highlight-box">
              <p>⚠️ <strong>Please note:</strong> Disabling strictly necessary cookies may prevent core features of our website from working correctly, including login, cart, and checkout. We recommend only blocking optional or third-party cookies if you have concerns.</p>
            </div>

            <p>
              On mobile devices, cookie settings can typically be found in your browser's app settings under Privacy or Security.
            </p>
          </div>

          {/* 6. Do Not Track */}
          <div id="do-not-track" className="policy-card reveal">
            <h2><span className="section-icon"><BarChart2 size={18} /></span>Do Not Track</h2>
            <p>
              Some browsers include a "Do Not Track" (DNT) setting that sends a signal to websites requesting that your browsing not be tracked. Since Emeren does not use tracking, behavioral analytics, or advertising cookies, your browsing on our site is not tracked across sessions regardless of your DNT setting.
            </p>
            <p>
              We respect the spirit of DNT by design — our website is built to function without any cross-site tracking or behavioral profiling.
            </p>
            <div className="info-box">
              <p>ℹ️ There is currently no universally accepted standard for responding to DNT signals in the Philippines or globally. Our response is to simply not track — and that applies to everyone, whether DNT is enabled or not.</p>
            </div>
          </div>

          {/* 7. Policy Updates */}
          <div id="updates" className="policy-card reveal">
            <h2><span className="section-icon"><Info size={18} /></span>Policy Updates</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or how we operate our website. Any updates will be posted on this page with a revised effective date.
            </p>
            <p>
              We encourage you to revisit this page periodically. For significant changes, we will place a notice on our homepage or send an email notification to registered users.
            </p>
            <p>
              This Cookie Policy should be read in conjunction with our <Link href="/privacy" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link> and <Link href="/terms" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>Terms of Service</Link>, which together form the complete set of legal agreements governing your use of Emeren's platform.
            </p>
          </div>

          {/* 8. Contact */}
          <div id="contact" className="policy-card reveal">
            <h2><span className="section-icon"><Phone size={18} /></span>Contact Us</h2>
            <p>
              If you have any questions about this Cookie Policy or how we use cookies on our website, feel free to reach out:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", margin: "20px 0" }}>
              {[
                { icon: <Mail size={16} />, label: "Email", value: "support@emeren.ph" },
                { icon: <Phone size={16} />, label: "Phone", value: "+63 XXX XXX XXXX" },
                { icon: <MapPin size={16} />, label: "Service Areas", value: "Bulacan & Pampanga, Philippines" },
              ].map((c) => (
                <div key={c.label} style={{ background: "#f8f7f4", borderRadius: "14px", padding: "18px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#d97706" }}>
                    {c.icon}
                    <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9ca3af" }}>{c.label}</span>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>{c.value}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button className="cta-btn" style={{ padding: "12px 24px", fontSize: "14px" }}>
                  Back to Homepage
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button
                  style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700, borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.15)", background: "transparent", color: "#374151", cursor: "pointer", transition: "border-color .15s, background .15s, color .15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.6)"; e.currentTarget.style.background = "rgba(217,119,6,.06)"; e.currentTarget.style.color = "#d97706"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
                >
                  Contact Us
                </button>
              </Link>
            </div>
          </div>

        </main>
      </div>

      {/* ── Mobile TOC Button ── */}
      <button className="mobile-toc-btn" onClick={() => setMobileNavOpen(true)}>
        <Cookie size={14} /> Contents
      </button>

      {/* ── Mobile TOC Drawer ── */}
      <div className={`mobile-nav-overlay${mobileNavOpen ? " open" : ""}`} onClick={() => setMobileNavOpen(false)} />
      <div className={`mobile-nav-drawer${mobileNavOpen ? " open" : ""}`}>
        <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "#e5e7eb", margin: "0 auto 20px" }} />
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 4px" }}>Contents</p>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`sidebar-link${activeSection === s.id ? " active" : ""}`}
            onClick={() => scrollTo(s.id)}
            style={{ fontSize: "14px", padding: "11px 14px" }}
          >
            {activeSection === s.id && <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: "#d97706", flexShrink: 0 }} />}
            {s.label}
          </button>
        ))}
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px 4px" }}>Cookie Summary</p>
          {[
            { label: "Strictly Necessary", status: "Active", color: "#16a34a", bg: "rgba(34,197,94,0.1)" },
            { label: "Functional", status: "Optional", color: "#d97706", bg: "rgba(217,119,6,0.08)" },
            { label: "Analytics", status: "Not Used", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
            { label: "Marketing", status: "Not Used", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: item.color, background: item.bg, padding: "2px 8px", borderRadius: "6px" }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,0,0,0.07)", background: "rgba(248,247,244,0.95)", padding: "32px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#d1d5db", fontSize: "12px", margin: 0 }}>© {new Date().getFullYear()} Emeren. All rights reserved.</p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{ color: l.href === "/cookies" ? "#d97706" : "#d1d5db", fontSize: "12px", textDecoration: "none", fontWeight: l.href === "/cookies" ? 700 : 400, transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = l.href === "/cookies" ? "#d97706" : "#d1d5db")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}