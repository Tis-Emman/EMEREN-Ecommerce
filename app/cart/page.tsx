"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Triangle, ArrowRight, ShoppingCart, Trash2, Plus, Minus,
  Tag, Truck, Shield, Wrench, ChevronRight, X, Check, User, LogOut, AirVent,
} from "lucide-react";
import { createClient, type Database } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { type Product } from "@/lib/products";

type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];

interface CartItem {
  id: string;          // cart_items.id from Supabase
  product_id: string;
  variant_hp: string;
  name: string;
  brand: string;
  price: number;
  orig: number;
  btu: string;
  sqm: string;
  type: string;
  tag: string;
  qty: number;
}

export default function CartPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  // Load cart from Supabase (resolve product details via API)
  useEffect(() => {
    if (!user) { setCart([]); setLoadingCart(false); return; }
    const supabase = createClient();
    Promise.all([
      supabase.from("cart_items").select("*").eq("user_id", user.id),
      fetch("/api/products").then(r => r.json()),
    ]).then(([{ data }, productsJson]) => {
      if (!data) { setLoadingCart(false); return; }
      const rows = data as CartItemRow[];
      const allProducts: Product[] = productsJson.products ?? [];
      const items: CartItem[] = rows.map((row) => {
        const product = allProducts.find((p) => p.id === row.product_id);
        const variant = product?.variants.find((v) => v.hp === row.variant_hp);
        return {
          id: row.id,
          product_id: row.product_id,
          variant_hp: row.variant_hp,
          name: product ? `${product.brand} ${product.series} ${row.variant_hp}`.trim() : row.product_id,
          brand: product?.brand ?? "",
          price: variant?.price ?? 0,
          orig: variant?.orig ?? 0,
          btu: variant?.btu ?? "",
          sqm: variant?.sqm ?? "",
          type: product?.type ?? "",
          tag: variant?.tag ?? "",
          qty: row.quantity,
        };
      });
      setCart(items);
      setLoadingCart(false);
    });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  const updateQty = async (id: string, delta: number) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.qty + delta);
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: newQty } : c));
    const supabase = createClient();
    await (supabase.from("cart_items") as any).update({ quantity: newQty }).eq("id", id);
  };

  const removeItem = async (id: string) => {
    setRemovingId(id);
    setTimeout(async () => {
      setCart((prev) => prev.filter((c) => c.id !== id));
      setRemovingId(null);
      const supabase = createClient();
      await supabase.from("cart_items").delete().eq("id", id);
    }, 300);
  };

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === "EMEREN10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = cart.reduce((sum, item) => sum + (item.orig - item.price) * item.qty, 0);
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal >= 25000 ? 0 : 1500;
  const total = subtotal - promoDiscount + delivery;
  const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f7f4",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#1a1a2e",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .brand  { font-family:'Outfit',sans-serif; letter-spacing:-0.02em; }
        .outfit { font-family:'Outfit',sans-serif; }
        .glass  { background:rgba(248,247,244,0.9); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .cart-item { background:#fff; border:1px solid rgba(0,0,0,0.07); border-radius:20px; padding:20px; display:flex; gap:16px; align-items:flex-start; transition:box-shadow .25s, opacity .3s, transform .3s; box-shadow:0 2px 12px rgba(0,0,0,0.05); animation:fadeUp .4s ease both; }
        .cart-item:hover { box-shadow:0 8px 28px rgba(0,0,0,0.08); }
        .cart-item.removing { opacity:0; transform:translateX(20px); }
        .qty-btn { width:30px; height:30px; border-radius:8px; border:1.5px solid rgba(0,0,0,0.1); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; color:#374151; flex-shrink:0; }
        .qty-btn:hover { border-color:#d97706; color:#d97706; background:#fffbf2; }
        .qty-btn:disabled { opacity:.35; cursor:not-allowed; }
        .qty-btn:disabled:hover { border-color:rgba(0,0,0,0.1); color:#374151; background:#fff; }
        .remove-btn { background:none; border:none; cursor:pointer; color:#d1d5db; display:flex; align-items:center; padding:4px; border-radius:7px; transition:color .15s, background .15s; }
        .remove-btn:hover { color:#ef4444; background:rgba(239,68,68,.08); }
        .summary-card { background:#fff; border:1px solid rgba(0,0,0,0.07); border-radius:20px; padding:24px; box-shadow:0 2px 12px rgba(0,0,0,0.05); position:sticky; top:88px; animation:fadeUp .4s ease both; }
        .checkout-btn { width:100%; padding:15px; background:#d97706; color:#fff; font-weight:700; font-size:15px; border:none; border-radius:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s,transform .15s,box-shadow .15s; box-shadow:0 4px 16px rgba(217,119,6,0.35); font-family:'Plus Jakarta Sans',sans-serif; }
        .checkout-btn:hover { background:#b45309; transform:translateY(-1px); box-shadow:0 6px 22px rgba(217,119,6,0.45); }
        .checkout-btn:active { transform:translateY(0); }
        .promo-input { flex:1; padding:11px 14px; border-radius:10px; border:1.5px solid rgba(0,0,0,0.1); background:#f8f7f4; font-size:13px; color:#1a1a2e; outline:none; transition:border-color .2s; font-family:'Plus Jakarta Sans',sans-serif; }
        .promo-input:focus { border-color:#d97706; }
        .promo-input::placeholder { color:#9ca3af; }
        .promo-input.error { border-color:#ef4444; }
        .promo-input.success { border-color:#22c55e; }
        .perks-row { display:flex; flex-direction:column; gap:10px; padding:16px; background:rgba(217,119,6,0.04); border:1px solid rgba(217,119,6,0.12); border-radius:14px; }
      `}</style>

      {/* Navbar */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? undefined : "1px solid transparent" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800 }}>EMEREN</span>
            </Link>

            <nav style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hidden md:flex">
              {[["Products", "/shop"], ["Features", "/#features"], ["About Us", "/about"], ["Contact Us", "/#contact"]].map(([label, href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Cart icon (active) */}
              <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid #d97706", background: "rgba(217,119,6,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingCart size={17} color="#d97706" />
                {cart.length > 0 && (
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "#d97706", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #f8f7f4" }}>
                    {cart.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>

              {user ? (
                <div style={{ position: "relative" }} ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email?.split("@")[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100, animation: "fadeUp .2s ease both" }}>
                      <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "6px" }}>
                        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                      <Link href="/my-units"
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none", transition: "background .15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <AirVent size={14} /> My Units
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
                  <Link href="/auth/signin" style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 600, textDecoration: "none", color: "#374151", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.12)", transition: "all .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.5)"; e.currentTarget.style.color = "#d97706"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#374151"; }}
                  >Sign In</Link>
                  <Link href="/auth/signup" style={{ padding: "9px 20px", fontSize: "13px", fontWeight: 700, textDecoration: "none", color: "#fff", borderRadius: "12px", background: "#d97706", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(217,119,6,0.35)", transition: "all .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
                  >Get Started <ArrowRight size={13} /></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "32px", animation: "fadeUp .4s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <Link href="/shop" style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >Shop</Link>
            <ChevronRight size={13} color="#d1d5db" />
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Cart</span>
          </div>
          <h1 className="outfit" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-1px", color: "#1a1a2e" }}>
            Your Cart
            {cart.length > 0 && (
              <span style={{ fontSize: "18px", fontWeight: 500, color: "#9ca3af", marginLeft: "10px" }}>
                ({cart.reduce((s, i) => s + i.qty, 0)} {cart.reduce((s, i) => s + i.qty, 0) === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>

        {loadingCart ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <p style={{ color: "#9ca3af" }}>Loading your cart…</p>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", animation: "fadeUp .4s ease both" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <ShoppingCart size={36} color="#d97706" />
            </div>
            <h2 className="outfit" style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a2e", marginBottom: "8px" }}>Your cart is empty</h2>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>Looks like you haven't added any units yet.</p>
            <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", borderRadius: "12px", background: "#d97706", color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none", boxShadow: "0 4px 16px rgba(217,119,6,0.35)" }}>
              Browse Products <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>

            {/* Cart items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {cart.map((item, i) => (
                <div key={item.id} className={`cart-item ${removingId === item.id ? "removing" : ""}`} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div style={{ width: "90px", height: "90px", borderRadius: "14px", background: "radial-gradient(ellipse at center, rgba(217,119,6,0.08) 0%, #f8f7f4 70%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "38px", filter: "drop-shadow(0 2px 8px rgba(217,119,6,0.15))" }}>❄️</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{item.brand}</p>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px", lineHeight: 1.3 }}>{item.name}</h3>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                          {[item.btu, item.sqm, item.type].filter(Boolean).map((t) => (
                            <span key={t} style={{ padding: "2px 7px", borderRadius: "5px", fontSize: "11px", color: "#6b7280", background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}>{t}</span>
                          ))}
                          {item.tag && (
                            <span style={{ padding: "2px 7px", borderRadius: "5px", fontSize: "11px", color: "#16a34a", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", fontWeight: 600 }}>{item.tag}</span>
                          )}
                        </div>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px" }}>
                      <div>
                        <span className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e" }}>{formatPrice(item.price * item.qty)}</span>
                        {item.qty > 1 && <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "6px" }}>{formatPrice(item.price)} each</span>}
                        <span style={{ fontSize: "11px", color: "#d1d5db", textDecoration: "line-through", marginLeft: "8px" }}>{formatPrice(item.orig * item.qty)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button className="qty-btn" onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}><Minus size={12} /></button>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e", minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.id, 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#d97706", fontWeight: 600, textDecoration: "none", marginTop: "4px" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="summary-card">
              <h2 className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", marginBottom: "20px", letterSpacing: "-0.5px" }}>Order Summary</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#6b7280", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name} {item.qty > 1 && `×${item.qty}`}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", flexShrink: 0 }}>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "16px 0" }} />

              {/* Promo */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Tag size={12} color="#d97706" /> Promo Code
                </p>
                {promoApplied ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", animation: "slideIn .2s ease both" }}>
                    <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                      <Check size={13} /> EMEREN10 applied!
                    </span>
                    <button onClick={() => setPromoApplied(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      className={`promo-input ${promoError ? "error" : ""}`}
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(false); }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                    />
                    <button onClick={applyPromo} style={{ padding: "0 14px", borderRadius: "10px", background: "#d97706", color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "background .15s", flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
                    >Apply</button>
                  </div>
                )}
                {promoError && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "5px" }}>Invalid promo code. Try EMEREN10</p>}
              </div>

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "16px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e" }}>{formatPrice(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#22c55e" }}>You save</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#22c55e" }}>−{formatPrice(savings)}</span>
                  </div>
                )}
                {promoApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between", animation: "slideIn .2s ease both" }}>
                    <span style={{ fontSize: "13px", color: "#d97706" }}>Promo (10%)</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#d97706" }}>−{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Delivery</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: delivery === 0 ? "#22c55e" : "#1a1a2e" }}>
                    {delivery === 0 ? "FREE" : formatPrice(delivery)}
                  </span>
                </div>
              </div>

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>Total</span>
                <span className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e" }}>{formatPrice(total)}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => router.push(`/checkout?promo=${promoApplied ? "EMEREN10" : ""}`)}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>

              {delivery > 0 && (
                <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginTop: "10px" }}>
                  Add <span style={{ color: "#d97706", fontWeight: 700 }}>{formatPrice(25000 - subtotal)}</span> more for free delivery
                </p>
              )}

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "16px 0" }} />

              <div className="perks-row">
                {[
                  { icon: <Truck size={14} color="#d97706" />, text: "Free delivery on orders over ₱25,000" },
                  { icon: <Wrench size={14} color="#d97706" />, text: "Professional installation included" },
                  { icon: <Shield size={14} color="#d97706" />, text: "2-year warranty on all units" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {p.icon}
                    </div>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
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
            {[["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"]].map(([l, href]) => (
              <Link key={l} href={href} style={{ fontSize: "12px", color: "#d1d5db", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
