"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Triangle,
  ArrowRight,
  ShoppingCart,
  User,
  Package,
  Shield,
  MapPin,
  Bell,
  LogOut,
  ChevronRight,
  Edit3,
  Check,
  X,
  Star,
  Truck,
  Wrench,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Menu,
  Home,
  Plus,
} from "lucide-react";

const TABS = [
  { id: "overview",      label: "Overview",      icon: <User size={15} /> },
  { id: "orders",        label: "Orders",         icon: <Package size={15} /> },
  { id: "warranties",    label: "Warranties",     icon: <Shield size={15} /> },
  { id: "addresses",     label: "Addresses",      icon: <MapPin size={15} /> },
  { id: "notifications", label: "Notifications",  icon: <Bell size={15} /> },
  { id: "security",      label: "Security",       icon: <Lock size={15} /> },
];

// Mock data — replace with real Supabase queries when orders/warranties tables exist
const ORDERS = [
  { id: "ORD-2025-001", date: "March 5, 2025",  items: ["FrostLine Pro 1.5HP"], total: 35000, status: "Delivered", statusColor: "#22c55e" },
  { id: "ORD-2025-002", date: "Feb 18, 2025",   items: ["PolarMax Cassette 2.5HP", "ArcticBreeze Portable 1.0HP"], total: 90500, status: "Installed", statusColor: "#3b82f6" },
  { id: "ORD-2024-089", date: "Dec 12, 2024",   items: ["FrostLine Pro 1.0HP"], total: 28500, status: "Delivered", statusColor: "#22c55e" },
  { id: "ORD-2024-071", date: "Nov 3, 2024",    items: ["ArcticBreeze Split 1.0HP"], total: 22000, status: "Delivered", statusColor: "#22c55e" },
];

const WARRANTIES = [
  { id: 1, product: "FrostLine Pro 1.5HP",        purchased: "March 5, 2025", expires: "March 5, 2027",  status: "Active", daysLeft: 726 },
  { id: 2, product: "PolarMax Cassette 2.5HP",    purchased: "Feb 18, 2025",  expires: "Feb 18, 2027",   status: "Active", daysLeft: 709 },
  { id: 3, product: "FrostLine Pro 1.0HP",        purchased: "Dec 12, 2024",  expires: "Dec 12, 2026",   status: "Active", daysLeft: 641 },
  { id: 4, product: "ArcticBreeze Split 1.0HP",   purchased: "Nov 3, 2024",   expires: "Nov 3, 2026",    status: "Active", daysLeft: 602 },
];

// ── PH Address Data (Pampanga & Bulacan only) ────────────────────────────────
const ADDRESS_DATA: Record<string, Record<string, string[]>> = {
  Pampanga: {
    "Angeles City": ["Agapito del Rosario","Amsic","Anunas","Balibago","Capaya","Claro M. Recto","Cuayan","Cutcut","Cutud","Lourdes North West","Lourdes Sur","Lourdes Sur East","Malabanias","Margot","Mining","Pampang","Pandan","Pulung Cacutud","Pulung Maragul","Pulung Santol","Salapungan","Sampaloc","San Jose","San Nicolas","Santa Teresita","Santa Trinidad","Santo Cristo","Santo Domingo","Santo Rosario","Sapalibutad","Sapangbato","Tabun","Virgen Delos Remedios"],
    "City of San Fernando": ["Alasas","Alusiis","Baliti","Bulaon","Calulut","Campo 6","Del Carmen","Del Pilar","Del Rosario","Dela Paz Norte","Dela Paz Sur","Dolores","Juliana","Lara","Lourdes","Magliman","Maimpis","Malino","Malpitic","Pandaras","Panipuan","Pulung Bulu","Quebiauan","Saguin","San Agustin","San Felipe","San Isidro","San Jose","San Juan","San Nicolas","San Pedro","Santa Lucia","Santa Remedios","Santa Rita","Santo Nino","Santo Rosario","Sindalan","Telabastagan"],
    "Mabalacat City": ["Atlu-Bola","Bical","Bundagul","Cacutud","Calumpang","Camachiles","Dapdap","Dau","Dolores","Duquit","Lakandula","Mabiga","Macapagal","Mamatitang","Mangalit","Marcos Village","Mawaque","Paralayunan","Poblacion","San Francisco","San Joaquin","Santa Ines","Santa Maria","Santo Rosario","Sapang Balen","Sapang Biabas","Tabun"],
    "Apalit": ["Balucuc","Calantipe","Cansinala","Capalangan","Colgante","Paligui","Sampaloc","San Juan","San Vicente","Sucad","Sulipan","Tabuyuc"],
    "Arayat": ["Arenas","Baliti","Batasan","Buensuceso","Candating","Cupang","Gatiawin","Guemasan","La Paz","Lacquios","Mangga-Cacutud","Mapalad","Matamo","Panlinlang","Paralaya","Planas","Poblacion","Pulungmasle","Sulipan","Umpungan","Veinte Reales"],
    "Bacolor": ["Balas","Cabalantian","Cabambangan","Cabetican","Calibutbut","Concepcion","Dolores","Duat","Macabacle","Magliman","Maliwalu","Mesalipit","Parulog","Potrero","San Antonio","San Isidro","San Vicente","Santa Barbara","Santa Ines","Talba","Tinajero"],
    "Candaba": ["Bahay Pare","Bambang","Barit","Buas","Cuayang Bugtong","Dalayap","Dulong Ilog","Gulap","Lanang","Lourdes","Magumbali","Mandasig","Mandili","Mangga","Mapaniqui","Paligui","Paralaya","Pasig","Pescadores","Pulong Gubat","Pulong Palazan","Salapungan","San Agustin","San Ildefonso","San Jose Matulid","San Juan","San Pedro","San Rafael","San Roque","San Vicente","Santa Cruz","Santa Monica","Santa Rita","Santo Cristo","Santo Nino","Tagulod","Talang","Telapayong","Villa Aglipay"],
    "Floridablanca": ["Anon","Apalit","Basa Air Base","Benedicto","Bodega","Cabangcalan","Calantas","Carmencita","Consuelo","Dampe","Del Carmen","Fortuna","Gutad","Mabical","Maligaya","Nabuclod","Pabanlag","Paguiruan","Palmayo","Pandaguirig","Poblacion","San Antonio","San Isidro","San Jose","San Nicolas","San Pedro","San Ramon","San Roque","Santa Cruz","Santa Monica","Santa Rita","Santo Rosario","Solib","Valdez"],
    "Guagua": ["Ascomo","Bancal","Dela Cruz","Gatbus","Imas","Maquiapo","Natividad","Pulungbulu","Quebiauan","San Agustin","San Isidro","San Juan","San Matias","San Miguel","San Nicolas","San Pablo","San Pedro","San Rafael","San Roque","San Vicente","Santa Filomena","Santa Ines","Santa Rita","Santo Cristo","Sibol","Suclayin","Tikyon","Tuburan"],
    "Lubao": ["Bancal Pugad","Bancal Sinubli","Calangain","Concepcion","Del Carmen","San Agustin","San Isidro","San Jose Apunan","San Jose Gumi","San Juan","San Nicolas 1st","San Nicolas 2nd","San Pablo 1st","San Pablo 2nd","San Pedro Palcarangan","San Pedro Saug","San Rafael","San Roque","San Sebastian","Santa Barbara","Santa Cruz","Santa Lucia","Santa Maria","Santa Rita","Santo Tomas"],
    "Macabebe": ["Batiauan","Caduang","Candelaria","Castuli","Consuelo","Dalayap","Mataguiti","San Agustin","San Esteban","San Francisco","San Gabriel","San Isidro","San Jose","San Juan","San Nicolas","San Rafael","San Roque","San Vicente","Santa Cruz","Santa Lutgarda","Santa Maria","Santa Rita","Santo Nino","Santo Tomas","Saplad David","Tacasan","Valdez"],
    "Magalang": ["Abacan","Ayala","Balaug","Bucanan","Camias","Dolores","Escaler","La Paz","Navaling","San Agustin","San Antonio","San Francisco","San Ildefonso","San Isidro","San Jose","San Miguel","San Nicolas 1st","San Nicolas 2nd","San Pablo","San Pedro","San Roque","San Vicente","Santa Cruz","Santa Lucia","Santa Maria","Santo Nino","Santo Rosario","Turu"],
    "Masantol": ["Alauli","Bagang","Balibago","Bebe Anac","Bebe Matua","Bulac","Caingin Batang","Caingin Matua","Cambasi","Malauli","Nigui","Palimpe","Puti","Sagrada Familia","San Agustin Matua","San Agustin Pamintasan","San Isidro","San Nicolas","San Pedro","Santa Cruz","Santa Lucia","Santa Monica","Santo Nino","Sua"],
    "Mexico": ["Acli","Anao","Arayat","Balas","Belen","Brgy. 1 (Pob.)","Brgy. 2 (Pob.)","Brgy. 3 (Pob.)","Brgy. 4 (Pob.)","Brgy. 5 (Pob.)","Brgy. 6 (Pob.)","Brgy. 7 (Pob.)","Brgy. 8 (Pob.)","Camuning","Cawayan","Concepcion","Culiat","De La Paz","Dolores","Eden","Gandus","Lagundi","Laput","Laug","Masamat","Masangsang","Nueva Victoria","Pandacaqui","Pangatlan","Panipuan","Parian","Sabanilla","San Antonio","San Carlos","San Jose","San Juan","San Lorenzo","San Miguel","San Nicolas","San Pablo","San Patricio","San Rafael","San Roque","Santa Cruz","Santa Maria","Santa Rita","Santo Cristo","Santo Rosario","Sapang Maisac","Suclaban","Tangle"],
    "Minalin": ["Bulac","Dawe","Lourdes","San Francisco 1st","San Francisco 2nd","San Isidro","San Nicolas","San Pedro","Santa Catalina","Santa Cruz","Santa Maria","Santo Domingo","Santo Tomas","Saplad"],
    "Porac": ["Babo Pangulo","Babo Sacan","Balubad","Banban","Cangatba","Diaz","Dolores","Jalung","Mancatian","Manibaug Libutad","Manibaug Pasig","Manibaug Paralaya","Mangalit","Mitla Proper","Palat","Pias","Pio","Planas","Poblacion","Pulong Santol","Salu","San Jose Mitla","Santa Cruz","Sapang Uwak","Sepung Calzada","Sinura","Tigig"],
    "San Luis": ["San Agustin","San Carlos","San Isidro","San Jose","San Juan","San Nicolas","San Pablo","San Pedro","San Roque","San Sebastian","Santa Catalina","Santa Cruz","Santa Lucia","Santa Monica","Santa Rita","Santa Rosa","Santo Cristo","Santo Nino","Santo Tomas"],
    "San Simon": ["Concepcion","De La Paz","San Isidro","San Jose","San Juan","San Miguel","San Nicolas","San Pablo","San Pedro","Santa Cruz","Santa Monica","Santo Nino"],
    "Santa Ana": ["Mitla","Pampang","Paralaya","Poblacion","San Agustin","San Carlos","San Isidro","San Juan","San Nicolas","San Pablo","San Pedro","Santa Cruz","Santa Lucia","Santa Rita","Santo Tomas","Saplad","Villa Dolores"],
    "Santa Rita": ["Becuran","Dila-dila","San Agustin","San Basilio","San Isidro","San Jose","San Juan","San Matias","San Vicente","Santa Monica","Santo Cristo"],
    "Santo Tomas": ["Moras de la Paz","Poblacion","San Bartolome","San Matias","San Vicente","Santa Cruz","Santa Lucia","Santa Maria","Santo Rosario"],
    "Sasmuan": ["Batang 1st","Batang 2nd","Malusac","Sabitanan","San Antonio","San Nicolas","San Pedro","Santa Lucia","Santa Monica","Santo Tomas","Sebitanan"],
  },
  Bulacan: {
    "City of Malolos": ["Anilao","Atlag","Babatnin","Bagna","Bagong Bayan","Balayong","Balite","Bangkal","Barihan","Bulihan","Bungahan","Caingin","Calero","Caliligawan","Canalate","Caniogan","Catmon","City Proper","Cofradia","Dakila","Guinhawa","Ligas","Liyang","Longos","Look 1st","Look 2nd","Lugam","Mabolo","Mainit","Malimba","Mambog","Masile","Matimbo","Mojon","Namayan","Niugan","Pamarawan","Panasahan","Pinagbakahan","San Agustin","San Gabriel","San Juan","San Pablo","San Vicente","Santiago","Santo Cristo","Santo Nino","Santo Rosario","Santol","Sumapang Bata","Sumapang Matanda","Taal","Tikay"],
    "City of Meycauayan": ["Bagbaguin","Bahay Pare","Bancal","Banga","Bayugo","Caingin","Calvario","Camalig","Gasak","Hulo","Iba","Langka","Lawa","Libtong","Liputan","Longos","Malhacan","Pajo","Pantoc","Perez","Poblacion","Saluysoy","San Francisco","San Jose","San Roque","Santa Cruz","Santo Cristo","Tugatog","Ubihan","Whangdao"],
    "City of San Jose del Monte": ["Assumption","Bagong Buhay","Bagong Buhay II","Bagong Buhay III","Citrus","Ciudad Real","Dulong Bayan","Fatima","Fatima II","Fatima III","Fatima IV","Fatima V","Francisco Homes-Guijo","Francisco Homes-Mulawin","Francisco Homes-Narra","Francisco Homes-Yakal","Gaya-Gaya","Graceville","Gumaoc Central","Gumaoc East","Gumaoc West","Kaybanban","Kaypian","Langkiwa","Lanzones","Maharlika","Minuyan","Minuyan II","Minuyan III","Minuyan IV","Minuyan V","Mulawin","Paradise III","Poblacion","San Isidro","San Manuel","San Martin","San Martin II","San Martin III","San Martin IV","San Pedro","San Rafael","Santa Cruz","Santa Cruz II","Santa Cruz III","Santa Cruz IV","Santa Cruz V","Santo Cristo","Santo Nino","Santo Nino II","Santo Nino III","Sapang Palay","St. Martin de Porres","Tungkong Mangga"],
    "Angat": ["Banaban","Baybay","Binagbag","Donacion","Encanto","Goldap","Hilltop","Ibayo","Kapalangan","Lawa","Lestonac","Lico","Marungko","Nilig","Paltok","Pulong Yantok","San Roque","Santa Cruz","Santa Lucia","Santiago","Santo Cristo","Sapang Bulak","Taboc","Talacsan","Tibag","Tilapayong","Tumana"],
    "Balagtas": ["Borol 1st","Borol 2nd","Dalig","Longos","Panginay","Pulong Sapat","Santol","Wawa"],
    "Baliuag": ["Bagong Nayon","Balagtas","Balete","Balubad","Bambang","Batia","Burol","Catulinan","Concepcion","Hinukay","Maasim","Mabalas-Balas","Maguinao","Malamig","Manga","Matangtubig","Pagala","Paitan","Piel","Pinagbarilan","Poblacion","Sabang","Sampaga","San Jose","San Roque","Santelmo","Subic","Sulivan","Tangos","Tarcan","Tiaong","Tibag","Tilapayong","Virgen delas Flores"],
    "Bocaue": ["Batia","Binagbag","Bolacan","Bundukan","Bunlo","Caingin","Capitangan","Igulot","Lolomboy","Poblacion","Pulong Yantok","Sulucan","Taal","Tiaong","Wakas","Wawa"],
    "Bulacan": ["Balagtas","Balubad","Bambang","Bitotolino","Calvario","Catmon","Matungao","Maysantol","Perez","Pitpitan","San Francisco","San Isidro","San Jose","San Nicolas","San Pascual","Santa Ana","Santa Ines","Santa Maria","Santo Cristo","Taliptip","Tibig"],
    "Bustos": ["Banga","Bintog","Calantipay","Calapan","Camachile","Cambaog","Catacte","Liciada","Malamig","Malawak","Poblacion","San Jose","Talacsan","Tanawan","Tibaguin"],
    "Calumpit": ["Balungao","Calizon","Corazon","Frances","Gatbuca","Iba East","Iba West","Longos","Meysulao","Meyto","Palimbang","Panducot","Pinalagdan","Poblacion","Pungo","San Jose","San Marcos","San Pedro","San Rafael","Santa Lucia","Santa Maria","Sapang Bayan","Wakas"],
    "Dona Remedios Trinidad": ["Bayabas","Kabayunan","Camachile","Kalawakan","Pulong Sampalok","Ulingao"],
    "Guiguinto": ["Cutcut","Daungan","Genesis","Holy Spirit","Hulong Duhat","Ilang-Ilang","Malis","Panginay","Perez","Poblacion","Pritil","Pulong Sapat","Santa Cruz","Santo Cristo","Tabang","Tiaong","Tibagin","Tuktukan"],
    "Hagonoy": ["Iba","Isla","Mambog","Mercado","Palapat","Panal","Pinalagdan","Poblacion","Sagrada Familia","San Agustin","San Isidro","San Jose","San Juan","San Pablo","San Pedro","San Roque","San Sebastian","Santa Cruz","Santa Elena","Santo Nino","Santo Tomas","Tampok","Tibaguin","Tipo"],
    "Marilao": ["Abangan Norte","Abangan Sur","Bahay Pare","Catmon","Ibayo","Lias","Lico","Nagbalon","Patubig","Poblacion I","Poblacion II","Saog","Tabing Ilog","Wawa"],
    "Norzagaray": ["Bangkal","Bigte","Friendship","Matictic","Minuyan","Partida","Pinagtulayan","Poblacion","San Mateo","Tigbe"],
    "Obando": ["Binuangan","Catanghalan","Hulo","Lawa","Pamarawan","Panghulo","Pariahan","Payanas","Salambao","San Pascual","Tawiran","Wakas"],
    "Pandi": ["Bagbaguin","Baka-Bakahan","Bunsuran I","Bunsuran II","Bunsuran III","Cacarong Bata","Cacarong Matanda","Cupang","Maligue","Mapulang Lupa","Masagana","Masagana II","Matiktik","Manatal","Pansol","Pantubig","Pasong Kalabaw","Pasong Bangkal","Pugad","San Roque","San Vicente","Santa Cruz","Santo Cristo","Santo Nino","Santo Nino II","Siling Bata","Siling Matanda"],
    "Paombong": ["Binakayan","Capitangan","Entablado","Gosok","Iba","Masukol","Mataas na Lupa","Pag-Asa","Poblacion","San Isidro","San Jose","San Roque","Santa Cruz","Santissima Trinidad","Santo Nino","Santo Tomas","Tibig","Wawa"],
    "Plaridel": ["Agnaya","Bagong Silang","Banga I","Banga II","Bintog","Bulihan","Caingin","Corazon","Culianin","Dampol","Dungan","Gatbuca","Guinhawa","Liciada","Llano","Loma","Longos","Lumang Bayan","Parulan","Poblacion","Rueda","San Jose","Santa Ines","Santa Maria","Santo Cristo","Sembrano","Tikay","Tinajero","Tolson","Wawa","Yabut"],
    "Pulilan": ["Balatong A","Balatong B","Cutcot","Dampol 1st","Dampol 2nd A","Dampol 2nd B","Dulong Malabon","Inaon","Longos","Lumbac","Lumbang","Mapaniqui","Parulan","Pepipis","Poblacion","Sacdalan","Sapang Bulak","Silangan","Sipat","Tabang"],
    "San Ildefonso": ["Akle","Alagao","Anyatam","Bagong Bayan","Bakal","Balete","Banga","Baro","Biak-na-Bato","Bigaa","Bunag","Burnay","Buwaya","Cabanon","Camias","Carino","Dita","Engkanto","Floridablanca","Gitna","Gubat","Ilog-Bulo","Imelda","Lambakin","Lias","Lico","Liwanag","Loma","Longos","Lukutan","Lumebia","Macabacle","Mahabang Parang","Maharlika","Maligaya","Malubak","Manatal","Mandile","Manggang-Kahoy","Mapagal","Mapalad","Matictic","Minuyan","Mirasol","Mundang","Muzon","Nagbalon","Niugan","Pabilao","Parulan","Pita","Poblacion","Pulong Bayabas","Pungo","Sacdalan","San Agustin","San Isidro","San Jose","San Juan","San Lucas","San Roque","San Vicente","Santa Cruz","Santa Ines","Santa Lucia","Santa Maria","Santo Cristo","Santo Nino","Santo Tomas","Sapang","Sumaging","Taboc","Talbak","Talacsan","Tanawan","Tibagan","Tibig","Tigbe","Tikling","Tinajero","Wawa"],
    "San Miguel": ["Alagao","Anyatam","Balaong","Balite","Bantog","Bardias","Baritan","Batong Malake","Biak-na-Bato","Biclat","Buga","Bulihan","Buliran 1st","Buliran 2nd","Camias","Candelaria","Canonical","Carino","Casing","Cawayan","Corazon","Dampol","De La Paz","Encanto","Figaro","Guiguinto","Ilang-Ilang","Ilog Bulo","Isip","King Kabayo","Labne","Lagundi","Lagusnilad","Lico","Ligas","Longos","Loy Norte","Loy Sur","Macamot","Maligaya","Mangga","Manzona","Masalisi","Matubog","Maysantol","Mirabel","Muzon","Niugan","Padre Roman","Paliwas","Paltok","Panaban","Pandayan","Paniniuan","Pariahan","Patubig","Pinagbarilan","Poblacion","Pulong Bayabas","Sacdalan","Salangan","San Agustin","San Isidro","San Jose","San Juan","San Pablo","San Pedro","San Roque","Santa Cruz","Santa Ines","Santa Isabel","Santa Maria","Santo Cristo","Santo Nino","Santo Tomas","Sapang Bato","Sapang Buho","Sapang Putik","Sapang Uwak","Sibul","Siclong","Taal","Talacsan","Tandang Sora","Tartaro","Tibag","Tilapayong","Tinajero","Ubihan","Uling","Wawa"],
    "San Rafael": ["Banca-Banca","Caingin","Capihan","Coral na Munti","Dila","Diliman I","Diliman II","Magmarale","Mandile","Marungko","Niugan","Paco","Parulan","Poblacion","Pugad Lawin","Pulong Bayabas","San Isidro","San Jose","Sapang Palay"],
    "Santa Maria": ["Balasing","Buenavista","Bulac","Camangyanan","Catmon","Caysio","Guyong","Lalakhan","Mag-Asawang Sapa","Malamig","Manggahan","Nagbalon","Parada","Pulong Buhangin","Pulong Yantok","Sampaloc","San Gabriel","San Jose Patag","Santa Clara","Santo Cristo","Santo Nino","Silangan","Tumana"],
  },
};

interface SavedAddress {
  id: number;
  label: string;
  street: string;
  province: string;
  municipality: string;
  barangay: string;
  isDefault: boolean;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [scrolled,      setScrolled]      = useState(false);
  const [activeTab,     setActiveTab]     = useState("overview");
  const [editingField,  setEditingField]  = useState<keyof ProfileData | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [saveError,     setSaveError]     = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading,       setLoading]       = useState(true);

  // Password fields
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving,   setPwSaving]   = useState(false);
  const [pwError,    setPwError]    = useState("");
  const [pwSuccess,  setPwSuccess]  = useState(false);

  const [profile,     setProfile]     = useState<ProfileData>({ firstName: "", lastName: "", email: "", phone: "", address: "" });
  const [tempProfile, setTempProfile] = useState<ProfileData>({ ...profile });

  const [notifications, setNotifications] = useState({
    orderUpdates:     true,
    warrantyAlerts:   true,
    promotions:       false,
    newsletter:       true,
    serviceReminders: true,
  });

  // ── Address field inline cascade (Personal Info) ──────────────────────────
  const [addrField, setAddrField] = useState({ province: "", municipality: "", barangay: "" });
  const addrFieldMunicipalities = addrField.province ? Object.keys(ADDRESS_DATA[addrField.province] ?? {}) : [];
  const addrFieldBarangays      = (addrField.province && addrField.municipality)
    ? (ADDRESS_DATA[addrField.province]?.[addrField.municipality] ?? [])
    : [];

  // ── Address state ──────────────────────────────────────────────────────────
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    { id: 1, label: "Home",   street: "123 Rizal St.", province: "Pampanga", municipality: "City of San Fernando", barangay: "San Jose", isDefault: true  },
    { id: 2, label: "Office", street: "45 MacArthur Hwy", province: "Bulacan", municipality: "City of Malolos", barangay: "Catmon", isDefault: false },
  ]);
  const [showAddForm,    setShowAddForm]    = useState(false);
  const [editAddrId,     setEditAddrId]     = useState<number | null>(null);
  const [addrForm, setAddrForm] = useState({ label: "", street: "", province: "", municipality: "", barangay: "" });

  const addrMunicipalities = addrForm.province ? Object.keys(ADDRESS_DATA[addrForm.province] ?? {}) : [];
  const addrBarangays      = (addrForm.province && addrForm.municipality)
    ? (ADDRESS_DATA[addrForm.province]?.[addrForm.municipality] ?? [])
    : [];

  const resetAddrForm = () => setAddrForm({ label: "", street: "", province: "", municipality: "", barangay: "" });

  const openAddAddress = () => { resetAddrForm(); setEditAddrId(null); setShowAddForm(true); };
  const openEditAddress = (addr: SavedAddress) => {
    setAddrForm({ label: addr.label, street: addr.street, province: addr.province, municipality: addr.municipality, barangay: addr.barangay });
    setEditAddrId(addr.id);
    setShowAddForm(true);
  };

  const saveAddress = () => {
    if (!addrForm.label || !addrForm.street || !addrForm.province || !addrForm.municipality || !addrForm.barangay) return;
    if (editAddrId !== null) {
      setSavedAddresses(prev => prev.map(a => a.id === editAddrId ? { ...a, ...addrForm } : a));
    } else {
      const newId = Date.now();
      setSavedAddresses(prev => [...prev, { id: newId, isDefault: prev.length === 0, ...addrForm }]);
    }
    setShowAddForm(false);
    resetAddrForm();
    setEditAddrId(null);
  };

  const deleteAddress = (id: number) => setSavedAddresses(prev => prev.filter(a => a.id !== id));
  const setDefaultAddress = (id: number) => setSavedAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

  const userMenuRef = useRef<HTMLDivElement>(null);

  // ── Load profile from Supabase ──────────────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/auth/signin"); return; }

      const uid   = data.user.id;
      const email = data.user.email ?? "";
      const meta  = data.user.user_metadata ?? {};

      // Try profiles table first, fall back to user_metadata
      type ProfileRow = { full_name: string | null; avatar_url: string | null; phone: string | null; address: string | null };
      const { data: profileRow } = await (supabase
        .from("profiles")
        .select("full_name, avatar_url, phone, address")
        .eq("id", uid)
        .single() as unknown as Promise<{ data: ProfileRow | null; error: unknown }>);

      const fullName: string = profileRow?.full_name ?? meta.full_name ?? meta.name ?? "";
      const [firstName = "", ...rest] = fullName.trim().split(" ");

      setProfile({
        firstName: firstName || email.split("@")[0],
        lastName:  rest.join(" "),
        email,
        phone:   profileRow?.phone   ?? meta.phone   ?? "",
        address: profileRow?.address ?? meta.address ?? "",
      });
      setTempProfile({
        firstName: firstName || email.split("@")[0],
        lastName:  rest.join(" "),
        email,
        phone:   profileRow?.phone   ?? meta.phone   ?? "",
        address: profileRow?.address ?? meta.address ?? "",
      });
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) { setMobileNavOpen(false); setMobileSidebarOpen(false); } };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  // ── Save a single profile field to Supabase ─────────────────────────────────
  const saveField = async (field: keyof ProfileData) => {
    setSaving(true);
    setSaveError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const value: string = tempProfile[field];

      if (field === "email") {
        const { error } = await supabase.auth.updateUser({ email: value });
        if (error) throw error;
      } else if (field === "firstName" || field === "lastName") {
        const newFirst = field === "firstName" ? value : profile.firstName;
        const newLast  = field === "lastName"  ? value : profile.lastName;
        const fullName = `${newFirst} ${newLast}`.trim();

        const { error: authErr } = await supabase.auth.updateUser({ data: { full_name: fullName } });
        if (authErr) throw authErr;

        const { error: dbErr } = await (supabase.from("profiles") as any).update({ full_name: fullName }).eq("id", user.id);
        if (dbErr) throw dbErr;
      } else {
        // phone or address — save to profiles table
        const { error } = await (supabase.from("profiles") as any).update({ [field]: value }).eq("id", user.id);
        if (error) throw error;
      }

      setProfile((prev) => ({ ...prev, [field]: value }));
      setEditingField(null);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = (field: keyof ProfileData) => {
    setTempProfile((prev) => ({ ...prev, [field]: profile[field] }));
    setEditingField(null);
    setSaveError("");
  };

  // ── Update password ─────────────────────────────────────────────────────────
  const handlePasswordUpdate = async () => {
    setPwError(""); setPwSuccess(false);
    if (!passwords.current)           { setPwError("Enter your current password."); return; }
    if (passwords.newPw.length < 8)   { setPwError("New password must be at least 8 characters."); return; }
    if (passwords.newPw !== passwords.confirm) { setPwError("Passwords do not match."); return; }

    setPwSaving(true);
    try {
      const supabase = createClient();
      // Re-authenticate with current password first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Not authenticated");

      const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: passwords.current });
      if (signInErr) throw new Error("Current password is incorrect.");

      const { error: updateErr } = await supabase.auth.updateUser({ password: passwords.newPw });
      if (updateErr) throw updateErr;

      setPasswords({ current: "", newPw: "", confirm: "" });
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (e: unknown) {
      setPwError(e instanceof Error ? e.message : "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid rgba(217,119,6,0.2)", borderTopColor: "#d97706", animation: "spin .8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin   { to { transform: rotate(360deg); } }

        .brand  { font-family: 'Outfit', sans-serif; letter-spacing: -0.02em; }
        .outfit { font-family: 'Outfit', sans-serif; }

        .glass {
          background: rgba(248,247,244,0.9);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }

        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }

        .mobile-nav {
          position:fixed; inset:0;
          background:rgba(248,247,244,0.97);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          z-index:40; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:32px;
        }
        .mobile-nav a {
          font-family:'Outfit',sans-serif; font-size:28px; font-weight:700;
          color:#1a1a2e; text-decoration:none; letter-spacing:-0.5px; transition:color .2s;
        }
        .mobile-nav a:hover { color:#d97706; }
        @media (min-width:768px) { .mobile-menu-btn { display:none !important; } }

        .sidebar-tab {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border-radius: 12px;
          font-size: 13px; font-weight: 600; color: #6b7280;
          cursor: pointer; transition: all .2s;
          text-decoration: none; border: none; background: none;
          width: 100%; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sidebar-tab:hover { background: rgba(0,0,0,0.04); color: #1a1a2e; }
        .sidebar-tab.active { background: rgba(217,119,6,0.1); color: #d97706; }

        .card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px; padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          animation: fadeUp .4s ease both;
        }

        .edit-input {
          flex: 1; padding: 9px 12px; border-radius: 10px;
          border: 1.5px solid #d97706; background: #fff;
          font-size: 14px; color: #1a1a2e; outline: none;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .field-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.06); gap: 12px;
        }
        .field-row:last-child { border-bottom: none; }

        .edit-btn {
          background: none; border: none; cursor: pointer; color: #9ca3af;
          display: flex; align-items: center; padding: 5px; border-radius: 7px;
          transition: color .15s, background .15s; flex-shrink: 0;
        }
        .edit-btn:hover { color: #d97706; background: rgba(217,119,6,0.08); }

        .status-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px;
          font-size: 11px; font-weight: 700;
        }

        .order-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px; border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.07); background: #fafafa; gap: 12px;
          transition: border-color .2s, background .2s; cursor: pointer;
        }
        .order-row:hover { border-color: rgba(217,119,6,.25); background: #fffbf2; }

        .toggle {
          width: 42px; height: 24px; border-radius: 100px;
          border: none; cursor: pointer; transition: background .2s;
          position: relative; flex-shrink: 0;
        }
        .toggle::after {
          content: ''; position: absolute; top: 3px;
          width: 18px; height: 18px; border-radius: 50%; background: #fff;
          transition: left .2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .toggle.on { background: #d97706; }
        .toggle.on::after { left: 21px; }
        .toggle.off { background: #d1d5db; }
        .toggle.off::after { left: 3px; }

        .warranty-bar-bg {
          height: 6px; border-radius: 3px;
          background: rgba(0,0,0,0.07); overflow: hidden; margin-top: 8px;
        }
        .warranty-bar-fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, #d97706, #fbbf24); transition: width .8s ease;
        }

        .save-btn {
          padding: 7px 14px; border-radius: 8px;
          background: #d97706; color: #fff; border: none;
          font-size: 12px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; gap: 4px;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: background .15s;
        }
        .save-btn:hover { background: #b45309; }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cancel-btn {
          padding: 7px 10px; border-radius: 8px;
          background: transparent; color: #9ca3af;
          border: 1.5px solid rgba(0,0,0,0.1);
          font-size: 12px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all .15s;
        }
        .cancel-btn:hover { border-color: rgba(0,0,0,0.2); color: #374151; }

        /* Mobile tab strip */
        .mobile-tab-strip {
          display: none;
          overflow-x: auto; gap: 8px; padding: 0 0 4px;
          scrollbar-width: none;
        }
        .mobile-tab-strip::-webkit-scrollbar { display: none; }
        .mobile-tab-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 100px; white-space: nowrap;
          font-size: 12px; font-weight: 600; cursor: pointer;
          border: 1.5px solid rgba(0,0,0,0.1); background: #fff; color: #6b7280;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all .2s;
          flex-shrink: 0;
        }
        .mobile-tab-pill.active { background: #d97706; border-color: #d97706; color: #fff; }

        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-tab-strip { display: flex !important; }
          .profile-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .field-row { flex-wrap: wrap; }
          .field-label-col { min-width: unset !important; width: 100% !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .3s" }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "68px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800, whiteSpace: "nowrap" }}>EMEREN</span>
            </Link>

            {/* Nav — desktop */}
            <nav style={{ display: "flex", alignItems: "center", gap: "28px", justifyContent: "center" }} className="hidden md:flex">
              {([["Shop","/shop"],["Services","/services"],["Contact","/contact"],["About Us","/about"]] as [string,string][]).map(([label,href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            {/* Auth */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
              <Link href="/cart" style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.4)"; e.currentTarget.style.background = "#fffbf2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.background = "#fff"; }}
              >
                <ShoppingCart size={17} color="#374151" />
              </Link>
              {/* Profile avatar — active */}
              <Link href="/profile" style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 3px 10px rgba(217,119,6,0.3)", border: "2px solid #d97706", textDecoration: "none" }}>
                {profile.firstName ? profile.firstName[0].toUpperCase() : <User size={16} color="#fff" />}
              </Link>
              {/* Mobile hamburger */}
              <button className="mobile-menu-btn" onClick={() => setMobileNavOpen((v) => !v)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer", marginLeft: "4px" }}
                aria-label="Toggle menu">
                {mobileNavOpen ? <X size={18} color="#1a1a2e" /> : <Menu size={18} color="#1a1a2e" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Overlay ── */}
      {mobileNavOpen && (
        <div className="mobile-nav">
          <button onClick={() => setMobileNavOpen(false)} style={{ position: "absolute", top: "20px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", cursor: "pointer" }}>
            <X size={18} color="#1a1a2e" />
          </button>
          <Link href="/shop"     onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>Shop</Link>
          <Link href="/services" onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>Services</Link>
          <Link href="/contact"  onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>Contact</Link>
          <Link href="/about"    onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "'Outfit',sans-serif", fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textDecoration: "none", letterSpacing: "-0.5px" }}>About Us</Link>
          <button onClick={() => { handleSignOut(); setMobileNavOpen(false); }} style={{ padding: "11px 24px", fontSize: "14px", fontWeight: 600, border: "1.5px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "12px", background: "transparent", cursor: "pointer" }}>Sign Out</button>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="profile-grid" style={{ maxWidth: "1280px", margin: "0 auto", padding: "96px 24px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: "24px", alignItems: "start" }}>

        {/* ── Desktop Sidebar ── */}
        <div className="desktop-sidebar" style={{ position: "sticky", top: "88px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Profile card */}
          <div className="card" style={{ textAlign: "center", marginBottom: "8px", padding: "20px" }}>
            <div style={{ position: "relative", display: "inline-block", marginBottom: "12px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 auto", boxShadow: "0 4px 14px rgba(217,119,6,0.3)", fontFamily: "'Outfit',sans-serif" }}>
                {profile.firstName ? profile.firstName[0].toUpperCase() : "?"}
              </div>
              <label htmlFor="avatar-upload" style={{ position: "absolute", bottom: 0, right: 0, width: "22px", height: "22px", borderRadius: "50%", background: "#d97706", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={10} color="#fff" />
                <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  // TODO: upload to Supabase storage and update avatar_url in profiles
                  console.log("Avatar upload:", file.name);
                }} />
              </label>
            </div>
            <p className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a2e", marginBottom: "2px" }}>{displayName}</p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{profile.email}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "8px", padding: "3px 10px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}>
              <Star size={10} color="#d97706" fill="#d97706" />
              <span style={{ fontSize: "11px", color: "#d97706", fontWeight: 700 }}>Member</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="card" style={{ padding: "8px" }}>
            {TABS.map((tab) => (
              <button key={tab.id} className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          {/* Sign out */}
          <button className="sidebar-tab" style={{ marginTop: "4px", color: "#ef4444" }} onClick={handleSignOut}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Mobile: profile header + tab strip */}
          <div style={{ display: "none" }} className="mobile-only-header">
            <div className="card" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", marginBottom: "0" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #d97706, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 800, color: "#fff", flexShrink: 0, fontFamily: "'Outfit',sans-serif" }}>
                {profile.firstName ? profile.firstName[0].toUpperCase() : "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a2e", margin: 0 }}>{displayName}</p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
              </div>
              <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "9px", border: "1.5px solid rgba(239,68,68,0.25)", background: "transparent", fontSize: "12px", fontWeight: 600, color: "#ef4444", cursor: "pointer", flexShrink: 0, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>

          {/* Mobile tab strip */}
          <div className="mobile-tab-strip">
            {TABS.map((tab) => (
              <button key={tab.id} className={`mobile-tab-pill ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Global save error */}
          {saveError && (
            <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
              <X size={14} color="#ef4444" />
              <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>{saveError}</p>
            </div>
          )}

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", animation: "fadeUp .4s ease both" }}>
                {[
                  { icon: <Package size={18} color="#d97706" />,  bg: "rgba(217,119,6,0.08)",   label: "Total Orders",     value: ORDERS.length.toString() },
                  { icon: <Shield  size={18} color="#3b82f6" />,  bg: "rgba(59,130,246,0.08)",  label: "Active Warranties", value: WARRANTIES.length.toString() },
                  { icon: <Truck   size={18} color="#22c55e" />,  bg: "rgba(34,197,94,0.08)",   label: "Delivered",         value: ORDERS.filter(o => o.status === "Delivered").length.toString() },
                ].map((s, i) => (
                  <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: "14px", animationDelay: `${i * 0.08}s` }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <p className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", lineHeight: 1 }}>{s.value}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal info */}
              <div className="card">
                <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Personal Information</h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>Manage your personal details</p>
                {([
                  { key: "firstName", label: "First Name",     icon: <User  size={14} color="#9ca3af" /> },
                  { key: "lastName",  label: "Last Name",      icon: <User  size={14} color="#9ca3af" /> },
                  { key: "email",     label: "Email",          icon: <Mail  size={14} color="#9ca3af" /> },
                  { key: "phone",     label: "Phone",          icon: <Phone size={14} color="#9ca3af" /> },
                  { key: "address",   label: "Address",        icon: <MapPin size={14} color="#9ca3af" /> },
                ] as { key: keyof ProfileData; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => (
                  <div key={key} className="field-row" style={{ alignItems: key === "address" && editingField === "address" ? "flex-start" : undefined }}>
                    <div className="field-label-col" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "130px", paddingTop: key === "address" && editingField === "address" ? "10px" : undefined }}>
                      {icon}
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                    </div>

                    {editingField === key ? (
                      key === "address" ? (
                        /* ── Address cascading dropdowns ── */
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                          {/* Province */}
                          <div style={{ position: "relative" }}>
                            <select
                              value={addrField.province}
                              onChange={(e) => {
                                const prov = e.target.value;
                                setAddrField({ province: prov, municipality: "", barangay: "" });
                                setTempProfile(prev => ({ ...prev, address: "" }));
                              }}
                              style={{ width: "100%", padding: "8px 32px 8px 10px", borderRadius: "9px", border: `1.5px solid ${addrField.province ? "#d97706" : "rgba(0,0,0,0.12)"}`, background: "#fff", fontSize: "13px", color: addrField.province ? "#1a1a2e" : "#9ca3af", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none", cursor: "pointer" }}
                              autoFocus
                            >
                              <option value="">Select province</option>
                              {Object.keys(ADDRESS_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <ChevronRight size={12} color="#9ca3af" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                          </div>
                          {/* Municipality */}
                          <div style={{ position: "relative" }}>
                            <select
                              value={addrField.municipality}
                              disabled={!addrField.province}
                              onChange={(e) => {
                                const mun = e.target.value;
                                setAddrField(prev => ({ ...prev, municipality: mun, barangay: "" }));
                                setTempProfile(prev2 => ({ ...prev2, address: "" }));
                              }}
                              style={{ width: "100%", padding: "8px 32px 8px 10px", borderRadius: "9px", border: `1.5px solid ${addrField.municipality ? "#d97706" : "rgba(0,0,0,0.12)"}`, background: addrField.province ? "#fff" : "#f9fafb", fontSize: "13px", color: addrField.municipality ? "#1a1a2e" : "#9ca3af", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none", cursor: addrField.province ? "pointer" : "not-allowed", opacity: addrField.province ? 1 : 0.55 }}
                            >
                              <option value="">{addrField.province ? "Select municipality / city" : "Select province first"}</option>
                              {addrFieldMunicipalities.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <ChevronRight size={12} color="#9ca3af" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                          </div>
                          {/* Barangay */}
                          <div style={{ position: "relative" }}>
                            <select
                              value={addrField.barangay}
                              disabled={!addrField.municipality}
                              onChange={(e) => {
                                const brgy = e.target.value;
                                setAddrField(prev => ({ ...prev, barangay: brgy }));
                                const full = `${brgy}, ${addrField.municipality}, ${addrField.province}`;
                                setTempProfile(prev2 => ({ ...prev2, address: full }));
                              }}
                              style={{ width: "100%", padding: "8px 32px 8px 10px", borderRadius: "9px", border: `1.5px solid ${addrField.barangay ? "#d97706" : "rgba(0,0,0,0.12)"}`, background: addrField.municipality ? "#fff" : "#f9fafb", fontSize: "13px", color: addrField.barangay ? "#1a1a2e" : "#9ca3af", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none", cursor: addrField.municipality ? "pointer" : "not-allowed", opacity: addrField.municipality ? 1 : 0.55 }}
                            >
                              <option value="">{addrField.municipality ? "Select barangay" : "Select municipality first"}</option>
                              {addrFieldBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <ChevronRight size={12} color="#9ca3af" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                          </div>
                          {/* Save / Cancel */}
                          <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
                            <button
                              className="save-btn"
                              onClick={() => { saveField("address"); setAddrField({ province: "", municipality: "", barangay: "" }); }}
                              disabled={saving || !tempProfile.address}
                              style={{ opacity: saving || !tempProfile.address ? 0.5 : 1 }}
                            >
                              {saving ? <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin .7s linear infinite" }} /> : <Check size={12} />}
                              Save
                            </button>
                            <button className="cancel-btn" onClick={() => { cancelEdit("address"); setAddrField({ province: "", municipality: "", barangay: "" }); }}>
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Regular text input for all other fields ── */
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, flexWrap: "wrap" }}>
                          <input
                            className="edit-input"
                            value={tempProfile[key]}
                            onChange={(e) => setTempProfile((prev) => ({ ...prev, [key]: e.target.value }))}
                            autoFocus
                          />
                          <button className="save-btn" onClick={() => saveField(key)} disabled={saving}>
                            {saving ? <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin .7s linear infinite" }} /> : <Check size={12} />}
                            Save
                          </button>
                          <button className="cancel-btn" onClick={() => cancelEdit(key)}><X size={12} /></button>
                        </div>
                      )
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: "14px", color: profile[key] ? "#1a1a2e" : "#d1d5db", fontWeight: 500, textAlign: "right" }}>
                          {profile[key] || "Not set"}
                        </span>
                        <button className="edit-btn" onClick={() => {
                          setEditingField(key);
                          setTempProfile({ ...profile });
                          setSaveError("");
                          // Pre-populate dropdowns if address already set
                          if (key === "address" && profile.address) {
                            const parts = profile.address.split(", ");
                            if (parts.length >= 3) {
                              setAddrField({ barangay: parts[0], municipality: parts[1], province: parts[2] });
                            }
                          }
                        }}>
                          <Edit3 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>Recent Orders</h2>
                  <button onClick={() => setActiveTab("orders")} style={{ fontSize: "12px", color: "#d97706", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {ORDERS.slice(0, 2).map((order) => (
                    <div key={order.id} className="order-row">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginBottom: "3px" }}>{order.id}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af" }}>{order.items.join(", ")}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span className="status-badge" style={{ background: `${order.statusColor}15`, color: order.statusColor, border: `1px solid ${order.statusColor}30`, marginBottom: "4px", display: "inline-flex" }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: order.statusColor }} />{order.status}
                        </span>
                        <p className="outfit" style={{ fontSize: "14px", fontWeight: 800, color: "#1a1a2e" }}>{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Orders ── */}
          {activeTab === "orders" && (
            <div className="card">
              <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Order History</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>All your past and current orders</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {ORDERS.map((order, i) => (
                  <div key={order.id} className="order-row" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(217,119,6,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="24" height="18" viewBox="0 0 88 64" fill="none">
                          <rect x="4" y="16" width="80" height="36" rx="8" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="2"/>
                          <line x1="14" y1="24" x2="14" y2="44" stroke="rgba(217,119,6,0.3)" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="20" y1="24" x2="20" y2="44" stroke="rgba(217,119,6,0.3)" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="26" y1="24" x2="26" y2="44" stroke="rgba(217,119,6,0.3)" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="76" cy="26" r="4" fill="#22c55e" opacity="0.8"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginBottom: "2px" }}>{order.id}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                        <p style={{ fontSize: "12px", color: "#6b7280" }}>{order.items.join(", ")}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span className="status-badge" style={{ background: `${order.statusColor}15`, color: order.statusColor, border: `1px solid ${order.statusColor}30`, marginBottom: "6px", display: "inline-flex" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: order.statusColor }} />{order.status}
                      </span>
                      <p className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>{formatPrice(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Warranties ── */}
          {activeTab === "warranties" && (
            <div className="card">
              <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Warranty Tracker</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>All units under warranty coverage</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {WARRANTIES.map((w, i) => (
                  <div key={w.id} style={{ padding: "16px", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa", animationDelay: `${i * 0.07}s` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="20" height="15" viewBox="0 0 88 64" fill="none">
                            <rect x="4" y="16" width="80" height="36" rx="8" fill="#fff" stroke="rgba(217,119,6,0.4)" strokeWidth="2"/>
                            <line x1="14" y1="24" x2="14" y2="44" stroke="rgba(217,119,6,0.3)" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="20" y1="24" x2="20" y2="44" stroke="rgba(217,119,6,0.3)" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="76" cy="26" r="4" fill="#22c55e" opacity="0.8"/>
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e", marginBottom: "2px" }}>{w.product}</p>
                          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Purchased {w.purchased}</p>
                        </div>
                      </div>
                      <span className="status-badge" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />{w.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>Expires {w.expires}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#d97706" }}>{w.daysLeft} days left</span>
                    </div>
                    <div className="warranty-bar-bg">
                      <div className="warranty-bar-fill" style={{ width: `${Math.min((w.daysLeft / 730) * 100, 100)}%` }} />
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                      <Link href="/services" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", color: "#d97706", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                        <Wrench size={12} /> Request Service
                      </Link>
                      <button style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "transparent", border: "1px solid rgba(0,0,0,0.1)", color: "#6b7280", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Addresses ── */}
          {activeTab === "addresses" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Saved Addresses</h2>
                    <p style={{ fontSize: "13px", color: "#9ca3af" }}>Manage your delivery addresses</p>
                  </div>
                  {!showAddForm && (
                    <button onClick={openAddAddress} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "#d97706", color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                      <Plus size={13} /> Add Address
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {savedAddresses.map((addr) => (
                    <div key={addr.id} style={{ padding: "16px", borderRadius: "14px", border: `1.5px solid ${addr.isDefault ? "rgba(217,119,6,0.3)" : "rgba(0,0,0,0.07)"}`, background: addr.isDefault ? "rgba(217,119,6,0.03)" : "#fafafa" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {addr.isDefault ? <Home size={14} color="#d97706" /> : <MapPin size={14} color="#6b7280" />}
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e" }}>{addr.label}</span>
                          {addr.isDefault && (
                            <span style={{ padding: "2px 8px", borderRadius: "100px", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", fontSize: "10px", fontWeight: 700, color: "#d97706" }}>Default</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button className="edit-btn" onClick={() => openEditAddress(addr)}><Edit3 size={13} /></button>
                          {!addr.isDefault && (
                            <button className="edit-btn" style={{ color: "#d1d5db" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
                              onClick={() => deleteAddress(addr.id)}
                            ><X size={13} /></button>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>
                        {addr.street}, Brgy. {addr.barangay}, {addr.municipality}, {addr.province}
                      </p>
                      {!addr.isDefault && (
                        <button onClick={() => setDefaultAddress(addr.id)} style={{ marginTop: "10px", fontSize: "12px", color: "#d97706", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                          Set as default
                        </button>
                      )}
                    </div>
                  ))}
                  {savedAddresses.length === 0 && !showAddForm && (
                    <div style={{ padding: "32px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
                      No saved addresses yet.
                    </div>
                  )}
                </div>
              </div>

              {/* ── Add / Edit Form ── */}
              {showAddForm && (
                <div className="card" style={{ animation: "fadeUp .3s ease both" }}>
                  <h3 className="outfit" style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a2e", marginBottom: "16px" }}>
                    {editAddrId !== null ? "Edit Address" : "New Address"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                    {/* Label */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Label</label>
                      <input
                        placeholder="e.g. Home, Office, Parents"
                        value={addrForm.label}
                        onChange={(e) => setAddrForm(p => ({ ...p, label: e.target.value }))}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "13px", color: "#1a1a2e", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "border-color .2s" }}
                        onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                        onBlur={(e)  => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
                      />
                    </div>

                    {/* Street / House No */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>House No. / Street / Subdivision</label>
                      <input
                        placeholder="e.g. 123 Rizal St., Purok 2"
                        value={addrForm.street}
                        onChange={(e) => setAddrForm(p => ({ ...p, street: e.target.value }))}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "13px", color: "#1a1a2e", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "border-color .2s" }}
                        onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                        onBlur={(e)  => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
                      />
                    </div>

                    {/* Province */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Province</label>
                      <div style={{ position: "relative" }}>
                        <select
                          value={addrForm.province}
                          onChange={(e) => setAddrForm(p => ({ ...p, province: e.target.value, municipality: "", barangay: "" }))}
                          style={{ width: "100%", padding: "9px 36px 9px 12px", borderRadius: "10px", border: `1.5px solid ${addrForm.province ? "#d97706" : "rgba(0,0,0,0.1)"}`, background: "#fff", fontSize: "13px", color: addrForm.province ? "#1a1a2e" : "#9ca3af", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none", cursor: "pointer" }}
                        >
                          <option value="">Select province</option>
                          {Object.keys(ADDRESS_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <ChevronRight size={13} color="#9ca3af" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                      </div>
                    </div>

                    {/* Municipality */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                        Municipality / City
                      </label>
                      <div style={{ position: "relative" }}>
                        <select
                          value={addrForm.municipality}
                          disabled={!addrForm.province}
                          onChange={(e) => setAddrForm(p => ({ ...p, municipality: e.target.value, barangay: "" }))}
                          style={{ width: "100%", padding: "9px 36px 9px 12px", borderRadius: "10px", border: `1.5px solid ${addrForm.municipality ? "#d97706" : "rgba(0,0,0,0.1)"}`, background: addrForm.province ? "#fff" : "#f9fafb", fontSize: "13px", color: addrForm.municipality ? "#1a1a2e" : "#9ca3af", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none", cursor: addrForm.province ? "pointer" : "not-allowed", opacity: addrForm.province ? 1 : 0.6 }}
                        >
                          <option value="">{addrForm.province ? "Select municipality / city" : "Select a province first"}</option>
                          {addrMunicipalities.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronRight size={13} color="#9ca3af" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                      </div>
                    </div>

                    {/* Barangay */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Barangay</label>
                      <div style={{ position: "relative" }}>
                        <select
                          value={addrForm.barangay}
                          disabled={!addrForm.municipality}
                          onChange={(e) => setAddrForm(p => ({ ...p, barangay: e.target.value }))}
                          style={{ width: "100%", padding: "9px 36px 9px 12px", borderRadius: "10px", border: `1.5px solid ${addrForm.barangay ? "#d97706" : "rgba(0,0,0,0.1)"}`, background: addrForm.municipality ? "#fff" : "#f9fafb", fontSize: "13px", color: addrForm.barangay ? "#1a1a2e" : "#9ca3af", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", appearance: "none", cursor: addrForm.municipality ? "pointer" : "not-allowed", opacity: addrForm.municipality ? 1 : 0.6 }}
                        >
                          <option value="">{addrForm.municipality ? "Select barangay" : "Select a municipality first"}</option>
                          {addrBarangays.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronRight size={13} color="#9ca3af" style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <button
                        onClick={saveAddress}
                        disabled={!addrForm.label || !addrForm.street || !addrForm.province || !addrForm.municipality || !addrForm.barangay}
                        className="save-btn"
                        style={{ flex: 1, justifyContent: "center", padding: "11px", fontSize: "13px", opacity: (!addrForm.label || !addrForm.street || !addrForm.province || !addrForm.municipality || !addrForm.barangay) ? 0.5 : 1 }}
                      >
                        <Check size={13} /> {editAddrId !== null ? "Save Changes" : "Add Address"}
                      </button>
                      <button
                        onClick={() => { setShowAddForm(false); resetAddrForm(); setEditAddrId(null); }}
                        className="cancel-btn"
                        style={{ padding: "11px 16px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <div className="card">
              <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Notification Preferences</h2>
              <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>Choose what updates you want to receive</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {([
                  { key: "orderUpdates",     label: "Order Updates",       desc: "Shipping, delivery, and installation status" },
                  { key: "warrantyAlerts",   label: "Warranty Alerts",     desc: "Expiry reminders and service due dates" },
                  { key: "serviceReminders", label: "Service Reminders",   desc: "Annual maintenance and cleaning reminders" },
                  { key: "promotions",       label: "Promotions & Deals",  desc: "Exclusive member discounts and flash sales" },
                  { key: "newsletter",       label: "Newsletter",          desc: "Monthly tips, product launches, and news" },
                ] as { key: keyof typeof notifications; label: string; desc: string }[]).map(({ key, label, desc }) => (
                  <div key={key} className="field-row">
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", marginBottom: "2px" }}>{label}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>{desc}</p>
                    </div>
                    <button
                      className={`toggle ${notifications[key] ? "on" : "off"}`}
                      onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {activeTab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="card">
                <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Change Password</h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "20px" }}>Keep your account secure with a strong password</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {([
                    { key: "current", label: "Current Password",     placeholder: "Enter current password" },
                    { key: "newPw",   label: "New Password",         placeholder: "Min. 8 characters" },
                    { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                  ] as { key: keyof typeof passwords; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>{label}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type={showPw[key] ? "text" : "password"}
                          placeholder={placeholder}
                          value={passwords[key]}
                          onChange={(e) => setPasswords((prev) => ({ ...prev, [key]: e.target.value }))}
                          style={{ width: "100%", padding: "11px 40px 11px 14px", borderRadius: "11px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "14px", color: "#1a1a2e", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "border-color .2s" }}
                          onFocus={(e) => (e.target.style.borderColor = "#d97706")}
                          onBlur={(e)  => (e.target.style.borderColor = "rgba(0,0,0,0.1)")}
                        />
                        <button type="button" onClick={() => setShowPw((prev) => ({ ...prev, [key]: !prev[key] }))}
                          style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                          {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {pwError && (
                    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <p style={{ fontSize: "13px", color: "#ef4444", margin: 0 }}>{pwError}</p>
                    </div>
                  )}
                  {pwSuccess && (
                    <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Check size={14} color="#16a34a" />
                      <p style={{ fontSize: "13px", color: "#16a34a", margin: 0, fontWeight: 600 }}>Password updated successfully!</p>
                    </div>
                  )}

                  <button
                    onClick={handlePasswordUpdate}
                    disabled={pwSaving}
                    style={{ marginTop: "4px", padding: "12px", borderRadius: "12px", background: "#d97706", color: "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: pwSaving ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 4px 14px rgba(217,119,6,0.3)", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: pwSaving ? 0.7 : 1 }}
                    onMouseEnter={(e) => { if (!pwSaving) e.currentTarget.style.background = "#b45309"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#d97706"; }}
                  >
                    {pwSaving ? <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin .7s linear infinite" }} /> : null}
                    {pwSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="card">
                <h2 className="outfit" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e", marginBottom: "4px" }}>Account Actions</h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>Manage your account status</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", background: "#fafafa", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "2px" }}>Download My Data</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>Export all your orders and account data</p>
                    </div>
                    <button style={{ padding: "7px 14px", borderRadius: "9px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Export</button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.03)", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#ef4444", marginBottom: "2px" }}>Delete Account</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>Permanently remove your account and data</p>
                    </div>
                    <button style={{ padding: "7px 14px", borderRadius: "9px", border: "1.5px solid rgba(239,68,68,0.3)", background: "transparent", fontSize: "12px", fontWeight: 600, color: "#ef4444", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.07)", padding: "40px 24px", background: "#fff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Triangle size={11} color="#fff" fill="#fff" />
            </span>
            <span className="brand" style={{ fontSize: "16px", fontWeight: 800, color: "#1a1a2e" }}>EMEREN</span>
          </div>
          <p style={{ fontSize: "12px", color: "#d1d5db" }}>© {new Date().getFullYear()} Emeren. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {([["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"]] as [string,string][]).map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: "12px", color: "#d1d5db", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6b7280")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d5db")}
              >{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}