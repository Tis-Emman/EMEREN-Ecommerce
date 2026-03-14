"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Triangle, ArrowRight, Star, ShoppingCart, User, LogOut,
  Check, Phone, MapPin, Clock, Shield, Droplets, Wind,
  ChevronRight, Wrench, CalendarCheck, BadgeCheck, Thermometer,
  Home, Store,
} from "lucide-react";
import { SERVICES, type Service } from "@/lib/services";

const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

// ── SVG Icons ────────────────────────────────────────────────────────────────
function WindowACIcon() {
  return (
    <svg width="90" height="63" viewBox="0 0 100 70" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.2))" }}>
      <rect x="5" y="10" width="90" height="50" rx="6" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      {[18,24,30,36].map((x) => <line key={x} x1={x} y1="18" x2={x} y2="52" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[28,35,42,49].map((y) => <line key={y} x1="48" y1={y} x2="88" y2={y} stroke="rgba(217,119,6,0.15)" strokeWidth="1.5" strokeLinecap="round"/>)}
      <rect x="48" y="16" width="40" height="26" rx="4" fill="rgba(217,119,6,0.05)" stroke="rgba(217,119,6,0.15)" strokeWidth="1"/>
      <circle cx="82" cy="21" r="4" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
      <circle cx="82" cy="21" r="1.5" fill="#22c55e"/>
      <text x="63" y="35" textAnchor="middle" fontSize="11" fontWeight="700" fill="#d97706" fontFamily="Outfit,sans-serif">18°C</text>
      <circle cx="20" cy="62" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="30" cy="65" r="1.5" fill="#93c5fd" opacity="0.4"/>
      <circle cx="40" cy="62" r="2" fill="#93c5fd" opacity="0.5"/>
    </svg>
  );
}

function SplitACIcon() {
  return (
    <svg width="90" height="81" viewBox="0 0 100 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.2))" }}>
      <rect x="8" y="6" width="84" height="28" rx="7" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      {[20,28,36,44,52,60,68,76].map((x) => <line key={x} x1={x} y1="12" x2={x} y2="28" stroke="rgba(217,119,6,0.15)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="84" cy="14" r="3" fill="#22c55e" opacity="0.8"/>
      <path d="M10 30 Q50 36 90 30" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="25" y1="34" x2="25" y2="54" stroke="rgba(0,0,0,0.1)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="34" x2="30" y2="54" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="54" width="84" height="30" rx="6" fill="#fff" stroke="rgba(217,119,6,0.25)" strokeWidth="1.5"/>
      <circle cx="35" cy="69" r="10" fill="rgba(217,119,6,0.05)" stroke="rgba(217,119,6,0.2)" strokeWidth="1.2"/>
      <circle cx="35" cy="69" r="4" fill="rgba(217,119,6,0.1)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
      {[0,60,120,180,240,300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={deg} x1={35 + 4.5*Math.cos(rad)} y1={69 + 4.5*Math.sin(rad)} x2={35 + 8.5*Math.cos(rad)} y2={69 + 8.5*Math.sin(rad)} stroke="rgba(217,119,6,0.25)" strokeWidth="1.2"/>;
      })}
      {[52,58,64,70,76,82].map((x) => <line key={x} x1={x} y1="58" x2={x} y2="80" stroke="rgba(217,119,6,0.12)" strokeWidth="1.2" strokeLinecap="round"/>)}
    </svg>
  );
}

function FridgeIcon() {
  return (
    <svg width="70" height="100" viewBox="0 0 70 100" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.2))" }}>
      {/* Main body */}
      <rect x="8" y="5" width="54" height="90" rx="8" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      {/* Freezer compartment */}
      <rect x="8" y="5" width="54" height="32" rx="8" fill="rgba(147,197,253,0.08)" stroke="rgba(217,119,6,0.2)" strokeWidth="1"/>
      {/* Divider line */}
      <line x1="8" y1="37" x2="62" y2="37" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5"/>
      {/* Freezer handle */}
      <rect x="48" y="16" width="6" height="14" rx="3" fill="rgba(217,119,6,0.15)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
      {/* Fridge handle */}
      <rect x="48" y="52" width="6" height="20" rx="3" fill="rgba(217,119,6,0.15)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
      {/* Freezer snowflake hint */}
      <line x1="25" y1="17" x2="25" y2="29" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="23" x2="31" y2="23" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20.5" y1="18.5" x2="29.5" y2="27.5" stroke="rgba(147,197,253,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="29.5" y1="18.5" x2="20.5" y2="27.5" stroke="rgba(147,197,253,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Fridge shelves */}
      <line x1="14" y1="58" x2="56" y2="58" stroke="rgba(217,119,6,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="14" y1="70" x2="56" y2="70" stroke="rgba(217,119,6,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="14" y1="82" x2="56" y2="82" stroke="rgba(217,119,6,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      {/* Status light */}
      <circle cx="16" cy="43" r="3" fill="#22c55e" opacity="0.7"/>
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.18))" }}>
      <path d="M22 68 L52 38" stroke="rgba(217,119,6,0.7)" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="18" cy="72" r="8" fill="#fff" stroke="rgba(217,119,6,0.4)" strokeWidth="2"/>
      <circle cx="18" cy="72" r="3.5" fill="rgba(217,119,6,0.2)" stroke="rgba(217,119,6,0.5)" strokeWidth="1.5"/>
      <path d="M52 38 C52 28 62 20 70 24 L62 32 L66 36 L74 28 C78 36 70 46 60 46 Z" fill="#fff" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5"/>
      <path d="M65 25 L30 60" stroke="rgba(59,130,246,0.5)" strokeWidth="3.5" strokeLinecap="round"/>
      <rect x="26" y="56" width="8" height="12" rx="2" transform="rotate(-45 26 56)" fill="#fff" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <rect x="10" y="10" width="36" height="18" rx="5" fill="#fff" stroke="rgba(217,119,6,0.25)" strokeWidth="1.5"/>
      {[16,21,26,30,34].map((x) => <line key={x} x1={x} y1="14" x2={x} y2="24" stroke="rgba(217,119,6,0.15)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="40" cy="13" r="2.5" fill="#22c55e" opacity="0.7"/>
    </svg>
  );
}

function RechargeIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.18))" }}>
      <rect x="30" y="30" width="24" height="42" rx="8" fill="#fff" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5"/>
      <rect x="36" y="22" width="12" height="12" rx="4" fill="#fff" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
      <line x1="42" y1="22" x2="42" y2="18" stroke="rgba(34,197,94,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="42" cy="48" r="10" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
      <path d="M36 52 A8 8 0 0 1 48 44" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="42" y1="48" x2="46" y2="44" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M54 52 Q68 52 68 40 Q68 28 58 26" stroke="rgba(34,197,94,0.4)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="16" y1="30" x2="16" y2="42" stroke="rgba(147,197,253,0.7)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="36" x2="22" y2="36" stroke="rgba(147,197,253,0.7)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11.5" y1="31.5" x2="20.5" y2="40.5" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20.5" y1="31.5" x2="11.5" y2="40.5" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.18))" }}>
      <rect x="5" y="20" width="32" height="16" rx="5" fill="rgba(217,119,6,0.06)" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeDasharray="3 2"/>
      <path d="M40 28 L58 28" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M54 23 L60 28 L54 33" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="53" y="20" width="32" height="16" rx="5" fill="#fff" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5"/>
      {[59,64,69,73,77].map((x) => <line key={x} x1={x} y1="24" x2={x} y2="32" stroke="rgba(217,119,6,0.2)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="81" cy="23" r="2.5" fill="#22c55e" opacity="0.8"/>
      <line x1="5" y1="44" x2="37" y2="44" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="53" y1="44" x2="85" y2="44" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="5" y="54" width="26" height="20" rx="5" fill="rgba(217,119,6,0.05)" stroke="rgba(217,119,6,0.15)" strokeWidth="1.5" strokeDasharray="3 2"/>
      <rect x="59" y="54" width="26" height="20" rx="5" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      <circle cx="72" cy="64" r="6" fill="rgba(217,119,6,0.06)" stroke="rgba(217,119,6,0.2)" strokeWidth="1.2"/>
      <circle cx="72" cy="64" r="2.5" fill="rgba(217,119,6,0.1)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
    </svg>
  );
}

function DismantleIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(239,68,68,0.15))" }}>
      <rect x="12" y="18" width="50" height="22" rx="6" fill="#fff" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"/>
      {[20,26,32,38,44,50].map((x) => <line key={x} x1={x} y1="23" x2={x} y2="36" stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="57" cy="22" r="2.5" fill="#ef4444" opacity="0.5"/>
      <path d="M62 20 L72 14" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M69 14 L72 14 L72 17" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M62 40 L72 46" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M69 46 L72 46 L72 43" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="22" r="3" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
      <line x1="14.5" y1="22" x2="17.5" y2="22" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="58" cy="36" r="3" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
      <line x1="56.5" y1="36" x2="59.5" y2="36" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M20 58 L38 76" stroke="rgba(217,119,6,0.6)" strokeWidth="4" strokeLinecap="round"/>
      <rect x="14" y="52" width="10" height="10" rx="2" transform="rotate(-45 14 52)" fill="#fff" stroke="rgba(217,119,6,0.4)" strokeWidth="1.5"/>
      <rect x="60" y="58" width="20" height="6" rx="2" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.12)" strokeWidth="1" transform="rotate(15 60 58)"/>
    </svg>
  );
}

// ── Icon picker ───────────────────────────────────────────────────────────────
function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  switch (icon) {
    case "window":    return <WindowACIcon />;
    case "split":     return <SplitACIcon />;
    case "fridge":    return <FridgeIcon />;
    case "tools":     return <ToolsIcon />;
    case "recharge":  return <RechargeIcon />;
    case "move":      return <MoveIcon />;
    case "dismantle": return <DismantleIcon />;
  }
}

// ── Location badge ────────────────────────────────────────────────────────────
function LocationBadge({ location }: { location: Service["location"] }) {
  const configs = {
    "on-site":  { label: "On-Site Service",       icon: <Home  size={11} color="#d97706" />, bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)",  color: "#b45309" },
    "in-store": { label: "In-Store Service",       icon: <Store size={11} color="#6b7280" />, bg: "rgba(0,0,0,0.04)",       border: "rgba(0,0,0,0.1)",      color: "#6b7280" },
    "both":     { label: "On-Site or In-Store",    icon: <MapPin size={11} color="#7c3aed" />, bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.2)", color: "#7c3aed" },
  };
  const c = configs[location];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "100px", background: c.bg, border: `1px solid ${c.border}` }}>
      {c.icon}
      <span style={{ fontSize: "11px", fontWeight: 700, color: c.color }}>{c.label}</span>
    </div>
  );
}

// ── Cleaning Card ─────────────────────────────────────────────────────────────
function CleaningCard({ service: s, index: i }: { service: Service; index: number }) {
  const [selected, setSelected] = useState(0);
  const variant = s.variants![selected];

  return (
    <div className="service-card" style={{ animationDelay: `${i * 0.08}s` }}>
      {/* Image area */}
      <div style={{ padding: "32px 24px 20px", background: "linear-gradient(145deg,#f0ede8 0%,#faf9f6 60%,#ede9e2 100%)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(217,119,6,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10px", left: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(217,119,6,0.04)", pointerEvents: "none" }} />
        {s.badge && (
          <span style={{ position: "absolute", top: "14px", left: "14px", padding: "3px 10px", borderRadius: "7px", fontSize: "10px", fontWeight: 700, background: "#d97706", color: "#fff" }}>
            {s.badge}
          </span>
        )}
        {s.icon === "window" ? <WindowACIcon /> : <SplitACIcon />}
        <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "100px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <Droplets size={11} color="#16a34a" />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a" }}>Deep Cleaning Service</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", margin: 0 }}>{s.type}</p>
          <LocationBadge location={s.location} />
        </div>
        <h3 className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", margin: "4px 0 10px", letterSpacing: "-0.3px" }}>{s.name}</h3>
        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, marginBottom: "16px" }}>{s.description}</p>

        {/* Includes */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>What's Included</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
            {s.includes.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "5px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <Check size={9} color="#d97706" strokeWidth={3} />
                </span>
                <span style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <Clock size={13} color="#9ca3af" />
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Estimated duration:</span>
          <span style={{ fontSize: "12px", color: "#1a1a2e", fontWeight: 700 }}>{s.duration}</span>
        </div>

        {/* Variant selector */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Select Type</p>
          <div style={{ display: "flex", gap: "8px" }}>
            {s.variants!.map((v, idx) => (
              <button key={v.label} onClick={() => setSelected(idx)}
                style={{ flex: 1, padding: "10px 8px", borderRadius: "10px", cursor: "pointer", border: selected === idx ? "1.5px solid #d97706" : "1.5px solid rgba(0,0,0,0.1)", background: selected === idx ? "rgba(217,119,6,0.06)" : "#fff", transition: "all .15s", textAlign: "center" as const, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: selected === idx ? "#d97706" : "#374151", margin: 0 }}>{v.label}</p>
                {v.sublabel && <p style={{ fontSize: "10px", color: selected === idx ? "#d97706" : "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>{v.sublabel}</p>}
              </button>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div>
            <p style={{ fontSize: "10px", color: "#9ca3af", margin: "0 0 1px", fontWeight: 500 }}>Service fee</p>
            <span className="outfit" style={{ fontSize: "26px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px" }}>{formatPrice(variant.price)}</span>
          </div>
          <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer" className="book-btn">
            <Phone size={14} /> Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Repair / Other AC Card ────────────────────────────────────────────────────
function RepairCard({ service: s, index: i }: { service: Service; index: number }) {
  const accentColors: Record<string, { bg: string; border: string; check: string; badge: string; label: string; labelColor: string }> = {
    Repair:      { bg: "rgba(59,130,246,0.06)",  border: "rgba(59,130,246,0.18)",  check: "#2563eb", badge: "#16a34a", label: "Repair Service",    labelColor: "#2563eb" },
    Recharge:    { bg: "rgba(34,197,94,0.05)",   border: "rgba(34,197,94,0.15)",   check: "#16a34a", badge: "#16a34a", label: "Recharge Service",  labelColor: "#16a34a" },
    Relocation:  { bg: "rgba(217,119,6,0.05)",   border: "rgba(217,119,6,0.15)",   check: "#d97706", badge: "#d97706", label: "Relocation Service",labelColor: "#b45309" },
    Dismantle:   { bg: "rgba(239,68,68,0.05)",   border: "rgba(239,68,68,0.12)",   check: "#ef4444", badge: "#6b7280", label: "Dismantle Service", labelColor: "#ef4444" },
  };
  const ac = accentColors[s.type] ?? accentColors.Repair;
  return (
    <div className="service-card repair-card" style={{ animationDelay: `${i * 0.08}s` }}>
      {/* Image area */}
      <div style={{ padding: "32px 24px 20px", background: `linear-gradient(145deg,${ac.bg.replace('0.06','0.12')} 0%,#f8f7f4 60%,${ac.bg} 100%)`, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "130px", height: "130px", borderRadius: "50%", background: ac.bg, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10px", left: "-10px", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(217,119,6,0.04)", pointerEvents: "none" }} />
        {s.badge && (
          <span style={{ position: "absolute", top: "14px", left: "14px", padding: "3px 10px", borderRadius: "7px", fontSize: "10px", fontWeight: 700, background: ac.badge, color: "#fff" }}>
            {s.badge}
          </span>
        )}
        <ServiceIcon icon={s.icon} />
        <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "100px", background: ac.bg, border: `1px solid ${ac.border}` }}>
          <Wrench size={11} color={ac.labelColor} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: ac.labelColor }}>{ac.label}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", margin: 0 }}>{s.type}</p>
          <LocationBadge location={s.location} />
        </div>
        <h3 className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", margin: "4px 0 10px", letterSpacing: "-0.3px" }}>{s.name}</h3>
        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, marginBottom: "16px" }}>{s.description}</p>

        {/* Unit types */}
        {s.unitTypes && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Unit Types Covered</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {s.unitTypes.map((unit) => (
                <span key={unit} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, color: "#374151", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)" }}>
                  <Thermometer size={10} color="#9ca3af" /> {unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Includes */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>What's Included</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
            {s.includes.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "5px", background: ac.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <Check size={9} color={ac.check} strokeWidth={3} />
                </span>
                <span style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <Clock size={13} color="#9ca3af" />
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>{s.duration}</span>
        </div>

        {/* Free diagnosis note */}
        <div style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", marginBottom: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <BadgeCheck size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#15803d", margin: "0 0 2px" }}>Free Diagnosis — No upfront cost</p>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>We assess the unit and give you a clear quote. You decide before any work starts.</p>
          </div>
        </div>

        <div style={{ display: "flex", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer" className="book-btn" style={{ flex: 1, justifyContent: "center" }}>
            <Phone size={14} /> Book via Messenger
          </a>
        </div>
      </div>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", textAlign: "left" as const }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e" }}>{question}</span>
        <ChevronRight size={16} color="#9ca3af" style={{ transition: "transform .2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: "12px" }} />
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const router = useRouter();
  const [scrolled,     setScrolled]     = useState(false);
  const [user,         setUser]         = useState<{ email: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartCount,    setCartCount]    = useState(0);

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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null); setUserMenuOpen(false);
    router.push("/");
  };

  const cleaningServices = SERVICES.filter((s) => s.type === "Cleaning");
  const repairServices   = SERVICES.filter((s) => s.type === "Repair");
  const otherACServices  = SERVICES.filter((s) => ["Recharge", "Relocation", "Dismantle"].includes(s.type));

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .brand  { font-family:'Outfit',sans-serif; letter-spacing:-0.02em; }
        .outfit { font-family:'Outfit',sans-serif; }
        .glass  { background:rgba(248,247,244,0.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .service-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 24px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05); animation: fadeUp .5s ease both;
          transition: transform .25s, box-shadow .25s, border-color .25s;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(0,0,0,0.1); border-color: rgba(217,119,6,.2); }
        .repair-card:hover  { border-color: rgba(37,99,235,.2); }
        .book-btn {
          display: inline-flex; align-items: center; gap: 7px; padding: 12px 20px; border-radius: 12px;
          background: #d97706; color: #fff; font-size: 13px; font-weight: 700; text-decoration: none;
          cursor: pointer; transition: background .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35); font-family: 'Plus Jakarta Sans',sans-serif; white-space: nowrap;
        }
        .book-btn:hover { background: #b45309; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(217,119,6,0.4); }
        .why-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 16px; padding: 24px;
          transition: border-color .2s, box-shadow .2s; animation: fadeUp .5s ease both;
        }
        .why-card:hover { border-color: rgba(217,119,6,.2); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .faq-item { background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 14px; overflow: hidden; transition: border-color .2s; }
        .faq-item:hover { border-color: rgba(217,119,6,.2); }
        .section-divider { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .section-divider::after { content:''; flex:1; height:1px; background:rgba(0,0,0,0.07); }
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

            <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              {[["Products", "/shop"], ["Services", "/services"], ["About", "/#about"], ["Contact", "/#contact"]].map(([label, href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: label === "Services" ? "#d97706" : "#6b7280", fontSize: "14px", fontWeight: label === "Services" ? 700 : 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = label === "Services" ? "#d97706" : "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/cart" style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .2s", flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.4)"; e.currentTarget.style.background = "#fffbf2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.background = "#fff"; }}
              >
                <ShoppingCart size={17} color="#374151" />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: "-5px", right: "-5px", width: "17px", height: "-17px", borderRadius: "50%", background: "#d97706", color: "#fff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div style={{ position: "relative" }}>
                  <button onClick={() => setUserMenuOpen((v) => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email.split("@")[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100 }}>
                      <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "6px" }}>
                        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }} onClick={() => setUserMenuOpen(false)}>
                        <User size={14} /> My Profile
                      </Link>
                      <button onClick={handleSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 600, textDecoration: "none", color: "#374151", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.12)", transition: "all .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.5)"; e.currentTarget.style.color = "#d97706"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#374151"; }}
                  >Sign In</Link>
                  <Link href="/auth/signup" style={{ padding: "9px 20px", fontSize: "13px", fontWeight: 700, textDecoration: "none", color: "#fff", borderRadius: "12px", background: "#d97706", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(217,119,6,0.35)", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
                  >Get Started <ArrowRight size={13} /></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={{ paddingTop: "100px", paddingBottom: "48px", paddingLeft: "24px", paddingRight: "24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ animation: "fadeUp .4s ease both" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "10px", fontFamily: "'Outfit',sans-serif" }}>
            Maintenance, Cleaning & Repair
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
            <h1 className="outfit" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 900, letterSpacing: "-2px", color: "#1a1a2e", lineHeight: 1.05, margin: 0 }}>
              Our <span style={{ color: "#d97706" }}>Services</span>
            </h1>
            <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "14px", background: "#1a1a2e", color: "#fff", fontSize: "14px", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "background .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#d97706")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a2e")}
            >
              <Phone size={15} /> Book via Messenger
            </a>
          </div>
          <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "580px", lineHeight: 1.7, margin: 0 }}>
            Professional cleaning and repair for air conditioners, refrigerators, and freezers — servicing Baliuag and nearby areas in Bulacan.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginTop: "40px", animation: "fadeUp .4s ease .1s both" }}>
          {[
            { icon: <BadgeCheck size={18} color="#d97706" />,                       value: "500+",      label: "Jobs Completed" },
            { icon: <Star size={18} color="#d97706" fill="#d97706" />,              value: "4.9",       label: "Avg. Rating" },
            { icon: <MapPin size={18} color="#d97706" />,                           value: "Baliuag",   label: "Based in" },
            { icon: <CalendarCheck size={18} color="#d97706" />,                    value: "Same Day",  label: "Booking Available" },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", margin: 0, letterSpacing: "-0.3px" }}>{value}</p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontWeight: 500 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cleaning services ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 48px" }}>
        <div className="section-divider">
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d97706", margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>AC Maintenance</p>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0 }}>Cleaning Services</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: "24px" }}>
          {cleaningServices.map((s, i) => <CleaningCard key={s.id} service={s} index={i} />)}
        </div>
      </div>

      {/* ── Repair services ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 48px" }}>
        <div className="section-divider">
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2563eb", margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>Troubleshooting & Fix</p>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0 }}>Repair Services</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: "24px" }}>
          {repairServices.map((s, i) => <RepairCard key={s.id} service={s} index={i} />)}
        </div>
      </div>

      {/* ── Other AC services ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 64px" }}>
        <div className="section-divider">
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d97706", margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>Recharge · Relocate · Dismantle</p>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0 }}>Other AC Services</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: "24px" }}>
          {otherACServices.map((s, i) => <RepairCard key={s.id} service={s} index={i} />)}
        </div>
      </div>

      {/* ── Why us ── */}
      <div style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "8px", fontFamily: "'Outfit',sans-serif" }}>Why Emeren</p>
            <h2 className="outfit" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-1px", margin: 0 }}>Service You Can Trust</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
            {[
              { icon: <Wrench       size={20} color="#d97706" />, title: "Trained Technicians",  desc: "Experienced in AC, refrigerators, and freezers of all major brands." },
              { icon: <MapPin       size={20} color="#d97706" />, title: "On-Site or In-Store",  desc: "We come to you, or you can bring the unit to our shop in Baliuag." },
              { icon: <Shield       size={20} color="#d97706" />, title: "Quality Guaranteed",   desc: "Every job is tested before we leave or hand back your unit." },
              { icon: <BadgeCheck   size={20} color="#d97706" />, title: "Free Diagnosis",       desc: "For repairs, we inspect first and quote before touching anything." },
              { icon: <Wind         size={20} color="#d97706" />, title: "Better Performance",   desc: "A clean or repaired unit runs more efficiently and lasts longer." },
              { icon: <CalendarCheck size={20} color="#d97706" />, title: "Flexible Schedule",   desc: "Weekdays, weekends, same-day — we work around your schedule." },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} className="why-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  {icon}
                </div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>{title}</p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "8px", fontFamily: "'Outfit',sans-serif" }}>Common Questions</p>
          <h2 className="outfit" style={{ fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.8px", margin: 0 }}>FAQs</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { q: "How often should I clean my AC?",               a: "Every 3–6 months for regular use. If your AC runs all day, every 3 months is ideal to maintain efficiency and prevent mold buildup." },
            { q: "Is the refrigerator diagnosis really free?",    a: "Yes, completely free. We inspect the unit and identify the issue first. We'll give you a transparent quote, and you decide whether to proceed before any repair work begins." },
            { q: "Can you come to my house for the repair?",      a: "Yes! For both AC cleaning and refrigeration repair, we offer on-site service. For refrigerators you can also bring the unit to our shop in Baliuag." },
            { q: "What brands of refrigerators do you repair?",   a: "We repair most major brands including Samsung, LG, Condura, Whirlpool, Sharp, Panasonic, and more. Message us with your brand and model if you're unsure." },
            { q: "How do I book a service?",                      a: "Just message us on Messenger or call our number. Tell us the service you need, your location, and your preferred schedule. We'll confirm right away." },
            { q: "Do you service areas outside Baliuag?",         a: "Yes, we cover nearby areas in Bulacan. Message us with your address and we'll confirm availability and any additional travel fee." },
          ].map(({ q, a }) => <FAQItem key={q} question={q} answer={a} />)}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{ background: "#1a1a2e", padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p className="outfit" style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.8px", marginBottom: "12px" }}>
            Ready to book a service?
          </p>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginBottom: "28px", lineHeight: 1.6 }}>
            Message us on Messenger — we'll confirm your schedule right away.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", borderRadius: "14px", background: "#d97706", color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(217,119,6,0.4)", transition: "background .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
            ><Phone size={16} /> Message Us on Messenger</a>
            <Link href="/shop"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", borderRadius: "14px", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none", transition: "border-color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
            >Browse Products <ArrowRight size={15} /></Link>
          </div>
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