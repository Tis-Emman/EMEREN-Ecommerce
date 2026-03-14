"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Wrench, MapPin, Users, TrendingUp, Heart, Send, CheckCircle, Loader2, ChevronDown } from "lucide-react";

const ROLES = [
  { id: "hvac-technician", label: "HVAC Technician" },
  { id: "general", label: "Open to Any Role" },
];

const PERKS = [
  {
    icon: <TrendingUp size={20} />,
    title: "Room to Grow",
    desc: "Emeren is early-stage and growing fast. Join now and grow with us — we promote from within.",
  },
  {
    icon: <Heart size={20} />,
    title: "People-First Culture",
    desc: "We treat our team the way we treat our customers — with respect, transparency, and care.",
  },
  {
    icon: <Wrench size={20} />,
    title: "Meaningful Work",
    desc: "Every job we complete improves comfort for a real family. Your work has a direct, visible impact.",
  },
  {
    icon: <MapPin size={20} />,
    title: "Local & Rooted",
    desc: "We serve Bulacan and Pampanga — work close to home, build relationships in your community.",
  },
];

export default function CareersPage() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", contact: "", role: "" });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.contact || !form.role) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes drift1   { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-30px) scale(1.07)} 70%{transform:translate(-30px,40px) scale(0.96)} }
        @keyframes drift2   { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-60px,25px) scale(1.09)} 70%{transform:translate(40px,-50px) scale(0.94)} }
        @keyframes shimmer  { 0%,100%{opacity:.3} 50%{opacity:.55} }
        @keyframes starFloat{ 0%,100%{opacity:.08;transform:translateY(0)} 50%{opacity:.2;transform:translateY(-5px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.95);opacity:.6} 70%{transform:scale(1.08);opacity:0} 100%{transform:scale(0.95);opacity:0} }

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

        .perk-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          transition: border-color .2s, box-shadow .2s, transform .2s;
        }
        .perk-card:hover {
          border-color: rgba(217,119,6,0.25);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .role-card {
          border: 1.5px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 20px 24px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: border-color .2s, background .2s, box-shadow .2s;
          gap: 12px;
        }
        .role-card:hover {
          border-color: rgba(217,119,6,0.4);
          background: #fffbf5;
          box-shadow: 0 4px 16px rgba(217,119,6,0.1);
        }
        .role-card.selected {
          border-color: #d97706;
          background: rgba(217,119,6,0.05);
          box-shadow: 0 4px 20px rgba(217,119,6,0.15);
        }

        .form-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: #fff;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1a2e;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .form-input:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
        }
        .form-input::placeholder { color: #9ca3af; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #d97706;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35);
          transition: background .15s, transform .15s, box-shadow .15s;
        }
        .submit-btn:hover:not(:disabled) { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.45); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #d97706;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35);
          transition: background .15s, transform .15s, box-shadow .15s;
          text-decoration: none;
        }
        .cta-btn:hover { background: #b45309; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.45); }

        .pulse-dot {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d97706;
          flex-shrink: 0;
        }
        .pulse-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #d97706;
          animation: pulse-ring 2s ease-out infinite;
        }

        @media (max-width: 767px) {
          .hero-actions { flex-direction: column; align-items: stretch; }
          .hero-actions .cta-btn, .hero-actions .ghost-btn { text-align: center; justify-content: center; }
          .perks-grid { grid-template-columns: 1fr !important; }
          .roles-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
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
            <span style={{ fontWeight: 800, fontSize: "20px", color: "#1a1a2e" }}>Emeren</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Users size={14} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>Careers</span>
          </div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#6b7280", textDecoration: "none", transition: "color .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Back to Home <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "72px 24px 64px" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>We're Building Our Team</span>
          </div>
          <h1 className="outfit" style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 20px", lineHeight: 1.08 }}>
            Grow with Emeren
          </h1>
          <p style={{ fontSize: "17px", color: "#6b7280", lineHeight: 1.75, margin: "0 0 36px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            We're not hiring just yet — but we're growing fast. If you're skilled, passionate, and want to be part of something real in Bulacan and Pampanga, leave your details and we'll reach out when the time is right.
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-btn" onClick={scrollToForm}>
              Express Interest <ChevronDown size={16} />
            </button>
            <a href="#why-emeren"
              className="ghost-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "transparent", color: "#374151", fontWeight: 700, fontSize: "15px", fontFamily: "'Plus Jakarta Sans', sans-serif", border: "1.5px solid rgba(0,0,0,0.15)", borderRadius: "14px", textDecoration: "none", transition: "border-color .15s, background .15s, color .15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.5)"; e.currentTarget.style.background = "rgba(217,119,6,.05)"; e.currentTarget.style.color = "#d97706"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#374151"; }}
            >
              Why Emeren?
            </a>
          </div>
        </div>
      </div>

      {/* ── Open Positions ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="reveal" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "24px", padding: "40px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", flexShrink: 0 }}>
              <Wrench size={18} />
            </div>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a2e", margin: 0, letterSpacing: "-0.02em" }}>Open Positions</h2>
          </div>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 28px 48px" }}>
            No formal openings right now — but we're always looking for great people.
          </p>

          <div className="roles-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { title: "HVAC Technician", note: "Future opening · Bulacan & Pampanga" },
              { title: "General Interest", note: "Any role · We'd love to hear from you" },
            ].map((r) => (
              <div key={r.title} style={{ border: "1px solid rgba(0,0,0,0.07)", borderRadius: "14px", padding: "20px 22px", background: "#f8f7f4" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d97706", opacity: 0.5 }} />
                  <span className="outfit" style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e" }}>{r.title}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 14px 18px" }}>{r.note}</p>
                <button
                  onClick={scrollToForm}
                  style={{ marginLeft: "18px", fontSize: "12px", fontWeight: 700, color: "#d97706", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Express interest <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Why Emeren ── */}
      <div id="why-emeren" style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "100px", padding: "6px 16px", marginBottom: "16px" }}>
            <Heart size={12} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>Why Work Here</span>
          </div>
          <h2 className="outfit" style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 14px", lineHeight: 1.15 }}>
            More than just a job
          </h2>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }}>
            Emeren is built on trust, craftsmanship, and community. Here's what you can expect when you join us.
          </p>
        </div>

        <div className="perks-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {PERKS.map((p) => (
            <div key={p.title} className="perk-card">
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", marginBottom: "16px" }}>
                {p.icon}
              </div>
              <h3 className="outfit" style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{p.title}</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interest Form ── */}
      <div ref={formRef} style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "0 24px 100px" }}>
        <div className="reveal" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "24px", padding: "40px", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#16a34a" }}>
                <CheckCircle size={32} />
              </div>
              <h3 className="outfit" style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 10px", letterSpacing: "-0.02em" }}>You're on our radar!</h3>
              <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7, margin: "0 0 28px" }}>
                Thanks for expressing interest in joining Emeren. We'll keep your details on file and reach out when we have an opening that fits.
              </p>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button className="cta-btn" style={{ margin: "0 auto" }}>Back to Homepage</button>
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", flexShrink: 0 }}>
                  <Send size={16} />
                </div>
                <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a2e", margin: 0, letterSpacing: "-0.02em" }}>Express Your Interest</h2>
              </div>
              <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 28px 48px" }}>
                No openings yet — but we'd love to hear from you. We'll be in touch.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "6px", letterSpacing: "0.03em" }}>FULL NAME</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Juan dela Cruz"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "6px", letterSpacing: "0.03em" }}>CONTACT NUMBER</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="+63 9XX XXX XXXX"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "6px", letterSpacing: "0.03em" }}>EMAIL ADDRESS</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="juan@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "10px", letterSpacing: "0.03em" }}>ROLE OF INTEREST</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {ROLES.map((r) => (
                      <div
                        key={r.id}
                        className={`role-card${form.role === r.id ? " selected" : ""}`}
                        onClick={() => setForm({ ...form, role: r.id })}
                      >
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>{r.label}</span>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${form.role === r.id ? "#d97706" : "rgba(0,0,0,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color .15s" }}>
                          {form.role === r.id && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#d97706" }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <p style={{ fontSize: "13px", color: "#dc2626", margin: 0, padding: "10px 14px", background: "rgba(220,38,38,0.06)", borderRadius: "10px", border: "1px solid rgba(220,38,38,0.15)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : <><Send size={16} /> Submit Interest</>}
                </button>

                <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
                  Your info is kept private and will only be used to contact you about relevant openings. See our{" "}
                  <Link href="/privacy" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>.
                </p>
              </form>
            </>
          )}
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
              <Link key={l.label} href={l.href} style={{ color: "#d1d5db", fontSize: "12px", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}