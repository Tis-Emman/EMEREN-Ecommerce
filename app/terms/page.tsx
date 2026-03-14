"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText, ChevronRight, ShoppingCart, Wrench, CreditCard,
  RotateCcw, AlertTriangle, Scale, MapPin, Phone, Mail, Ban, Star
} from "lucide-react";

const SECTIONS = [
  { id: "acceptance",       label: "Acceptance of Terms" },
  { id: "services",         label: "Our Services" },
  { id: "orders",           label: "Orders & Purchases" },
  { id: "service-requests", label: "Service Requests" },
  { id: "payment",          label: "Payment Terms" },
  { id: "cancellation",     label: "Cancellation & Returns" },
  { id: "liability",        label: "Limitation of Liability" },
  { id: "prohibited",       label: "Prohibited Use" },
  { id: "governing-law",    label: "Governing Law" },
  { id: "contact",          label: "Contact Us" },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");
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

        .nav-link { position: relative; }
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

        .warning-box {
          background: linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 14px;
          padding: 20px 24px;
          margin: 16px 0;
        }

        .warning-box p {
          color: #991b1b !important;
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

        .service-badge {
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
          .highlight-box, .warning-box { padding: 14px 16px; border-radius: 10px; }
          .service-badge { font-size: 12px; padding: 6px 10px; }
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
          max-height: 80vh;
          overflow-y: auto;
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
            <FileText size={14} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>Terms of Service</span>
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
            <FileText size={13} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>Legal Agreement</span>
          </div>
          <h1 className="outfit" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.7, margin: "0 0 24px" }}>
            Please read these terms carefully before using our website or placing an order. By accessing Emeren's platform, you agree to be bound by the following terms and conditions.
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

          {/* 1. Acceptance */}
          <div id="acceptance" className="policy-card reveal">
            <h2><span className="section-icon"><FileText size={18} /></span>Acceptance of Terms</h2>
            <p>
              Welcome to <strong>Emeren</strong>. By accessing or using our website, placing a product order, or requesting any HVAC service, you confirm that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our <Link href="/privacy" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you ("Customer," "User") and Emeren ("we," "us," "our"), a business operating within <strong>Bulacan and Pampanga, Philippines</strong>. If you do not agree with any part of these Terms, you must not use our website or services.
            </p>
            <p>
              We reserve the right to update or modify these Terms at any time. Continued use of our platform after any changes are posted constitutes acceptance of the revised Terms. The date of the most recent revision is indicated at the top of this page.
            </p>
            <div className="highlight-box">
              <p><strong>Minimum age requirement:</strong> You must be at least 18 years old, or have the consent of a parent or legal guardian, to place an order or enter into any agreement with Emeren.</p>
            </div>
          </div>

          {/* 2. Services */}
          <div id="services" className="policy-card reveal">
            <h2><span className="section-icon"><Wrench size={18} /></span>Our Services</h2>
            <p>Emeren offers two primary categories of offerings through our platform:</p>

            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>E-Commerce — Aircon Units</p>
            <p>We sell various types of air conditioning units for delivery within our service area. Available product types include:</p>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "12px 0 20px", gap: "4px" }}>
              {["Split-Type", "Cassette", "Ducted", "Portable", "Multi-Split"].map((t) => (
                <span key={t} className="service-badge">{t}</span>
              ))}
            </div>

            <div className="divider" />

            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>HVAC Services</p>
            <p>We provide on-site HVAC services performed by our technicians. Service types include:</p>
            <ul>
              <li>Air conditioner installation (wall-mounted, ceiling cassette, and ducted systems)</li>
              <li>Unit cleaning and preventive maintenance</li>
              <li>Repair and troubleshooting of existing air conditioning units</li>
              <li>Refrigerant recharging and leak detection</li>
              <li>Post-purchase installation of units purchased through our store</li>
            </ul>

            <div className="highlight-box">
              <p><strong>Service area:</strong> All product deliveries and on-site services are available within <strong>Bulacan and Pampanga only</strong>. Orders or requests from outside this area will not be fulfilled, and a full refund will be issued if accepted in error.</p>
            </div>

            <p>
              Emeren reserves the right to modify, suspend, or discontinue any product or service at any time without prior notice, though we will make reasonable efforts to inform affected customers.
            </p>
          </div>

          {/* 3. Orders & Purchases */}
          <div id="orders" className="policy-card reveal">
            <h2><span className="section-icon"><ShoppingCart size={18} /></span>Orders & Purchases</h2>
            <p>
              All product orders placed through our website are subject to availability and confirmation. Submitting an order constitutes an offer to purchase — a binding contract is formed only upon our written or electronic confirmation of your order.
            </p>
            <ul>
              <li>Product descriptions, images, and prices on our website are as accurate as possible. Emeren reserves the right to correct pricing errors before an order is confirmed.</li>
              <li>We reserve the right to refuse or cancel any order at our discretion, including cases of suspected fraud, pricing errors, or delivery address outside our service area.</li>
              <li>Delivery timelines are estimates and not guaranteed. Delays due to unforeseen circumstances (weather, logistics, supply) do not constitute a breach of these Terms.</li>
              <li>Risk of loss or damage to products transfers to the customer upon delivery and acknowledgment of receipt.</li>
              <li>All listed prices are in <strong>Philippine Peso (₱)</strong> and are inclusive of applicable taxes unless otherwise stated.</li>
            </ul>
            <div className="highlight-box">
              <p><strong>Order confirmation:</strong> You will receive an order confirmation via email and/or SMS. Please review it carefully and contact us immediately if any details are incorrect.</p>
            </div>
          </div>

          {/* 4. Service Requests */}
          <div id="service-requests" className="policy-card reveal">
            <h2><span className="section-icon"><Wrench size={18} /></span>Service Requests</h2>
            <p>
              When you submit a service request (installation, cleaning, repair, etc.), you agree to the following conditions:
            </p>
            <ul>
              <li>You must provide an accurate service address within Bulacan or Pampanga. Requests outside our service area will be declined.</li>
              <li>An adult (18 years or older) must be present at the service location at the agreed time of the appointment.</li>
              <li>You are responsible for ensuring safe access to the unit and work area for our technicians. Emeren is not liable for damages arising from restricted, unsafe, or incorrectly described work areas.</li>
              <li>Service appointments are subject to technician availability. We will confirm your schedule via call, SMS, or email.</li>
              <li>If our technician determines upon arrival that the work cannot be safely or effectively completed due to conditions not disclosed during booking, the appointment may be rescheduled or declined. A cancellation fee may apply (see Cancellation section).</li>
              <li>Any damage to property caused by our technicians due to negligence will be assessed on a case-by-case basis. Pre-existing damage must be disclosed prior to service commencement.</li>
            </ul>
            <div className="highlight-box">
              <p><strong>Rescheduling:</strong> Please notify us at least <strong>24 hours in advance</strong> if you need to reschedule a service appointment to avoid incurring a rescheduling fee.</p>
            </div>
          </div>

          {/* 5. Payment Terms */}
          <div id="payment" className="policy-card reveal">
            <h2><span className="section-icon"><CreditCard size={18} /></span>Payment Terms</h2>
            <p>
              Emeren accepts the following payment methods:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", margin: "16px 0 20px" }}>
              {[
                { label: "Credit / Debit Card", desc: "Processed securely via our payment gateway" },
                { label: "GCash", desc: "Digital wallet payment on delivery or service completion" },
                { label: "Bank Transfer", desc: "Direct transfer to our registered account" },
                { label: "Cash on Delivery", desc: "For product orders upon receipt" },
                { label: "Cash on Service", desc: "For HVAC services upon completion" },
              ].map((m) => (
                <div key={m.label} style={{ background: "#f8f7f4", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "12px", padding: "14px 16px" }}>
                  <p style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", margin: "0 0 4px" }}>{m.label}</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              ))}
            </div>
            <ul>
              <li>Payment is due in full at the time of delivery (for product orders) or upon service completion, unless otherwise agreed in writing.</li>
              <li>For card payments processed via our website, your card details are handled securely. We do not store full card numbers on our servers.</li>
              <li>In the event of a disputed charge, please contact us within <strong>7 days</strong> of the transaction date.</li>
              <li>Emeren reserves the right to charge applicable late fees or withhold future service in cases of non-payment or dishonored transactions.</li>
            </ul>
            <div className="warning-box">
              <p> <strong>Fraud prevention:</strong> Any attempt to use fraudulent payment methods or initiate false chargebacks may result in legal action in accordance with Philippine law.</p>
            </div>
          </div>

          {/* 6. Cancellation & Returns */}
          <div id="cancellation" className="policy-card reveal">
            <h2><span className="section-icon"><RotateCcw size={18} /></span>Cancellation & Returns</h2>

            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Product Orders</p>
            <ul>
              <li>Orders may be cancelled free of charge if cancelled before the item has been dispatched for delivery. Contact us immediately after placing your order if you wish to cancel.</li>
              <li>Once a unit has been dispatched, cancellations are subject to a restocking and logistics fee.</li>
              <li>Returns are accepted within <strong>7 days</strong> of delivery for units that are unused, in original packaging, and accompanied by proof of purchase.</li>
              <li>Units that have been installed, used, or damaged by the customer are not eligible for return.</li>
              <li>Defective units covered under manufacturer warranty will be handled through the applicable warranty process.</li>
            </ul>

            <div className="divider" />

            <p style={{ fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Service Appointments</p>
            <ul>
              <li>Service appointments cancelled at least <strong>24 hours before</strong> the scheduled time are cancelled at no charge.</li>
              <li>Cancellations made less than 24 hours before the appointment or no-shows may be subject to a cancellation fee to cover technician mobilization costs.</li>
              <li>Emeren reserves the right to cancel or reschedule appointments due to technician unavailability, safety concerns, or force majeure events. In such cases, no cancellation fee will be charged.</li>
            </ul>

            <div className="highlight-box">
              <p><strong>To cancel or reschedule:</strong> Contact us via phone, email, or our website's contact form as early as possible. All cancellation requests must be confirmed by our team to be valid.</p>
            </div>
          </div>

          {/* 7. Limitation of Liability */}
          <div id="liability" className="policy-card reveal">
            <h2><span className="section-icon"><AlertTriangle size={18} /></span>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable Philippine law, Emeren shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our products or services, including but not limited to:
            </p>
            <ul>
              <li>Loss of income, revenue, or business opportunity</li>
              <li>Property damage not directly caused by the negligence of our technicians</li>
              <li>Delays in delivery or service scheduling beyond our reasonable control</li>
              <li>Interruption or failure of utility services (electricity, water) during service</li>
              <li>Incompatibility of purchased units with the customer's existing electrical system or physical space, where such incompatibility was not disclosed at the time of purchase</li>
            </ul>
            <p>
              Our total cumulative liability to you for any claims arising from a specific transaction shall not exceed the total amount paid by you for that transaction.
            </p>
            <div className="warning-box">
              <p> <strong>Product warranties</strong> are governed by the terms of the respective manufacturer. Emeren will assist in facilitating warranty claims but is not itself the warrantor of third-party brands.</p>
            </div>
          </div>

          {/* 8. Prohibited Use */}
          <div id="prohibited" className="policy-card reveal">
            <h2><span className="section-icon"><Ban size={18} /></span>Prohibited Use</h2>
            <p>You agree not to use our website or services for any of the following purposes:</p>
            <ul>
              <li>Submitting false, misleading, or fraudulent orders or service requests</li>
              <li>Impersonating another person or misrepresenting your identity or affiliation</li>
              <li>Attempting to gain unauthorized access to our systems, databases, or customer data</li>
              <li>Using our platform to distribute spam, malware, or other harmful content</li>
              <li>Engaging in any activity that disrupts or interferes with the normal functioning of our website</li>
              <li>Reselling our products or services without prior written authorization from Emeren</li>
              <li>Any activity that violates Philippine law, including the Cybercrime Prevention Act of 2012 (R.A. 10175)</li>
            </ul>
            <p>
              Violation of these prohibitions may result in immediate suspension of access to our platform, cancellation of pending orders, and legal action where warranted.
            </p>
          </div>

          {/* 9. Governing Law */}
          <div id="governing-law" className="policy-card reveal">
            <h2><span className="section-icon"><Scale size={18} /></span>Governing Law & Dispute Resolution</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the <strong>Republic of the Philippines</strong>, without regard to its conflict of law principles.
            </p>
            <p>
              Any dispute arising from or related to these Terms, your use of our platform, or any transaction with Emeren shall first be subject to good-faith negotiation between the parties. If the dispute cannot be resolved informally within 30 days, it shall be submitted to the appropriate courts or regulatory bodies with jurisdiction in the Province of <strong>Bulacan or Pampanga</strong>, Philippines.
            </p>
            <p>
              For consumer complaints, you may also escalate unresolved concerns to the <strong>Department of Trade and Industry (DTI)</strong> or the <strong>National Privacy Commission (NPC)</strong> as applicable.
            </p>
            <div className="highlight-box">
              <p><strong>Our preference:</strong> We believe most concerns can be resolved directly. Please reach out to us first — we're committed to resolving any issue fairly and promptly.</p>
            </div>
          </div>

          {/* 10. Contact */}
          <div id="contact" className="policy-card reveal">
            <h2><span className="section-icon"><Phone size={18} /></span>Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, need clarification on a policy, or wish to raise a concern, please get in touch:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", margin: "20px 0" }}>
              {[
                { icon: <Phone size={16} />, label: "Phone", value: "+63 961 093 1586" },
                { icon: <MapPin size={16} />, label: "Service Area", value: "Bulacan & Pampanga, Philippines" },
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

            <p>
              These Terms of Service, together with our <Link href="/privacy" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link> and <Link href="/cookies" style={{ color: "#d97706", textDecoration: "none", fontWeight: 600 }}>Cookie Policy</Link>, constitute the entire agreement between you and Emeren with respect to your use of our platform.
            </p>

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
        <FileText size={14} /> Contents
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
              <Link
                key={l.label}
                href={l.href}
                style={{ color: l.href === "/terms" ? "#d97706" : "#d1d5db", fontSize: "12px", textDecoration: "none", fontWeight: l.href === "/terms" ? 700 : 400, transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = l.href === "/terms" ? "#d97706" : "#d1d5db")}
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