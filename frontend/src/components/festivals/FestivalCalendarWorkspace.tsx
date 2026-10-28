import React, { useState, useEffect } from "react";
import {
  fetchFestivals,
  checkBackendHealth,
  type FestivalRule,
  AstronomyApiError,
} from "@/services/astronomy-api";
import { FestivalDetailModal } from "./FestivalDetailModal";
import {
  Calendar,
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Info,
  MapPin,
  ChevronRight,
} from "lucide-react";

// Curated supplementary major Indian festivals to enrich knowledge base display
const SUPPLEMENTARY_FESTIVALS: FestivalRule[] = [
  {
    id: "makara-sankranti",
    name: "Makara Sankranti / Pongal",
    names: { english: "Makara Sankranti", hindi: "मकर सङ्क्रान्ति / पोंगल" },
    rule_type: "solar_transit",
    rule: {
      solar_month: "Makara",
      notes: "Astronomical solar transit into sidereal Capricorn (Makara Rashi at 270°).",
    },
    region: "Pan-India",
    notes:
      "Celebrated across India as Uttarayana, Pongal (Tamil Nadu), Maghi (Punjab), and Uttarayan (Gujarat).",
    verification_status: "verified_astronomical",
  },
  {
    id: "maha-shivaratri",
    name: "Maha Shivaratri",
    names: { english: "Maha Shivaratri", hindi: "महाशिवरात्रि" },
    rule_type: "lunar_tithi",
    rule: {
      lunar_month: "Phalguna / Magha",
      paksha: "krishna",
      tithi: "Chaturdashi",
    },
    region: "Pan-India",
    notes: "Requires Chaturdashi tithi prevailing during Nishita Kala (astronomical midnight).",
    verification_status: "verified_panchang_rule",
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    names: { english: "Ganesh Chaturthi", hindi: "गणेश चतुर्थी" },
    rule_type: "lunar_tithi",
    rule: {
      lunar_month: "Bhadrapada",
      paksha: "shukla",
      tithi: "Chaturthi",
    },
    region: "Pan-India",
    notes: "Requires Chaturthi tithi prevailing during Madhyanha Kala (solar midday).",
    verification_status: "verified_panchang_rule",
  },
  {
    id: "navaratri-dussehra",
    name: "Sharad Navaratri & Vijayadashami",
    names: { english: "Navaratri & Dussehra", hindi: "शारदीय नवरात्रि एवं विजयादशमी" },
    rule_type: "lunar_tithi",
    rule: {
      lunar_month: "Ashwina",
      paksha: "shukla",
      tithi: "Pratipada to Dashami",
    },
    region: "Pan-India",
    notes:
      "Nine nights of Goddess Durga culminating on Vijayadashami (Dashami tithi with Aparahna kala).",
    verification_status: "verified_panchang_rule",
  },
];

export function FestivalCalendarWorkspace() {
  const [festivalsList, setFestivalsList] = useState<FestivalRule[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFestival, setSelectedFestival] = useState<FestivalRule | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  const loadFestivals = async () => {
    setIsLoading(true);
    setBackendError(null);

    try {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);

      const res = await fetchFestivals(selectedRegion === "all" ? undefined : selectedRegion);

      // Merge backend dataset with supplementary verified festivals, deduplicating by ID
      const existingIds = new Set(res.festivals.map((f) => f.id));
      const merged = [
        ...res.festivals,
        ...SUPPLEMENTARY_FESTIVALS.filter((sf) => !existingIds.has(sf.id)),
      ];

      setFestivalsList(merged);
    } catch (err) {
      console.warn("Backend fetch festival notice:", err);
      // Still show supplementary festivals as local fallback if offline
      setFestivalsList(SUPPLEMENTARY_FESTIVALS);
      setIsBackendOnline(false);
      setBackendError(err instanceof Error ? err.message : "Error connecting to festivals backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, [selectedRegion]);

  const filteredFestivals = festivalsList.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      f.names?.hindi?.toLowerCase().includes(q) ||
      f.rule.lunar_month?.toLowerCase().includes(q) ||
      f.rule.tithi?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 self-center sm:self-start rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-medium text-gold-soft">
          <Calendar className="h-3.5 w-3.5 text-gold" />
          <span>Feature 5 • भारतीय पर्व एवं पञ्चाङ्ग प्रज्ञा (Festival Intelligence)</span>
        </div>
        <h1 className="font-deva text-4xl text-gold-gradient drop-shadow-gold sm:text-5xl lg:text-6xl">
          पर्व एवं उत्सव
        </h1>
        <h2 className="font-serif text-xl text-gold-soft sm:text-2xl">
          Festival Calendar & Panchang Intelligence
        </h2>
        <p className="max-w-3xl font-sans text-sm text-muted-foreground leading-relaxed">
          Explore traditional Indian festivals with strict astronomical explanations of their Tithi,
          Paksha, and solar transit rules. Distinguish between Pan-Indian rules and regional
          conventions (Amanta vs Purnimanta) grounded in the Dharmashastras and modern ephemeris.
        </p>
      </div>

      {/* Backend Status Alert */}
      {isBackendOnline === false && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div>
            <strong className="font-semibold text-amber-300">Backend API Notice:</strong>{" "}
            {backendError || "Offline"}
            <p className="mt-1 text-muted-foreground">
              Displaying verified festival rule intelligence from client knowledge cache.
            </p>
          </div>
        </div>
      )}

      {isBackendOnline === true && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>KalaGanaka Festival Engine Online • Curated Panchang Rule Knowledge Base</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-400">127.0.0.1:8000</span>
        </div>
      )}

      {/* Search & Region Filter Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-gold/25 bg-background/80 p-4 shadow-xl backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-soft" />
          <input
            type="text"
            placeholder="Search festival, Tithi, or month..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gold/25 bg-background/70 pl-9 pr-3 py-2 text-xs text-gold-light placeholder:text-muted-foreground focus:border-gold focus:outline-none"
          />
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gold shrink-0" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="rounded-lg border border-gold/25 bg-background/70 px-3 py-2 text-xs text-gold-light focus:border-gold focus:outline-none"
          >
            <option value="all" className="bg-background text-foreground">
              All Regions (सम्पूर्ण भारत)
            </option>
            <option value="India" className="bg-background text-foreground">
              Pan-India
            </option>
            <option value="North India" className="bg-background text-foreground">
              North India (पूर्णिमान्त)
            </option>
            <option value="South India" className="bg-background text-foreground">
              South India (अमान्त)
            </option>
          </select>

          <button
            type="button"
            onClick={loadFestivals}
            disabled={isLoading}
            className="rounded-lg border border-gold/20 bg-gold/10 p-2 text-gold hover:bg-gold/20"
            title="Refresh Festival Rules"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      {/* Festival Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredFestivals.map((fest) => (
          <div
            key={fest.id}
            onClick={() => setSelectedFestival(fest)}
            className="group flex flex-col justify-between rounded-xl border border-gold/20 bg-background/80 p-5 shadow-lg backdrop-blur-md transition-all hover:border-gold/50 hover:bg-gold/10 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
                <span className="flex items-center gap-1 font-deva text-gold">
                  <Sparkles className="h-3.5 w-3.5 text-gold group-hover:scale-110 transition-transform" />
                  {fest.names?.hindi || fest.name}
                </span>
                <span className="font-mono text-[10px] text-gold-soft capitalize">
                  {fest.region || "Pan-India"}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-deva text-xl font-bold text-gold-light group-hover:text-gold transition-colors">
                  {fest.name}
                </h4>
                <p className="mt-1 text-xs text-gold-soft font-mono">
                  {fest.rule.lunar_month || fest.rule.solar_month || "Solar Transit"} •{" "}
                  {fest.rule.paksha ? `${fest.rule.paksha} Paksha` : ""} {fest.rule.tithi || ""}
                </p>
              </div>

              {fest.notes && (
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {fest.notes}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gold/10 pt-3 text-[11px] text-gold-soft">
              <span>View Astronomical Rule</span>
              <ChevronRight className="h-4 w-4 text-gold group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail View */}
      <FestivalDetailModal festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
    </div>
  );
}
