import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  Compass,
  Moon,
  Sun,
  Globe2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Mandala } from "@/components/Mandala";
import spaceBg from "@/assets/space-bg.jpg";
import nebulaBg from "@/assets/nebula-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KalaGanaka — कलागणक | Explore the Wisdom of Time" },
      {
        name: "description",
        content: "KalaGanaka (कलागणक): explore the wisdom of time — Panchang, Dharma and Jyotish.",
      },
      { property: "og:title", content: "KalaGanaka — कलागणक" },
      { property: "og:description", content: "Explore the Wisdom of Time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Timeline (ms) mirrors the reference: shloka → spark → mandala → flash → nebula → site
const T = { spark: 2300, mandala: 3400, flash: 5300, nebula: 6200, site: 7600 };
type Phase = "shloka" | "spark" | "mandala" | "flash" | "nebula" | "site";

const ALL_MODULES = [
  {
    to: "/timekeeping",
    title: "प्राचीन एवं आधुनिक काल-गणना",
    enTitle: "Ancient vs Modern Timekeeping",
    desc: "Interactive Konark Sun Temple Chakra & modern celestial coordinates",
    icon: Sun,
  },
  {
    to: "/chandra-panchang",
    title: "चन्द्र पञ्चाङ्ग",
    enTitle: "Chandra Panchang",
    desc: "Tithi, Nakshatra, Yoga, Karana & transitions",
    icon: Moon,
  },
  {
    to: "/saur-panchang",
    title: "सौर पञ्चाङ्ग",
    enTitle: "Saur Panchang",
    desc: "Solar calendar, Sankranti & Sayana/Nirayana solar ingress",
    icon: Sun,
  },
  {
    to: "/planetary-explorer",
    title: "ग्रह मण्डल वेधशाला",
    enTitle: "Planetary Explorer",
    desc: "7 classical Grahas, time-travel & Surya Siddhanta comparison",
    icon: Globe2,
  },
  {
    to: "/festivals",
    title: "पर्व एवं उत्सव",
    enTitle: "Festival Calendar",
    desc: "Interactive festival dates, astronomical tithi rules & regions",
    icon: Calendar,
  },
  {
    to: "/assistant",
    title: "काल-संवाद सहायक",
    enTitle: "AI Astronomy Assistant",
    desc: "Bilingual AI assistant for Indian astronomical queries",
    icon: Sparkles,
  },
];

function Index() {
  const [phase, setPhase] = useState<Phase>("shloka");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ids = (Object.keys(T) as (keyof typeof T)[]).map((k) =>
      setTimeout(() => setPhase(k), T[k]),
    );
    return () => ids.forEach(clearTimeout);
  }, []);
  const at = (...p: Phase[]) => p.includes(phase);
  const skip = () => setPhase("site");

  const NAV_ITEMS = [
    { label: "TIMEKEEPING", to: "/timekeeping" },
    { label: "LUNAR", to: "/chandra-panchang" },
    { label: "SOLAR", to: "/saur-panchang" },
    { label: "PLANETS", to: "/planetary-explorer" },
    { label: "FESTIVALS", to: "/festivals" },
    { label: "ASSISTANT", to: "/assistant" },
  ];

  return (
    <main
      className="relative h-svh w-full overflow-hidden bg-background text-gold"
      onClick={phase !== "site" ? skip : undefined}
    >
      <div className="stars absolute inset-0" />

      {/* Scene 1 */}
      <section
        className={`scene absolute inset-0 flex flex-col items-center justify-center text-center ${at("shloka") ? "is-on" : ""}`}
      >
        <p className="shloka font-deva text-3xl leading-snug sm:text-5xl">
          <span className="line text-gold drop-shadow-gold" style={{ animationDelay: "0.2s" }}>
            असतो मा सद्गमय।
          </span>
          <span className="line text-gold drop-shadow-gold" style={{ animationDelay: "0.6s" }}>
            तमसो मा ज्योतिर्गमय।
          </span>
          <span className="line text-gold drop-shadow-gold" style={{ animationDelay: "1s" }}>
            मृत्योर्मा अमृतं गमय॥
          </span>
        </p>
        <Divider className="mt-4 w-56 line" style={{ animationDelay: "1.3s" }} />
        <p
          className="line mt-3 font-serif text-sm text-gold-soft sm:text-base"
          style={{ animationDelay: "1.5s" }}
        >
          Lead me from darkness to light
        </p>
      </section>

      {/* Scene 2: spark + mandala */}
      {at("spark") && <div className="spark-trail absolute" />}
      <div
        className={`nebula absolute inset-0 bg-cover bg-center ${at("nebula") ? "is-on" : ""}`}
        style={{ backgroundImage: `url(${nebulaBg})` }}
      />
      <div
        className={`mandala-wrap absolute left-1/2 top-1/2 ${at("mandala", "flash", "nebula") ? "is-on" : ""} ${at("mandala") ? "drawing" : "drawn"} ${at("nebula") ? "small" : ""} ${at("site") ? "behind" : ""}`}
      >
        <Mandala />
        {at("mandala") && <div className="orbit-light" />}
      </div>
      {at("flash") && <div className="flash absolute inset-0" />}

      {/* Scene 4: site */}
      <div className={`site absolute inset-0 ${at("site") ? "is-on" : ""}`}>
        <img
          src={spaceBg}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="site-mandala absolute left-1/2 top-[45%]">
          <Mandala className="drawn" />
        </div>

        <header className="nav relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-deva text-2xl text-gold-gradient sm:text-3xl">कलागणक</span>
          <nav className="hidden items-center gap-3 font-sans text-sm tracking-wider text-gold-soft md:flex">
            {NAV_ITEMS.map((item, i) => (
              <span key={item.label} className="flex items-center gap-3">
                {i > 0 && <span className="opacity-70">|</span>}
                <Link to={item.to} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-gold-soft">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden lg:flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 font-sans text-xs text-gold-light hover:bg-gold/20 transition-all"
            >
              <Compass className="h-3.5 w-3.5 text-gold" />
              <span>All 6 Features</span>
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-slate-950 font-bold hover:opacity-90 transition-opacity shadow-md"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Feature Drawer / Modal Overlay */}
        {menuOpen && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-4xl rounded-2xl border border-gold/30 bg-background/95 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                <div>
                  <h3 className="font-deva text-2xl text-gold-gradient">कलागणक खगोलीय विभाग</h3>
                  <p className="font-sans text-xs text-muted-foreground">
                    Select an astronomical module to begin exploration
                  </p>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-gold/20 p-2 text-gold hover:bg-gold/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ALL_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.to}
                      to={mod.to}
                      onClick={() => setMenuOpen(false)}
                      className="group flex flex-col gap-2 rounded-xl border border-gold/20 bg-gold/5 p-4 transition-all hover:border-gold/50 hover:bg-gold/15 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-gold">
                        <Icon className="h-5 w-5 text-gold group-hover:scale-110 transition-transform" />
                        <span className="font-deva text-base font-semibold text-gold-light">
                          {mod.title}
                        </span>
                      </div>
                      <span className="font-sans text-xs font-medium text-gold-soft">
                        {mod.enTitle}
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {mod.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 flex h-[calc(100%-72px)] flex-col items-center justify-center pb-16 text-center">
          <h1
            className="rise font-deva text-6xl leading-none text-gold-gradient drop-shadow-gold sm:text-8xl md:text-9xl"
            style={{ animationDelay: ".2s" }}
          >
            कलागणक
          </h1>
          <Divider className="rise mt-3 w-64 sm:w-80" style={{ animationDelay: ".5s" }} />
          <p
            className="rise mt-3 font-serif text-2xl text-gold-soft sm:text-3xl"
            style={{ animationDelay: ".7s" }}
          >
            Explore the Wisdom of Time
          </p>
          <div
            className="rise mt-12 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "1.1s" }}
          >
            <Link
              to="/timekeeping"
              className="cta rounded-full px-7 py-3 font-sans text-base font-semibold"
            >
              Begin the Journey
            </Link>
            <Link
              to="/chandra-panchang"
              className="rounded-full border border-gold/40 bg-gold/10 px-6 py-3 font-sans text-base font-medium text-gold hover:bg-gold/20 transition-all backdrop-blur-sm"
            >
              Chandra Panchang
            </Link>
          </div>
        </div>
      </div>

      <Sparkle />
    </main>
  );
}

function Divider({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 240 12" className={`text-gold ${className}`} style={style} aria-hidden>
      <line x1="0" y1="6" x2="104" y2="6" stroke="currentColor" strokeWidth=".8" />
      <line x1="136" y1="6" x2="240" y2="6" stroke="currentColor" strokeWidth=".8" />
      <path
        d="M120 1 L125 6 L120 11 L115 6Z M108 6 a4 4 0 1 0 0.01 0 M132 6 a4 4 0 1 0 0.01 0"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute bottom-[12%] right-[8%] z-20 h-8 w-8 text-gold-soft opacity-50"
      aria-hidden
    >
      <path
        d="M12 0 C13 9 15 11 24 12 C15 13 13 15 12 24 C11 15 9 13 0 12 C9 11 11 9 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
