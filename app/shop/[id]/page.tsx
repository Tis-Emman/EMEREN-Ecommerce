"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Triangle, ArrowLeft, ArrowRight, Star, Check, ShoppingCart,
  User, LogOut, Phone, MapPin, Clock, ChevronRight,
  Shield, Wrench, Truck, Wind, Zap, Thermometer, Menu, X,
} from "lucide-react";
import { BADGE_COLORS, type Variant, type Product } from "@/lib/products";

const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

export default function ProductPage() {
  const params   = useParams();
  const router   = useRouter();

  const [product,        setProduct]       = useState<Product | null>(null);
  const [allProducts,    setAllProducts]   = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [added,         setAdded]         = useState(false);
  const [cartCount,     setCartCount]     = useState(0);
  const [user,          setUser]          = useState<{ id: string; email: string } | null>(null);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [activeTab,     setActiveTab]     = useState<"features"|"specs">("features");
  const [imgError,      setImgError]      = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
    fetch(`/api/products/${id}`).then(r => r.json()).then(json => {
      setProduct(json.product ?? null);
      setProductLoading(false);
    });
    fetch("/api/products").then(r => r.json()).then(json => {
      setAllProducts(json.products ?? []);
    });
  }, [params.id]);

  useEffect(() => {
    if (product) setSelectedVariant(product.variants[0]);
  }, [product]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (u) {
        setUser({ id: u.id, email: u.email ?? "" });
        supabase.from("cart_items").select("quantity").eq("user_id", u.id).then(({ data: rows }) => {
          setCartCount(rows?.reduce((s, r) => s + r.quantity, 0) ?? 0);
        });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null); setUserMenuOpen(false);
  };

  const handleAdd = async () => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    if (!selectedVariant || !product) return;

    const supabase = createClient();

    // Check if same product+variant already in cart
    const { data: existing, error: selectErr } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .eq("variant_hp", selectedVariant.hp)
      .maybeSingle();

    if (selectErr) {
      console.error("Cart select error:", selectErr);
      alert(`Cart error: ${selectErr.message}`);
      return;
    }

    if (existing) {
      const { error: updateErr } = await (supabase.from("cart_items") as any)
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
      if (updateErr) {
        console.error("Cart update error:", updateErr);
        alert(`Cart update error: ${updateErr.message}`);
        return;
      }
    } else {
      const { error: insertErr } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        variant_hp: selectedVariant.hp,
        quantity: 1,
      });
      if (insertErr) {
        console.error("Cart insert error:", insertErr);
        alert(`Cart insert error: ${insertErr.message}`);
        return;
      }
    }

    setAdded(true);
    setCartCount((c) => c + 1);
    setTimeout(() => setAdded(false), 1800);
  };

  if (productLoading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f8f7f4" }}>
        <div style={{ width:"32px", height:"32px", borderRadius:"50%", border:"3px solid rgba(217,119,6,0.2)", borderTopColor:"#d97706", animation:"spin .8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#f8f7f4" }}>
        <p style={{ fontSize:"48px", marginBottom:"16px" }}>🔍</p>
        <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:"24px", fontWeight:800, color:"#1a1a2e", marginBottom:"8px" }}>Product not found</h2>
        <Link href="/shop" style={{ color:"#d97706", fontWeight:700, textDecoration:"none" }}>← Back to Shop</Link>
      </div>
    );
  }

  const discount = Math.round(((selectedVariant.orig - selectedVariant.price) / selectedVariant.orig) * 100);
  const related  = allProducts.filter((p) => p.id !== product.id && (p.type === product.type || p.brand === product.brand)).slice(0, 3);

  return (
    <div style={{ minHeight:"100vh", background:"#f8f7f4", fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", color:"#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.96)}       to{opacity:1;transform:scale(1)} }
        .brand  { font-family:'Outfit',sans-serif; letter-spacing:-0.02em; }
        .outfit { font-family:'Outfit',sans-serif; }
        .glass  { background:rgba(248,247,244,0.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .add-btn {
          background:#d97706; color:#fff; border:none; border-radius:14px;
          padding:14px 28px; font-size:15px; font-weight:700; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px;
          transition:background .15s, transform .15s, box-shadow .15s;
          box-shadow:0 4px 16px rgba(217,119,6,0.35);
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .add-btn:hover { background:#b45309; transform:translateY(-2px); box-shadow:0 8px 24px rgba(217,119,6,0.4); }
        .add-btn.added { background:#22c55e; box-shadow:0 4px 16px rgba(34,197,94,0.35); }
        .tab-btn {
          padding:9px 22px; border-radius:10px; border:1.5px solid rgba(0,0,0,0.1);
          background:transparent; font-size:13px; font-weight:600; color:#6b7280;
          cursor:pointer; transition:all .2s; font-family:'Plus Jakarta Sans',sans-serif;
        }
        .tab-btn.active { background:#1a1a2e; border-color:#1a1a2e; color:#fff; }
        .hp-btn {
          padding:10px 18px; border-radius:10px; border:1.5px solid rgba(0,0,0,0.1);
          background:#fff; font-size:13px; font-weight:700; color:#374151;
          cursor:pointer; transition:all .2s; font-family:'Plus Jakarta Sans',sans-serif;
          display:flex; flex-direction:column; align-items:center; gap:3px;
          min-width:90px;
        }
        .hp-btn:hover { border-color:#d97706; color:#d97706; }
        .hp-btn.active { border-color:#d97706; background:rgba(217,119,6,0.06); color:#d97706; }
        .related-card {
          background:#fff; border:1px solid rgba(0,0,0,0.07); border-radius:16px;
          overflow:hidden; transition:transform .2s, box-shadow .2s, border-color .2s;
          box-shadow:0 2px 10px rgba(0,0,0,0.04); text-decoration:none; color:inherit; display:block;
        }
        .related-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.09); border-color:rgba(217,119,6,.2); }
        .spec-row:nth-child(odd) { background:rgba(0,0,0,0.02); }
        /* Hide on mobile, show on desktop */
        .desktop-only { display:none !important; }
        @media (min-width:768px) {
          .desktop-only { display:flex !important; }
          .mobile-menu-btn { display:none !important; }
        }
        /* ── Mobile Nav Drawer ── */
        .mobile-nav-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.35);
          backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
          z-index:45; animation:fadeUp .2s ease both;
        }
        .mobile-nav {
          position:fixed; top:0; right:0; bottom:0;
          width:min(320px,88vw); background:#faf9f6; z-index:50;
          display:flex; flex-direction:column;
          box-shadow:-8px 0 40px rgba(0,0,0,0.14);
          animation:slideInRight .25s cubic-bezier(.22,1,.36,1) both;
          overflow-y:auto;
        }
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .mobile-nav-header {
          display:flex; align-items:center; justify-content:space-between;
          padding:18px 20px 16px; border-bottom:1px solid rgba(0,0,0,0.07); flex-shrink:0;
        }
        .mobile-nav-links { flex:1; padding:8px 12px; display:flex; flex-direction:column; gap:2px; }
        .mobile-nav-link {
          display:flex; align-items:center; gap:12px; padding:13px 12px;
          border-radius:12px; font-family:'Plus Jakarta Sans',sans-serif;
          font-size:15px; font-weight:600; color:#374151; text-decoration:none;
          transition:background .15s,color .15s; cursor:pointer;
          background:none; border:none; width:100%; text-align:left;
        }
        .mobile-nav-link:hover { background:rgba(217,119,6,0.07); color:#d97706; }
        .mobile-nav-link .link-icon {
          width:34px; height:34px; border-radius:9px; background:rgba(0,0,0,0.04);
          display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .15s;
        }
        .mobile-nav-link:hover .link-icon { background:rgba(217,119,6,0.12); }
        .mobile-nav-footer {
          padding:16px 20px 28px; border-top:1px solid rgba(0,0,0,0.07);
          display:flex; flex-direction:column; gap:10px; flex-shrink:0;
        }
        .mobile-nav-divider { height:1px; background:rgba(0,0,0,0.06); margin:4px 12px; }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, transition:"all .3s" }}>
        <div className={scrolled ? "glass" : ""} style={{ transition:"all .3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent" }}>
          <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"0 24px", height:"68px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px" }}>

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
                { label:"Services", href:"/services", icon:<Wrench size={16} color="#d97706" /> },
                { label:"About Us",    href:"/about",    icon:<Shield size={16} color="#d97706" /> },
                { label:"Contact Us",  href:"/contact",  icon:<Phone size={16} color="#d97706" /> },
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

      {/* ── Main ── */}
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"100px 24px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"28px", animation:"fadeUp .4s ease both" }}>
          <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:"6px", color:"#9ca3af", fontSize:"13px", fontWeight:600, textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color="#d97706")}
            onMouseLeave={(e) => (e.currentTarget.style.color="#9ca3af")}
          ><ArrowLeft size={13} /> Shop</Link>
          <ChevronRight size={12} color="#d1d5db" />
          <span style={{ fontSize:"13px", color:"#9ca3af" }}>{product.type}</span>
          <ChevronRight size={12} color="#d1d5db" />
          <span style={{ fontSize:"13px", color:"#1a1a2e", fontWeight:600 }}>{product.brand} {product.series}</span>
        </div>

        {/* ── Hero ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", marginBottom:"64px", alignItems:"start" }}>

          {/* Image */}
          <div style={{ animation:"fadeUp .4s ease .05s both" }}>
            <div style={{ borderRadius:"24px", overflow:"hidden", background:"linear-gradient(145deg,#f0ede8 0%,#f8f7f4 50%,#ede9e2 100%)", position:"relative", aspectRatio:"1/1", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(217,119,6,0.06)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:"-30px", left:"-30px", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(217,119,6,0.04)", pointerEvents:"none" }} />
              {!imgError ? (
                <img src={`/images/products/${product.id}.png`} alt={product.series}
                  onError={() => setImgError(true)}
                  style={{ width:"80%", height:"80%", objectFit:"contain", mixBlendMode:"multiply", position:"relative", zIndex:1 }} />
              ) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", zIndex:1 }}>
                  <svg width="140" height="100" viewBox="0 0 88 64" fill="none" style={{ filter:"drop-shadow(0 6px 20px rgba(217,119,6,0.2))" }}>
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
                  <span style={{ fontSize:"12px", color:"#c4b5a0", fontWeight:600, letterSpacing:"0.03em" }}>{product.type}</span>
                </div>
              )}
              {product.badge && (
                <span style={{ position:"absolute", top:"16px", left:"16px", padding:"4px 12px", borderRadius:"8px", fontSize:"11px", fontWeight:700, background: BADGE_COLORS[product.badge]?.bg ?? "#d97706", color: BADGE_COLORS[product.badge]?.color ?? "#fff", zIndex:2 }}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginTop:"16px" }}>
              {[
                { icon:<Truck  size={15} color="#d97706" />, label:"Free Delivery", sub:"Baliuag & nearby" },
                { icon:<Wrench size={15} color="#d97706" />, label:"Free Install",   sub:"Standard setup" },
                { icon:<Shield size={15} color="#d97706" />, label:"Warranty",       sub: product.specs["Warranty"] ?? "Included" },
              ].map(({ icon, label, sub }) => (
                <div key={label} style={{ background:"#fff", border:"1px solid rgba(0,0,0,0.07)", borderRadius:"12px", padding:"12px", display:"flex", flexDirection:"column", alignItems:"center", gap:"5px", textAlign:"center" }}>
                  {icon}
                  <span style={{ fontSize:"11px", fontWeight:700, color:"#1a1a2e" }}>{label}</span>
                  <span style={{ fontSize:"10px", color:"#9ca3af" }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ animation:"fadeUp .4s ease .1s both" }}>
            <p style={{ fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#d97706", margin:"0 0 8px", fontFamily:"'Outfit',sans-serif" }}>{product.brand}</p>
            <h1 className="outfit" style={{ fontSize:"clamp(24px,3.5vw,38px)", fontWeight:900, letterSpacing:"-1px", color:"#1a1a2e", margin:"0 0 16px", lineHeight:1.1 }}>
              {product.brand} {product.series}
            </h1>

            {/* Rating */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
              <div style={{ display:"flex", gap:"2px" }}>
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} color="#d97706" fill={s <= Math.round(product.rating) ? "#d97706" : "none"} />
                ))}
              </div>
              <span style={{ fontSize:"14px", fontWeight:700, color:"#1a1a2e" }}>{product.rating}</span>
              <span style={{ fontSize:"13px", color:"#9ca3af" }}>({product.reviews} reviews)</span>
            </div>

            <p style={{ fontSize:"14px", color:"#6b7280", lineHeight:1.7, marginBottom:"24px" }}>{product.description}</p>

            {/* ── HP Selector ── */}
            <div style={{ marginBottom:"28px" }}>
              <p style={{ fontSize:"12px", fontWeight:700, color:"#1a1a2e", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                Select Horsepower
              </p>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {product.variants.map((v) => (
                  <button key={v.hp} className={`hp-btn ${selectedVariant.hp === v.hp ? "active" : ""}`} onClick={() => setSelectedVariant(v)}>
                    <span style={{ fontSize:"15px" }}>{v.hp}</span>
                    <span style={{ fontSize:"10px", color: selectedVariant.hp === v.hp ? "#d97706" : "#9ca3af", fontWeight:500 }}>{v.btu}</span>
                    <span style={{ fontSize:"10px", color: selectedVariant.hp === v.hp ? "#d97706" : "#9ca3af", fontWeight:500 }}>{v.sqm}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick spec pills */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"28px" }}>
              {[
                { icon:<Thermometer size={12} color="#d97706" />, val: selectedVariant.btu },
                { icon:<Wind        size={12} color="#d97706" />, val: selectedVariant.sqm },
                { icon:<Zap         size={12} color="#d97706" />, val: selectedVariant.tag },
              ].map(({ icon, val }) => (
                <span key={val} style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"6px 12px", borderRadius:"8px", fontSize:"12px", fontWeight:600, color:"#374151", background:"#fff", border:"1px solid rgba(0,0,0,0.08)" }}>
                  {icon} {val}
                </span>
              ))}
            </div>

            {/* Price */}
            <div style={{ display:"flex", alignItems:"baseline", gap:"12px", marginBottom:"8px" }}>
              <span className="outfit" style={{ fontSize:"36px", fontWeight:900, color:"#1a1a2e", letterSpacing:"-1px" }}>{formatPrice(selectedVariant.price)}</span>
              <span style={{ fontSize:"16px", color:"#d1d5db", textDecoration:"line-through" }}>{formatPrice(selectedVariant.orig)}</span>
              <span style={{ padding:"3px 10px", borderRadius:"7px", background:"rgba(239,68,68,0.1)", color:"#ef4444", fontSize:"12px", fontWeight:700 }}>{discount}% OFF</span>
            </div>
            <p style={{ fontSize:"12px", color:"#9ca3af", marginBottom:"28px" }}>
              Price for <strong style={{ color:"#1a1a2e" }}>{selectedVariant.hp}</strong> unit. Inclusive of VAT. Installation quote available in-store.
            </p>

            {/* CTA */}
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <button className={`add-btn ${added ? "added" : ""}`} onClick={handleAdd} style={{ flex:1, minWidth:"160px", justifyContent:"center" }}>
                {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
              </button>
              <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer"
                style={{ flex:1, minWidth:"160px", padding:"14px 20px", borderRadius:"14px", border:"1.5px solid rgba(0,0,0,0.12)", background:"#fff", fontSize:"14px", fontWeight:700, color:"#374151", cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"8px", textDecoration:"none", transition:"all .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(217,119,6,.5)"; e.currentTarget.style.color="#d97706"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor="rgba(0,0,0,0.12)"; e.currentTarget.style.color="#374151"; }}
              ><Phone size={15} /> Inquire</a>
            </div>
          </div>
        </div>

        {/* ── Features / Specs ── */}
        <div style={{ marginBottom:"64px", animation:"fadeUp .4s ease .15s both" }}>
          <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
            <button className={`tab-btn ${activeTab==="features" ? "active" : ""}`} onClick={() => setActiveTab("features")}>Features</button>
            <button className={`tab-btn ${activeTab==="specs"    ? "active" : ""}`} onClick={() => setActiveTab("specs")}>Specifications</button>
          </div>
          {activeTab === "features" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"12px" }}>
              {product.features.map((f) => (
                <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:"10px", padding:"14px 16px", background:"#fff", borderRadius:"12px", border:"1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ width:"20px", height:"20px", borderRadius:"6px", background:"rgba(217,119,6,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"1px" }}>
                    <Check size={11} color="#d97706" strokeWidth={3} />
                  </span>
                  <span style={{ fontSize:"13px", color:"#374151", fontWeight:500, lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background:"#fff", borderRadius:"16px", border:"1px solid rgba(0,0,0,0.07)", overflow:"hidden" }}>
              {[
                ["Horsepower",       selectedVariant.hp],
                ["Cooling Capacity", selectedVariant.btu],
                ["Coverage Area",    selectedVariant.sqm],
                ["Technology",       selectedVariant.tag],
                ...Object.entries(product.specs),
              ].map(([key, val]) => (
                <div key={key} className="spec-row" style={{ display:"flex", padding:"13px 20px", borderBottom:"1px solid rgba(0,0,0,0.04)" }}>
                  <span style={{ width:"200px", flexShrink:0, fontSize:"13px", color:"#9ca3af", fontWeight:600 }}>{key}</span>
                  <span style={{ fontSize:"13px", color:"#1a1a2e", fontWeight:600 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Store location ── */}
        <div style={{ marginBottom:"64px", animation:"fadeUp .4s ease .2s both" }}>
          <p style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#d97706", marginBottom:"8px", fontFamily:"'Outfit',sans-serif" }}>Visit Us</p>
          <h2 className="outfit" style={{ fontSize:"26px", fontWeight:900, color:"#1a1a2e", letterSpacing:"-0.5px", marginBottom:"24px" }}>Our Store in Baliuag</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
            <div style={{ borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(0,0,0,0.08)", aspectRatio:"16/9" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30799.67!2d120.9!3d14.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0e4b9170001%3A0x1f3c6d4b8a3e4c2f!2sBaliuag%2C%20Bulacan!5e0!3m2!1sen!2sph!4v1699999999999"
                width="100%" height="100%" style={{ border:0, display:"block" }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {[
                { icon:<MapPin size={16} color="#d97706" />, label:"Address",     value:"Emeren AC Solutions\nBaliuag, Bulacan, Philippines" },
                { icon:<Phone  size={16} color="#d97706" />, label:"Contact Us",     value:"+63 917 123 4567\ninfo@emerenph.com" },
                { icon:<Clock  size={16} color="#d97706" />, label:"Store Hours", value:"Mon – Sat: 8:00 AM – 6:00 PM\nSun: 9:00 AM – 4:00 PM" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display:"flex", gap:"14px", padding:"14px", background:"#fff", borderRadius:"14px", border:"1px solid rgba(0,0,0,0.07)" }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"10px", background:"rgba(217,119,6,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</div>
                  <div>
                    <p style={{ fontSize:"10px", fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 3px" }}>{label}</p>
                    {value.split("\n").map((line) => (
                      <p key={line} style={{ fontSize:"13px", fontWeight:600, color:"#1a1a2e", margin:"1px 0", lineHeight:1.5 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <a href="https://www.google.com/maps/search/Emeren+AC+Baliuag+Bulacan" target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"7px", padding:"12px 20px", borderRadius:"12px", background:"#1a1a2e", color:"#fff", fontSize:"13px", fontWeight:700, textDecoration:"none", transition:"background .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background="#d97706")}
                onMouseLeave={(e) => (e.currentTarget.style.background="#1a1a2e")}
              ><MapPin size={14} /> Get Directions</a>
            </div>
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div style={{ animation:"fadeUp .4s ease .25s both" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px" }}>
              <h2 className="outfit" style={{ fontSize:"22px", fontWeight:900, color:"#1a1a2e", letterSpacing:"-0.5px" }}>You Might Also Like</h2>
              <Link href="/shop" style={{ fontSize:"13px", fontWeight:700, color:"#d97706", textDecoration:"none", display:"flex", alignItems:"center", gap:"4px" }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
              {related.map((rp) => {
                const lowestPrice = Math.min(...rp.variants.map((v) => v.price));
                return (
                  <Link key={rp.id} href={`/shop/${rp.id}`} className="related-card">
                    <div style={{ height:"140px", position:"relative", background:"linear-gradient(145deg,#f0ede8 0%,#f8f7f4 50%,#ede9e2 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <img src={`/images/products/${rp.id}.png`} alt={rp.series}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display="none"; }}
                        style={{ width:"100%", height:"100%", objectFit:"contain", padding:"16px", mixBlendMode:"multiply" }} />
                      {rp.badge && (
                        <span style={{ position:"absolute", top:"10px", left:"10px", padding:"2px 8px", borderRadius:"5px", fontSize:"9px", fontWeight:700, background: BADGE_COLORS[rp.badge]?.bg ?? "#d97706", color:"#fff" }}>{rp.badge}</span>
                      )}
                    </div>
                    <div style={{ padding:"12px 14px" }}>
                      <p style={{ fontSize:"9px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"#9ca3af", margin:"0 0 2px" }}>{rp.brand}</p>
                      <p style={{ fontSize:"13px", fontWeight:700, color:"#1a1a2e", margin:"0 0 4px" }}>{rp.brand} {rp.series}</p>
                      <p style={{ fontSize:"10px", color:"#9ca3af", margin:"0 0 6px" }}>{rp.variants.length} variant{rp.variants.length > 1 ? "s" : ""}</p>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div>
                          <p style={{ fontSize:"9px", color:"#9ca3af", margin:"0" }}>From</p>
                          <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:"15px", fontWeight:800, color:"#1a1a2e" }}>{formatPrice(lowestPrice)}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:"3px" }}>
                          <Star size={10} color="#d97706" fill="#d97706" />
                          <span style={{ fontSize:"11px", fontWeight:700, color:"#1a1a2e" }}>{rp.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop:"1px solid rgba(0,0,0,0.07)", padding:"40px 24px", background:"#fff" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ width:"26px", height:"26px", borderRadius:"7px", background:"#d97706", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Triangle size={11} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize:"16px", fontWeight:800, color:"#1a1a2e" }}>EMEREN</span>
          </div>
          <p style={{ fontSize:"12px", color:"#d1d5db" }}>© 2025 Emeren. All rights reserved.</p>
          <div style={{ display:"flex", gap:"20px" }}>
            {["Privacy Policy","Terms","Contact Us"].map((l) => (
              <a key={l} href="#" style={{ fontSize:"12px", color:"#d1d5db", textDecoration:"none", transition:"color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color="#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color="#d1d5db")}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}