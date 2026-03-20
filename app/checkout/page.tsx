"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Triangle, ArrowRight, ShoppingCart, ChevronRight,
  MapPin, CreditCard, Banknote, Check, Loader2,
  User, LogOut, AirVent, Building2, Menu, X,
} from "lucide-react";
import { createClient, type Database } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];

interface CartItem {
  id: string;
  product_id: string;
  variant_hp: string;
  name: string;
  brand: string;
  price: number;
  orig: number;
  btu: string;
  type: string;
  tag: string;
  qty: number;
  image: string;
  tubeFeet: number | null;
}

const PAYMENT_METHODS = [
  { id: "gcash",         label: "GCash",                icon: null,            img: "/images/icons/payment methods/gcash.png" },
  { id: "cod",           label: "Cash on Delivery",     icon: "Banknote",      img: null },
  { id: "bank_transfer", label: "Bank Transfer",        icon: "Building2",     img: null },
  { id: "card",          label: "Credit / Debit Card",  icon: "CreditCard",    img: null },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoParam = searchParams.get("promo") ?? "";
  const { user, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    notes: "",
    payment: "gcash",
  });

  const promoApplied = promoParam === "EMEREN10";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load cart from Supabase (resolve product details via API)
  useEffect(() => {
    if (!user) { setLoadingCart(false); return; }

    const buyNow = searchParams.get("buyNow");
    const pid    = searchParams.get("pid");
    const hp     = searchParams.get("hp");
    const tube   = searchParams.get("tube");

    // Buy Now flow — skip cart entirely, build item from URL params
    if (buyNow === "1" && pid && hp) {
      fetch("/api/products").then(r => r.json()).then((productsJson) => {
        type P = { id: string; brand: string; series: string; type: string; variants: { hp: string; price: number; orig: number; btu: string; tag: string }[] };
        const allProducts: P[] = productsJson.products ?? [];
        const product = allProducts.find((p) => p.id === pid);
        const variant = product?.variants.find((v) => v.hp === hp);
        if (!product || !variant) { router.push("/shop"); return; }
        setCart([{
          id: `buynow-${pid}-${hp}`,
          product_id: pid,
          variant_hp: hp,
          name: `${product.brand} ${product.series} ${hp}`.trim(),
          brand: product.brand,
          price: variant.price,
          orig: variant.orig,
          btu: variant.btu ?? "",
          type: product.type ?? "",
          tag: variant.tag ?? "",
          qty: 1,
          image: `/images/products/${pid}.png`,
          tubeFeet: tube ? parseInt(tube) : null,
        }]);
        setLoadingCart(false);
      });
      return;
    }

    // Normal cart flow
    const supabase = createClient();
    Promise.all([
      supabase.from("cart_items").select("*").eq("user_id", user.id),
      fetch("/api/products").then(r => r.json()),
    ]).then(([{ data }, productsJson]) => {
      if (!data) { setLoadingCart(false); return; }
      const rows = data as CartItemRow[];
      const allProducts: { id: string; brand: string; series: string; type: string; variants: { hp: string; price: number; orig: number; btu: string; tag: string }[] }[] = productsJson.products ?? [];
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
          type: product?.type ?? "",
          tag: variant?.tag ?? "",
          qty: row.quantity,
          image: `/images/products/${row.product_id}.png`,
          tubeFeet: (row as any).tube_length ?? null,
        };
      });
      const selectedIds: string[] = JSON.parse(localStorage.getItem("checkout_selected_ids") ?? "[]");
      const filtered = items.filter((i) => selectedIds.includes(i.id));
      if (filtered.length === 0) { router.push("/cart"); return; }
      setCart(filtered);
      setLoadingCart(false);
    });
  }, [user]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tubeExtra = cart.reduce((s, i) => s + Math.max(0, (i.tubeFeet ?? 10) - 10) * 300, 0);
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal >= 25000 ? 0 : 1500;
  const total = subtotal + tubeExtra - promoDiscount + delivery;
  const fmt = (n: number) => `₱${n.toLocaleString()}`;

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.province) {
      setError("Please fill in all delivery fields.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setError("");
    setPlacing(true);

    const deliveryAddress = `${form.fullName}, ${form.phone} — ${form.address}, ${form.city}, ${form.province}`;

    const isBuyNow = searchParams.get("buyNow") === "1";
    // For Buy Now, no cart items to clear. For cart checkout, clear only the ordered items.
    const cartItemIds = isBuyNow ? [] : cart.map((i) => i.id);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((i) => ({
          product_id: i.product_id,
          product_name: i.name,
          brand: i.brand,
          variant_hp: i.variant_hp,
          price: i.price,
          quantity: i.qty,
          tube_length: i.tubeFeet ?? null,
        })),
        subtotal,
        promo_discount: promoDiscount,
        delivery_fee: delivery,
        total,
        delivery_address: deliveryAddress,
        payment_method: form.payment,
        notes: form.notes || null,
        cart_item_ids: cartItemIds,
      }),
    });

    const json = await res.json();
    setPlacing(false);

    if (!res.ok) {
      setError(json.error ?? "Failed to place order. Please try again.");
      return;
    }

    setPlacedOrderId(json.order_id);
    setPlaced(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  if (placed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap'); * { box-sizing: border-box; } .outfit { font-family: 'Outfit', sans-serif; }`}</style>
        <div style={{ textAlign: "center", padding: "48px 32px", background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", maxWidth: "480px", width: "100%" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={32} color="#22c55e" />
          </div>
          <h1 className="outfit" style={{ fontSize: "28px", fontWeight: 900, color: "#1a1a2e", marginBottom: "8px" }}>Order Placed!</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "6px" }}>Your order has been received and is being confirmed.</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "32px" }}>Order ID: <span style={{ fontWeight: 700, color: "#374151" }}>{placedOrderId}</span></p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/profile" style={{ padding: "12px 24px", borderRadius: "12px", background: "#d97706", color: "#fff", fontWeight: 700, fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              View My Orders <ArrowRight size={14} />
            </Link>
            <Link href="/shop" style={{ padding: "12px 24px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.12)", color: "#374151", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .brand  { font-family:'Outfit',sans-serif; letter-spacing:-0.02em; }
        .outfit { font-family:'Outfit',sans-serif; }
        .glass  { background:rgba(248,247,244,0.9); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .field-label { font-size:12px; font-weight:700; color:#374151; margin-bottom:6px; display:block; }
        .field-input { width:100%; padding:11px 14px; border-radius:10px; border:1.5px solid rgba(0,0,0,0.1); background:#f8f7f4; font-size:13px; color:#1a1a2e; outline:none; transition:border-color .2s; font-family:'Plus Jakarta Sans',sans-serif; }
        .field-input:focus { border-color:#d97706; background:#fff; }
        .field-input::placeholder { color:#9ca3af; }
        .payment-option { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:12px; border:1.5px solid rgba(0,0,0,0.1); cursor:pointer; transition:all .15s; background:#fff; }
        .payment-option.selected { border-color:#d97706; background:rgba(217,119,6,0.04); }
        .payment-option:hover { border-color:rgba(217,119,6,0.4); }
        .place-btn { width:100%; padding:15px; background:#d97706; color:#fff; font-weight:700; font-size:15px; border:none; border-radius:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s,transform .15s; box-shadow:0 4px 16px rgba(217,119,6,0.35); font-family:'Plus Jakarta Sans',sans-serif; }
        .place-btn:hover:not(:disabled) { background:#b45309; transform:translateY(-1px); }
        .place-btn:disabled { opacity:.6; cursor:not-allowed; }

        /* ── Nav ── */
        .desktop-only { display: none !important; }
        .nav-bar { display: flex; align-items: center; justify-content: space-between; }
        @media (min-width: 768px) {
          .desktop-only { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }

        /* ── Mobile Nav Drawer ── */
        .mobile-nav-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          z-index: 45; animation: fadeUp .2s ease both;
        }
        .mobile-nav {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(320px, 88vw); background: #faf9f6; z-index: 50;
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
        .mobile-nav-footer {
          padding: 16px 20px 28px; border-top: 1px solid rgba(0,0,0,0.07);
          display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;
        }

        /* ── Mobile layout ── */
        @media (max-width: 767px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .summary-sticky { position: static !important; }
        }
      `}</style>

      {/* Navbar */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? undefined : "1px solid transparent" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800 }}>EMEREN</span>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link href="/cart" style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <ShoppingCart size={17} color="#6b7280" />
                {cart.length > 0 && (
                  <span style={{ position: "absolute", top: "-6px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", background: "#d97706", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #f8f7f4" }}>
                    {cart.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </Link>

              {user && (
                <div style={{ position: "relative" }} className="desktop-only">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e" }}>{user.email?.split("@")[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100 }}>
                      <Link href="/my-units"
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <AirVent size={14} /> My Units
                      </Link>
                      <Link href="/profile"
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={14} /> My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile hamburger */}
              <button className="mobile-menu-btn" onClick={() => setMobileNavOpen((v) => !v)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer" }}
                aria-label="Toggle menu">
                {mobileNavOpen ? <X size={18} color="#1a1a2e" /> : <Menu size={18} color="#1a1a2e" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileNavOpen(false)} />
          <div className="mobile-nav">
            <div className="mobile-nav-header">
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }} onClick={() => setMobileNavOpen(false)}>
                <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Triangle size={12} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ color: "#1a1a2e", fontSize: "18px", fontWeight: 800 }}>EMEREN</span>
              </Link>
              <button onClick={() => setMobileNavOpen(false)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} color="#374151" />
              </button>
            </div>
            <nav className="mobile-nav-links">
              {[["Shop", "/shop"], ["Services", "/services"], ["About Us", "/about"], ["Contact Us", "/contact"]].map(([label, href]) => (
                <Link key={label} href={href} className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
                  <ArrowRight size={15} color="#d97706" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mobile-nav-footer">
              {user ? (
                <button onClick={handleSignOut} className="mobile-nav-link" style={{ color: "#ef4444" }}>
                  <LogOut size={15} /> Sign Out
                </button>
              ) : (
                <Link href="/auth/signin" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}><User size={15} /> Sign In</Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Main */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px", animation: "fadeUp .4s ease both" }}>
          <Link href="/shop" style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >Shop</Link>
          <ChevronRight size={13} color="#d1d5db" />
          <Link href="/cart" style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d97706")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
          >Cart</Link>
          <ChevronRight size={13} color="#d1d5db" />
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Checkout</span>
        </div>

        <h1 className="outfit" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, letterSpacing: "-1px", color: "#1a1a2e", marginBottom: "32px", animation: "fadeUp .4s ease both" }}>
          Checkout
        </h1>

        {loadingCart ? (
          <div style={{ textAlign: "center", padding: "60px" }}><p style={{ color: "#9ca3af" }}>Loading…</p></div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>Your cart is empty.</p>
            <Link href="/shop" style={{ padding: "12px 24px", borderRadius: "12px", background: "#d97706", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: "14px" }}>Browse Products</Link>
          </div>
        ) : (
          <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>

            {/* Left: form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Delivery */}
              <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", animation: "fadeUp .4s ease both" }}>
                <h2 className="outfit" style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a2e", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={17} color="#d97706" /> Delivery Details
                </h2>
                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="field-label">Full Name *</label>
                    <input className="field-input" placeholder="Juan dela Cruz" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">Phone Number *</label>
                    <input className="field-input" placeholder="09xx xxx xxxx" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="field-label">Street Address *</label>
                    <input className="field-input" placeholder="House no., Street, Barangay" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">City / Municipality *</label>
                    <input className="field-input" placeholder="e.g. Angeles City" value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">Province *</label>
                    <input className="field-input" placeholder="e.g. Pampanga" value={form.province} onChange={(e) => handleChange("province", e.target.value)} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="field-label">Order Notes (optional)</label>
                    <textarea className="field-input" placeholder="Special instructions, gate code, preferred schedule…" rows={3} value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} style={{ resize: "vertical" }} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", animation: "fadeUp .5s ease both" }}>
                <h2 className="outfit" style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a2e", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CreditCard size={17} color="#d97706" /> Payment Method
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {PAYMENT_METHODS.map((m) => (
                    <div key={m.id} className={`payment-option ${form.payment === m.id ? "selected" : ""}`} onClick={() => handleChange("payment", m.id)}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {m.img ? (
                          <img src={m.img} alt={m.label} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                        ) : m.icon === "Banknote" ? (
                          <Banknote size={18} color="#d97706" />
                        ) : m.icon === "Building2" ? (
                          <Building2 size={18} color="#d97706" />
                        ) : m.icon === "CreditCard" ? (
                          <CreditCard size={18} color="#d97706" />
                        ) : null}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", flex: 1 }}>{m.label}</span>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: form.payment === m.id ? "none" : "1.5px solid rgba(0,0,0,0.15)", background: form.payment === m.id ? "#d97706" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {form.payment === m.id && <Check size={10} color="#fff" />}
                      </div>
                    </div>
                  ))}
                </div>
                {form.payment === "gcash" && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "12px", padding: "10px 12px", background: "rgba(217,119,6,0.04)", borderRadius: "8px", border: "1px solid rgba(217,119,6,0.12)" }}>
                    GCash payment details will be sent to your email after order confirmation.
                  </p>
                )}
                {form.payment === "bank_transfer" && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "12px", padding: "10px 12px", background: "rgba(217,119,6,0.04)", borderRadius: "8px", border: "1px solid rgba(217,119,6,0.12)" }}>
                    Bank transfer details will be sent to your email after order confirmation.
                  </p>
                )}
                {form.payment === "cod" && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "12px", padding: "10px 12px", background: "rgba(217,119,6,0.04)", borderRadius: "8px", border: "1px solid rgba(217,119,6,0.12)" }}>
                    Please prepare exact amount on delivery day.
                  </p>
                )}
              </div>
            </div>

            {/* Right: summary */}
            <div className="summary-sticky" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", position: "sticky", top: "88px", animation: "fadeUp .4s ease both" }}>
              <h2 className="outfit" style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a2e", marginBottom: "18px" }}>Order Summary</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                {cart.map((item) => {
                  const extraFeet = Math.max(0, (item.tubeFeet ?? 10) - 10);
                  const extraCost = extraFeet * 300;
                  return (
                    <div key={item.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                          {item.qty > 1 && <p style={{ fontSize: "11px", color: "#9ca3af" }}>×{item.qty}</p>}
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", flexShrink: 0 }}>₱{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                      {item.tubeFeet === null ? (
                        <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                          🔧 Tube length TBD on-site
                        </p>
                      ) : extraCost === 0 ? (
                        <p style={{ fontSize: "11px", color: "#16a34a", marginTop: "4px", fontWeight: 600 }}>
                          ✓ {item.tubeFeet} ft copper tube — included
                        </p>
                      ) : (
                        <p style={{ fontSize: "11px", color: "#d97706", marginTop: "4px", fontWeight: 600 }}>
                          {item.tubeFeet} ft copper tube — +₱{extraCost.toLocaleString()} ({extraFeet} ft extra)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "16px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{fmt(subtotal)}</span>
                </div>
                {tubeExtra > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#d97706" }}>Tube extension</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#d97706" }}>+{fmt(tubeExtra)}</span>
                  </div>
                )}
                {promoApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#d97706" }}>Promo (EMEREN10)</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#d97706" }}>−{fmt(promoDiscount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>Delivery</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: delivery === 0 ? "#22c55e" : "#1a1a2e" }}>
                    {delivery === 0 ? "FREE" : fmt(delivery)}
                  </span>
                </div>
              </div>

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>Total</span>
                <span className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e" }}>{fmt(total)}</span>
              </div>

              {error && (
                <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "12px", padding: "10px 12px", background: "rgba(239,68,68,0.06)", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </p>
              )}

              <button className="place-btn" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Placing Order…</> : <><Banknote size={15} /> Place Order — {fmt(total)}</>}
              </button>

              <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginTop: "12px" }}>
                By placing your order, you agree to our <Link href="/terms" style={{ color: "#d97706", textDecoration: "none" }}>Terms</Link> and <Link href="/privacy" style={{ color: "#d97706", textDecoration: "none" }}>Privacy Policy</Link>.
              </p>
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
              <Link key={l} href={href} style={{ fontSize: "12px", color: "#d1d5db", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >{l}</Link>
            ))}
          </div>
        </div>
      </footer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
