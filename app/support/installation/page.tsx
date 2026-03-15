"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, X, Zap, ThermometerSun, Info, ShoppingCart } from "lucide-react";

type Room = {
  id: string;
  label: string;
  hp: string;
  btu: string;
  type: string;
  why: string;
  tip: string;
  color: string;
  // SVG polygon points for the floor plan
  points: string;
  // Label position
  lx: number;
  ly: number;
};

const ROOMS: Room[] = [
  {
    id: "living",
    label: "Living Room",
    hp: "2.0 – 2.5 HP",
    btu: "18,000 – 24,000 BTU",
    type: "Split-Type or Cassette",
    why: "Living rooms are typically the largest open space in a home, often connected to dining areas. High foot traffic and heat-generating appliances like TVs mean you need more cooling capacity.",
    tip: "Go cassette-type if your ceiling allows — it distributes air in 4 directions for even cooling across a large space.",
    color: "#fef3c7",
    points: "60,60 340,60 340,240 60,240",
    lx: 200,
    ly: 148,
  },
  {
    id: "dining",
    label: "Dining Area",
    hp: "1.0 – 1.5 HP",
    btu: "9,000 – 12,000 BTU",
    type: "Split-Type",
    why: "Dining areas are medium-sized and used intermittently. A 1.0–1.5 HP unit is sufficient unless your dining area is open-plan with the living room, in which case share the living room unit.",
    tip: "Position the unit away from the dining table to avoid cold air blowing directly on diners during meals.",
    color: "#d1fae5",
    points: "340,60 545,60 545,180 340,180",
    lx: 443,
    ly: 118,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    hp: "1.0 – 1.5 HP",
    btu: "9,000 – 12,000 BTU",
    type: "Split-Type (inverter recommended)",
    why: "Kitchens generate significant heat from cooking. An inverter unit is strongly recommended here as it can handle variable heat loads efficiently without overworking the compressor.",
    tip: "Never place the indoor unit directly above or near the cooking area — grease and steam will damage the unit and void the warranty.",
    color: "#fee2e2",
    points: "340,180 545,180 545,420 340,420",
    lx: 443,
    ly: 298,
  },
  {
    id: "master",
    label: "Master Bedroom",
    hp: "1.5 HP",
    btu: "12,000 – 14,000 BTU",
    type: "Split-Type (inverter)",
    why: "Master bedrooms are larger than standard rooms and used for extended periods — often 8+ hours during sleep. An inverter unit maintains consistent temperature quietly while using less electricity overnight.",
    tip: "Set the timer to cool the room 30 minutes before bedtime for best comfort without running it all night.",
    color: "#e0e7ff",
    points: "60,240 200,240 200,420 60,420",
    lx: 130,
    ly: 328,
  },
  {
    id: "bedroom",
    label: "Small Bedroom",
    hp: "1.0 HP",
    btu: "9,000 BTU",
    type: "Split-Type",
    why: "Small bedrooms (up to 15 sqm) only need a compact 1.0 HP unit. Oversizing wastes electricity and causes the room to feel humid because the unit short-cycles before properly dehumidifying.",
    tip: "A 1.0 HP unit is perfect for a standard Philippine bedroom. Don't oversize — bigger is not always better.",
    color: "#fce7f3",
    points: "200,240 340,240 340,420 200,420",
    lx: 270,
    ly: 328,
  },
  {
    id: "office",
    label: "Office / Study",
    hp: "1.0 HP",
    btu: "9,000 BTU",
    type: "Split-Type (inverter recommended)",
    why: "Home offices have consistent occupancy and heat from computers and monitors. An inverter unit runs quietly at low speeds during long work sessions, keeping noise low and electricity costs down.",
    tip: "Place the unit where airflow doesn't blow directly on you or your monitor — side-wall mounting works best for most study layouts.",
    color: "#fef9c3",
    points: "60,420 220,420 220,545 60,545",
    lx: 140,
    ly: 480,
  },
  {
    id: "garage",
    label: "Garage",
    hp: "1.5 – 2.0 HP",
    btu: "12,000 – 18,000 BTU",
    type: "Split-Type (non-inverter ok)",
    why: "Garages trap heat from vehicles, poor insulation, and direct sun exposure. A robust 1.5–2.0 HP unit is needed to handle the high ambient temperature, especially in the Philippine heat.",
    tip: "Use a non-inverter unit if the garage is only used occasionally — inverter savings only show up with extended daily use.",
    color: "#e2e8f0",
    points: "220,420 545,420 545,545 220,545",
    lx: 383,
    ly: 480,
  },
];

export default function InstallationPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selected, setSelected] = useState<Room | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [animatePanel, setAnimatePanel] = useState(false);

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

  const selectRoom = (room: Room) => {
    setSelected(room);
    setAnimatePanel(false);
    setTimeout(() => setAnimatePanel(true), 10);
  };

  const closePanel = () => {
    setAnimatePanel(false);
    setTimeout(() => setSelected(null), 300);
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
        @keyframes slideIn  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes panelIn  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping     { 0%{transform:scale(1);opacity:.8} 80%,100%{transform:scale(2);opacity:0} }

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

        .room-poly {
          cursor: pointer;
          transition: filter .2s;
          stroke: #1a1a2e;
          stroke-width: 2;
          stroke-linejoin: round;
        }
        .room-poly:hover { filter: brightness(0.93); }
        .room-poly.active { filter: brightness(0.88); stroke-width: 3; stroke: #d97706; }

        .room-label {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 700;
          fill: #374151;
          text-anchor: middle;
          dominant-baseline: middle;
          pointer-events: none;
          letter-spacing: 0.02em;
        }

        .room-sublabel {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 9px;
          font-weight: 500;
          fill: #9ca3af;
          text-anchor: middle;
          dominant-baseline: middle;
          pointer-events: none;
        }

        .click-dot {
          cursor: pointer;
          animation: ping 1.8s ease-out infinite;
        }

        .panel-enter { animation: slideIn .3s ease forwards; }
        .panel-mobile { animation: panelIn .3s ease forwards; }

        .info-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #d97706;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35);
          transition: background .15s, transform .15s;
          text-decoration: none;
        }
        .cta-btn:hover { background: #b45309; transform: translateY(-1px); }

        .floor-wrap {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 1023px) {
          .floor-wrap { grid-template-columns: 1fr; }
        }

        @media (max-width: 639px) {
          .blueprint-svg { width: 100% !important; height: auto !important; }
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
            <ThermometerSun size={14} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>Installation Guide</span>
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
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "64px 24px 48px" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "100px", padding: "6px 16px", marginBottom: "20px" }}>
            <Zap size={12} style={{ color: "#d97706" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>Interactive Floor Plan</span>
          </div>
          <h1 className="outfit" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
            Find the right aircon<br />for every room
          </h1>
          <p style={{ fontSize: "16px", color: "#6b7280", lineHeight: 1.75, margin: 0 }}>
            Click any room in the floor plan below to see our recommended HP, unit type, and exactly why it's the right fit for that space.
          </p>
        </div>
      </div>

      {/* ── Floor Plan + Panel ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="floor-wrap reveal">

          {/* ── Blueprint SVG ── */}
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
            {/* Title bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Floor Plan — Click a Room</span>
              </div>
              <div style={{ fontSize: "11px", color: "#d1d5db", fontWeight: 500 }}>Emeren · 2025</div>
            </div>

            <svg
              className="blueprint-svg"
              viewBox="0 30 610 570"
              width="100%"
              style={{ display: "block", maxWidth: "610px", margin: "0 auto" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <rect width="50" height="50" fill="url(#smallGrid)"/>
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
                </pattern>
                <filter id="active-glow">
                  <feGaussianBlur stdDeviation="6" result="blur"/>
                  <feFlood floodColor="#d97706" floodOpacity="0.4" result="color"/>
                  <feComposite in="color" in2="blur" operator="in" result="shadow"/>
                  <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <pattern id="wallHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.08)" strokeWidth="2"/>
                </pattern>
                {/* Garage floor hatch */}
                <pattern id="garageHatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(0,0,0,0.04)" strokeWidth="4"/>
                </pattern>
              </defs>

              {/* Background grid */}
              <rect x="40" y="40" width="530" height="530" fill="url(#grid)" rx="4"/>

              {/* ── ROOMS ── */}
              {ROOMS.map((room) => {
                const isActive = selected?.id === room.id;
                const isHovered = hovered === room.id;
                return (
                  <g key={room.id} onClick={() => selectRoom(room)} onMouseEnter={() => setHovered(room.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }} filter={isActive ? "url(#active-glow)" : undefined}>
                    <polygon
                      className={`room-poly${isActive ? " active" : ""}`}
                      points={room.points}
                      fill={isActive ? room.color : isHovered ? `${room.color}dd` : `${room.color}55`}
                      stroke={isActive ? "#d97706" : isHovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.08)"}
                      strokeWidth={isActive ? 2.5 : 1}
                    />
                    {/* Garage gets floor texture */}
                    {room.id === "garage" && <polygon points={room.points} fill="url(#garageHatch)" style={{ pointerEvents: "none" }}/>}
                  </g>
                );
              })}

              {/* ═══════════════════════════════════ */}
              {/* ── FURNITURE DECORATIONS ── */}
              {/* ═══════════════════════════════════ */}
              {/* All furniture is non-interactive, pointer-events: none */}

              {/* LIVING ROOM: sofa (L-shape) + TV unit + coffee table */}
              <g style={{ pointerEvents: "none" }} opacity="0.55">
                {/* Sofa — long back */}
                <rect x="75" y="195" width="120" height="30" rx="4" fill="none" stroke="#92400e" strokeWidth="1.5"/>
                <rect x="75" y="192" width="120" height="8" rx="2" fill="none" stroke="#92400e" strokeWidth="1.2"/>
                {/* Sofa arm left */}
                <rect x="72" y="195" width="8" height="30" rx="2" fill="none" stroke="#92400e" strokeWidth="1.2"/>
                {/* Sofa arm right */}
                <rect x="187" y="195" width="8" height="30" rx="2" fill="none" stroke="#92400e" strokeWidth="1.2"/>
                {/* Sofa cushion lines */}
                <line x1="115" y1="200" x2="115" y2="222" stroke="#92400e" strokeWidth="1" strokeDasharray="2,2"/>
                <line x1="155" y1="200" x2="155" y2="222" stroke="#92400e" strokeWidth="1" strokeDasharray="2,2"/>
                {/* Coffee table */}
                <rect x="100" y="168" width="60" height="22" rx="3" fill="none" stroke="#92400e" strokeWidth="1.2"/>
                {/* TV unit on opposite wall */}
                <rect x="75" y="68" width="80" height="14" rx="2" fill="none" stroke="#92400e" strokeWidth="1.5"/>
                <rect x="108" y="65" width="14" height="5" rx="1" fill="none" stroke="#92400e" strokeWidth="1"/>
                {/* TV screen */}
                <rect x="78" y="70" width="74" height="10" rx="1" fill="rgba(146,64,14,0.08)" stroke="none"/>
              </g>

              {/* DINING AREA: round table + 4 chairs */}
              <g style={{ pointerEvents: "none" }} opacity="0.55">
                {/* Table */}
                <ellipse cx="443" cy="118" rx="36" ry="28" fill="none" stroke="#065f46" strokeWidth="1.5"/>
                {/* Chair top */}
                <rect x="425" y="80" width="36" height="14" rx="4" fill="none" stroke="#065f46" strokeWidth="1.2"/>
                {/* Chair bottom */}
                <rect x="425" y="144" width="36" height="14" rx="4" fill="none" stroke="#065f46" strokeWidth="1.2"/>
                {/* Chair left */}
                <rect x="393" y="106" width="14" height="24" rx="4" fill="none" stroke="#065f46" strokeWidth="1.2"/>
                {/* Chair right */}
                <rect x="479" y="106" width="14" height="24" rx="4" fill="none" stroke="#065f46" strokeWidth="1.2"/>
              </g>

              {/* KITCHEN: counter L-shape + stove + sink */}
              <g style={{ pointerEvents: "none" }} opacity="0.55">
                {/* Counter top */}
                <rect x="348" y="190" width="14" height="100" rx="2" fill="none" stroke="#991b1b" strokeWidth="1.5"/>
                {/* Counter right */}
                <rect x="348" y="190" width="100" height="14" rx="2" fill="none" stroke="#991b1b" strokeWidth="1.5"/>
                {/* Stove burners */}
                <circle cx="374" cy="220" r="7" fill="none" stroke="#991b1b" strokeWidth="1.2"/>
                <circle cx="374" cy="240" r="7" fill="none" stroke="#991b1b" strokeWidth="1.2"/>
                <circle cx="374" cy="220" r="3" fill="none" stroke="#991b1b" strokeWidth="0.8"/>
                <circle cx="374" cy="240" r="3" fill="none" stroke="#991b1b" strokeWidth="0.8"/>
                {/* Sink */}
                <rect x="400" y="192" width="28" height="22" rx="2" fill="none" stroke="#991b1b" strokeWidth="1.2"/>
                <circle cx="414" cy="203" r="4" fill="none" stroke="#991b1b" strokeWidth="1"/>
                {/* Fridge */}
                <rect x="440" y="190" width="22" height="34" rx="2" fill="none" stroke="#991b1b" strokeWidth="1.2"/>
                <line x1="451" y1="192" x2="451" y2="222" stroke="#991b1b" strokeWidth="0.8" strokeDasharray="2,2"/>
              </g>

              {/* MASTER BEDROOM: bed + nightstands + wardrobe */}
              <g style={{ pointerEvents: "none" }} opacity="0.55">
                {/* Bed frame */}
                <rect x="68" y="260" width="56" height="80" rx="4" fill="none" stroke="#3730a3" strokeWidth="1.5"/>
                {/* Headboard */}
                <rect x="68" y="258" width="56" height="12" rx="3" fill="rgba(55,48,163,0.1)" stroke="#3730a3" strokeWidth="1.2"/>
                {/* Pillow left */}
                <rect x="72" y="274" width="20" height="14" rx="3" fill="rgba(55,48,163,0.08)" stroke="#3730a3" strokeWidth="1"/>
                {/* Pillow right */}
                <rect x="98" y="274" width="20" height="14" rx="3" fill="rgba(55,48,163,0.08)" stroke="#3730a3" strokeWidth="1"/>
                {/* Blanket */}
                <rect x="69" y="292" width="54" height="46" rx="2" fill="rgba(55,48,163,0.06)" stroke="#3730a3" strokeWidth="1" strokeDasharray="3,2"/>
                {/* Nightstand left */}
                <rect x="128" y="268" width="16" height="16" rx="2" fill="none" stroke="#3730a3" strokeWidth="1"/>
                {/* Wardrobe */}
                <rect x="68" y="390" width="56" height="22" rx="2" fill="none" stroke="#3730a3" strokeWidth="1.2"/>
                <line x1="96" y1="390" x2="96" y2="412" stroke="#3730a3" strokeWidth="0.8"/>
                <circle cx="88" cy="401" r="2" fill="none" stroke="#3730a3" strokeWidth="0.8"/>
                <circle cx="104" cy="401" r="2" fill="none" stroke="#3730a3" strokeWidth="0.8"/>
              </g>

              {/* SMALL BEDROOM: single bed + desk */}
              <g style={{ pointerEvents: "none" }} opacity="0.55">
                {/* Bed */}
                <rect x="210" y="260" width="44" height="70" rx="4" fill="none" stroke="#9d174d" strokeWidth="1.5"/>
                <rect x="210" y="258" width="44" height="10" rx="3" fill="rgba(157,23,77,0.1)" stroke="#9d174d" strokeWidth="1.2"/>
                <rect x="214" y="270" width="36" height="12" rx="3" fill="rgba(157,23,77,0.06)" stroke="#9d174d" strokeWidth="1"/>
                <rect x="212" y="286" width="40" height="42" rx="2" fill="rgba(157,23,77,0.05)" stroke="#9d174d" strokeWidth="1" strokeDasharray="3,2"/>
                {/* Desk */}
                <rect x="212" y="390" width="60" height="22" rx="2" fill="none" stroke="#9d174d" strokeWidth="1.2"/>
                {/* Monitor */}
                <rect x="228" y="382" width="24" height="10" rx="2" fill="none" stroke="#9d174d" strokeWidth="1"/>
                <line x1="240" y1="392" x2="240" y2="394" stroke="#9d174d" strokeWidth="1"/>
              </g>

              {/* OFFICE: desk + chair + bookshelf */}
              <g style={{ pointerEvents: "none" }} opacity="0.55">
                {/* L-desk */}
                <rect x="68" y="430" width="70" height="14" rx="2" fill="none" stroke="#854d0e" strokeWidth="1.5"/>
                <rect x="68" y="430" width="14" height="50" rx="2" fill="none" stroke="#854d0e" strokeWidth="1.5"/>
                {/* Monitor */}
                <rect x="90" y="424" width="28" height="8" rx="2" fill="none" stroke="#854d0e" strokeWidth="1"/>
                <line x1="104" y1="432" x2="104" y2="434" stroke="#854d0e" strokeWidth="1"/>
                {/* Chair */}
                <circle cx="120" cy="460" r="12" fill="none" stroke="#854d0e" strokeWidth="1.2"/>
                <circle cx="120" cy="460" r="5" fill="none" stroke="#854d0e" strokeWidth="0.8"/>
                {/* Bookshelf */}
                <rect x="150" y="428" width="14" height="60" rx="2" fill="none" stroke="#854d0e" strokeWidth="1.2"/>
                <line x1="150" y1="448" x2="164" y2="448" stroke="#854d0e" strokeWidth="0.8"/>
                <line x1="150" y1="468" x2="164" y2="468" stroke="#854d0e" strokeWidth="0.8"/>
              </g>

              {/* GARAGE: car outline */}
              <g style={{ pointerEvents: "none" }} opacity="0.4">
                {/* Car body */}
                <rect x="260" y="445" width="200" height="75" rx="10" fill="none" stroke="#475569" strokeWidth="2"/>
                {/* Car roof */}
                <path d="M 300 445 Q 310 422 370 420 Q 430 422 440 445" fill="none" stroke="#475569" strokeWidth="1.8"/>
                {/* Windshield */}
                <path d="M 308 443 Q 316 426 370 424 Q 424 426 432 443" fill="rgba(71,85,105,0.06)" stroke="#475569" strokeWidth="1"/>
                {/* Wheels */}
                <circle cx="305" cy="522" r="16" fill="none" stroke="#475569" strokeWidth="2"/>
                <circle cx="305" cy="522" r="7" fill="none" stroke="#475569" strokeWidth="1.2"/>
                <circle cx="415" cy="522" r="16" fill="none" stroke="#475569" strokeWidth="2"/>
                <circle cx="415" cy="522" r="7" fill="none" stroke="#475569" strokeWidth="1.2"/>
                {/* Door line */}
                <line x1="360" y1="447" x2="360" y2="518" stroke="#475569" strokeWidth="1.2" strokeDasharray="3,2"/>
                {/* Door handle */}
                <rect x="340" y="480" width="12" height="5" rx="2" fill="none" stroke="#475569" strokeWidth="1"/>
                <rect x="370" y="480" width="12" height="5" rx="2" fill="none" stroke="#475569" strokeWidth="1"/>
                {/* Headlights */}
                <rect x="457" y="460" width="6" height="14" rx="2" fill="rgba(71,85,105,0.15)" stroke="#475569" strokeWidth="1"/>
                {/* Taillights */}
                <rect x="257" y="460" width="6" height="14" rx="2" fill="rgba(71,85,105,0.15)" stroke="#475569" strokeWidth="1"/>
              </g>

              {/* ═══════════════════════════════════ */}
              {/* ── ROOM LABELS (drawn last, above furniture) ── */}
              {ROOMS.map((room) => {
                const isActive = selected?.id === room.id;
                const isHovered = hovered === room.id;
                return (
                  <g key={`label-${room.id}`} style={{ pointerEvents: "none" }}>
                    <text x={room.lx} y={room.ly - 10} fontFamily="Outfit, sans-serif" fontSize="11.5" fontWeight="800" fill={isActive ? "#1a1a2e" : isHovered ? "#1a1a2e" : "#374151"} textAnchor="middle" dominantBaseline="middle" style={{ letterSpacing: "0.01em" }}>
                      {room.label}
                    </text>
                    <text x={room.lx} y={room.ly + 8} fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9.5" fontWeight="600" fill={isActive ? "#92400e" : "#9ca3af"} textAnchor="middle" dominantBaseline="middle">
                      {room.hp}
                    </text>
                    {!isActive && <circle cx={room.lx} cy={room.ly + 26} r="4" fill="#d97706" opacity={isHovered ? "0.9" : "0.5"} className="click-dot"/>}
                    {isActive && (<><circle cx={room.lx} cy={room.ly + 26} r="7" fill="#d97706" opacity="0.2"/><circle cx={room.lx} cy={room.ly + 26} r="4.5" fill="#d97706"/></>)}
                  </g>
                );
              })}

              {/* ── WALLS ── */}
              <rect x="55" y="55" width="495" height="495" rx="3" fill="none" stroke="#1a1a2e" strokeWidth="4"/>
              {/* Interior walls */}
              <line x1="340" y1="55" x2="340" y2="420" stroke="#1a1a2e" strokeWidth="2.5"/>
              <line x1="55" y1="240" x2="340" y2="240" stroke="#1a1a2e" strokeWidth="2.5"/>
              <line x1="340" y1="180" x2="550" y2="180" stroke="#1a1a2e" strokeWidth="2.5"/>
              <line x1="55" y1="420" x2="545" y2="420" stroke="#1a1a2e" strokeWidth="2.5"/>
              <line x1="200" y1="240" x2="200" y2="420" stroke="#1a1a2e" strokeWidth="2.5"/>
              <line x1="220" y1="420" x2="220" y2="550" stroke="#1a1a2e" strokeWidth="2.5"/>
              {/* Wall hatching */}
              <rect x="55" y="55" width="495" height="4" fill="url(#wallHatch)"/>
              <rect x="55" y="547" width="495" height="4" fill="url(#wallHatch)"/>
              <rect x="55" y="55" width="4" height="495" fill="url(#wallHatch)"/>
              <rect x="547" y="55" width="4" height="495" fill="url(#wallHatch)"/>

              {/* ── DOORS ── */}
              {/* Living room */}
              <rect x="55" y="170" width="3" height="40" fill="#fff"/>
              <path d="M 58 170 Q 98 170 98 210" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3"/>
              <line x1="58" y1="170" x2="58" y2="210" stroke="#9ca3af" strokeWidth="1"/>
              {/* Master bedroom */}
              <rect x="55" y="290" width="3" height="40" fill="#fff"/>
              <path d="M 58 290 Q 98 290 98 330" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3"/>
              <line x1="58" y1="290" x2="58" y2="330" stroke="#9ca3af" strokeWidth="1"/>
              {/* Small bedroom */}
              <rect x="197" y="270" width="3" height="38" fill="#fff"/>
              <path d="M 200 270 Q 240 270 240 308" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3"/>
              <line x1="200" y1="270" x2="200" y2="308" stroke="#9ca3af" strokeWidth="1"/>
              {/* Kitchen */}
              <rect x="547" y="280" width="3" height="40" fill="#fff"/>
              <path d="M 547 280 Q 507 280 507 320" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3"/>
              <line x1="547" y1="280" x2="547" y2="320" stroke="#9ca3af" strokeWidth="1"/>
              {/* Office */}
              <rect x="55" y="460" width="3" height="36" fill="#fff"/>
              <path d="M 58 460 Q 90 460 90 492" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3"/>
              <line x1="58" y1="460" x2="58" y2="492" stroke="#9ca3af" strokeWidth="1"/>
              {/* Garage — big door on bottom */}
              <rect x="280" y="547" width="120" height="3" fill="#fff"/>
              <line x1="280" y1="547" x2="280" y2="550" stroke="#1a1a2e" strokeWidth="2"/>
              <line x1="400" y1="547" x2="400" y2="550" stroke="#1a1a2e" strokeWidth="2"/>
              <line x1="300" y1="548" x2="300" y2="550" stroke="#9ca3af" strokeWidth="1"/>
              <line x1="320" y1="548" x2="320" y2="550" stroke="#9ca3af" strokeWidth="1"/>
              <line x1="340" y1="548" x2="340" y2="550" stroke="#9ca3af" strokeWidth="1"/>
              <line x1="360" y1="548" x2="360" y2="550" stroke="#9ca3af" strokeWidth="1"/>
              <line x1="380" y1="548" x2="380" y2="550" stroke="#9ca3af" strokeWidth="1"/>

              {/* ── WINDOWS ── */}
              <rect x="140" y="52" width="80" height="6" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
              <line x1="180" y1="52" x2="180" y2="58" stroke="#93c5fd" strokeWidth="1"/>
              <rect x="370" y="52" width="80" height="6" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
              <line x1="410" y1="52" x2="410" y2="58" stroke="#93c5fd" strokeWidth="1"/>
              <rect x="547" y="200" width="6" height="60" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
              <line x1="547" y1="230" x2="553" y2="230" stroke="#93c5fd" strokeWidth="1"/>
              <rect x="547" y="360" width="6" height="50" rx="2" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1"/>
              <line x1="547" y1="385" x2="553" y2="385" stroke="#93c5fd" strokeWidth="1"/>

              {/* ── DIMENSION LINES ── */}
              <line x1="55" y1="36" x2="550" y2="36" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
              <line x1="55" y1="33" x2="55" y2="39" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
              <line x1="550" y1="33" x2="550" y2="39" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
              <text x="302" y="31" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="8" fill="rgba(0,0,0,0.3)" textAnchor="middle">~12 meters</text>
              <line x1="576" y1="55" x2="576" y2="550" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
              <line x1="573" y1="55" x2="579" y2="55" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
              <line x1="573" y1="550" x2="579" y2="550" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
              <text x="590" y="302" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="8" fill="rgba(0,0,0,0.3)" textAnchor="middle" transform="rotate(90,590,302)">~10 meters</text>

              {/* ── COMPASS ── */}
              <g transform="translate(524, 520)">
                <circle cx="0" cy="0" r="16" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
                <polygon points="0,-10 4,0 0,3 -4,0" fill="#d97706"/>
                <polygon points="0,10 4,0 0,-3 -4,0" fill="rgba(0,0,0,0.15)"/>
                <text fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="800" fill="#d97706" textAnchor="middle" dominantBaseline="middle" x="0" y="-14">N</text>
              </g>

              {/* ── SCALE ── */}
              <g transform="translate(65, 562)">
                <line x1="0" y1="0" x2="50" y2="0" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
                <line x1="0" y1="-4" x2="0" y2="4" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
                <line x1="50" y1="-4" x2="50" y2="4" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5"/>
                <text fontFamily="Plus Jakarta Sans, sans-serif" fontSize="7.5" fill="rgba(0,0,0,0.3)" textAnchor="middle" x="25" y="13">~5m</text>
              </g>

              {/* ── ROOM LETTER TAGS ── */}
              <text x="68" y="72" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">A</text>
              <text x="348" y="72" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">B</text>
              <text x="348" y="192" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">C</text>
              <text x="68" y="252" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">D</text>
              <text x="208" y="252" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">E</text>
              <text x="68" y="432" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">F</text>
              <text x="228" y="432" fontFamily="Outfit, sans-serif" fontSize="7" fontWeight="700" fill="rgba(0,0,0,0.18)" letterSpacing="0.08em">G</text>
            </svg>

            {/* Legend */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "18px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "14px", height: "5px", background: "#bfdbfe", borderRadius: "2px", border: "1px solid #93c5fd" }} />
                <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>Window</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "14px", borderTop: "1.5px dashed #9ca3af" }} />
                <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>Door</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d97706", opacity: 0.7 }} />
                <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>Click to explore</span>
              </div>
            </div>
          </div>

          {/* ── Recommendation Panel ── */}
          <div>
            {!selected ? (
              <div style={{ background: "#fff", border: "1px dashed rgba(0,0,0,0.12)", borderRadius: "24px", padding: "40px 32px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#d97706" }}>
                  <ThermometerSun size={26} />
                </div>
                <p className="outfit" style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" }}>Select a Room</p>
                <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
                  Click any room on the floor plan to see the recommended HP, unit type, and expert tips.
                </p>
              </div>
            ) : (
              <div
                className={animatePanel ? "panel-enter" : ""}
                style={{ background: "#fff", border: `2px solid ${selected.color}`, borderRadius: "24px", padding: "32px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", position: "sticky", top: "84px" }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Recommendation</p>
                    <h3 className="outfit" style={{ fontSize: "22px", fontWeight: 800, color: "#1a1a2e", margin: 0, letterSpacing: "-0.02em" }}>{selected.label}</h3>
                  </div>
                  <button onClick={closePanel} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7280", flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>

                {/* HP Badge */}
                <div style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <Zap size={14} style={{ color: "#d97706" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", letterSpacing: "0.08em", textTransform: "uppercase" }}>Recommended HP</span>
                  </div>
                  <p className="outfit" style={{ fontSize: "28px", fontWeight: 800, color: "#1a1a2e", margin: "0 0 2px", letterSpacing: "-0.02em" }}>{selected.hp}</p>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{selected.btu}</p>
                </div>

                {/* Unit Type */}
                <div style={{ marginBottom: "20px" }}>
                  <span className="info-chip" style={{ background: selected.color, color: "#374151", border: `1px solid ${selected.color}` }}>
                    <ThermometerSun size={12} /> {selected.type}
                  </span>
                </div>

                {/* Why */}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>Why this size?</p>
                  <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.75, margin: 0 }}>{selected.why}</p>
                </div>

                {/* Tip */}
                <div style={{ background: "linear-gradient(135deg, #fffbf2 0%, #fef3c7 100%)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Info size={14} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ fontSize: "13px", color: "#92400e", lineHeight: 1.65, margin: 0 }}><strong>Pro tip:</strong> {selected.tip}</p>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/shop" className="cta-btn" style={{ width: "100%", justifyContent: "center" }}>
                  <ShoppingCart size={15} /> Shop {selected.hp} Units
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── FAQ Strip ── */}
      <div style={{ position: "relative", zIndex: 1, background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "48px 0", marginBottom: "80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 className="outfit" style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em", margin: "0 0 10px" }}>Good to know</h2>
            <p style={{ fontSize: "15px", color: "#6b7280", margin: 0 }}>A few things that matter when choosing the right unit.</p>
          </div>
          <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {[
              { q: "What does HP mean?", a: "HP (horsepower) determines how much space a unit can cool. Higher HP = more cooling power, but also more electricity." },
              { q: "Inverter vs non-inverter?", a: "Inverter units adjust their speed to maintain temperature — they're quieter, more efficient, and ideal for long daily use." },
              { q: "What if my room size varies?", a: "When in doubt, go with the higher HP — an undersized unit works harder, wears out faster, and never fully cools the room." },
              { q: "Do you handle installation?", a: "Yes! Emeren provides professional installation across Bulacan and Pampanga. Contact us after your purchase to book." },
            ].map((item) => (
              <div key={item.q} style={{ background: "#f8f7f4", borderRadius: "16px", padding: "22px 24px", border: "1px solid rgba(0,0,0,0.06)" }}>
                <p className="outfit" style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" }}>{item.q}</p>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="reveal" style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", borderRadius: "24px", padding: "48px 40px", textAlign: "center", boxShadow: "0 8px 40px rgba(217,119,6,0.3)" }}>
          <h2 className="outfit" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Ready to install?
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: "0 0 28px" }}>
            Browse our aircon units and book an installation with Emeren — serving Bulacan & Pampanga.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", background: "#fff", color: "#d97706", fontWeight: 700, fontSize: "14px", fontFamily: "'Plus Jakarta Sans', sans-serif", borderRadius: "12px", textDecoration: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.12)", transition: "transform .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <ShoppingCart size={15} /> Shop Aircon Units
            </Link>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontSize: "14px", fontFamily: "'Plus Jakarta Sans', sans-serif", borderRadius: "12px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.4)", transition: "background .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              Book Installation
            </Link>
          </div>
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
    </div>
  );
}