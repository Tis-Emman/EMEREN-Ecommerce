export type ServiceVariant = {
  label: string;
  sublabel?: string;
  price: number;
};

export type Service = {
  id: string;
  name: string;
  shortName: string;
  type: "Cleaning" | "Repair" | "Recharge" | "Relocation" | "Dismantle";
  icon: "window" | "split" | "fridge" | "tools" | "recharge" | "move" | "dismantle";
  badge: string | null;
  description: string;
  includes: string[];
  duration: string;
  location: "on-site" | "in-store" | "both";
  // Cleaning services have fixed priced variants
  variants?: ServiceVariant[];
  // All other services list the unit types they cover
  unitTypes?: string[];
};

export const SERVICES: Service[] = [
  {
    id: "window-ac-cleaning",
    name: "Window Type AC Cleaning",
    shortName: "Window AC",
    type: "Cleaning",
    icon: "window",
    badge: "Most Affordable",
    location: "on-site",
    description:
      "Full deep-clean service for window-type air conditioners. We disassemble, wash the filters and evaporator coil, clean the blower and chassis, then reassemble and test — all at your location.",
    includes: [
      "Filter removal & deep wash",
      "Evaporator coil cleaning",
      "Blower wheel cleaning",
      "Drain pan flush",
      "Chassis wipe-down",
      "Performance test after service",
    ],
    duration: "45 – 60 mins",
    variants: [
      { label: "Non-Inverter", sublabel: "Standard window unit", price: 500 },
      { label: "Inverter",     sublabel: "Inverter window unit", price: 600 },
    ],
  },
  {
    id: "split-ac-cleaning",
    name: "Split Type AC Cleaning",
    shortName: "Split Type",
    type: "Cleaning",
    icon: "split",
    badge: "Most Popular",
    location: "on-site",
    description:
      "Comprehensive cleaning service for wall-mounted split-type aircons. We use high-pressure washing on the indoor unit, clean the outdoor condenser coil, and ensure peak cooling efficiency.",
    includes: [
      "Indoor unit high-pressure wash",
      "Evaporator coil deep clean",
      "Blower & fan cleaning",
      "Drain line flush",
      "Outdoor condenser coil rinse",
      "Full system test & check",
    ],
    duration: "60 – 90 mins",
    variants: [
      { label: "1.0HP – 2.0HP", sublabel: "Standard size units", price: 1000 },
      { label: "2.5HP – 3.0HP", sublabel: "Larger / commercial units", price: 1200 },
    ],
  },
  {
    id: "refrigeration-repair",
    name: "Refrigeration Repair",
    shortName: "Ref & Freezer",
    type: "Repair",
    icon: "fridge",
    badge: "Free Diagnosis",
    location: "both",
    description:
      "We diagnose and repair refrigerators and freezers of all common types. Bring it to our shop in Baliuag or we can come to you — we assess the unit first at no charge, then give you a clear quote before any repair work begins.",
    includes: [
      "Free diagnosis & inspection",
      "Transparent quote before repair",
      "Compressor & refrigerant check",
      "Thermostat & electrical diagnosis",
      "Door seal & gasket inspection",
      "Post-repair cooling performance test",
    ],
    duration: "Diagnosis: 30 – 60 mins",
    unitTypes: [
      "Single Door Ref",
      "Two-Door Ref",
      "Chest Freezer",
      "Upright Freezer",
    ],
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    shortName: "AC Repair",
    type: "Repair",
    icon: "tools",
    badge: "Free Diagnosis",
    location: "both",
    description:
      "Not cooling properly? Strange noises or leaking water? We diagnose your aircon at no charge, identify the root cause, and give you a clear quote before any repair work starts.",
    includes: [
      "Free diagnosis & inspection",
      "Transparent quote before repair",
      "Electrical & control board check",
      "Compressor & fan motor inspection",
      "Refrigerant leak detection",
      "Post-repair cooling performance test",
    ],
    duration: "Diagnosis: 30 – 60 mins",
    unitTypes: ["Window Type", "Split Type"],
  },
  {
    id: "ac-recharge",
    name: "AC Recharge",
    shortName: "Recharge",
    type: "Recharge",
    icon: "recharge",
    badge: "Free Diagnosis",
    location: "both",
    description:
      "If your aircon is running but not cooling well, it may need a refrigerant recharge. We check for leaks first and provide a quote before any gas is added — no surprises.",
    includes: [
      "Free refrigerant level check",
      "Leak detection before recharging",
      "Refrigerant top-up (R-22 or R-32/R-410A)",
      "Pressure test after recharge",
      "Cooling efficiency check",
      "Transparent quote before service",
    ],
    duration: "45 – 90 mins",
    unitTypes: ["Window Type", "Split Type"],
  },
  {
    id: "ac-relocation",
    name: "AC Relocation",
    shortName: "Relocation",
    type: "Relocation",
    icon: "move",
    badge: null,
    location: "on-site",
    description:
      "Moving to a new room or home? We safely dismantle, transport, and reinstall your aircon at its new location — including all piping, electrical work, and a full performance test.",
    includes: [
      "Safe dismantling at old location",
      "Transport to new location",
      "Full reinstallation & mounting",
      "New piping & drain line as needed",
      "Electrical connection & testing",
      "Post-install cooling performance check",
    ],
    duration: "2 – 4 hours (varies by distance)",
    unitTypes: ["Window Type", "Split Type"],
  },
  {
    id: "ac-dismantle",
    name: "AC Dismantle",
    shortName: "Dismantle",
    type: "Dismantle",
    icon: "dismantle",
    badge: null,
    location: "on-site",
    description:
      "Need your aircon removed and not reinstalled? We carefully dismantle and recover the unit — ideal for unit replacement, renovation, or even when you're moving out.",
    includes: [
      "Safe removal of indoor unit",
      "Safe removal of outdoor unit",
      "Refrigerant recovery before removal",
      "Piping & bracket removal",
      "Site left clean after dismantling",
      "Quote provided before any work",
    ],
    duration: "1 – 2 hours",
    unitTypes: ["Window Type", "Split Type"],
  },
];