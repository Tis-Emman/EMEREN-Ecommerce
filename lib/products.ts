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

export const ALL_PRODUCTS: Product[] = [
  // ── AUX ─────────────────────────────────────────────
  {
    id: "aux-q-series",
    brand: "AUX",
    series: "Q-Series",
    type: "Split-Type",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 263,
    description: "The AUX Q-Series inverter wall-split is engineered for Philippine homes — ultra-quiet, energy-saving, and built to handle the heat. Available in 1.0, 1.5, and 2.0HP.",
    features: [
      "Inverter compressor — up to 60% energy savings",
      "Auto-cleaning filter",
      "Wi-Fi ready (optional module)",
      "4-way airflow direction",
      "Sleep mode & 24-hr timer",
      "Turbo cool function",
      "R-32 eco-friendly refrigerant",
    ],
    specs: {
      "Type": "Wall-Mounted Split-Type",
      "Technology": "DC Inverter",
      "Refrigerant": "R-32",
      "Voltage": "220V / 60Hz",
      "Warranty": "5 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "1.0HP", price: 21000, orig: 25000, btu: "9K BTU",  sqm: "~16m²", tag: "Inverter" },
      { hp: "1.5HP", price: 25000, orig: 30000, btu: "12K BTU", sqm: "~22m²", tag: "Inverter" },
      { hp: "2.0HP", price: 30000, orig: 35000, btu: "18K BTU", sqm: "~30m²", tag: "Inverter" },
    ],
  },

  // ── Daikin ──────────────────────────────────────────
  {
    id: "daikin-d-series",
    brand: "Daikin",
    series: "D-Series",
    type: "Split-Type",
    badge: "Featured",
    rating: 4.9,
    reviews: 312,
    description: "Daikin D-Series — Japan's most trusted AC brand in the Philippines. Premium inverter technology with superior humidity control and class-leading quiet operation.",
    features: [
      "Daikin inverter compressor",
      "Coanda airflow for even distribution",
      "PM2.5 filter with streamer discharge",
      "Self-cleaning indoor unit",
      "Powerful mode (rapid cooling)",
      "Dry mode (dehumidification)",
      "R-32 eco-friendly refrigerant",
    ],
    specs: {
      "Type": "Wall-Mounted Split-Type",
      "Technology": "DC Inverter",
      "Refrigerant": "R-32",
      "Voltage": "220V / 60Hz",
      "Warranty": "5 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "1.0HP", price: 32000, orig: 37000, btu: "9K BTU",  sqm: "~16m²", tag: "Inverter" },
      { hp: "1.5HP", price: 39000, orig: 45000, btu: "12K BTU", sqm: "~22m²", tag: "Inverter" },
      { hp: "2.0HP", price: 48000, orig: 55000, btu: "18K BTU", sqm: "~30m²", tag: "Inverter" },
      { hp: "2.5HP", price: 62000, orig: 70000, btu: "24K BTU", sqm: "~40m²", tag: "Inverter" },
    ],
  },

  // ── Samsung ─────────────────────────────────────────
  {
    id: "samsung",
    brand: "Samsung",
    series: "",
    type: "Split-Type",
    badge: "New",
    rating: 4.8,
    reviews: 189,
    description: "Samsung™ disperses cool air through 23,000 micro air holes — eliminating the cold draft feeling while maintaining your ideal temperature silently.",
    features: [
      "Wind-Free™ Cooling (no cold drafts)",
      "SmartThings Wi-Fi control",
      "Auto Clean — prevents mold build-up",
      "AI Auto Cooling — learns your schedule",
      "Fast Cooling mode",
      "Good Sleep mode",
      "R-32 eco-friendly refrigerant",
    ],
    specs: {
      "Type": "Wall-Mounted Split-Type",
      "Technology": "Digital Inverter",
      "Refrigerant": "R-32",
      "Voltage": "220V / 60Hz",
      "Warranty": "5 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "1.0HP", price: 29000, orig: 34000, btu: "9K BTU",  sqm: "~16m²", tag: "Inverter" },
      { hp: "1.5HP", price: 36000, orig: 42000, btu: "12K BTU", sqm: "~22m²", tag: "Inverter" },
      { hp: "2.0HP", price: 44000, orig: 51000, btu: "18K BTU", sqm: "~30m²", tag: "Inverter" },
    ],
  },

  // ── TCL ─────────────────────────────────────────────
  {
    id: "tcl-elite",
    brand: "TCL",
    series: "Elite",
    type: "Split-Type",
    badge: "Sale",
    rating: 4.6,
    reviews: 421,
    description: "TCL Elite offers solid inverter performance at a price that won't break the bank. A top pick for first-time AC buyers who want reliable cooling without compromise.",
    features: [
      "Turbo Inverter Cooling",
      "TCL Home Wi-Fi app control",
      "Self-cleaning function",
      "Anti-corrosion gold fin",
      "Sleep mode & 24-hr timer",
      "Auto restart after power cut",
      "R-32 eco-friendly refrigerant",
    ],
    specs: {
      "Type": "Wall-Mounted Split-Type",
      "Technology": "Turbo Inverter",
      "Refrigerant": "R-32",
      "Voltage": "220V / 60Hz",
      "Warranty": "3 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "1.0HP", price: 17500, orig: 21000, btu: "9K BTU",  sqm: "~16m²", tag: "Inverter" },
      { hp: "1.5HP", price: 21000, orig: 25000, btu: "12K BTU", sqm: "~22m²", tag: "Inverter" },
      { hp: "2.0HP", price: 26000, orig: 31000, btu: "18K BTU", sqm: "~30m²", tag: "Inverter" },
    ],
  },

  // ── American Home ────────────────────────────────────
  {
    id: "american-home-classique",
    brand: "American Home",
    series: "Classique",
    type: "Split-Type",
    badge: "Popular",
    rating: 4.5,
    reviews: 534,
    description: "American Home Classique — the most popular budget split-type in the Philippines. Straightforward cooling, easy maintenance, and wide service network nationwide.",
    features: [
      "Standard rotary compressor",
      "Auto mode, Cool, Fan, Dry",
      "Easy-clean washable filter",
      "Sleep timer",
      "Auto restart",
      "Corrosion-resistant outdoor unit",
      "Wide service network in PH",
    ],
    specs: {
      "Type": "Wall-Mounted Split-Type",
      "Technology": "Standard (Non-Inverter)",
      "Refrigerant": "R-22",
      "Voltage": "220V / 60Hz",
      "Warranty": "2 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "1.0HP",  price: 15000, orig: 18000, btu: "9K BTU",  sqm: "~16m²", tag: "Standard" },
      { hp: "1.5HP",  price: 19000, orig: 23000, btu: "12K BTU", sqm: "~22m²", tag: "Standard" },
      { hp: "2.0HP",  price: 24000, orig: 28000, btu: "18K BTU", sqm: "~30m²", tag: "Standard" },
    ],
  },

  {
    id: "carrier",
    brand: "Carrier",
    series: "",
    type: "Split-Type",
    badge: "Popular",
    rating: 4.5,
    reviews: 534,
    description: "Carrier split-type air conditioners — a trusted choice in the Philippines for reliable cooling. Known for durable performance, energy efficiency, and a strong nationwide service network.",
    features: [
      "Standard rotary compressor",
      "Auto mode, Cool, Fan, Dry",
      "Easy-clean washable filter",
      "Sleep timer",
      "Auto restart",
      "Corrosion-resistant outdoor unit",
      "Wide service network in PH",
    ],
    specs: {
      "Type": "Wall-Mounted Split-Type",
      "Technology": "Standard (Non-Inverter)",
      "Refrigerant": "R-22",
      "Voltage": "220V / 60Hz",
      "Warranty": "2 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "1.0HP",  price: 15000, orig: 18000, btu: "9K BTU",  sqm: "~16m²", tag: "Standard" },
      { hp: "1.5HP",  price: 19000, orig: 23000, btu: "12K BTU", sqm: "~22m²", tag: "Standard" },
      { hp: "2.0HP",  price: 24000, orig: 28000, btu: "18K BTU", sqm: "~30m²", tag: "Standard" },
    ],
  },

  // ── AUX Cassette ────────────────────────────────────
  {
    id: "aux-cassette",
    brand: "AUX",
    series: "Cassette",
    type: "Cassette",
    badge: "Commercial",
    rating: 4.8,
    reviews: 90,
    description: "AUX Cassette units deliver 360° ceiling-mounted airflow for offices, restaurants, and commercial spaces. Flush-mount design keeps the aesthetic clean and professional.",
    features: [
      "360° airflow from ceiling",
      "Flush ceiling-mount — minimal visual footprint",
      "Auto-swing louvers (4-way)",
      "Built-in drain pump",
      "Inverter compressor",
      "BMS compatible",
    ],
    specs: {
      "Type": "Ceiling Cassette",
      "Technology": "DC Inverter",
      "Refrigerant": "R-410A",
      "Voltage": "220V / 60Hz",
      "Warranty": "3 yrs compressor, 1 yr parts",
    },
    variants: [
      { hp: "2.5HP", price: 72000, orig: 80000,  btu: "24K BTU", sqm: "~45m²", tag: "Inverter" },
      { hp: "4.0HP", price: 110000, orig: 125000, btu: "36K BTU", sqm: "~70m²", tag: "Inverter" },
    ],
  },

  // ── AUX Floor mounted ────────────────────────────────────
  {
    id: "aux-floor-mounted",
    brand: "AUX",
    series: "Floor Mounted",
    type: "Floor-Mounted",
    badge: null,
    rating: 4.4,
    reviews: 298,
    description: "No installation, no hassle. The AUX Floor Mounted rolls anywhere you need cooling — great for renters, condos, and room-to-room flexibility.",
    features: [
      "Zero installation required",
      "Self-evaporating (no draining needed)",
      "3 fan speeds",
      "24-hour timer",
      "Auto-restart after power cut",
      "Dual caster wheels",
    ],
    specs: {
      "Type": "Portable (Freestanding)",
      "Technology": "Standard",
      "Refrigerant": "R-410A",
      "Voltage": "220V / 60Hz",
      "Warranty": "1 yr parts & labor",
    },
    variants: [
      { hp: "1.0HP", price: 18500, orig: 22000, btu: "9K BTU",  sqm: "~14m²", tag: "Standard" },
      { hp: "1.5HP", price: 24000, orig: 28000, btu: "12K BTU", sqm: "~20m²", tag: "Standard" },
    ],
  },

  // ── Daikin VRF ──────────────────────────────────────
  {
    id: "midea",
    brand: "Midea",
    series: "",
    type: "Split-Type",
    badge: "Premium",
    rating: 5.0,
    reviews: 38,
    description: "Midea VRF systems are a leading solution for large-scale commercial climate control. Multi-zone capable, energy-efficient, and BMS-ready for seamless building integration and centralized management.",
    features: [
      "Multi-zone (up to 13 indoor units)",
      "Heat recovery option",
      "Centralized controller (BACnet/Modbus)",
      "Variable refrigerant volume",
      "High ambient operation up to 52°C",
      "Remote fault diagnostics",
    ],
    specs: {
      "Type": "VRF / Multi-Zone",
      "Technology": "Variable Refrigerant Volume",
      "Refrigerant": "R-410A",
      "Voltage": "380V / 3-phase / 60Hz",
      "Warranty": "5 yrs compressor, 2 yrs parts",
    },
    variants: [
      { hp: "1HP",  price: 185000, orig: 210000, btu: "72K BTU",  sqm: "~120m²", tag: "Inverter" },
      { hp: "1.5HP", price: 235000, orig: 265000, btu: "90K BTU",  sqm: "~160m²", tag: "Inverter" },
      { hp: "2HP", price: 280000, orig: 320000, btu: "108K BTU", sqm: "~200m²", tag: "Inverter" },
    ],
  },
];

export const BRANDS = ["All Brands", "AUX", "Daikin", "Samsung", "TCL", "American Home"];

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