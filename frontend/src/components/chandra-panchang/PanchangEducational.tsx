import React from "react";
import { BookOpen, Compass, Sparkles, Layers } from "lucide-react";

export function PanchangEducational() {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-gold/25 bg-background/80 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-gold/15 pb-3">
        <BookOpen className="h-5 w-5 text-gold" />
        <h3 className="font-deva text-xl text-gold-gradient sm:text-2xl">
          पञ्चाङ्ग-विज्ञान एवं सिद्धान्त (Panchang Principles & Ephemeris Derivations)
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Card 1: What are the 5 Limbs? */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Layers className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              पञ्चाङ्ग का स्वरूप (The Five Limbs of Time)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The word <strong>Panchanga</strong> (पञ्चाङ्ग) literally translates to &ldquo;five
            limbs&rdquo; (<em>Pancha</em> = 5, <em>Anga</em> = limb), referring to the five distinct
            astronomical coordinates that quantify time in traditional Indian astronomy:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>तिथि (Tithi):</strong> Lunar day measuring relative elongation between Moon
              and Sun (12° per Tithi).
            </li>
            <li>
              <strong>वासर / वार (Vara):</strong> Solar civil weekday governed by planetary hora
              order from sunrise.
            </li>
            <li>
              <strong>नक्षत्र (Nakshatra):</strong> Sidereal asterism sector occupied by the Moon
              (13°20&prime; per sector).
            </li>
            <li>
              <strong>योग (Yoga):</strong> Combined angular sum of the Moon and Sun&rsquo;s sidereal
              longitudes (13°20&prime; per Yoga).
            </li>
            <li>
              <strong>करण (Karana):</strong> Half-lunar day measuring 6° of solar-lunar angular
              separation.
            </li>
          </ul>
        </div>

        {/* Card 2: Invariance of Tithi & Ayanamsha Cancellation */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Compass className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              तिथि-सिद्धान्त एवं अयनांश (Mathematical Invariance of Tithi)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A profound mathematical property of the Tithi is its{" "}
            <strong>invariance between Sayana (tropical) and Nirayana (sidereal)</strong>{" "}
            frameworks:
          </p>
          <div className="rounded bg-black/40 p-2 text-[11px] font-mono text-gold-light leading-relaxed">
            Δλ = (λ_Moon,trop − λ_Sun,trop) = (λ_Moon,sid − λ_Sun,sid)
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Because Ayanamsha is applied identically to both luminaries, it cancels out completely
            when calculating relative elongation. Thus, whether computed in modern tropical
            ephemeris or Vedic sidereal frames, the true physical Tithi boundary is identical to the
            exact second.
          </p>
        </div>

        {/* Card 3: Nakshatra and Yoga Sidereal Necessity */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              नक्षत्र एवं योग की निरयण अनिवार्यता (Sidereal Coordinates)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlike Tithi, <strong>Nakshatra</strong> and <strong>Yoga</strong> strictly require{" "}
            <em>Nirayana</em> (sidereal) coordinates:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>Nakshatra:</strong> Divides the fixed stellar background into 27 equal sectors
              of 13°20&prime; (360° / 27 = 13°20&prime;) anchored to the fiducial star Chitra (Spica
              at 180°).
            </li>
            <li>
              <strong>Yoga:</strong> Calculated from (λ_Sun,sid + λ_Moon,sid) % 360°. Tropical
              coordinates cannot be used because adding tropical angles introduces twice the
              Ayanamsha (+2 × Ayanamsha).
            </li>
            <li>
              <strong>KalaGanaka Calibrations:</strong> We compute Lahiri Ayanamsha using the
              official Indian Calendar Reform Committee polynomial (Positional Astronomy Centre,
              Kolkata).
            </li>
          </ul>
        </div>

        {/* Card 4: The 60 Karanas Structure */}
        <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <Layers className="h-4 w-4" />
            <h4 className="font-deva text-base font-semibold">
              करणों का चक्रीय एवं स्थिर विभाजन (Karana Classification)
            </h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A lunar month of 30 Tithis contains exactly 60 Karanas of 6° each, classified into two
            categories:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>
              <strong>चर करण (Mobile / Repeating Karanas):</strong> 7 repeating Karanas (Bava,
              Balava, Kaulava, Taitila, Gara, Vanija, Vishti/Bhadra) repeat 8 times each, accounting
              for 56 half-tithis.
            </li>
            <li>
              <strong>स्थिर करण (Fixed / Immovable Karanas):</strong> 4 stationary Karanas occur
              only once per lunar month: Shakuni (2nd half of Krishna 14), Chatushpada (1st half of
              Amavasya), Naga (2nd half of Amavasya), and Kintughna (1st half of Shukla 1).
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
