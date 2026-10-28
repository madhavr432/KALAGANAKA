import React from "react";
import { Landmark, Compass, Clock, Sparkles } from "lucide-react";

export function SamratYantraEducational() {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-gold/15 pb-3">
        <Landmark className="h-5 w-5 text-gold" />
        <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
          इतिहास एवं यन्त्र-विज्ञान (History & Architectural Astronomy)
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card 1: What is the Samrat Yantra? */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Compass className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              सम्राट यन्त्र का स्वरूप (The Supreme Instrument)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The <strong>Samrat Yantra</strong> (सम्राट यन्त्र, &ldquo;Supreme Instrument&rdquo;) is
            an equinoctial sundial of monumental proportions conceived and constructed in the early
            18th century by <strong>Maharaja Sawai Jai Singh II</strong> across the Jantar Mantar
            observatories of Delhi, Jaipur, Ujjain, Varanasi, and Mathura.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlike small brass astrolabes whose graduated divisions were limited by handcrafting
            tolerances, Jai Singh scaled his stone instruments to colossal sizes—reaching 27 meters
            in height in Jaipur (the <em>Vrihat Samrat Yantra</em>)—enabling observers to measure
            time to an accuracy of <strong>two seconds</strong>.
          </p>
        </div>

        {/* Card 2: Principles of Gnomon and Equinoctial Quadrants */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Clock className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              शंकु एवं वृत्तांश का सिद्धान्त (Gnomon & Equinoctial Geometry)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The central triangular wall (<em>Phalak</em> or gnomon) is strictly aligned with the
            local North-South meridian. Its sloping hypotenuse is angled precisely to match the{" "}
            <strong>latitude ($\phi$)</strong> of the observatory, causing the gnomon edge to point
            straight towards the <strong>North Celestial Pole</strong> (the North Star / Dhruva).
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Extending east and west are two curved cylindrical quadrants (<em>Kapala</em>) whose
            surfaces lie exactly parallel to <strong>Earth&rsquo;s celestial equator</strong>.
            Because the Sun appears to rotate uniformly around the polar axis at 15° per hour, the
            shadow moves along the quadrant arc at a constant angular rate of{" "}
            <strong>1° every 4 minutes (6° per Ghati)</strong>.
          </p>
        </div>

        {/* Card 3: Traditional Timekeeping & Solar Observation */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              काल-गणना एवं खगोलीय वेध (Timekeeping & Solar Observation)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The quadrant scales are inscribed with dual time standards: European hours, minutes, and
            seconds alongside traditional Indian units:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>घटी (Ghati):</strong> 1/60th of a solar day = 24 minutes (6° arc).
            </li>
            <li>
              <strong>पल / विघटी (Pala / Vighati):</strong> 1/60th of a ghati = 24 seconds (0.1°
              arc).
            </li>
            <li>
              <strong>विपल (Vipala):</strong> 1/60th of a pala = 0.4 seconds.
            </li>
          </ul>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The instrument directly reads <strong>Local Apparent Time (LAT)</strong>. Converting
            this to standard clock time (IST) requires adding the Equation of Time (EoT) and the
            longitude correction for the 82.5° E Indian Standard Meridian.
          </p>
        </div>

        {/* Card 4: Historical Observation vs Mathematical Model */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Landmark className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              प्रत्यक्ष वेध बनाम आधुनिक संगणना (Observation vs Simulation)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            It is essential to distinguish between physical stone observation and computer models:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>Historical Observation:</strong> Physical observers observed the shadow cast
              by the solar penumbra onto calibrated white marble scales under clear sunlight.
            </li>
            <li>
              <strong>Simulator Model:</strong> Uses real topocentric apparent solar altitude and
              azimuth from the Python Skyfield engine (backed by NASA/JPL DE421 ephemeris) to
              project the geometric shadow vector.
            </li>
            <li>
              <strong>Seasonal Solstice Indication:</strong> The position where the shadow falls
              along the gnomon edge also traces the solar declination $\delta$ between summer
              (Uttarayana) and winter (Dakshinayana).
            </li>
          </ul>
        </div>

        {/* Card 5: Historical Distinction - Samrat Yantra vs Konark Sun Temple Wheels */}
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 text-gold">
            <Compass className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              ऐतिहासिक विभेद: सम्राट यन्त्र बनाम कोणार्क सूर्य मन्दिर चक्र (Samrat Yantra vs. Konark
              Wheels)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A common point of confusion in popular astronomy is conflating Maharaja Sawai Jai Singh
            II's 18th-century
            <strong> Samrat Yantra</strong> with the 13th-century{" "}
            <strong>Konark Sun Temple Wheels</strong> (Sun Temple of Konark, Odisha, built by King
            Narasimhadeva I of the Eastern Ganga Dynasty):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="rounded border border-gold/20 bg-background/60 p-3 space-y-1">
              <span className="font-semibold text-gold text-xs">
                सम्राट यन्त्र (Samrat Yantra — Equinoctial Sundial):
              </span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Features a triangular gnomon tilted precisely at local latitude (φ) towards the
                North Celestial Pole, flanked by curved cylindrical quadrants parallel to Earth's
                celestial equator. The shadow moves at a strictly uniform angular rate (15° per hour
                = 6° per Ghati = 1° per 4 minutes) regardless of season.
              </p>
            </div>
            <div className="rounded border border-gold/20 bg-background/60 p-3 space-y-1">
              <span className="font-semibold text-gold text-xs">
                कोणार्क चक्र (Konark Sun Temple Wheels — Chariot Wheels):
              </span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                24 monumental vertical stone wheels representing the 24 fortnights (Pakshas) of the
                solar year on Surya's grand chariot. The 8 major spokes represent the 8 Praharas of
                a 24-hour day (each $\sim$3 hours), and 8 minor spokes divide each Prahara into 1.5
                hours (90 minutes).
              </p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/90 italic pt-1 border-t border-gold/10">
            <strong>Historical Note on Precision:</strong> Modern popular folklore often asserts
            that Konark wheels can be read down to an exact 4-minute interval uniformly across the
            year. However, because the Konark wheels stand vertically rather than parallel to the
            celestial equator, the shadow of the central axle does not sweep uniformly across the
            vertical rim without complex trigonometric declination adjustments. KalaGanaka preserves
            historical transparency by not claiming unsupported 4-minute precision for the vertical
            wheels.
          </p>
        </div>
      </div>
    </section>
  );
}
