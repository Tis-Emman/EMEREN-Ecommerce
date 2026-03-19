export type Variant = {
  hp: string;
  price: number;
  orig: number;
  btu: string;
  sqm: string;
  tag: "Inverter" | "Standard";
};

export type Product = {
  id: string;           // slug e.g. "aux-q-series"
  brand: string;
  series: string;       // e.g. "Q-Series"
  type: "Split-Type" | "Cassette" | "Portable" | "Multi-Split" | "VRF/Ducted" | "Floor-Mounted";
  badge: string | null;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  specs: Record<string, string>;
  variants: Variant[];
};

// Products are now stored in Supabase. Use GET /api/products to fetch them.

export const BRANDS = ["All Brands", "AUX", "Daikin", "Samsung", "TCL", "American Home", "Carrier", "Midea"];

export const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: "#d97706", color: "#fff" },
  "Featured":    { bg: "#d97706", color: "#fff" },
  "New":         { bg: "#3b82f6", color: "#fff" },
  "Commercial":  { bg: "#0ea5e9", color: "#fff" },
  "Premium":     { bg: "#8b5cf6", color: "#fff" },
  "Sale":        { bg: "#ef4444", color: "#fff" },
  "Popular":     { bg: "#16a34a", color: "#fff" },
  "Enterprise":  { bg: "#6d28d9", color: "#fff" },
};
