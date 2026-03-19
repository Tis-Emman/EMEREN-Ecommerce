"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  Triangle, ArrowRight, Search, SlidersHorizontal, Star,
  ChevronDown, X, Zap, Wind, Building2, Layers, Package,
  Check, ShoppingCart, User, LogOut, Menu,
} from "lucide-react";
import { BRANDS, BADGE_COLORS, type Product } from "@/lib/products";

const CATEGORIES = [
  { label: "All",        value: "all",         icon: <Layers    size={15} /> },
  { label: "Split-Type", value: "Split-Type",  icon: <Wind      size={15} /> },
  { label: "Cassette",   value: "Cassette",    icon: <Building2 size={15} /> },
  { label: "Portable",   value: "Portable",    icon: <Package   size={15} /> },
  { label: "Multi-Split",value: "Multi-Split", icon: <Zap       size={15} /> },
  { label: "VRF/Ducted", value: "VRF/Ducted",  icon: <Building2 size={15} /> },
];

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated", "Most Reviews"];

const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

export default function ShopPage() {
  const [scrolled,      setScrolled]      = useState(false);
  const [search,        setSearch]        = useState("");
  const [category,      setCategory]      = useState("all");
  const [brand,         setBrand]         = useState("All Brands");
  const [sort,          setSort]          = useState("Featured");
  const [maxPrice,      setMaxPrice]      = useState(350000);
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [sortOpen,      setSortOpen]      = useState(false);
  const [cartCount,     setCartCount]     = useState(0);
  const [user,          setUser]          = useState<{ email: string } | null>(null);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [products,      setProducts]      = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
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
    setUser(null); setUserMenuOpen(false);
  };

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(json => {
      setProducts(json.products ?? []);
      setProductsLoading(false);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Filter products — price check uses the lowest variant price
  const filtered = products
    .filter((p) => {
      const lowestPrice = Math.min(...p.variants.map((v) => v.price));
      const matchSearch   = p.series.toLowerCase().includes(search.toLowerCase())
                         || p.brand.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" || p.type === category;
      const matchBrand    = brand === "All Brands" || p.brand === brand;
      const matchPrice    = lowestPrice <= maxPrice;
      return matchSearch && matchCategory && matchBrand && matchPrice;
    })
    .sort((a, b) => {
      const aPrice = Math.min(...a.variants.map((v) => v.price));
      const bPrice = Math.min(...b.variants.map((v) => v.price));
      if (sort === "Price: Low to High")  return aPrice - bPrice;
      if (sort === "Price: High to Low")  return bPrice - aPrice;
      if (sort === "Top Rated")           return b.rating - a.rating;
      if (sort === "Most Reviews")        return b.reviews - a.reviews;
      return 0;
    });

  const activeFilters = [
    category !== "all"      && category,
    brand !== "All Brands"  && brand,
    maxPrice < 350000       && `Under ${formatPrice(maxPrice)}`,
  ].filter(Boolean) as string[];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { from { opacity:0; transform:scale(0.95); }     to { opacity:1; transform:scale(1); } }
        .brand  { font-family:'Outfit',sans-serif; letter-spacing:-0.02em; }
        .outfit { font-family:'Outfit',sans-serif; }
        .glass  { background:rgba(248,247,244,0.9); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .product-card {
          background:#fff; border:1px solid rgba(0,0,0,0.07); border-radius:20px; overflow:hidden;
          transition:transform .25s, box-shadow .25s, border-color .25s;
          box-shadow:0 2px 12px rgba(0,0,0,0.05); animation:fadeUp .4s ease both;
          cursor: pointer;
        }
        .product-card:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(0,0,0,0.1); border-color:rgba(217,119,6,.25); }
        .cat-pill {
          display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:100px;
          border:1.5px solid rgba(0,0,0,0.1); background:#fff; font-size:13px; font-weight:600;
          color:#6b7280; cursor:pointer; transition:all .2s; white-space:nowrap;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .cat-pill:hover { border-color:rgba(217,119,6,.4); color:#d97706; background:#fffbf2; }
        .cat-pill.active { background:#d97706; border-color:#d97706; color:#fff; }
        .filter-btn {
          display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:12px;
          border:1.5px solid rgba(0,0,0,0.1); background:#fff; font-size:13px; font-weight:600;
          color:#374151; cursor:pointer; transition:all .2s; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .filter-btn:hover { border-color:rgba(217,119,6,.4); background:#fffbf2; }
        .filter-btn.active { border-color:#d97706; color:#d97706; background:rgba(217,119,6,.06); }
        .search-input {
          width:100%; padding:10px 16px 10px 40px; border-radius:12px;
          border:1.5px solid rgba(0,0,0,0.1); background:#fff; font-size:14px; color:#1a1a2e;
          outline:none; transition:border-color .2s, box-shadow .2s; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .search-input:focus { border-color:#d97706; box-shadow:0 0 0 3px rgba(217,119,6,0.1); }
        .search-input::placeholder { color:#9ca3af; }
        .filter-panel { background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:16px; padding:24px; box-shadow:0 8px 32px rgba(0,0,0,0.08); animation:popIn .2s ease both; }
        .dropdown { background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.1); overflow:hidden; animation:popIn .15s ease both; min-width:200px; }
        .dropdown-item { padding:10px 16px; font-size:13px; font-weight:500; color:#374151; cursor:pointer; transition:background .15s; font-family:'Plus Jakarta Sans',sans-serif; }
        .dropdown-item:hover { background:#fffbf2; color:#d97706; }
        .dropdown-item.selected { color:#d97706; font-weight:700; background:rgba(217,119,6,.05); }
        .badge { padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700; }
        .range-input { -webkit-appearance:none; width:100%; height:4px; border-radius:2px; background:linear-gradient(to right,#d97706 0%,#d97706 var(--val),#e5e7eb var(--val),#e5e7eb 100%); outline:none; cursor:pointer; }
        .range-input::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#d97706; cursor:pointer; box-shadow:0 2px 6px rgba(217,119,6,0.4); border:2px solid #fff; }
        .hp-pill {
          padding:3px 9px; border-radius:6px; font-size:11px; font-weight:700;
          border:1.5px solid rgba(0,0,0,0.09); background:#f8f7f4; color:#374151;
          transition: all .15s;
        }
        .hp-pill:hover { border-color:#d97706; color:#d97706; background:#fffbf2; }
        .empty-state { animation:fadeUp .4s ease both; }
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
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          z-index: 45; animation: fadeUp .2s ease both;
        }
        .mobile-nav {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(320px, 88vw);
          background: #faf9f6; z-index: 50;
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

        /* ── Mobile responsiveness ── */
        @media (max-width: 767px) {
          .filter-btn { padding: 8px 12px; font-size: 12px; }
          .cat-pill   { padding: 7px 12px; font-size: 12px; }

          /* Hide "Sign In" text on very small screens, keep Get Started */
          .nav-signin-desktop { display: none !important; }

          /* Toolbar search takes full width on its own row */
          .toolbar-row { flex-wrap: wrap; }
          .toolbar-search { max-width: 100% !important; flex: 1 1 100% !important; order: -1; }

          /* Filter panel full-width on mobile */
          .filter-panel-dropdown { width: calc(100vw - 48px) !important; left: 0 !important; right: 0 !important; }

          /* Sort dropdown anchors right */
          .sort-dropdown { right: 0 !important; left: auto !important; width: 200px; }

          /* Product grid: 2 columns on mobile */
          .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }

          /* Product card tweaks for small screens */
          .product-card .card-img  { height: 140px !important; }
          .product-card .card-body { padding: 12px !important; }
          .product-card .card-title { font-size: 13px !important; }
          .product-card .card-price { font-size: 15px !important; }

          /* Hero section compact */
          .page-hero { padding-top: 230px !important; padding-bottom: 24px !important; }

          /* Footer stack vertically */
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }

        @media (max-width: 400px) {
          /* Single column on very small phones */
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, transition:"all .3s" }}>
        <div className={scrolled ? "glass" : ""} style={{ transition:"all .3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent" }}>
          <div className="nav-bar" style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 24px", height:"68px", gap:"16px" }}>

            {/* Logo */}
            <Link href="/" style={{ display:"flex", alignItems:"center", gap:"8px", textDecoration:"none", flexShrink:0 }}>
              <span style={{ width:"30px", height:"30px", borderRadius:"8px", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 3px 10px rgba(217,119,6,0.3)" }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color:"#1a1a2e", fontSize:"20px", fontWeight:800, whiteSpace:"nowrap" }}>EMEREN</span>
            </Link>

            {/* Nav links — desktop only */}
            <nav className="desktop-only" style={{ alignItems:"center", gap:"28px", justifyContent:"center" }}>
              {([["Shop","/shop"],["Services","/services"],["Contact Us","/contact"],["About Us","/about"]] as [string,string][]).map(([label,href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: label==="Shop" ? "#d97706" : "#6b7280", fontSize:"14px", fontWeight: label==="Shop" ? 600 : 500, textDecoration:"none", transition:"color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color="#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color= label==="Shop" ? "#d97706" : "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            {/* Auth + cart */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", justifyContent:"flex-end" }}>
              <Link href="/cart" style={{ position:"relative", width:"40px", height:"40px", borderRadius:"12px", border:"1.5px solid rgba(0,0,0,0.1)", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", transition:"all .2s", flexShrink:0 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(217,119,6,.4)"; e.currentTarget.style.background="#fffbf2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(0,0,0,0.1)"; e.currentTarget.style.background="#fff"; }}
              >
                <ShoppingCart size={17} color="#374151" />
                {cartCount > 0 && (
                  <span style={{ position:"absolute", top:"-5px", right:"-5px", width:"17px", height:"17px", borderRadius:"50%", background:"#d97706", color:"#fff", fontSize:"9px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div style={{ position:"relative" }} ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen((v) => !v)}
                    className="desktop-only"
                    style={{ alignItems:"center", gap:"8px", padding:"7px 14px", borderRadius:"12px", border:"1.5px solid rgba(217,119,6,0.3)", background:"rgba(217,119,6,0.06)", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", maxWidth:"200px" }}>
                    <div style={{ width:"24px", height:"24px", borderRadius:"50%", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize:"13px", fontWeight:600, color:"#1a1a2e", maxWidth:"100px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {user.email.split("@")[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"#fff", border:"1px solid rgba(0,0,0,0.08)", borderRadius:"14px", boxShadow:"0 8px 32px rgba(0,0,0,0.1)", padding:"8px", minWidth:"180px", zIndex:100 }}>
                      <div style={{ padding:"8px 12px 12px", borderBottom:"1px solid rgba(0,0,0,0.06)", marginBottom:"6px" }}>
                        <p style={{ fontSize:"11px", color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Signed in as</p>
                        <p style={{ fontSize:"13px", fontWeight:700, color:"#1a1a2e", marginTop:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</p>
                      </div>
                      <Link href="/shop" style={{ display:"flex", alignItems:"center", gap:"8px", padding:"9px 12px", borderRadius:"9px", fontSize:"13px", fontWeight:600, color:"#374151", textDecoration:"none" }} onMouseEnter={(e) => (e.currentTarget.style.background="rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background="none")} onClick={() => setUserMenuOpen(false)}>Browse Shop</Link>
                      <Link href="/profile" style={{ display:"flex", alignItems:"center", gap:"8px", padding:"9px 12px", borderRadius:"9px", fontSize:"13px", fontWeight:600, color:"#374151", textDecoration:"none" }} onMouseEnter={(e) => (e.currentTarget.style.background="rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background="none")} onClick={() => setUserMenuOpen(false)}><User size={14} /> My Profile</Link>
                      <button onClick={handleSignOut} style={{ width:"100%", display:"flex", alignItems:"center", gap:"8px", padding:"9px 12px", borderRadius:"9px", border:"none", background:"none", cursor:"pointer", fontSize:"13px", fontWeight:600, color:"#ef4444", fontFamily:"'Plus Jakarta Sans',sans-serif" }} onMouseEnter={(e) => (e.currentTarget.style.background="rgba(239,68,68,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background="none")}><LogOut size={14} /> Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" className="desktop-only"
                    style={{ alignItems:"center", padding:"8px 18px", fontSize:"13px", fontWeight:600, textDecoration:"none", color:"#374151", borderRadius:"12px", border:"1.5px solid rgba(0,0,0,0.12)", transition:"all .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(217,119,6,.5)"; e.currentTarget.style.color="#d97706"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(0,0,0,0.12)"; e.currentTarget.style.color="#374151"; }}
                  >Sign In</Link>
                  <Link href="/auth/signup" className="desktop-only"
                    style={{ alignItems:"center", gap:"6px", padding:"9px 20px", fontSize:"13px", fontWeight:700, textDecoration:"none", color:"#fff", borderRadius:"12px", background:"#d97706", boxShadow:"0 4px 14px rgba(217,119,6,0.35)", transition:"background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background="#b45309")}
                    onMouseLeave={(e) => (e.currentTarget.style.background="#d97706")}
                  >Get Started <ArrowRight size={13} /></Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button className="mobile-menu-btn" onClick={() => setMobileNavOpen((v) => !v)}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"38px", height:"38px", borderRadius:"10px", border:"1.5px solid rgba(0,0,0,0.12)", background:"transparent", cursor:"pointer" }}
                aria-label="Toggle menu">
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
              <Link href="/" onClick={() => setMobileNavOpen(false)} style={{ display:"flex", alignItems:"center", gap:"8px", textDecoration:"none" }}>
                <span style={{ width:"28px", height:"28px", borderRadius:"7px", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Triangle size={12} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ color:"#1a1a2e", fontSize:"18px", fontWeight:800 }}>EMEREN</span>
              </Link>
              <button onClick={() => setMobileNavOpen(false)} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"36px", height:"36px", borderRadius:"10px", border:"1.5px solid rgba(0,0,0,0.1)", background:"transparent", cursor:"pointer" }} aria-label="Close menu">
                <X size={17} color="#374151" />
              </button>
            </div>

            {user && (
              <div style={{ margin:"12px 20px 4px", padding:"12px 14px", borderRadius:"12px", background:"rgba(217,119,6,0.06)", border:"1px solid rgba(217,119,6,0.15)", display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <User size={16} color="#fff" />
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:"12px", color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.04em", margin:0 }}>Signed in as</p>
                  <p style={{ fontSize:"13px", fontWeight:700, color:"#1a1a2e", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</p>
                </div>
              </div>
            )}

            <nav className="mobile-nav-links">
              {([
                { label:"Shop",     href:"/shop",     icon:<Wind size={16} color="#d97706" /> },
                { label:"Services", href:"/services", icon:<Zap size={16} color="#d97706" /> },
                { label:"About Us",    href:"/about",    icon:<Building2 size={16} color="#d97706" /> },
                { label:"Contact Us",  href:"/contact",  icon:<Package size={16} color="#d97706" /> },
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
                  <Link href="/auth/signup" onClick={() => setMobileNavOpen(false)}
                    style={{ padding:"13px 20px", fontSize:"14px", fontWeight:700, textDecoration:"none", color:"#fff", borderRadius:"12px", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px", boxShadow:"0 4px 14px rgba(217,119,6,0.35)" }}>
                    Get Started <ArrowRight size={14} />
                  </Link>
                  <Link href="/auth/signin" onClick={() => setMobileNavOpen(false)}
                    style={{ padding:"12px 20px", fontSize:"14px", fontWeight:600, textDecoration:"none", color:"#374151", borderRadius:"12px", border:"1.5px solid rgba(0,0,0,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    Sign In
                  </Link>
                </>
              ) : (
                <button onClick={() => { handleSignOut(); setMobileNavOpen(false); }}
                  style={{ width:"100%", padding:"13px 20px", fontSize:"14px", fontWeight:600, border:"1.5px solid rgba(239,68,68,0.25)", color:"#ef4444", borderRadius:"12px", background:"rgba(239,68,68,0.04)", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                  <LogOut size={15} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Page hero ── */}
      <div className="page-hero" style={{ paddingTop:"210px", paddingBottom:"40px", paddingLeft:"24px", paddingRight:"24px", maxWidth:"1280px", margin:"0 auto" }}>
        <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#d97706", marginBottom:"10px", fontFamily:"'Outfit',sans-serif" }}>Our Collection</p>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"12px" }}>
          <h1 className="outfit" style={{ fontSize:"clamp(28px,5vw,48px)", fontWeight:900, letterSpacing:"-1.5px", color:"#1a1a2e", lineHeight:1.1 }}>All Products</h1>
          <p style={{ fontSize:"14px", color:"#9ca3af" }}>
            Showing <span style={{ color:"#1a1a2e", fontWeight:700 }}>{filtered.length}</span> of {products.length} models
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ position:"fixed", top:"68px", left:0, right:0, zIndex:40, background:"rgba(248,247,244,0.95)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderBottom:"1px solid rgba(0,0,0,0.06)", padding:"14px 24px" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"flex", flexDirection:"column", gap:"12px" }}>
          <div className="toolbar-row" style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            {/* Search */}
            <div className="toolbar-search" style={{ position:"relative", flex:1, maxWidth:"360px" }}>
              <Search size={15} color="#9ca3af" style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)" }} />
              <input className="search-input" placeholder="Search by brand or series..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch("")} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", display:"flex" }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <div style={{ position:"relative" }}>
              <button className={`filter-btn ${filterOpen ? "active" : ""}`} onClick={() => { setFilterOpen(v => !v); setSortOpen(false); }}>
                <SlidersHorizontal size={14} /> Filters
                {activeFilters.length > 0 && (
                  <span style={{ width:"18px", height:"18px", borderRadius:"50%", background:"#d97706", color:"#fff", fontSize:"10px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{activeFilters.length}</span>
                )}
              </button>
              {filterOpen && (
                <div className="filter-panel filter-panel-dropdown" style={{ position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:100, width:"280px" }}>
                  <p style={{ fontSize:"12px", fontWeight:700, color:"#1a1a2e", marginBottom:"14px", fontFamily:"'Outfit',sans-serif", letterSpacing:"0.05em", textTransform:"uppercase" }}>Brand</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"20px" }}>
                    {BRANDS.map((b) => (
                      <div key={b} onClick={() => setBrand(b)} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", borderRadius:"9px", cursor:"pointer", background: brand===b ? "rgba(217,119,6,.08)" : "transparent", transition:"background .15s" }}>
                        <div style={{ width:"18px", height:"18px", borderRadius:"5px", border:`1.5px solid ${brand===b ? "#d97706" : "rgba(0,0,0,0.15)"}`, background: brand===b ? "#d97706" : "#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .15s" }}>
                          {brand===b && <Check size={11} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontSize:"13px", color: brand===b ? "#d97706" : "#374151", fontWeight: brand===b ? 700 : 500 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:"12px", fontWeight:700, color:"#1a1a2e", marginBottom:"10px", fontFamily:"'Outfit',sans-serif", letterSpacing:"0.05em", textTransform:"uppercase" }}>Max Price</p>
                  <div style={{ marginBottom:"8px" }}>
                    <input type="range" className="range-input" min={10000} max={350000} step={5000} value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{ "--val":`${((maxPrice-10000)/(350000-10000))*100}%` } as React.CSSProperties} />
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px" }}>
                      <span style={{ fontSize:"11px", color:"#9ca3af" }}>₱10,000</span>
                      <span style={{ fontSize:"12px", fontWeight:700, color:"#d97706" }}>Up to {formatPrice(maxPrice)}</span>
                      <span style={{ fontSize:"11px", color:"#9ca3af" }}>₱350,000</span>
                    </div>
                  </div>
                  <button onClick={() => { setBrand("All Brands"); setMaxPrice(350000); setFilterOpen(false); }}
                    style={{ width:"100%", marginTop:"8px", padding:"9px", borderRadius:"9px", border:"1.5px solid rgba(0,0,0,0.1)", background:"transparent", fontSize:"12px", fontWeight:600, color:"#6b7280", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Sort */}
            <div style={{ position:"relative", marginLeft:"auto" }}>
              <button className={`filter-btn ${sortOpen ? "active" : ""}`} onClick={() => { setSortOpen(v => !v); setFilterOpen(false); }}>
                Sort: <span style={{ color:"#d97706" }}>{sort}</span>
                <ChevronDown size={13} style={{ transition:"transform .2s", transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {sortOpen && (
                <div className="dropdown sort-dropdown" style={{ position:"absolute", top:"calc(100% + 8px)", right:0, zIndex:100 }}>
                  {SORT_OPTIONS.map((opt) => (
                    <div key={opt} className={`dropdown-item ${sort===opt ? "selected" : ""}`} onClick={() => { setSort(opt); setSortOpen(false); }}>
                      {sort===opt && <span style={{ marginRight:"6px" }}>✓</span>}{opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"2px" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.value} className={`cat-pill ${category===cat.value ? "active" : ""}`} onClick={() => setCategory(cat.value)}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Active filter tags */}
          {activeFilters.length > 0 && (
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {activeFilters.map((f) => (
                <span key={f} style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"3px 10px", borderRadius:"100px", background:"rgba(217,119,6,0.1)", border:"1px solid rgba(217,119,6,0.25)", fontSize:"12px", color:"#d97706", fontWeight:600 }}>
                  {f}
                  <X size={11} style={{ cursor:"pointer" }} onClick={() => {
                    if (f === brand) setBrand("All Brands");
                    else if (f === category) setCategory("all");
                    else setMaxPrice(350000);
                  }} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Product grid ── */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"32px 24px 80px" }}>
        {productsLoading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", border:"3px solid rgba(217,119,6,0.2)", borderTopColor:"#d97706", animation:"spin .8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ textAlign:"center", padding:"80px 24px" }}>
            <div style={{ fontSize:"48px", marginBottom:"16px" }}>🔍</div>
            <h3 className="outfit" style={{ fontSize:"22px", fontWeight:800, color:"#1a1a2e", marginBottom:"8px" }}>No products found</h3>
            <p style={{ color:"#6b7280", fontSize:"14px", marginBottom:"20px" }}>Try adjusting your search or filters.</p>
            <button onClick={() => { setSearch(""); setCategory("all"); setBrand("All Brands"); setMaxPrice(350000); }}
              style={{ padding:"10px 24px", borderRadius:"10px", background:"#d97706", color:"#fff", border:"none", fontWeight:700, fontSize:"13px", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"20px" }}>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop:"1px solid rgba(0,0,0,0.07)", padding:"40px 24px", background:"#fff" }}>
        <div className="footer-inner" style={{ maxWidth:"1280px", margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ width:"26px", height:"26px", borderRadius:"7px", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Triangle size={11} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize:"16px", fontWeight:800, color:"#1a1a2e" }}>EMEREN</span>
          </div>
          <p style={{ fontSize:"12px", color:"#d1d5db" }}>© {new Date().getFullYear()} Emeren. All rights reserved.</p>
          <div style={{ display:"flex", gap:"20px" }}>
            {([["Privacy Policy","/privacy"],["Terms","/terms"],["Contact Us","/contact"]] as [string,string][]).map(([label,href]) => (
              <Link key={label} href={href} style={{ fontSize:"12px", color:"#d1d5db", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color="#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color="#d1d5db")}
              >{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product: p, index: i }: { product: Product; index: number }) {
  const [imgError, setImgError] = useState(false);
  const lowestPrice = Math.min(...p.variants.map((v) => v.price));
  const lowestOrig  = p.variants.find((v) => v.price === lowestPrice)?.orig ?? lowestPrice;
  const discount    = Math.round(((lowestOrig - lowestPrice) / lowestOrig) * 100);
  const hasInverter = p.variants.some((v) => v.tag === "Inverter");

  return (
    <Link href={`/shop/${p.id}`} style={{ textDecoration:"none", color:"inherit", display:"block" }}>
      <div className="product-card" style={{ animationDelay:`${i * 0.05}s` }}>

        {/* Image area */}
        <div className="card-img" style={{ height:"190px", position:"relative", overflow:"hidden", background:"linear-gradient(145deg,#f0ede8 0%,#f8f7f4 50%,#ede9e2 100%)" }}>
          <div style={{ position:"absolute", top:"-30px", right:"-30px", width:"130px", height:"130px", borderRadius:"50%", background:"rgba(217,119,6,0.06)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"-20px", left:"-20px", width:"90px", height:"90px", borderRadius:"50%", background:"rgba(217,119,6,0.04)", pointerEvents:"none" }} />

          {!imgError ? (
            <img src={`/images/products/${p.id}.png`} alt={p.series}
              onError={() => setImgError(true)}
              style={{ width:"100%", height:"100%", objectFit:"contain", padding:"20px", display:"block", position:"relative", zIndex:1, mixBlendMode:"multiply" }} />
          ) : (
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"6px", zIndex:1 }}>
              <svg width="88" height="64" viewBox="0 0 88 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter:"drop-shadow(0 4px 14px rgba(217,119,6,0.18))" }}>
                <rect x="4" y="16" width="80" height="36" rx="8" fill="#fff" stroke="rgba(217,119,6,0.25)" strokeWidth="1.5"/>
                <line x1="14" y1="24" x2="14" y2="44" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="20" y1="24" x2="20" y2="44" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="26" y1="24" x2="26" y2="44" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="36" y="22" width="38" height="20" rx="4" fill="rgba(217,119,6,0.07)" stroke="rgba(217,119,6,0.15)" strokeWidth="1"/>
                <text x="55" y="36" textAnchor="middle" fontSize="10" fontWeight="700" fill="#d97706" fontFamily="Outfit,sans-serif">18°C</text>
                <circle cx="44" cy="49" r="2" fill="#93c5fd" opacity="0.7"/>
                <circle cx="52" cy="53" r="1.5" fill="#93c5fd" opacity="0.5"/>
                <circle cx="60" cy="49" r="2" fill="#93c5fd" opacity="0.7"/>
                <circle cx="76" cy="26" r="3" fill="#22c55e" opacity="0.8"/>
              </svg>
              <span style={{ fontSize:"10px", color:"#c4b5a0", fontWeight:600, letterSpacing:"0.03em" }}>{p.type}</span>
            </div>
          )}

          {p.badge && (
            <span style={{ position:"absolute", top:"12px", left:"12px", padding:"2px 8px", borderRadius:"6px", fontSize:"10px", fontWeight:700, background: BADGE_COLORS[p.badge]?.bg ?? "#d97706", color: BADGE_COLORS[p.badge]?.color ?? "#fff", zIndex:2 }}>
              {p.badge}
            </span>
          )}
          {hasInverter && (
            <span style={{ position:"absolute", top:"12px", right:"12px", padding:"2px 8px", borderRadius:"5px", fontSize:"10px", fontWeight:600, background:"rgba(34,197,94,0.1)", color:"#16a34a", border:"1px solid rgba(34,197,94,0.25)", backdropFilter:"blur(4px)", zIndex:2 }}>
              Inverter
            </span>
          )}
        </div>

        {/* Info */}
        <div className="card-body" style={{ padding:"16px" }}>
          <p style={{ color:"#9ca3af", fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 2px" }}>{p.brand}</p>
          <h3 className="card-title" style={{ color:"#1a1a2e", fontSize:"15px", fontWeight:700, margin:"0 0 10px", lineHeight:1.3 }}>{p.brand} {p.series}</h3>

          {/* HP variant pills */}
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"12px" }}>
            {p.variants.map((v) => (
              <span key={v.hp} className="hp-pill">{v.hp}</span>
            ))}
          </div>

          {/* Rating */}
          <div style={{ display:"flex", alignItems:"center", gap:"5px", marginBottom:"12px" }}>
            <Star size={12} color="#d97706" fill="#d97706" />
            <span style={{ fontSize:"12px", fontWeight:700, color:"#1a1a2e" }}>{p.rating}</span>
            <span style={{ fontSize:"12px", color:"#9ca3af" }}>({p.reviews} reviews)</span>
          </div>

          {/* Price + CTA */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <p style={{ fontSize:"10px", color:"#9ca3af", margin:"0 0 1px" }}>Starting at</p>
              <div style={{ display:"flex", alignItems:"baseline", gap:"5px" }}>
                <span className="outfit card-price" style={{ fontSize:"18px", fontWeight:800, color:"#1a1a2e" }}>{formatPrice(lowestPrice)}</span>
                <span style={{ fontSize:"11px", color:"#d1d5db", textDecoration:"line-through" }}>{formatPrice(lowestOrig)}</span>
              </div>
            </div>
            <span style={{ padding:"3px 9px", borderRadius:"7px", background:"rgba(239,68,68,0.08)", color:"#ef4444", fontSize:"11px", fontWeight:700 }}>
              {discount}% OFF
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}