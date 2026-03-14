"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ChevronRight, Lock, Eye, Database, UserCheck, Phone, Mail, MapPin } from "lucide-react";

const SECTIONS = [
  { id: "overview",       label: "Overview" },
  { id: "data-collected", label: "Data We Collect" },
  { id: "how-we-use",     label: "How We Use Your Data" },
  { id: "data-sharing",   label: "Data Sharing" },
  { id: "data-security",  label: "Data Security" },
  { id: "your-rights",    label: "Your Rights" },
  { id: "retention",      label: "Data Retention" },
  { id: "contact",        label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("overview");
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
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    setMobileNavOpen(false);
  };

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

        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(50px,-30px) scale(1.07)} 70%{transform:translate(-30px,40px) scale(0.96)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1)} 35%{transform:translate(-60px,25px) scale(1.09)} 70%{transform:translate(40px,-50px) scale(0.94)} }
        @keyframes shimmer { 0%,100%{opacity:.3} 50%{opacity:.55} }
        @keyframes starFloat { 0%,100%{opacity:.08;transform:translateY(0)} 50%{opacity:.2;transform:translateY(-5px)} }

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

        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }

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

        .data-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          background: #fffbf2;
          border: 1px solid rgba(217,119,6,0.2);
          color: #92400e;
          font-size: 13px;
          font-weight: 600;
          margin: 4px;
        }

        .highlight-box {
          background: linear-gradient(135deg, #fffbf2 0%, #fef3c7 100%);
          border: 1px solid rgba(217,119,6,0.2);
          border-radius: 14px;
          padding: 20px 24px;
          margin: 16px 0;
        }

        .highlight-box p {
          color: #92400e !important;
          font-size: 14px !important;
          margin: 0 !important;
        }

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
          .highlight-box { padding: 14px 16px; border-radius: 10px; }
          .data-pill { font-size: 12px; padding: 6px 10px; }
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
            <Shield size={14} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>Privacy Policy</span>
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
            <Shield size={13} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>Data Privacy</span>
          </div>
          <h1 className="outfit" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.7, margin: "0 0 24px" }}>
            At Emeren, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our website and services.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap", rowGap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Effective: <strong style={{ color: "#4b5563" }}>January 1, 2025</strong></span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Updated: <strong style={{ color: "#4b5563" }}>June 2025</strong></span>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#d1d5db", display: "inline-block" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>⚖️ <strong style={{ color: "#4b5563" }}>R.A. 10173 (DPA)</strong></span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="main-layout" style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "40px", alignItems: "start" }}>

        {/* ── Sidebar TOC ── */}
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
        </aside>

        {/* ── Content ── */}
        <main>

          {/* Overview */}
          <div id="overview" className="policy-card reveal">
            <h2>
              <span className="section-icon"><Shield size={18} /></span>
              Overview
            </h2>
            <p>
              This Privacy Policy applies to <strong>Emeren</strong>, an HVAC products and services business operating within <strong>Bulacan and Pampanga, Philippines</strong>. We are committed to protecting your personal information in accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and its Implementing Rules and Regulations.
            </p>
            <p>
              By using our website, placing an order, or requesting a service, you acknowledge and agree to the practices described in this policy. This covers both our e-commerce platform (purchase of air conditioning units) and our services platform (installation, cleaning, repair, and related HVAC services).
            </p>
            <div className="highlight-box">
              <p>
                🛡️ <strong>Our commitment:</strong> We collect only the data necessary to fulfill your order or service request. We do not sell your personal information to third parties.
              </p>
            </div>
          </div>

          {/* Data We Collect */}
          <div id="data-collected" className="policy-card reveal">
            <h2>
              <span className="section-icon"><Database size={18} /></span>
              Data We Collect
            </h2>
            <p>When you place an order or request a service through our website, we collect the following personal information:</p>

            <div style={{ display: "flex", flexWrap: "wrap", margin: "16px 0 24px", gap: "4px" }}>
              {[
                { icon: <UserCheck size={13} />, label: "Full Name" },
                { icon: <MapPin size={13} />, label: "Full Delivery/Service Address" },
                { icon: <Phone size={13} />, label: "Contact Number" },
                { icon: <Mail size={13} />, label: "Email Address" },
                { icon: <Lock size={13} />, label: "Payment Details" },
              ].map((d) => (
                <span key={d.label} className="data-pill">
                  {d.icon} {d.label}
                </span>
              ))}
            </div>

            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Payment Information</p>
            <p>
              For transactions processed through our website, we handle card payment data directly. We also accept payment via <strong>GCash, bank transfer, or cash on delivery/service completion</strong>. Card transactions are processed using industry-standard security measures (see Data Security section). We do not store full card numbers in our database.
            </p>
            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Technical & Usage Data</p>
            <p>
              We do not use third-party analytics or tracking tools (e.g., Google Analytics, Facebook Pixel) on our website. Basic server logs (IP address, browser type, pages visited) may be collected automatically for security and operational purposes only, and are not used for marketing or profiling.
            </p>
          </div>

          {/* How We Use Your Data */}
          <div id="how-we-use" className="policy-card reveal">
            <h2>
              <span className="section-icon"><Eye size={18} /></span>
              How We Use Your Data
            </h2>
            <p>We use your personal information solely for the following purposes:</p>
            <ul>
              <li>Processing and fulfilling your product orders (split-type, cassette, ducted, portable, and multi-split air conditioners)</li>
              <li>Scheduling and dispatching HVAC services including installation, cleaning, repair, and maintenance within Bulacan and Pampanga</li>
              <li>Communicating order confirmations, service schedules, and updates via SMS, call, or email</li>
              <li>Processing payments and issuing receipts or invoices</li>
              <li>Handling after-sales concerns, warranty claims, and customer support</li>
              <li>Complying with legal and regulatory obligations under Philippine law</li>
            </ul>
            <div className="highlight-box">
              <p>
                📧 <strong>No unsolicited marketing:</strong> We will not send promotional emails or messages without your explicit consent. You may opt out of any communications at any time.
              </p>
            </div>
          </div>

          {/* Data Sharing */}
          <div id="data-sharing" className="policy-card reveal">
            <h2>
              <span className="section-icon"><UserCheck size={18} /></span>
              Data Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share your data only in the following limited circumstances:
            </p>
            <ul>
              <li><strong>Service Delivery Partners:</strong> Technicians or delivery personnel assigned to fulfill your order or service request within Bulacan or Pampanga. They receive only the information necessary to complete the job (name, address, contact number).</li>
              <li><strong>Payment Processors:</strong> When you pay by card or via GCash/bank transfer, your payment details are handled by the respective payment platform under their own privacy policies.</li>
              <li><strong>Legal Compliance:</strong> We may disclose your data to government authorities or law enforcement if required by applicable Philippine laws, a valid court order, or other legal processes.</li>
            </ul>
            <p>
              All third parties who access your data are bound by confidentiality obligations and are only permitted to use your data for the specific purpose of fulfilling your transaction.
            </p>
          </div>

          {/* Data Security */}
          <div id="data-security" className="policy-card reveal">
            <h2>
              <span className="section-icon"><Lock size={18} /></span>
              Data Security
            </h2>
            <p>
              We store your personal data in our own secure database and take the following measures to protect it:
            </p>
            <ul>
              <li>Encrypted data transmission using HTTPS/TLS protocols across all pages of our website</li>
              <li>Access to your data is restricted to authorized Emeren personnel only, on a need-to-know basis</li>
              <li>Card payment data is handled in accordance with payment card security standards — full card numbers are never stored in our systems</li>
              <li>Regular security reviews of our database and access controls</li>
              <li>Employees with access to personal data are trained on data privacy obligations</li>
            </ul>
            <p>
              While we implement these safeguards, no method of transmission over the internet is 100% secure. In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and the National Privacy Commission (NPC) as required under R.A. 10173 within 72 hours of discovery.
            </p>
          </div>

          {/* Your Rights */}
          <div id="your-rights" className="policy-card reveal">
            <h2>
              <span className="section-icon"><UserCheck size={18} /></span>
              Your Rights Under the Data Privacy Act
            </h2>
            <p>
              As a data subject under the <strong>Data Privacy Act of 2012</strong>, you have the following rights with respect to your personal data:
            </p>
            <ul>
              <li><strong>Right to be Informed:</strong> You have the right to know how your personal data is being collected and used.</li>
              <li><strong>Right to Access:</strong> You may request a copy of the personal information we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You may request correction of any inaccurate or incomplete personal data.</li>
              <li><strong>Right to Erasure or Blocking:</strong> You may request deletion or blocking of your personal data under certain conditions.</li>
              <li><strong>Right to Object:</strong> You may object to the processing of your personal data for certain purposes, including direct marketing.</li>
              <li><strong>Right to Data Portability:</strong> You may request a copy of your data in a structured, commonly used format.</li>
              <li><strong>Right to Damages:</strong> You are entitled to compensation if you suffer damage due to inaccurate, incomplete, or unauthorized use of your personal data.</li>
              <li><strong>Right to Complain:</strong> You may file a complaint with the <strong>National Privacy Commission (NPC)</strong> if you believe your rights have been violated.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the details in the Contact section below. We will respond to your request within a reasonable time frame, and no later than 15 business days from receipt.
            </p>
          </div>

          {/* Data Retention */}
          <div id="retention" className="policy-card reveal">
            <h2>
              <span className="section-icon"><Database size={18} /></span>
              Data Retention
            </h2>
            <p>
              We retain your personal data for as long as it is necessary to fulfill the purposes outlined in this policy, or as required by Philippine law and regulations. Specifically:
            </p>
            <ul>
              <li>Order and service records are retained for a minimum of <strong>5 years</strong> for tax, warranty, and legal compliance purposes.</li>
              <li>If you request deletion of your account or data, we will process this within 15 business days, except where retention is required by law.</li>
              <li>Server logs are purged after 90 days unless required for an active security investigation.</li>
            </ul>
            <p>
              Upon expiry of the retention period, your personal data will be securely deleted or anonymized in a manner that prevents unauthorized reconstruction.
            </p>
          </div>

          {/* Contact */}
          <div id="contact" className="policy-card reveal">
            <h2>
              <span className="section-icon"><Phone size={18} /></span>
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your data privacy rights, or need to report a data concern, please reach out to us:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", margin: "20px 0" }}>
              {[
                { icon: <Phone size={16} />, label: "Phone", value: "+63 961 093 1586" },
                { icon: <MapPin size={16} />, label: "Service Areas", value: "Bulacan & Pampanga, Philippines" },
              ].map((c) => (
                <div key={c.label} style={{ background: "#f8f7f4", borderRadius: "14px", padding: "18px 20px", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#d97706" }}>{c.icon}<span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9ca3af" }}>{c.label}</span></div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>{c.value}</p>
                </div>
              ))}
            </div>

            <p>
              We may update this Privacy Policy from time to time. Any material changes will be communicated via a notice on our website. Your continued use of our services after any changes constitutes your acceptance of the revised policy.
            </p>

            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <button className="cta-btn" style={{ padding: "12px 24px", fontSize: "14px" }}>
                  Back to Homepage
                </button>
              </Link>
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <button style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700, borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.15)", background: "transparent", color: "#374151", cursor: "pointer", transition: "border-color .15s, background .15s, color .15s", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
        <Shield size={14} /> Contents
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
              <Link key={l.label} href={l.href} style={{ color: l.href === "/privacy" ? "#d97706" : "#d1d5db", fontSize: "12px", textDecoration: "none", fontWeight: l.href === "/privacy" ? 700 : 400, transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = l.href === "/privacy" ? "#d97706" : "#d1d5db")}
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