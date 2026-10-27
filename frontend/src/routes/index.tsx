import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Mandala } from "@/components/Mandala";
import spaceBg from "@/assets/space-bg.jpg";
import nebulaBg from "@/assets/nebula-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KalaGanaka — कलागणक | Explore the Wisdom of Time" },
      { name: "description", content: "KalaGanaka (कलागणक): explore the wisdom of time — Panchang, Dharma and Jyotish." },
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

function Index() {
  const [phase, setPhase] = useState<Phase>("shloka");
  useEffect(() => {
    const ids = (Object.keys(T) as (keyof typeof T)[]).map((k) => setTimeout(() => setPhase(k), T[k]));
    return () => ids.forEach(clearTimeout);
  }, []);
  const at = (...p: Phase[]) => p.includes(phase);
  const skip = () => setPhase("site");

  return (
    <main className="relative h-svh w-full overflow-hidden bg-background text-gold" onClick={phase !== "site" ? skip : undefined}>
      <div className="stars absolute inset-0" />

      {/* Scene 1 */}
      <section className={`scene absolute inset-0 flex flex-col items-center justify-center text-center ${at("shloka") ? "is-on" : ""}`}>
        <p className="shloka font-deva text-3xl leading-snug sm:text-5xl">
          <span className="line text-gold drop-shadow-gold" style={{ animationDelay: "0.2s" }}>असतो मा सद्गमय।</span>
          <span className="line text-gold drop-shadow-gold" style={{ animationDelay: "0.6s" }}>तमसो मा ज्योतिर्गमय।</span>
          <span className="line text-gold drop-shadow-gold" style={{ animationDelay: "1s" }}>मृत्योर्मा अमृतं गमय॥</span>
        </p>
        <Divider className="mt-4 w-56 line" style={{ animationDelay: "1.3s" }} />
        <p className="line mt-3 font-serif text-sm text-gold-soft sm:text-base" style={{ animationDelay: "1.5s" }}>
          Lead me from darkness to light
        </p>
      </section>

      {/* Scene 2: spark + mandala */}
      {at("spark") && <div className="spark-trail absolute" />}
      <div className={`nebula absolute inset-0 bg-cover bg-center ${at("nebula") ? "is-on" : ""}`} style={{ backgroundImage: `url(${nebulaBg})` }} />
      <div className={`mandala-wrap absolute left-1/2 top-1/2 ${at("mandala", "flash", "nebula") ? "is-on" : ""} ${at("mandala") ? "drawing" : "drawn"} ${at("nebula") ? "small" : ""} ${at("site") ? "behind" : ""}`}>
        <Mandala />
        {at("mandala") && <div className="orbit-light" />}
      </div>
      {at("flash") && <div className="flash absolute inset-0" />}

      {/* Scene 4: site */}
      <div className={`site absolute inset-0 ${at("site") ? "is-on" : ""}`}>
        <img src={spaceBg} alt="" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="site-mandala absolute left-1/2 top-[45%]"><Mandala className="drawn" /></div>

        <header className="nav relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-deva text-2xl text-gold-gradient sm:text-3xl">कलागणक</span>
          <nav className="hidden items-center gap-3 font-sans text-sm tracking-wider text-gold-soft md:flex">
            {["PANCHANG", "DHARMA", "JYOTISH", "EXPLORE"].map((n, i) => (
              <span key={n} className="flex items-center gap-3">
                {i > 0 && <span className="opacity-70">|</span>}
                <a href="#" className="hover:text-gold">{n}</a>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-gold-soft">
            <Search className="h-5 w-5" />
            <span className="relative"><Bell className="h-5 w-5" /><span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" /></span>
            <button aria-label="Menu" className="grid h-8 w-8 place-items-center rounded-full bg-gold-gradient text-background"><Menu className="h-4 w-4" /></button>
          </div>
        </header>

        <div className="relative z-10 flex h-[calc(100%-72px)] flex-col items-center justify-center pb-16 text-center">
          <h1 className="rise font-deva text-6xl leading-none text-gold-gradient drop-shadow-gold sm:text-8xl md:text-9xl" style={{ animationDelay: ".2s" }}>कलागणक</h1>
          <Divider className="rise mt-3 w-64 sm:w-80" style={{ animationDelay: ".5s" }} />
          <p className="rise mt-3 font-serif text-2xl text-gold-soft sm:text-3xl" style={{ animationDelay: ".7s" }}>Explore the Wisdom of Time</p>
          <a href="#" className="rise cta mt-16 rounded-full px-7 py-3 font-sans text-base font-semibold" style={{ animationDelay: "1.1s" }}>Begin the Journey</a>
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
      <path d="M120 1 L125 6 L120 11 L115 6Z M108 6 a4 4 0 1 0 0.01 0 M132 6 a4 4 0 1 0 0.01 0" fill="none" stroke="currentColor" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="absolute bottom-[12%] right-[8%] z-20 h-8 w-8 text-gold-soft opacity-50" aria-hidden>
      <path d="M12 0 C13 9 15 11 24 12 C15 13 13 15 12 24 C11 15 9 13 0 12 C9 11 11 9 12 0Z" fill="currentColor" />
    </svg>
  );
}
