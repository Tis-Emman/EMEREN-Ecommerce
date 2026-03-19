"use client";

import { useState, useEffect } from "react";
import { Search, X, Plus, Edit2, Trash2, Save, AlertCircle, Check, ExternalLink, ChevronDown } from "lucide-react";
import Link from "next/link";
import { BADGE_COLORS, type Product, type Variant } from "@/lib/products";

const TYPES = ["Split-Type", "Cassette", "Portable", "Multi-Split", "VRF/Ducted", "Floor-Mounted"];
const BADGES = ["", "Best Seller", "Featured", "New", "Commercial", "Premium", "Sale", "Popular", "Enterprise"];
const FILTER_TYPES = ["All", ...TYPES];

const fmt = (n: number) => `₱${n.toLocaleString()}`;

function emptyProduct(): Product {
  return {
    id: "", brand: "", series: "", type: "Split-Type", badge: null,
    rating: 4.5, reviews: 0, description: "",
    features: [""],
    specs: { "Type": "", "Technology": "", "Refrigerant": "", "Voltage": "220V / 60Hz", "Warranty": "" },
    variants: [{ hp: "", price: 0, orig: 0, btu: "", sqm: "", tag: "Inverter" }],
  };
}

export default function AdminProductsPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("All");
  const [toast, setToast]             = useState<{ msg: string; ok: boolean } | null>(null);
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null); // null = new
  const [form, setForm]               = useState<Product>(emptyProduct());
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const json = await fetch("/api/products").then(r => r.json());
    setProducts(json.products ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.brand.toLowerCase().includes(q) || p.series.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchType = typeFilter === "All" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const openAdd = () => {
    setForm(emptyProduct());
    setEditingId(null);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setForm({ ...p, features: [...p.features], variants: p.variants.map(v => ({ ...v })) });
    setEditingId(p.id);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setFormError(""); };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete product "${id}"? This cannot be undone.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const json = await res.json();
    setDeleting(null);
    if (json.error) { showToast(json.error, false); return; }
    showToast("Product deleted.");
    fetchProducts();
  };

  const handleSave = async () => {
    setFormError("");
    if (!form.id.trim()) { setFormError("Product ID is required."); return; }
    if (!form.brand.trim()) { setFormError("Brand is required."); return; }
    if (!form.type) { setFormError("Type is required."); return; }
    if (form.variants.length === 0) { setFormError("At least one variant is required."); return; }
    if (form.variants.some(v => !v.hp.trim())) { setFormError("All variants need an HP value."); return; }

    setSaving(true);
    const payload = {
      ...form,
      id: form.id.trim().toLowerCase().replace(/\s+/g, "-"),
      badge: form.badge || null,
      features: form.features.filter(f => f.trim()),
    };

    const url  = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PATCH" : "POST";
    const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setSaving(false);

    if (json.error) { setFormError(json.error); return; }
    showToast(editingId ? "Product updated." : "Product created.");
    closeModal();
    fetchProducts();
  };

  // ── Variant helpers ──────────────────────────────────────────────────────
  const setVariant = (i: number, field: keyof Variant, value: string | number) => {
    setForm(f => {
      const variants = f.variants.map((v, idx) => idx === i ? { ...v, [field]: value } : v);
      return { ...f, variants };
    });
  };
  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { hp: "", price: 0, orig: 0, btu: "", sqm: "", tag: "Inverter" as const }] }));
  const removeVariant = (i: number) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  // ── Feature helpers ───────────────────────────────────────────────────────
  const setFeature = (i: number, val: string) => setForm(f => ({ ...f, features: f.features.map((fv, idx) => idx === i ? val : fv) }));
  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i: number) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  // ── Spec helpers ──────────────────────────────────────────────────────────
  const setSpecKey   = (oldKey: string, newKey: string) => setForm(f => {
    const entries = Object.entries(f.specs);
    const idx = entries.findIndex(([k]) => k === oldKey);
    if (idx === -1) return f;
    entries[idx] = [newKey, entries[idx][1]];
    return { ...f, specs: Object.fromEntries(entries) };
  });
  const setSpecVal   = (key: string, val: string) => setForm(f => ({ ...f, specs: { ...f.specs, [key]: val } }));
  const addSpec      = () => setForm(f => ({ ...f, specs: { ...f.specs, "": "" } }));
  const removeSpec   = (key: string) => setForm(f => {
    const { [key]: _, ...rest } = f.specs;
    return { ...f, specs: rest };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <style>{`
        .form-input {
          width: 100%; padding: 9px 12px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #e2e8f0; font-size: 13px; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: border-color .15s;
        }
        .form-input:focus { border-color: rgba(217,119,6,0.5); }
        .form-input::placeholder { color: #475569; }
        .form-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 5px; display: block; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 200, padding: "12px 18px", borderRadius: "12px", background: toast.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${toast.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, color: toast.ok ? "#4ade80" : "#f87171", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          {toast.ok ? <Check size={14} /> : <AlertCircle size={14} />} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="outfit" style={{ fontSize: "24px", fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Products</h1>
          <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{products.length} products · stored in Supabase</p>
        </div>
        <button onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 16px", borderRadius: "10px", border: "none", background: "#d97706", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} color="#475569" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="form-input"
            placeholder="Search brand, series, ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "34px" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex" }}>
              <X size={13} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {FILTER_TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{ padding: "7px 13px", borderRadius: "100px", border: `1px solid ${typeFilter === t ? "rgba(217,119,6,0.5)" : "rgba(255,255,255,0.08)"}`, background: typeFilter === t ? "rgba(217,119,6,0.12)" : "transparent", color: typeFilter === t ? "#fbbf24" : "#64748b", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all .15s", fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: "nowrap" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 120px 100px 1fr 140px 100px", gap: "12px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          {["Product", "Type", "Badge", "Price Range", "Variants", ""].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.2)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#475569", fontSize: "14px" }}>No products found.</p>
        ) : filtered.map(p => {
          const minPrice = Math.min(...p.variants.map(v => v.price));
          const maxPrice = Math.max(...p.variants.map(v => v.price));
          const badge = BADGE_COLORS[p.badge ?? ""];
          return (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "220px 120px 100px 1fr 140px 100px", gap: "12px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#cbd5e1" }}>{p.brand} {p.series}</p>
                <p style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>{p.id}</p>
              </div>
              <span style={{ fontSize: "11px", color: "#64748b", background: "rgba(255,255,255,0.04)", padding: "3px 9px", borderRadius: "6px", width: "fit-content" }}>{p.type}</span>
              {p.badge ? (
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "6px", background: badge?.bg ?? "#d97706", color: badge?.color ?? "#fff", width: "fit-content" }}>{p.badge}</span>
              ) : <span style={{ color: "#334155", fontSize: "11px" }}>—</span>}
              <div>
                <p className="outfit" style={{ fontSize: "13px", fontWeight: 800, color: "#f1f5f9" }}>
                  {minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} – ${fmt(maxPrice)}`}
                </p>
                <p style={{ fontSize: "10px", color: "#475569", marginTop: "1px" }}>{p.variants.length} variant{p.variants.length !== 1 ? "s" : ""}</p>
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {p.variants.map(v => (
                  <span key={v.hp} style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "5px", background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>{v.hp}</span>
                ))}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <Link href={`/shop/${p.id}`} target="_blank" style={{ display: "flex", alignItems: "center", padding: "6px", borderRadius: "7px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", textDecoration: "none", transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#94a3b8"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#475569"; }}
                >
                  <ExternalLink size={12} />
                </Link>
                <button onClick={() => openEdit(p)} style={{ display: "flex", alignItems: "center", padding: "6px", borderRadius: "7px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", cursor: "pointer", transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(217,119,6,0.4)"; e.currentTarget.style.color = "#fbbf24"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#475569"; }}
                >
                  <Edit2 size={12} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ display: "flex", alignItems: "center", padding: "6px", borderRadius: "7px", border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", cursor: "pointer", transition: "all .15s", opacity: deleting === p.id ? 0.5 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#475569"; }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <>
          <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "min(720px, calc(100vw - 32px))", maxHeight: "calc(100vh - 48px)", overflowY: "auto", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", zIndex: 101, padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 className="outfit" style={{ fontSize: "18px", fontWeight: 900, color: "#f1f5f9" }}>{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Basic info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="form-label">Product ID *</label>
                  <input className="form-input" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} placeholder="e.g. aux-q-series" disabled={!!editingId} style={{ opacity: editingId ? 0.5 : 1 }} />
                  {!editingId && <p style={{ fontSize: "10px", color: "#475569", marginTop: "4px" }}>Slug used in URLs. Cannot change after creation.</p>}
                </div>
                <div>
                  <label className="form-label">Brand *</label>
                  <input className="form-input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. AUX" />
                </div>
                <div>
                  <label className="form-label">Series</label>
                  <input className="form-input" value={form.series} onChange={e => setForm(f => ({ ...f, series: e.target.value }))} placeholder="e.g. Q-Series" />
                </div>
                <div>
                  <label className="form-label">Type *</label>
                  <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Product["type"] }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Badge</label>
                  <select className="form-input" value={form.badge ?? ""} onChange={e => setForm(f => ({ ...f, badge: e.target.value || null }))}>
                    {BADGES.map(b => <option key={b} value={b}>{b || "(none)"}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label className="form-label">Rating</label>
                    <input className="form-input" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className="form-label">Reviews</label>
                    <input className="form-input" type="number" min="0" value={form.reviews} onChange={e => setForm(f => ({ ...f, reviews: parseInt(e.target.value) || 0 }))} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description…" style={{ resize: "vertical" }} />
              </div>

              {/* Variants */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Variants *</label>
                  <button onClick={addVariant} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.08)", color: "#fbbf24", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Plus size={11} /> Add
                  </button>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 100px 100px 80px 80px 80px 28px", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    <input className="form-input" value={v.hp} onChange={e => setVariant(i, "hp", e.target.value)} placeholder="1.5HP" style={{ padding: "7px 10px" }} />
                    <input className="form-input" type="number" value={v.price} onChange={e => setVariant(i, "price", parseInt(e.target.value) || 0)} placeholder="Price" style={{ padding: "7px 10px" }} />
                    <input className="form-input" type="number" value={v.orig} onChange={e => setVariant(i, "orig", parseInt(e.target.value) || 0)} placeholder="Orig" style={{ padding: "7px 10px" }} />
                    <input className="form-input" value={v.btu} onChange={e => setVariant(i, "btu", e.target.value)} placeholder="12K BTU" style={{ padding: "7px 10px" }} />
                    <input className="form-input" value={v.sqm} onChange={e => setVariant(i, "sqm", e.target.value)} placeholder="~22m²" style={{ padding: "7px 10px" }} />
                    <select className="form-input" value={v.tag} onChange={e => setVariant(i, "tag", e.target.value as "Inverter" | "Standard")} style={{ padding: "7px 8px" }}>
                      <option value="Inverter">Inverter</option>
                      <option value="Standard">Standard</option>
                    </select>
                    <button onClick={() => removeVariant(i)} disabled={form.variants.length === 1} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.2)", background: "none", color: "#ef4444", cursor: "pointer", opacity: form.variants.length === 1 ? 0.3 : 1 }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "80px 100px 100px 80px 80px 80px 28px", gap: "8px" }}>
                  {["HP", "Price ₱", "Orig ₱", "BTU", "sqm", "Tag", ""].map(h => (
                    <span key={h} style={{ fontSize: "9px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Features</label>
                  <button onClick={addFeature} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.08)", color: "#fbbf24", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Plus size={11} /> Add
                  </button>
                </div>
                {form.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    <input className="form-input" value={f} onChange={e => setFeature(i, e.target.value)} placeholder="Feature description…" />
                    <button onClick={() => removeFeature(i)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", flexShrink: 0, borderRadius: "6px", border: "1px solid rgba(239,68,68,0.2)", background: "none", color: "#ef4444", cursor: "pointer" }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Specs */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Specs</label>
                  <button onClick={addSpec} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "7px", border: "1px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.08)", color: "#fbbf24", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <Plus size={11} /> Add
                  </button>
                </div>
                {Object.entries(form.specs).map(([key, val]) => (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 34px", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                    <input className="form-input" value={key} onChange={e => setSpecKey(key, e.target.value)} placeholder="Key" />
                    <input className="form-input" value={val} onChange={e => setSpecVal(key, e.target.value)} placeholder="Value" />
                    <button onClick={() => removeSpec(key)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "6px", border: "1px solid rgba(239,68,68,0.2)", background: "none", color: "#ef4444", cursor: "pointer" }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Error */}
              {formError && (
                <div style={{ padding: "12px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", display: "flex", gap: "8px", alignItems: "center" }}>
                  <AlertCircle size={14} color="#f87171" />
                  <p style={{ color: "#f87171", fontSize: "13px" }}>{formError}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", paddingTop: "4px" }}>
                <button onClick={closeModal} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 20px", borderRadius: "10px", border: "none", background: saving ? "rgba(217,119,6,0.5)" : "#d97706", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {saving ? "Saving…" : <><Save size={13} /> {editingId ? "Update" : "Create"}</>}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
