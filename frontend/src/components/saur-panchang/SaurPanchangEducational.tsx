import React from "react";
import { Sun, Compass, Landmark, Calendar } from "lucide-react";

export function SaurPanchangEducational() {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-gold/15 pb-3">
        <Sun className="h-5 w-5 text-gold" />
        <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
          सौर सिद्धान्त एवं सङ्क्रान्ति-विधान (Solar Principles & Sankranti Conventions)
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card 1: What is Saur Mana? */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Compass className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              सौर मान एवं १२ राशियाँ (Solar Calendar & The 12 Rashis)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In traditional Indian astronomy (<em>Siddhanta Jyotisha</em>),{" "}
            <strong>Saur Mana</strong> (सौर मान) measures time by the Sun&rsquo;s apparent journey
            along the ecliptic through the 12 equal 30° sidereal divisions called{" "}
            <strong>Rashis</strong> (राशयः): Mesha (Aries) through Meena (Pisces).
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A solar month (<em>Saur Masa</em>) is defined as the time taken by the Sun to traverse a
            single Rashi. Because Earth&rsquo;s orbit is elliptical (Kepler&rsquo;s second law), the
            Sun moves faster near perihelion in January and slower near aphelion in July, causing
            traditional solar months to vary between 29 and 32 civil days.
          </p>
        </div>

        {/* Card 2: What is Sankranti? */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Sun className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              सङ्क्रान्ति की परिभाषा (The Exact Moment of Sankranti)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Sankranti (सङ्क्रान्ति)</strong> is the precise mathematical instant when the
            center of the solar disc crosses the boundary from one Rashi into the next in the{" "}
            <em>Nirayana</em> (sidereal) zodiac.
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>मेष सङ्क्रान्ति (Mesha Sankranti, 0°):</strong> Vernal sidereal ingress
              marking the traditional Solar New Year (Vaisakhi, Puthandu, Pohela Boishakh, Bohag
              Bihu).
            </li>
            <li>
              <strong>कर्क सङ्क्रान्ति (Karka Sankranti, 90°):</strong> Beginning of Dakshinayana
              (Sun moving southwards).
            </li>
            <li>
              <strong>तुला सङ्क्रान्ति (Tula Sankranti, 180°):</strong> Autumnal sidereal ingress.
            </li>
            <li>
              <strong>मकर सङ्क्रान्ति (Makara Sankranti, 270°):</strong> Winter ingress into
              Capricorn, celebrated pan-India as Uttarayana festival.
            </li>
          </ul>
        </div>

        {/* Card 3: Regional Calendar Variations */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Landmark className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              क्षेत्रीय सौर सौर-पञ्चाङ्ग नियम (Regional Solar Month Boundaries)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            While the astronomical instant of Sankranti is identical worldwide, regional Indian
            solar calendars use different civil day transition rules:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>Tamil Solar Calendar (Tirukanitha):</strong> If Sankranti occurs between
              sunrise and sunset, that day is Day 1 of the new month. If it occurs after sunset, Day
              1 is the next morning.
            </li>
            <li>
              <strong>Malayalam Calendar (Kollam Era):</strong> Uses the <em>Madhyanha</em> (noon /
              Aparahna) rule: if Sankranti occurs before midday (1:12 PM), that day is the 1st of
              the month.
            </li>
            <li>
              <strong>Bengali Solar Calendar (Surya Siddhanta / Drik):</strong> Month starts next
              day if Sankranti occurs after midnight or evening depending on local school.
            </li>
            <li>
              <strong>Odia Calendar:</strong> Uses sunset as the transition threshold.
            </li>
          </ul>
        </div>

        {/* Card 4: Sayana vs Nirayana Solar Drift */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Calendar className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              सायण बनाम निरयण अयनांश अन्तर (Sayana vs Nirayana Drift)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Modern Western calendars (Gregorian) are <strong>Sayana</strong> (tropical), pegged to
            the moving equinox ($0^\circ$ on March 20/21). Indian solar calendars are predominantly{" "}
            <strong>Nirayana</strong> (sidereal), pegged to fixed stellar constellations.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Due to the 25,772-year Precession of the Equinoxes, the Vernal Equinox moves westward by
            roughly 50.29 arcseconds per year ($1^\circ$ every ~71.6 years). This creates an
            accumulated difference called <strong>Ayanamsha</strong> (currently $\sim 24.23^\circ$
            in 2026), explaining why Makara Sankranti currently occurs on January 14/15 rather than
            the physical winter solstice of December 21/22.
          </p>
        </div>
      </div>
    </section>
  );
}
