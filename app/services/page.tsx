"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  Triangle, ArrowRight, Star, ShoppingCart, User, LogOut,
  Check, Phone, MapPin, Clock, Shield, Droplets, Wind,
  ChevronRight, Wrench, CalendarCheck, BadgeCheck, Thermometer,
  Home, Store, Menu, X, Calendar, CheckCircle, Loader, AirVent,
} from "lucide-react";
import { SERVICES, type Service } from "@/lib/services";

const formatPrice = (n: number) => `₱${n.toLocaleString()}`;

// ── PH Address Data (Pampanga & Bulacan) ──────────────────────────────────────
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
    "Porac": ["Babo Pangulo","Babo Sacan","Balubad","Banban","Cangatba","Diaz","Dolores","Jalung","Mancatian","Manibaug Libutad","Manibaug Pasig","Manibaug Paralaya","Mangalit","Mitla Proper","Palat","Pias","Pio","Planas","Poblacion","Pulong Santol","Salu","San Jose Mitla","Santa Cruz","Sapang Uwak","Sepung Calzada","Sinura","Tigig"],
    "Magalang": ["Abacan","Ayala","Balaug","Bucanan","Camias","Dolores","Escaler","La Paz","Navaling","San Agustin","San Antonio","San Francisco","San Ildefonso","San Isidro","San Jose","San Miguel","San Nicolas 1st","San Nicolas 2nd","San Pablo","San Pedro","San Roque","San Vicente","Santa Cruz","Santa Lucia","Santa Maria","Santo Nino","Santo Rosario","Turu"],
    "Mexico": ["Acli","Anao","Arayat","Balas","Belen","Brgy. 1 (Pob.)","Brgy. 2 (Pob.)","Brgy. 3 (Pob.)","Brgy. 4 (Pob.)","Brgy. 5 (Pob.)","Brgy. 6 (Pob.)","Brgy. 7 (Pob.)","Brgy. 8 (Pob.)","Camuning","Cawayan","Concepcion","Culiat","De La Paz","Dolores","Eden","Gandus","Lagundi","Laput","Laug","Masamat","Masangsang","Nueva Victoria","Pandacaqui","Pangatlan","Panipuan","Parian","Sabanilla","San Antonio","San Carlos","San Jose","San Juan","San Lorenzo","San Miguel","San Nicolas","San Pablo","San Patricio","San Rafael","San Roque","Santa Cruz","Santa Maria","Santa Rita","Santo Cristo","Santo Rosario","Sapang Maisac","Suclaban","Tangle"],
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

// ── SVG Icons ────────────────────────────────────────────────────────────────
function WindowACIcon() {
  return (
    <svg width="90" height="63" viewBox="0 0 100 70" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.2))" }}>
      <rect x="5" y="10" width="90" height="50" rx="6" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      {[18,24,30,36].map((x) => <line key={x} x1={x} y1="18" x2={x} y2="52" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[28,35,42,49].map((y) => <line key={y} x1="48" y1={y} x2="88" y2={y} stroke="rgba(217,119,6,0.15)" strokeWidth="1.5" strokeLinecap="round"/>)}
      <rect x="48" y="16" width="40" height="26" rx="4" fill="rgba(217,119,6,0.05)" stroke="rgba(217,119,6,0.15)" strokeWidth="1"/>
      <circle cx="82" cy="21" r="4" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
      <circle cx="82" cy="21" r="1.5" fill="#22c55e"/>
      <text x="63" y="35" textAnchor="middle" fontSize="11" fontWeight="700" fill="#d97706" fontFamily="Outfit,sans-serif">18°C</text>
      <circle cx="20" cy="62" r="2" fill="#93c5fd" opacity="0.6"/>
      <circle cx="30" cy="65" r="1.5" fill="#93c5fd" opacity="0.4"/>
      <circle cx="40" cy="62" r="2" fill="#93c5fd" opacity="0.5"/>
    </svg>
  );
}

function SplitACIcon() {
  return (
    <svg width="90" height="81" viewBox="0 0 100 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.2))" }}>
      <rect x="8" y="6" width="84" height="28" rx="7" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      {[20,28,36,44,52,60,68,76].map((x) => <line key={x} x1={x} y1="12" x2={x} y2="28" stroke="rgba(217,119,6,0.15)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="84" cy="14" r="3" fill="#22c55e" opacity="0.8"/>
      <path d="M10 30 Q50 36 90 30" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="25" y1="34" x2="25" y2="54" stroke="rgba(0,0,0,0.1)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="34" x2="30" y2="54" stroke="rgba(0,0,0,0.06)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="54" width="84" height="30" rx="6" fill="#fff" stroke="rgba(217,119,6,0.25)" strokeWidth="1.5"/>
      <circle cx="35" cy="69" r="10" fill="rgba(217,119,6,0.05)" stroke="rgba(217,119,6,0.2)" strokeWidth="1.2"/>
      <circle cx="35" cy="69" r="4" fill="rgba(217,119,6,0.1)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
      {[0,60,120,180,240,300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={deg} x1={35 + 4.5*Math.cos(rad)} y1={69 + 4.5*Math.sin(rad)} x2={35 + 8.5*Math.cos(rad)} y2={69 + 8.5*Math.sin(rad)} stroke="rgba(217,119,6,0.25)" strokeWidth="1.2"/>;
      })}
      {[52,58,64,70,76,82].map((x) => <line key={x} x1={x} y1="58" x2={x} y2="80" stroke="rgba(217,119,6,0.12)" strokeWidth="1.2" strokeLinecap="round"/>)}
    </svg>
  );
}

function FridgeIcon() {
  return (
    <svg width="70" height="100" viewBox="0 0 70 100" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.2))" }}>
      {/* Main body */}
      <rect x="8" y="5" width="54" height="90" rx="8" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      {/* Freezer compartment */}
      <rect x="8" y="5" width="54" height="32" rx="8" fill="rgba(147,197,253,0.08)" stroke="rgba(217,119,6,0.2)" strokeWidth="1"/>
      {/* Divider line */}
      <line x1="8" y1="37" x2="62" y2="37" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5"/>
      {/* Freezer handle */}
      <rect x="48" y="16" width="6" height="14" rx="3" fill="rgba(217,119,6,0.15)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
      {/* Fridge handle */}
      <rect x="48" y="52" width="6" height="20" rx="3" fill="rgba(217,119,6,0.15)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
      {/* Freezer snowflake hint */}
      <line x1="25" y1="17" x2="25" y2="29" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="23" x2="31" y2="23" stroke="rgba(147,197,253,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20.5" y1="18.5" x2="29.5" y2="27.5" stroke="rgba(147,197,253,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="29.5" y1="18.5" x2="20.5" y2="27.5" stroke="rgba(147,197,253,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Fridge shelves */}
      <line x1="14" y1="58" x2="56" y2="58" stroke="rgba(217,119,6,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="14" y1="70" x2="56" y2="70" stroke="rgba(217,119,6,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      <line x1="14" y1="82" x2="56" y2="82" stroke="rgba(217,119,6,0.1)" strokeWidth="1" strokeDasharray="3 2"/>
      {/* Status light */}
      <circle cx="16" cy="43" r="3" fill="#22c55e" opacity="0.7"/>
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.18))" }}>
      <path d="M22 68 L52 38" stroke="rgba(217,119,6,0.7)" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="18" cy="72" r="8" fill="#fff" stroke="rgba(217,119,6,0.4)" strokeWidth="2"/>
      <circle cx="18" cy="72" r="3.5" fill="rgba(217,119,6,0.2)" stroke="rgba(217,119,6,0.5)" strokeWidth="1.5"/>
      <path d="M52 38 C52 28 62 20 70 24 L62 32 L66 36 L74 28 C78 36 70 46 60 46 Z" fill="#fff" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5"/>
      <path d="M65 25 L30 60" stroke="rgba(59,130,246,0.5)" strokeWidth="3.5" strokeLinecap="round"/>
      <rect x="26" y="56" width="8" height="12" rx="2" transform="rotate(-45 26 56)" fill="#fff" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <rect x="10" y="10" width="36" height="18" rx="5" fill="#fff" stroke="rgba(217,119,6,0.25)" strokeWidth="1.5"/>
      {[16,21,26,30,34].map((x) => <line key={x} x1={x} y1="14" x2={x} y2="24" stroke="rgba(217,119,6,0.15)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="40" cy="13" r="2.5" fill="#22c55e" opacity="0.7"/>
    </svg>
  );
}

function RechargeIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.18))" }}>
      <rect x="30" y="30" width="24" height="42" rx="8" fill="#fff" stroke="rgba(34,197,94,0.4)" strokeWidth="1.5"/>
      <rect x="36" y="22" width="12" height="12" rx="4" fill="#fff" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
      <line x1="42" y1="22" x2="42" y2="18" stroke="rgba(34,197,94,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="42" cy="48" r="10" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.3)" strokeWidth="1.5"/>
      <path d="M36 52 A8 8 0 0 1 48 44" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="42" y1="48" x2="46" y2="44" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M54 52 Q68 52 68 40 Q68 28 58 26" stroke="rgba(34,197,94,0.4)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="16" y1="30" x2="16" y2="42" stroke="rgba(147,197,253,0.7)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="36" x2="22" y2="36" stroke="rgba(147,197,253,0.7)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="11.5" y1="31.5" x2="20.5" y2="40.5" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20.5" y1="31.5" x2="11.5" y2="40.5" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function MoveIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(217,119,6,0.18))" }}>
      <rect x="5" y="20" width="32" height="16" rx="5" fill="rgba(217,119,6,0.06)" stroke="rgba(217,119,6,0.2)" strokeWidth="1.5" strokeDasharray="3 2"/>
      <path d="M40 28 L58 28" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M54 23 L60 28 L54 33" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="53" y="20" width="32" height="16" rx="5" fill="#fff" stroke="rgba(217,119,6,0.35)" strokeWidth="1.5"/>
      {[59,64,69,73,77].map((x) => <line key={x} x1={x} y1="24" x2={x} y2="32" stroke="rgba(217,119,6,0.2)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="81" cy="23" r="2.5" fill="#22c55e" opacity="0.8"/>
      <line x1="5" y1="44" x2="37" y2="44" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="53" y1="44" x2="85" y2="44" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="5" y="54" width="26" height="20" rx="5" fill="rgba(217,119,6,0.05)" stroke="rgba(217,119,6,0.15)" strokeWidth="1.5" strokeDasharray="3 2"/>
      <rect x="59" y="54" width="26" height="20" rx="5" fill="#fff" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"/>
      <circle cx="72" cy="64" r="6" fill="rgba(217,119,6,0.06)" stroke="rgba(217,119,6,0.2)" strokeWidth="1.2"/>
      <circle cx="72" cy="64" r="2.5" fill="rgba(217,119,6,0.1)" stroke="rgba(217,119,6,0.3)" strokeWidth="1"/>
    </svg>
  );
}

function DismantleIcon() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" style={{ filter: "drop-shadow(0 4px 16px rgba(239,68,68,0.15))" }}>
      <rect x="12" y="18" width="50" height="22" rx="6" fill="#fff" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"/>
      {[20,26,32,38,44,50].map((x) => <line key={x} x1={x} y1="23" x2={x} y2="36" stroke="rgba(0,0,0,0.08)" strokeWidth="1.2" strokeLinecap="round"/>)}
      <circle cx="57" cy="22" r="2.5" fill="#ef4444" opacity="0.5"/>
      <path d="M62 20 L72 14" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M69 14 L72 14 L72 17" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M62 40 L72 46" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M69 46 L72 46 L72 43" stroke="rgba(239,68,68,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="22" r="3" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
      <line x1="14.5" y1="22" x2="17.5" y2="22" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="58" cy="36" r="3" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
      <line x1="56.5" y1="36" x2="59.5" y2="36" stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M20 58 L38 76" stroke="rgba(217,119,6,0.6)" strokeWidth="4" strokeLinecap="round"/>
      <rect x="14" y="52" width="10" height="10" rx="2" transform="rotate(-45 14 52)" fill="#fff" stroke="rgba(217,119,6,0.4)" strokeWidth="1.5"/>
      <rect x="60" y="58" width="20" height="6" rx="2" fill="rgba(0,0,0,0.06)" stroke="rgba(0,0,0,0.12)" strokeWidth="1" transform="rotate(15 60 58)"/>
    </svg>
  );
}

// ── Icon picker ───────────────────────────────────────────────────────────────
function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  switch (icon) {
    case "window":    return <WindowACIcon />;
    case "split":     return <SplitACIcon />;
    case "fridge":    return <FridgeIcon />;
    case "tools":     return <ToolsIcon />;
    case "recharge":  return <RechargeIcon />;
    case "move":      return <MoveIcon />;
    case "dismantle": return <DismantleIcon />;
  }
}

// ── Location badge ────────────────────────────────────────────────────────────
function LocationBadge({ location }: { location: Service["location"] }) {
  const configs = {
    "on-site":  { label: "On-Site Service",       icon: <Home  size={11} color="#d97706" />, bg: "rgba(217,119,6,0.08)",   border: "rgba(217,119,6,0.2)",  color: "#b45309" },
    "in-store": { label: "In-Store Service",       icon: <Store size={11} color="#6b7280" />, bg: "rgba(0,0,0,0.04)",       border: "rgba(0,0,0,0.1)",      color: "#6b7280" },
    "both":     { label: "On-Site or In-Store",    icon: <MapPin size={11} color="#7c3aed" />, bg: "rgba(124,58,237,0.07)", border: "rgba(124,58,237,0.2)", color: "#7c3aed" },
  };
  const c = configs[location];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "100px", background: c.bg, border: `1px solid ${c.border}` }}>
      {c.icon}
      <span style={{ fontSize: "11px", fontWeight: 700, color: c.color }}>{c.label}</span>
    </div>
  );
}

// ── Custom Calendar Picker ────────────────────────────────────────────────────
function CalendarPicker({ value, onChange, hasError }: { value: string; onChange: (d: string) => void; hasError: boolean }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const isPast = (day: number) => new Date(viewYear, viewMonth, day) < today;
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === day;
  };
  const isToday = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  const select = (day: number) => {
    if (isPast(day)) return;
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
  };

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-PH", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div style={{ border: hasError ? "1.5px solid #ef4444" : "1.5px solid rgba(0,0,0,0.12)", borderRadius: "14px", overflow: "hidden", background: "#fff" }}>
      {/* Selected date display */}
      <div style={{ padding: "10px 14px", background: selectedDate ? "rgba(217,119,6,0.05)" : "#fafaf9", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "8px" }}>
        <Calendar size={14} color={selectedDate ? "#d97706" : "#9ca3af"} />
        <span style={{ fontSize: "13px", fontWeight: selectedDate ? 700 : 400, color: selectedDate ? "#1a1a2e" : "#9ca3af", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {displayValue || "Select a date"}
        </span>
      </div>

      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 8px" }}>
        <button onClick={prevMonth} type="button"
          style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6L7.5 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "14px", fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.2px" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} type="button"
          style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6L4.5 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 4px" }}>
        {DAYS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#9ca3af", padding: "4px 0", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "0.03em" }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 12px", gap: "2px" }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const past     = isPast(day);
          const selected = isSelected(day);
          const todayDay = isToday(day);
          return (
            <button key={i} type="button" onClick={() => select(day)} disabled={past}
              style={{
                width: "100%", aspectRatio: "1", borderRadius: "8px", border: selected ? "none" : todayDay ? "1.5px solid rgba(217,119,6,0.4)" : "none",
                background: selected ? "#d97706" : "transparent",
                color: selected ? "#fff" : past ? "#d1d5db" : todayDay ? "#d97706" : "#1a1a2e",
                fontSize: "13px", fontWeight: selected || todayDay ? 700 : 400,
                cursor: past ? "not-allowed" : "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                transition: "background .12s, color .12s",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={(e) => { if (!past && !selected) { e.currentTarget.style.background = "rgba(217,119,6,0.08)"; e.currentTarget.style.color = "#d97706"; } }}
              onMouseLeave={(e) => { if (!past && !selected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = todayDay ? "#d97706" : "#1a1a2e"; } }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function BookingModal({
  service, onClose, user,
}: {
  service: { name: string; price: string } | null;
  onClose: () => void;
  user: { email: string } | null;
}) {
  const [step, setStep]       = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "", phone: "",
    street: "", province: "", municipality: "", barangay: "",
    date: "", time: "", notes: "",
  });

  // Fetch full name from profiles table when user is logged in
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const meta = data.user.user_metadata ?? {};
      type ProfileRow = { full_name: string | null };
      const { data: profileRow } = await (supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.user.id)
        .single() as unknown as Promise<{ data: ProfileRow | null; error: unknown }>);
      const fullName = profileRow?.full_name ?? meta.full_name ?? meta.name ?? "";
      if (fullName) setForm((f) => ({ ...f, name: fullName }));
    });
  }, [user]);

  useEffect(() => {
    if (service) {
      setStep("form");
      setErrors({});
      setForm((f) => ({ ...f, street: "", province: "", municipality: "", barangay: "", date: "", time: "", notes: "" }));
    }
  }, [service]);

  if (!service) return null;

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  const focusStyle  = (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = "#d97706"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(217,119,6,0.1)"; };
  const blurStyle   = (key: string) => (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = errors[key] ? "#ef4444" : "rgba(0,0,0,0.12)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; };
  const inputStyle  = (key: string) => ({ padding: "10px 14px", borderRadius: "10px", border: errors[key] ? "1.5px solid #ef4444" : "1.5px solid rgba(0,0,0,0.12)", fontSize: "14px", color: "#1a1a2e", fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" as const });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())         e.name         = "Name is required";
    if (!form.phone.trim()) {
      e.phone = "Contact number is required";
    } else {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length !== 11 || !digits.startsWith("09")) e.phone = "Enter a valid PH number (09XX XXX XXXX)";
    }
    if (!form.street.trim())       e.street       = "Street / house no. is required";
    if (!form.province)            e.province     = "Select a province";
    if (!form.municipality)        e.municipality = "Select a municipality";
    if (!form.barangay)            e.barangay     = "Select a barangay";
    if (!form.date)                e.date         = "Please pick a date";
    if (!form.time)                e.time         = "Please pick a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await (supabase.from("bookings") as any).insert({
        service_name:   service.name,
        service_price:  service.price,
        customer_name:  form.name,
        phone:          form.phone,
        street:         form.street,
        province:       form.province,
        municipality:   form.municipality,
        barangay:       form.barangay,
        address:        `${form.street}, ${form.barangay}, ${form.municipality}, ${form.province}`,
        preferred_date: form.date,
        preferred_time: form.time,
        notes:          form.notes || null,
        user_email:     user?.email || null,
        status:         "pending",
        created_at:     new Date().toISOString(),
      });
      if (error) throw error;
      setStep("success");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", zIndex: 200, animation: "fadeIn .2s ease both" }} />

      {/* Modal */}
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 201, width: "min(520px, calc(100vw - 32px))", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: "24px", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "popIn .25s cubic-bezier(.22,1,.36,1) both" }}>

        {step === "success" ? (
          /* ── Success ── */
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} color="#22c55e" />
            </div>
            <h3 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px", letterSpacing: "-0.5px" }}>Booking Received!</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6, margin: "0 0 8px" }}>
              We've received your booking for <strong style={{ color: "#1a1a2e" }}>{service.name}</strong>.
            </p>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 28px", lineHeight: 1.6 }}>
              Our team will confirm your schedule via call or message within 24 hours.
            </p>
            <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: "12px", background: "#d97706", color: "#fff", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 4px 14px rgba(217,119,6,0.35)" }}>
              Done
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Header */}
            <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Book a Service</p>
                <h3 className="outfit" style={{ fontSize: "20px", fontWeight: 900, color: "#1a1a2e", margin: 0, letterSpacing: "-0.4px" }}>{service.name}</h3>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "6px", padding: "3px 10px", borderRadius: "100px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)" }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#d97706", fontFamily: "'Outfit',sans-serif" }}>{service.price}</span>
                </div>
              </div>
              <button onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent", cursor: "pointer", flexShrink: 0 }}>
                <X size={16} color="#6b7280" />
              </button>
            </div>

            {/* Logged-in banner */}
            {user ? (
              <div style={{ margin: "16px 28px 0", padding: "10px 14px", borderRadius: "10px", background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={13} color="#fff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, margin: 0 }}>Booking as</p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
              </div>
            ) : (
              <div style={{ margin: "16px 28px 0", padding: "10px 14px", borderRadius: "10px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                  <Link href="/auth/signin" style={{ color: "#d97706", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
                  {" "}to auto-fill your details or continue as guest.
                </p>
              </div>
            )}

            {/* Form body */}
            <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                <input type="text" value={form.name} onChange={set("name")} placeholder="e.g. Juan Dela Cruz"
                  style={inputStyle("name")} onFocus={focusStyle} onBlur={blurStyle("name")} />
                {errors.name && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.name}</span>}
              </div>

              {/* Phone */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Number</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      let raw = e.target.value.replace(/[^\d+]/g, "");
                      if (raw.startsWith("+639")) raw = "09" + raw.slice(4);
                      if (raw.startsWith("639"))  raw = "09" + raw.slice(3);
                      if (raw.length > 11) raw = raw.slice(0, 11);
                      let fmt = raw;
                      if (raw.length > 7)      fmt = raw.slice(0,4) + " " + raw.slice(4,7) + " " + raw.slice(7);
                      else if (raw.length > 4) fmt = raw.slice(0,4) + " " + raw.slice(4);
                      setForm((f) => ({ ...f, phone: fmt }));
                      setErrors((er) => ({ ...er, phone: "" }));
                    }}
                    placeholder="09XX XXX XXXX"
                    maxLength={13}
                    style={{ ...inputStyle("phone"), paddingRight: "90px" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle("phone")}
                  />
                  {(() => {
                    const d = form.phone.replace(/\D/g, "");
                    const p = d.slice(0, 4);
                    const globe = ["0817","0904","0905","0906","0915","0916","0917","0926","0927","0935","0936","0937","0945","0953","0954","0955","0956","0965","0966","0967","0975","0976","0977","0978","0979","0995","0996","0997"];
                    const smart = ["0907","0908","0909","0910","0911","0912","0913","0914","0918","0919","0920","0921","0928","0929","0930","0938","0939","0940","0946","0947","0948","0949","0950","0951","0961","0998","0999"];
                    const dito  = ["0895","0896","0897","0898","0991","0992","0993","0994"];
                    const isG = globe.includes(p), isS = smart.includes(p), isD = dito.includes(p);
                    if (!isG && !isS && !isD) return null;
                    return (
                      <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: isG ? "rgba(59,130,246,0.1)" : isS ? "rgba(239,68,68,0.08)" : "rgba(217,119,6,0.1)", color: isG ? "#1d4ed8" : isS ? "#dc2626" : "#d97706" }}>
                        {isG ? "Globe" : isS ? "Smart" : "DITO"}
                      </span>
                    );
                  })()}
                </div>
                {form.phone && (() => {
                  const d = form.phone.replace(/\D/g, "");
                  if (d.length === 11 && d.startsWith("09")) return (
                    <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Check size={11} strokeWidth={3} /> Valid PH number
                    </span>
                  );
                  if (d.length > 0 && d.length < 11) return (
                    <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>
                      {11 - d.length} more digit{11 - d.length !== 1 ? "s" : ""} needed
                    </span>
                  );
                  return null;
                })()}
                {errors.phone && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.phone}</span>}
              </div>

              {/* Address — cascading */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</label>

                {/* Street */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <input type="text" value={form.street} onChange={set("street")} placeholder="House No. / Street / Subdivision"
                    style={inputStyle("street")} onFocus={focusStyle} onBlur={blurStyle("street")} />
                  {errors.street && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.street}</span>}
                </div>

                {/* Province */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <select value={form.province}
                    onChange={(e) => { setForm((f) => ({ ...f, province: e.target.value, municipality: "", barangay: "" })); setErrors((er) => ({ ...er, province: "" })); }}
                    style={{ ...inputStyle("province"), color: form.province ? "#1a1a2e" : "#9ca3af", cursor: "pointer" }}
                    onFocus={focusStyle} onBlur={blurStyle("province")}>
                    <option value="">Select Province</option>
                    {Object.keys(ADDRESS_DATA).map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.province}</span>}
                </div>

                {/* Municipality */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <select value={form.municipality} disabled={!form.province}
                    onChange={(e) => { setForm((f) => ({ ...f, municipality: e.target.value, barangay: "" })); setErrors((er) => ({ ...er, municipality: "" })); }}
                    style={{ ...inputStyle("municipality"), color: form.municipality ? "#1a1a2e" : "#9ca3af", cursor: form.province ? "pointer" : "not-allowed", opacity: form.province ? 1 : 0.6 }}
                    onFocus={focusStyle} onBlur={blurStyle("municipality")}>
                    <option value="">Select City / Municipality</option>
                    {(form.province ? Object.keys(ADDRESS_DATA[form.province] ?? {}) : []).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.municipality && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.municipality}</span>}
                </div>

                {/* Barangay */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <select value={form.barangay} disabled={!form.municipality}
                    onChange={(e) => { setForm((f) => ({ ...f, barangay: e.target.value })); setErrors((er) => ({ ...er, barangay: "" })); }}
                    style={{ ...inputStyle("barangay"), color: form.barangay ? "#1a1a2e" : "#9ca3af", cursor: form.municipality ? "pointer" : "not-allowed", opacity: form.municipality ? 1 : 0.6 }}
                    onFocus={focusStyle} onBlur={blurStyle("barangay")}>
                    <option value="">Select Barangay</option>
                    {(form.province && form.municipality ? ADDRESS_DATA[form.province]?.[form.municipality] ?? [] : []).map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.barangay && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.barangay}</span>}
                </div>

                {/* Full address preview */}
                {form.barangay && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "9px 12px", borderRadius: "10px", background: "rgba(217,119,6,0.05)", border: "1px solid rgba(217,119,6,0.15)" }}>
                    <MapPin size={13} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "12px", color: "#92400e", fontWeight: 500, lineHeight: 1.5 }}>
                      {[form.street, form.barangay, form.municipality, form.province].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Date + Time */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preferred Date</label>
                  <CalendarPicker value={form.date} onChange={(d) => { setForm((f) => ({ ...f, date: d })); setErrors((er) => ({ ...er, date: "" })); }} hasError={!!errors.date} />
                  {errors.date && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.date}</span>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preferred Time</label>
                  <select value={form.time} onChange={set("time")}
                    style={{ ...inputStyle("time"), color: form.time ? "#1a1a2e" : "#9ca3af", cursor: "pointer" }}
                    onFocus={focusStyle} onBlur={blurStyle("time")}>
                    <option value="">Select time</option>
                    {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500 }}>{errors.time}</span>}
                </div>
              </div>

              {/* Notes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Additional Notes <span style={{ color: "#9ca3af", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                </label>
                <textarea value={form.notes} rows={3} onChange={set("notes")}
                  placeholder="e.g. 2nd floor unit, gate code is 1234, etc."
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.12)", fontSize: "14px", color: "#1a1a2e", fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none", resize: "vertical", background: "#fff", lineHeight: 1.5, width: "100%", boxSizing: "border-box" }}
                  onFocus={focusStyle} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 28px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: "10px" }}>
              <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.12)", background: "transparent", fontSize: "14px", fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex: 2, padding: "12px", borderRadius: "12px", background: loading ? "#e5e7eb" : "#d97706", color: loading ? "#9ca3af" : "#fff", fontSize: "14px", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: loading ? "none" : "0 4px 14px rgba(217,119,6,0.35)", transition: "background .15s" }}>
                {loading
                  ? <><Loader size={15} style={{ animation: "spin .8s linear infinite" }} /> Submitting...</>
                  : <><Calendar size={15} /> Confirm Booking</>}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { from { opacity:0; transform:translate(-50%,-48%) scale(0.96); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
      `}</style>
    </>
  );
}

// ── Cleaning Card ─────────────────────────────────────────────────────────────
function CleaningCard({ service: s, index: i, onBook }: { service: Service; index: number; onBook: (s: { name: string; price: string }) => void }) {
  const [selected,     setSelected]     = useState(0);
  const [cleaningType, setCleaningType] = useState<"normal" | "deep">("normal");

  const isSplit = s.icon === "split";
  const variant = s.variants![selected];

  // Parse HP from variant label to determine surcharge
  const hpValue = parseFloat(variant.label.replace("HP","").trim());
  const isLargeUnit = hpValue >= 2.5;
  const SURCHARGE = 200;

  // Base price: split uses cleaning type, window uses variant price
  const basePrice  = isSplit ? (cleaningType === "normal" ? 1000 : 1500) : variant.price;
  const displayPrice = basePrice + (isLargeUnit ? SURCHARGE : 0);

  const CLEANING_TYPES = [
    {
      key: "normal" as const,
      label: "Normal Cleaning",
      tagalog: "Sinasahuran",
      price: 1000,
      desc: "Filter wash, coil cleaning, drain check",
      icon: <Droplets size={13} color="#0891b2" />,
      bg: "rgba(8,145,178,0.06)",
      border: "rgba(8,145,178,0.2)",
      active: { bg: "rgba(8,145,178,0.08)", border: "#0891b2", color: "#0e7490" },
    },
    {
      key: "deep" as const,
      label: "Deep Cleaning",
      tagalog: "Unit dismantled",
      price: 1500,
      desc: "Indoor unit removed for thorough cleaning",
      icon: <Wrench size={13} color="#d97706" />,
      bg: "rgba(217,119,6,0.06)",
      border: "rgba(217,119,6,0.2)",
      active: { bg: "rgba(217,119,6,0.08)", border: "#d97706", color: "#b45309" },
    },
  ];

  return (
    <div className="service-card" style={{ animationDelay: `${i * 0.08}s` }}>
      {/* Image area */}
      <div style={{ padding: "32px 24px 20px", background: "linear-gradient(145deg,#f0ede8 0%,#faf9f6 60%,#ede9e2 100%)", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(217,119,6,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10px", left: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(217,119,6,0.04)", pointerEvents: "none" }} />
        {s.badge && (
          <span style={{ position: "absolute", top: "14px", left: "14px", padding: "3px 10px", borderRadius: "7px", fontSize: "10px", fontWeight: 700, background: "#d97706", color: "#fff" }}>
            {s.badge}
          </span>
        )}
        {s.icon === "window" ? <WindowACIcon /> : <SplitACIcon />}
        <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "100px", background: isSplit && cleaningType === "deep" ? "rgba(217,119,6,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${isSplit && cleaningType === "deep" ? "rgba(217,119,6,0.25)" : "rgba(34,197,94,0.2)"}` }}>
          {isSplit && cleaningType === "deep"
            ? <><Wrench size={11} color="#d97706" /><span style={{ fontSize: "11px", fontWeight: 700, color: "#b45309" }}>Deep Cleaning — Unit Removed</span></>
            : <><Droplets size={11} color="#16a34a" /><span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a" }}>{isSplit ? "Normal Cleaning — Sinasahuran" : "Deep Cleaning Service"}</span></>
          }
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", margin: 0 }}>{s.type}</p>
          <LocationBadge location={s.location} />
        </div>
        <h3 className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", margin: "4px 0 10px", letterSpacing: "-0.3px" }}>{s.name}</h3>
        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, marginBottom: "16px" }}>{s.description}</p>

        {/* ── Normal vs Deep selector (split type only) ── */}
        {isSplit && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Cleaning Type</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {CLEANING_TYPES.map((ct) => {
                const isActive = cleaningType === ct.key;
                return (
                  <button key={ct.key} onClick={() => setCleaningType(ct.key)} type="button"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", border: `1.5px solid ${isActive ? ct.active.border : "rgba(0,0,0,0.08)"}`, background: isActive ? ct.active.bg : "#fff", cursor: "pointer", transition: "all .15s", textAlign: "left", fontFamily: "'Plus Jakarta Sans',sans-serif", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: isActive ? (ct.key === "deep" ? "rgba(217,119,6,0.12)" : "rgba(8,145,178,0.12)") : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {ct.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: isActive ? ct.active.color : "#374151", margin: 0 }}>{ct.label}</p>
                        <p style={{ fontSize: "11px", color: isActive ? ct.active.color : "#9ca3af", margin: "1px 0 0", fontWeight: 500, opacity: isActive ? 0.8 : 1 }}>{ct.tagalog} · {ct.desc}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: "14px", fontWeight: 800, color: isActive ? ct.active.color : "#374151" }}>₱{ct.price.toLocaleString()}</span>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${isActive ? ct.active.border : "rgba(0,0,0,0.15)"}`, background: isActive ? ct.active.border : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {isActive && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Includes */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>What's Included</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
            {s.includes.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "5px", background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <Check size={9} color="#d97706" strokeWidth={3} />
                </span>
                <span style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <Clock size={13} color="#9ca3af" />
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>Estimated duration:</span>
          <span style={{ fontSize: "12px", color: "#1a1a2e", fontWeight: 700 }}>{s.duration}</span>
        </div>

        {/* HP variant selector (still shown for both) */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>Select HP</p>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af" }}>+₱200 for 2.5HP & above</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {s.variants!.map((v, idx) => {
              const hp     = parseFloat(v.label.replace("HP","").trim());
              const isLarge = hp >= 2.5;
              const isActive = selected === idx;
              return (
                <button key={v.label} onClick={() => setSelected(idx)}
                  style={{ flex: 1, padding: "10px 8px", borderRadius: "10px", cursor: "pointer", border: isActive ? "1.5px solid #d97706" : "1.5px solid rgba(0,0,0,0.1)", background: isActive ? "rgba(217,119,6,0.06)" : "#fff", transition: "all .15s", textAlign: "center" as const, fontFamily: "'Plus Jakarta Sans',sans-serif", position: "relative" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: isActive ? "#d97706" : "#374151", margin: 0 }}>{v.label}</p>
                  {v.sublabel && <p style={{ fontSize: "10px", color: isActive ? "#d97706" : "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>{v.sublabel}</p>}
                  {isLarge && (
                    <span style={{ display: "block", marginTop: "4px", fontSize: "9px", fontWeight: 700, color: isActive ? "#d97706" : "#9ca3af", letterSpacing: "0.03em" }}>+₱200</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <div>
            <p style={{ fontSize: "10px", color: "#9ca3af", margin: "0 0 1px", fontWeight: 500 }}>Service fee</p>
            <span className="outfit" style={{ fontSize: "26px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px" }}>{formatPrice(displayPrice)}</span>
            {isLargeUnit && (
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>
                {formatPrice(basePrice)} <span style={{ color: "#d97706", fontWeight: 700 }}>+ ₱200 large unit</span>
              </p>
            )}
          </div>
          <a onClick={() => onBook({
            name: isSplit ? `${s.name} — ${cleaningType === "normal" ? "Normal Cleaning" : "Deep Cleaning"}` : s.name,
            price: formatPrice(displayPrice),
          })} className="book-btn" style={{ cursor: "pointer" }}>
            <Phone size={14} /> Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Repair / Other AC Card ────────────────────────────────────────────────────
function RepairCard({ service: s, index: i, onBook }: { service: Service; index: number; onBook: (s: { name: string; price: string }) => void }) {
  const accentColors: Record<string, { bg: string; border: string; check: string; badge: string; label: string; labelColor: string }> = {
    Repair:      { bg: "rgba(59,130,246,0.06)",  border: "rgba(59,130,246,0.18)",  check: "#2563eb", badge: "#16a34a", label: "Repair Service",    labelColor: "#2563eb" },
    Recharge:    { bg: "rgba(34,197,94,0.05)",   border: "rgba(34,197,94,0.15)",   check: "#16a34a", badge: "#16a34a", label: "Recharge Service",  labelColor: "#16a34a" },
    Relocation:  { bg: "rgba(217,119,6,0.05)",   border: "rgba(217,119,6,0.15)",   check: "#d97706", badge: "#d97706", label: "Relocation Service",labelColor: "#b45309" },
    Dismantle:   { bg: "rgba(239,68,68,0.05)",   border: "rgba(239,68,68,0.12)",   check: "#ef4444", badge: "#6b7280", label: "Dismantle Service", labelColor: "#ef4444" },
  };
  const ac = accentColors[s.type] ?? accentColors.Repair;
  return (
    <div className="service-card repair-card" style={{ animationDelay: `${i * 0.08}s` }}>
      {/* Image area */}
      <div style={{ padding: "32px 24px 20px", background: `linear-gradient(145deg,${ac.bg.replace('0.06','0.12')} 0%,#f8f7f4 60%,${ac.bg} 100%)`, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "130px", height: "130px", borderRadius: "50%", background: ac.bg, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10px", left: "-10px", width: "90px", height: "90px", borderRadius: "50%", background: "rgba(217,119,6,0.04)", pointerEvents: "none" }} />
        {s.badge && (
          <span style={{ position: "absolute", top: "14px", left: "14px", padding: "3px 10px", borderRadius: "7px", fontSize: "10px", fontWeight: 700, background: ac.badge, color: "#fff" }}>
            {s.badge}
          </span>
        )}
        <ServiceIcon icon={s.icon} />
        <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "100px", background: ac.bg, border: `1px solid ${ac.border}` }}>
          <Wrench size={11} color={ac.labelColor} />
          <span style={{ fontSize: "11px", fontWeight: 700, color: ac.labelColor }}>{ac.label}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", margin: 0 }}>{s.type}</p>
          <LocationBadge location={s.location} />
        </div>
        <h3 className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", margin: "4px 0 10px", letterSpacing: "-0.3px" }}>{s.name}</h3>
        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6, marginBottom: "16px" }}>{s.description}</p>

        {/* Unit types */}
        {s.unitTypes && (
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Unit Types Covered</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {s.unitTypes.map((unit) => (
                <span key={unit} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 600, color: "#374151", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)" }}>
                  <Thermometer size={10} color="#9ca3af" /> {unit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Includes */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a1a2e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>What's Included</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
            {s.includes.map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <span style={{ width: "16px", height: "16px", borderRadius: "5px", background: ac.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <Check size={9} color={ac.check} strokeWidth={3} />
                </span>
                <span style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", marginBottom: "16px" }}>
          <Clock size={13} color="#9ca3af" />
          <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>{s.duration}</span>
        </div>

        {/* Free diagnosis note */}
        <div style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", marginBottom: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <BadgeCheck size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: "1px" }} />
          <div>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#15803d", margin: "0 0 2px" }}>Free Diagnosis — No upfront cost</p>
            <p style={{ fontSize: "11px", color: "#6b7280", margin: 0, lineHeight: 1.5 }}>We assess the unit and give you a clear quote. You decide before any work starts.</p>
          </div>
        </div>

        <div style={{ display: "flex", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <a onClick={() => onBook({ name: s.name, price: "Free Diagnosis" })} className="book-btn" style={{ flex: 1, justifyContent: "center", cursor: "pointer" }}>
            <Phone size={14} /> Book now
          </a>
        </div>
      </div>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", textAlign: "left" as const }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e" }}>{question}</span>
        <ChevronRight size={16} color="#9ca3af" style={{ transition: "transform .2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: "12px" }} />
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [scrolled,      setScrolled]     = useState(false);
  const [user,          setUser]         = useState<{ email: string } | null>(null);
  const [userMenuOpen,  setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartCount,     setCartCount]    = useState(0);
  const [bookingService, setBookingService] = useState<{ name: string; price: string } | null>(null);
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

  const cleaningServices = SERVICES.filter((s) => s.type === "Cleaning");
  const repairServices   = SERVICES.filter((s) => s.type === "Repair");
  const otherACServices  = SERVICES.filter((s) => ["Recharge", "Relocation", "Dismantle"].includes(s.type));

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: "#1a1a2e" }}>
      {/* ── Booking Modal ── */}
      <BookingModal service={bookingService} onClose={() => setBookingService(null)} user={user} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .brand  { font-family:'Outfit',sans-serif; letter-spacing:-0.02em; }
        .outfit { font-family:'Outfit',sans-serif; }
        .glass  { background:rgba(248,247,244,0.92); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.07); }
        .nav-link { position:relative; }
        .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:#d97706; transition:width .25s; }
        .nav-link:hover::after { width:100%; }
        .service-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 24px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05); animation: fadeUp .5s ease both;
          transition: transform .25s, box-shadow .25s, border-color .25s;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(0,0,0,0.1); border-color: rgba(217,119,6,.2); }
        .repair-card:hover  { border-color: rgba(37,99,235,.2); }
        .book-btn {
          display: inline-flex; align-items: center; gap: 7px; padding: 12px 20px; border-radius: 12px;
          background: #d97706; color: #fff; font-size: 13px; font-weight: 700; text-decoration: none;
          cursor: pointer; transition: background .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(217,119,6,0.35); font-family: 'Plus Jakarta Sans',sans-serif; white-space: nowrap;
        }
        .book-btn:hover { background: #b45309; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(217,119,6,0.4); }
        .why-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 16px; padding: 24px;
          transition: border-color .2s, box-shadow .2s; animation: fadeUp .5s ease both;
        }
        .why-card:hover { border-color: rgba(217,119,6,.2); box-shadow: 0 8px 28px rgba(0,0,0,0.07); }
        .faq-item { background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 14px; overflow: hidden; transition: border-color .2s; }
        .faq-item:hover { border-color: rgba(217,119,6,.2); }
        .section-divider { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .section-divider::after { content:''; flex:1; height:1px; background:rgba(0,0,0,0.07); }
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
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, transition: "all .3s" }}>
        <div className={scrolled ? "glass" : ""} style={{ transition: "all .3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "1px solid transparent" }}>
          <div className="nav-bar" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "68px", gap: "16px" }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(217,119,6,0.3)" }}>
                <Triangle size={13} color="#fff" fill="#fff" />
              </span>
              <span className="brand" style={{ color: "#1a1a2e", fontSize: "20px", fontWeight: 800, whiteSpace: "nowrap" }}>EMEREN</span>
            </Link>

            {/* Nav links — desktop only */}
            <nav className="desktop-only" style={{ alignItems: "center", gap: "28px", justifyContent: "center" }}>
              {([["Shop", "/shop"], ["Services", "/services"], ["Contact Us", "/contact"], ["About Us", "/about"]] as [string, string][]).map(([label, href]) => (
                <Link key={label} href={href} className="nav-link"
                  style={{ color: label === "Services" ? "#d97706" : "#6b7280", fontSize: "14px", fontWeight: label === "Services" ? 600 : 500, textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#1a1a2e")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = label === "Services" ? "#d97706" : "#6b7280")}
                >{label}</Link>
              ))}
            </nav>

            {/* Auth + cart */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
              <Link href="/cart" style={{ position: "relative", width: "40px", height: "40px", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.1)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "all .2s", flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.4)"; e.currentTarget.style.background = "#fffbf2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.background = "#fff"; }}
              >
                <ShoppingCart size={17} color="#374151" />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: "-5px", right: "-5px", width: "17px", height: "17px", borderRadius: "50%", background: "#d97706", color: "#fff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div style={{ position: "relative" }} ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen((v) => !v)}
                    className="desktop-only"
                    style={{ alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "12px", border: "1.5px solid rgba(217,119,6,0.3)", background: "rgba(217,119,6,0.06)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", maxWidth: "200px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email.split("@")[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", padding: "8px", minWidth: "180px", zIndex: 100 }}>
                      <div style={{ padding: "8px 12px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)", marginBottom: "6px" }}>
                        <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Signed in as</p>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                      <Link href="/shop" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")} onClick={() => setUserMenuOpen(false)}>Browse Shop</Link>
                      <Link href="/my-units" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")} onClick={() => setUserMenuOpen(false)}><AirVent size={14} /> My Units</Link>
                      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", fontSize: "13px", fontWeight: 600, color: "#374151", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")} onClick={() => setUserMenuOpen(false)}><User size={14} /> My Profile</Link>
                      <button onClick={handleSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 12px", borderRadius: "9px", border: "none", background: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444", fontFamily: "'Plus Jakarta Sans',sans-serif" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")} onMouseLeave={(e) => (e.currentTarget.style.background = "none")}><LogOut size={14} /> Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" className="desktop-only"
                    style={{ alignItems: "center", padding: "8px 18px", fontSize: "13px", fontWeight: 600, textDecoration: "none", color: "#374151", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.12)", transition: "all .2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(217,119,6,.5)"; e.currentTarget.style.color = "#d97706"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#374151"; }}
                  >Sign In</Link>
                  <Link href="/auth/signup" className="desktop-only"
                    style={{ alignItems: "center", gap: "6px", padding: "9px 20px", fontSize: "13px", fontWeight: 700, textDecoration: "none", color: "#fff", borderRadius: "12px", background: "#d97706", boxShadow: "0 4px 14px rgba(217,119,6,0.35)", transition: "background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
                  >Get Started <ArrowRight size={13} /></Link>
                </>
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

      {/* ── Mobile Nav Drawer ── */}
      {mobileNavOpen && (
        <>
          <div className="mobile-nav-backdrop" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
          <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="mobile-nav-header">
              <Link href="/" onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Triangle size={12} color="#fff" fill="#fff" />
                </span>
                <span className="brand" style={{ color: "#1a1a2e", fontSize: "18px", fontWeight: 800 }}>EMEREN</span>
              </Link>
              <button onClick={() => setMobileNavOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent", cursor: "pointer" }} aria-label="Close menu">
                <X size={17} color="#374151" />
              </button>
            </div>

            {user && (
              <div style={{ margin: "12px 20px 4px", padding: "12px 14px", borderRadius: "12px", background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.15)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={16} color="#fff" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>Signed in as</p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a2e", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
              </div>
            )}

            <nav className="mobile-nav-links">
              {([
                { label: "Shop",     href: "/shop",     icon: <ShoppingCart size={16} color="#d97706" /> },
                { label: "Services", href: "/services", icon: <Wrench size={16} color="#d97706" /> },
                { label: "About Us",    href: "/about",    icon: <Shield size={16} color="#d97706" /> },
                { label: "Contact Us",  href: "/contact",  icon: <Phone size={16} color="#d97706" /> },
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
                    style={{ padding: "13px 20px", fontSize: "14px", fontWeight: 700, textDecoration: "none", color: "#fff", borderRadius: "12px", background: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", boxShadow: "0 4px 14px rgba(217,119,6,0.35)" }}>
                    Get Started <ArrowRight size={14} />
                  </Link>
                  <Link href="/auth/signin" onClick={() => setMobileNavOpen(false)}
                    style={{ padding: "12px 20px", fontSize: "14px", fontWeight: 600, textDecoration: "none", color: "#374151", borderRadius: "12px", border: "1.5px solid rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Sign In
                  </Link>
                </>
              ) : (
                <button onClick={() => { handleSignOut(); setMobileNavOpen(false); }}
                  style={{ width: "100%", padding: "13px 20px", fontSize: "14px", fontWeight: 600, border: "1.5px solid rgba(239,68,68,0.25)", color: "#ef4444", borderRadius: "12px", background: "rgba(239,68,68,0.04)", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <LogOut size={15} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Hero ── */}
      <div style={{ paddingTop: "100px", paddingBottom: "48px", paddingLeft: "24px", paddingRight: "24px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ animation: "fadeUp .4s ease both" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "10px", fontFamily: "'Outfit',sans-serif" }}>
            Maintenance, Cleaning & Repair
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
            <h1 className="outfit" style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 900, letterSpacing: "-2px", color: "#1a1a2e", lineHeight: 1.05, margin: 0 }}>
              Our <span style={{ color: "#d97706" }}>Services</span>
            </h1>
            <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", borderRadius: "14px", background: "#1a1a2e", color: "#fff", fontSize: "14px", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "background .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#d97706")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a2e")}
            >
              <Phone size={15} /> Book now
            </a>
          </div>
          <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "580px", lineHeight: 1.7, margin: 0 }}>
            Professional cleaning and repair for air conditioners, refrigerators, and freezers — servicing Baliuag and nearby areas in Bulacan.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginTop: "40px", animation: "fadeUp .4s ease .1s both" }}>
          {[
            { icon: <BadgeCheck size={18} color="#d97706" />,                       value: "500+",      label: "Jobs Completed" },
            { icon: <Star size={18} color="#d97706" fill="#d97706" />,              value: "4.9",       label: "Avg. Rating" },
            { icon: <MapPin size={18} color="#d97706" />,                           value: "Baliuag",   label: "Based in" },
            { icon: <CalendarCheck size={18} color="#d97706" />,                    value: "Same Day",  label: "Booking Available" },
          ].map(({ icon, value, label }) => (
            <div key={label} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p className="outfit" style={{ fontSize: "18px", fontWeight: 800, color: "#1a1a2e", margin: 0, letterSpacing: "-0.3px" }}>{value}</p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0, fontWeight: 500 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Cleaning services ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 48px" }}>
        <div className="section-divider">
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d97706", margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>AC Maintenance</p>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0 }}>Cleaning Services</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: "24px" }}>
          {cleaningServices.map((s, i) => <CleaningCard key={s.id} service={s} index={i} onBook={setBookingService} />)}
        </div>
      </div>

      {/* ── Repair services ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 48px" }}>
        <div className="section-divider">
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2563eb", margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>Troubleshooting & Fix</p>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0 }}>Repair Services</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: "24px" }}>
          {repairServices.map((s, i) => <RepairCard key={s.id} service={s} index={i} onBook={setBookingService} />)}
        </div>
      </div>

      {/* ── Other AC services ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 64px" }}>
        <div className="section-divider">
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d97706", margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>Recharge · Relocate · Dismantle</p>
            <h2 className="outfit" style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.5px", margin: 0 }}>Other AC Services</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: "24px" }}>
          {otherACServices.map((s, i) => <RepairCard key={s.id} service={s} index={i} onBook={setBookingService} />)}
        </div>
      </div>

      {/* ── Why us ── */}
      <div style={{ background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "64px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "8px", fontFamily: "'Outfit',sans-serif" }}>Why Emeren</p>
            <h2 className="outfit" style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-1px", margin: 0 }}>Service You Can Trust</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px" }}>
            {[
              { icon: <Wrench       size={20} color="#d97706" />, title: "Trained Technicians",  desc: "Experienced in AC, refrigerators, and freezers of all major brands." },
              { icon: <MapPin       size={20} color="#d97706" />, title: "On-Site or In-Store",  desc: "We come to you, or you can bring the unit to our shop in Baliuag." },
              { icon: <Shield       size={20} color="#d97706" />, title: "Quality Guaranteed",   desc: "Every job is tested before we leave or hand back your unit." },
              { icon: <BadgeCheck   size={20} color="#d97706" />, title: "Free Diagnosis",       desc: "For repairs, we inspect first and quote before touching anything." },
              { icon: <Wind         size={20} color="#d97706" />, title: "Better Performance",   desc: "A clean or repaired unit runs more efficiently and lasts longer." },
              { icon: <CalendarCheck size={20} color="#d97706" />, title: "Flexible Schedule",   desc: "Weekdays, weekends, same-day — we work around your schedule." },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} className="why-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  {icon}
                </div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>{title}</p>
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d97706", marginBottom: "8px", fontFamily: "'Outfit',sans-serif" }}>Common Questions</p>
          <h2 className="outfit" style={{ fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 900, color: "#1a1a2e", letterSpacing: "-0.8px", margin: 0 }}>FAQs</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            { q: "How often should I clean my AC?",               a: "Every 3–6 months for regular use. If your AC runs all day, every 3 months is ideal to maintain efficiency and prevent mold buildup." },
            { q: "Is the refrigerator diagnosis really free?",    a: "Yes, completely free. We inspect the unit and identify the issue first. We'll give you a transparent quote, and you decide whether to proceed before any repair work begins." },
            { q: "Can you come to my house for the repair?",      a: "Yes! For both AC cleaning and refrigeration repair, we offer on-site service. For refrigerators you can also bring the unit to our shop in Baliuag." },
            { q: "What brands of refrigerators do you repair?",   a: "We repair most major brands including Samsung, LG, Condura, Whirlpool, Sharp, Panasonic, and more. Message us with your brand and model if you're unsure." },
            { q: "How do I book a service?",                      a: "Just message us on Messenger or call our number. Tell us the service you need, your location, and your preferred schedule. We'll confirm right away." },
            { q: "Do you service areas outside Baliuag?",         a: "Yes, we cover nearby areas in Bulacan. Message us with your address and we'll confirm availability and any additional travel fee." },
          ].map(({ q, a }) => <FAQItem key={q} question={q} answer={a} />)}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div style={{ background: "#1a1a2e", padding: "56px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p className="outfit" style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.8px", marginBottom: "12px" }}>
            Ready to book a service?
          </p>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginBottom: "28px", lineHeight: 1.6 }}>
            Message us on Messenger — we'll confirm your schedule right away.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://m.me/emerenph" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", borderRadius: "14px", background: "#d97706", color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(217,119,6,0.4)", transition: "background .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b45309")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#d97706")}
            ><Phone size={16} /> Message Us on Messenger</a>
            <Link href="/shop"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", borderRadius: "14px", border: "1.5px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "15px", fontWeight: 700, textDecoration: "none", transition: "border-color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
            >Browse Products <ArrowRight size={15} /></Link>
          </div>
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
            {([["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact Us", "/contact"]] as [string, string][]).map(([label, href]) => (
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