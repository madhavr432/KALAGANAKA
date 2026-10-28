/**
 * EducationalPanel.tsx
 * Plain-language educational explanation of:
 * 1. The Konark Sun Temple Chakra (history, geometry, cosmic chariot of Surya)
 * 2. Sunlight, Gnomon, and Shadows (how sundials work)
 * 3. Modern Sun-Position Calculations (orbital mechanics, ephemeris)
 * 4. Civil Time vs Solar Time (why clock time ≠ sundial time)
 * 5. Archaeological & Geometric Validation (Fact vs Popular Myth)
 */

import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Compass,
  Sun,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function EducationalPanel() {
  const [expandedCard, setExpandedCard] = useState<string | null>("konark");

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full space-y-6 rounded-2xl border border-gold/25 bg-background/80 p-6 shadow-2xl backdrop-blur-md">
      {/* Section Header */}
      <div className="border-b border-gold/15 pb-4 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
          <BookOpen className="h-4 w-4" />
          <span>ऐतिहासिक एवं वैज्ञानिक व्याख्या (Educational Curriculum)</span>
        </div>
        <h2 className="mt-1 font-deva text-2xl text-gold-gradient sm:text-3xl">
          The Science of Sun, Stone, and Time
        </h2>
        <p className="mt-2 font-serif text-sm text-gold-soft/80 sm:text-base leading-relaxed">
          Discover how ancient temple architects and modern astrophysicists decode the movement of
          the cosmos.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: What is the Konark Chakra? */}
        <div className="rounded-xl border border-gold/20 bg-background/50 p-4 transition-all hover:border-gold/40">
          <button
            onClick={() => toggleCard("konark")}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-gold/10 p-2 text-gold">
                <Sun className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-deva text-base text-gold font-semibold">
                  १. कोणार्क सूर्य मन्दिर चक्र (The Konark Chakra)
                </h3>
                <span className="font-sans text-[11px] text-muted-foreground">
                  Cosmic Chariot Wheels of Surya Deula (13th Century CE)
                </span>
              </div>
            </div>
            {expandedCard === "konark" ? (
              <ChevronUp className="h-4 w-4 text-gold-soft" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gold-soft" />
            )}
          </button>

          {expandedCard === "konark" && (
            <div className="mt-3.5 space-y-2 border-t border-gold/10 pt-3 font-sans text-xs text-muted-foreground leading-relaxed">
              <p>
                Built around 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty at Konark,
                Odisha, the Sun Temple was conceived as a monumental celestial chariot for the Sun
                god Surya, drawn by 7 horses representing the days of the week.
              </p>
              <p>
                Carved into the temple plinth are{" "}
                <strong className="text-foreground">24 colossal stone wheels</strong>, each ~3
                meters in diameter. Together they symbolize the 24 fortnights (Pakshas) of the Hindu
                lunisolar year. Each wheel features 8 major spokes representing the 8 Praharas and 8
                minor spokes dividing them into half-Praharas.
              </p>
            </div>
          )}
        </div>

        {/* Card 2: How Sundials Work (Shadow & Gnomon) */}
        <div className="rounded-xl border border-gold/20 bg-background/50 p-4 transition-all hover:border-gold/40">
          <button
            onClick={() => toggleCard("shadow")}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-gold/10 p-2 text-gold">
                <Compass className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-deva text-base text-gold font-semibold">
                  २. धूप एवं छाया द्वारा समय मापन (Gnomon & Shadows)
                </h3>
                <span className="font-sans text-[11px] text-muted-foreground">
                  The Physics of Shadow Direction and Solar Altitude
                </span>
              </div>
            </div>
            {expandedCard === "shadow" ? (
              <ChevronUp className="h-4 w-4 text-gold-soft" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gold-soft" />
            )}
          </button>

          {expandedCard === "shadow" && (
            <div className="mt-3.5 space-y-2 border-t border-gold/10 pt-3 font-sans text-xs text-muted-foreground leading-relaxed">
              <p>
                A sundial functions by casting the shadow of a fixed rod or axle (the{" "}
                <strong className="text-foreground">gnomon</strong>) onto a graduated surface. As
                the Sun ascends in the east, reaches its highest point at solar noon, and sets in
                the west, the shadow moves in the opposite direction.
              </p>
              <p>
                On a vertical wheel facing South or East, the angle and length of the axle shadow
                vary with both the Sun's diurnal hour angle and its seasonal declination (Uttarayana
                and Dakshinayana).
              </p>
            </div>
          )}
        </div>

        {/* Card 3: Modern Astronomical Calculations */}
        <div className="rounded-xl border border-gold/20 bg-background/50 p-4 transition-all hover:border-gold/40">
          <button
            onClick={() => toggleCard("modern")}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-gold/10 p-2 text-gold">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-deva text-base text-gold font-semibold">
                  ३. आधुनिक खगोलीय गणना (Modern Celestial Mechanics)
                </h3>
                <span className="font-sans text-[11px] text-muted-foreground">
                  Ephemeris, Atmospheric Refraction, and Topocentric Coordinates
                </span>
              </div>
            </div>
            {expandedCard === "modern" ? (
              <ChevronUp className="h-4 w-4 text-gold-soft" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gold-soft" />
            )}
          </button>

          {expandedCard === "modern" && (
            <div className="mt-3.5 space-y-2 border-t border-gold/10 pt-3 font-sans text-xs text-muted-foreground leading-relaxed">
              <p>
                Modern calculations rely on high-precision numerical ephemerides such as{" "}
                <strong className="text-foreground">NASA JPL DE421</strong>. The position of the Sun
                is calculated by integrating gravitational perturbations from all planets,
                relativistic light deflection, stellar aberration, and Earth's precession-nutation.
              </p>
              <p>
                When rays enter Earth's atmosphere, they bend downwards. Modern models apply
                standard Sæmundsson refraction, ensuring that the apparent sunrise is observed
                approximately 2 to 3 minutes before the geometric center of the Sun crosses the
                horizon.
              </p>
            </div>
          )}
        </div>

        {/* Card 4: Historical Fact vs Popular Myth */}
        <div className="rounded-xl border border-gold/20 bg-background/50 p-4 transition-all hover:border-gold/40">
          <button
            onClick={() => toggleCard("validation")}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-gold/10 p-2 text-gold">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-deva text-base text-gold font-semibold">
                  ४. ऐतिहासिक प्रामाणिकता (Fact vs Popular Myth)
                </h3>
                <span className="font-sans text-[11px] text-muted-foreground">
                  Archaeological Evidence and Responsible Interpretation
                </span>
              </div>
            </div>
            {expandedCard === "validation" ? (
              <ChevronUp className="h-4 w-4 text-gold-soft" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gold-soft" />
            )}
          </button>

          {expandedCard === "validation" && (
            <div className="mt-3.5 space-y-2 border-t border-gold/10 pt-3 font-sans text-xs text-muted-foreground leading-relaxed">
              <p>
                Popular internet tour guides often claim that every single spoke and bead of every
                Konark wheel can tell the exact minute of civil Indian Standard Time. Historically
                and scientifically, this claim must be viewed with scholarly nuance:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong className="text-foreground">Indian Standard Time (IST)</strong> was
                  established in 1905 (referenced to 82.5° E longitude), whereas Konark is at 86.09°
                  E (~14.4 minutes ahead).
                </li>
                <li>
                  A vertical sundial produces non-linear shadow angle rates unless calibrated for
                  seasonal declination.
                </li>
                <li>
                  The wheels primarily served as supreme architectural and sacred astronomical
                  allegories of the Kala Chakra (wheel of time) and Surya's cosmic chariot.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
