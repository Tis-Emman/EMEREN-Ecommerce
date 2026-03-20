"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface PreviewItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export function CartPreview() {
  const { user, cartCount } = useAuth();
  const [hover, setHover] = useState(false);
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchedForCount = useRef<number>(-1);

  const fetchItems = async () => {
    if (!user) return;
    if (fetchedForCount.current === cartCount) return; // already fresh
    setLoading(true);
    const supabase = createClient();
    const [{ data: rows }, productsJson] = await Promise.all([
      supabase.from("cart_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      fetch("/api/products").then(r => r.json()),
    ]);
    if (rows) {
      const allProducts: { id: string; brand: string; series: string; variants: { hp: string; price: number }[] }[] = productsJson.products ?? [];
      setItems(rows.map((row: { id: string; product_id: string; variant_hp: string; quantity: number }) => {
        const product = allProducts.find(p => p.id === row.product_id);
        const variant = product?.variants.find(v => v.hp === row.variant_hp);
        return {
          id: row.id,
          name: product ? `${product.brand} ${product.series} ${row.variant_hp}`.trim() : row.product_id,
          price: variant?.price ?? 0,
          qty: row.quantity,
          image: `/images/products/${row.product_id}.png`,
        };
      }));
      fetchedForCount.current = cartCount;
    }
    setLoading(false);
  };

  // Invalidate cache when cart count changes
  useEffect(() => {
    fetchedForCount.current = -1;
  }, [cartCount]);

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setHover(true);
    fetchItems();
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setHover(false), 150);
  };

  const extraCount = cartCount - items.length;

  return (
    <div style={{ position: "relative" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <style>{`
        @keyframes cartPopIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
      `}</style>

      {/* Cart icon button */}
      <Link href="/cart" style={{
        position: "relative", width: "40px", height: "40px", borderRadius: "12px",
        border: `1.5px solid ${hover ? "rgba(217,119,6,.4)" : "rgba(0,0,0,0.1)"}`,
        background: hover ? "#fffbf2" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        textDecoration: "none", transition: "all .2s", flexShrink: 0,
      }}>
        <ShoppingCart size={17} color="#374151" />
        {cartCount > 0 && (
          <span style={{
            position: "absolute", top: "-5px", right: "-5px",
            minWidth: "17px", height: "17px", borderRadius: "999px",
            background: "#d97706", color: "#fff", fontSize: "9px", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", border: "2px solid #f8f7f4",
          }}>
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {/* Hover popup */}
      {hover && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: "288px", background: "#fff",
          border: "1px solid rgba(0,0,0,0.08)", borderRadius: "16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.13)", padding: "14px",
          zIndex: 200, animation: "cartPopIn .15s ease both",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
            Recently Added
          </p>

          {loading ? (
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", padding: "16px 0" }}>Loading…</p>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <ShoppingCart size={28} color="#d1d5db" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "10px", flexShrink: 0,
                    background: "radial-gradient(ellipse at center, rgba(217,119,6,0.08) 0%, #f8f7f4 70%)",
                    overflow: "hidden",
                  }}>
                    <img
                      src={item.image} alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain", padding: "5px" }}
                      onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "2px" }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                      ×{item.qty} · <span style={{ color: "#d97706", fontWeight: 700 }}>₱{item.price.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ))}
              {extraCount > 0 && (
                <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>
                  +{extraCount} more item{extraCount > 1 ? "s" : ""} in cart
                </p>
              )}
            </div>
          )}

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: "12px", paddingTop: "10px" }}>
            <Link href="/cart" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "9px 14px", borderRadius: "10px", background: "#d97706",
              color: "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none",
              transition: "background .15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
            >
              View Cart <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
