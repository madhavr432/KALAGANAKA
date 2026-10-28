/**
 * AstronomyLearningPanel.tsx
 * Beginner-friendly educational curriculum explaining the scientific mechanics
 * of the solar year, Earth's revolution, seasons, Ayanamsha, and Indian calendar traditions.
 */

import React, { useState } from "react";
import {
  BookOpen,
  Sun,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Flame,
  Globe,
} from "lucide-react";

interface CurriculumTopic {
  id: string;
  number: string;
  title: string;
  sanskritTitle: string;
  summary: string;
  icon: React.ElementType;
  details: React.ReactNode;
}

export function AstronomyLearningPanel() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>("axial-tilt");

  const toggleTopic = (id: string) => {
    setExpandedTopic((prev) => (prev === id ? null : id));
  };

  const TOPICS: CurriculumTopic[] = [
    {
      id: "solar-year",
      number: "१",
      title: "The Solar Year: Tropical vs Sidereal",
      sanskritTitle: "सौर वर्ष एवं नाक्षत्र वर्ष (Solar vs Sidereal Year)",
      summary:
        "Why a year measured by the seasons is 20 minutes shorter than a year measured by the distant stars.",
      icon: Sun,
      details: (
        <div className="space-y-2 text-muted-foreground leading-relaxed">
          <p>
            There are two distinct ways to measure the duration of one complete Earth revolution:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-gold/15 bg-background/50 p-3">
              <strong className="text-gold-light block font-sans">
                1. Tropical Year (सावन संवत्सर): 365.2422 days
              </strong>
              <span>
                Measured from one Vernal Equinox to the next. Governs Earth&rsquo;s seasons and the
                Gregorian civil calendar. Because the equinox precesses westward, Earth completes a
                tropical cycle slightly before completing a full 360° circle relative to the stars.
              </span>
            </div>
            <div className="rounded-lg border border-gold/15 bg-background/50 p-3">
              <strong className="text-gold-light block font-sans">
                2. Sidereal Year (नाक्षत्र संवत्सर): 365.2564 days
              </strong>
              <span>
                Measured by Earth completing a true 360° orbit relative to the fixed stars (such as
                Spica / Chitra). Indian solar calendars (Saur Mana) follow the sidereal year, which
                is approximately 20 minutes and 24 seconds longer than the tropical year.
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "axial-tilt",
      number: "२",
      title: "Earth's 23.44° Axial Tilt & Seasons",
      sanskritTitle: "अक्षीय झुकाव एवं षड्ऋतु (Axial Tilt & The Six Ritus)",
      summary:
        "The geometric truth behind seasonal warmth: solar angle of incidence and daylight duration.",
      icon: Globe,
      details: (
        <div className="space-y-2 text-muted-foreground leading-relaxed">
          <p>
            A common misconception is that summer occurs because Earth is physically closer to the
            Sun. In reality, Earth&rsquo;s orbit is nearly circular (eccentricity only 0.0167).
            Earth reaches its closest point (Perihelion) in early <strong>January</strong>, during
            the chilly Northern winter!
          </p>
          <p>
            Earth&rsquo;s rotational axis is permanently tilted at{" "}
            <strong className="text-amber-200">23.44°</strong> relative to its orbital plane. As
            Earth orbits, the hemisphere tilted toward the Sun experiences:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Higher solar noon altitude (steeper ray angle, concentrating thermal energy per square
              meter).
            </li>
            <li>Longer duration of daylight, allowing prolonged surface solar heating.</li>
            <li>
              Traditional Indian astronomy divides this progression into six vivid seasonal periods
              (Shad-Ritu): Vasant (Spring), Grishma (Summer), Varsha (Monsoon), Sharad (Autumn),
              Hemanta (Pre-winter), and Shishira (Winter).
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "ecliptic-zodiac",
      number: "३",
      title: "The Ecliptic & The 12 Rashis",
      sanskritTitle: "क्रान्तिवृत्त एवं द्वादश राशि (The Ecliptic & Rashis)",
      summary: "The Sun's apparent yearly path against the background starry constellations.",
      icon: Compass,
      details: (
        <div className="space-y-2 text-muted-foreground leading-relaxed">
          <p>
            As Earth revolves around the Sun, the Sun appears from our vantage point to travel along
            a 360° circular celestial track called the <strong>Ecliptic (क्रान्तिवृत्त)</strong>.
          </p>
          <p>
            Indian astronomy divides this circular path into 12 equal sectors of 30° each, known as
            the <strong>द्वादश राशि (12 Rashis)</strong>, beginning with Mesha (Aries at 0°) and
            concluding with Meena (Pisces at 330°–360°). Each solar month corresponds to the
            Sun&rsquo;s journey through one 30° Rashi sector.
          </p>
        </div>
      ),
    },
    {
      id: "precession-ayanamsha",
      number: "४",
      title: "Precession of the Equinoxes & Ayanamsha",
      sanskritTitle: "अयनांश एवं विषुव-चलन (Precession & Ayanamsha)",
      summary: "How Earth's rotational wobble shifts the calendar milestones over millennia.",
      icon: RotateCw,
      details: (
        <div className="space-y-2 text-muted-foreground leading-relaxed">
          <p>
            Earth does not spin like a rigid top; gravitational forces from the Moon and Sun cause
            its rotational axis to trace out a slow cone in space over 25,772 years.
          </p>
          <p>
            This gentle wobble causes the tropical Vernal Equinox (the intersection of the celestial
            equator and ecliptic) to slip backwards through the sidereal stars at a rate of{" "}
            <strong>50.29 arcseconds per year</strong> (about 1 degree every 72 years).
          </p>
          <p>
            The angular separation between the tropical zero point and the sidereal zero point is
            called <strong>Ayanamsha (अयनांश)</strong>. In 2026, the Lahiri Ayanamsha is
            approximately
            <strong> 24.23°</strong> (~24 days of solar motion).
          </p>
        </div>
      ),
    },
    {
      id: "uttarayana-dakshinayana",
      number: "५",
      title: "Uttarayana & Dakshinayana: Dual Interpretations",
      sanskritTitle: "उत्तरायण एवं दक्षिणायन (Astronomical vs Calendar Traditions)",
      summary:
        "Understanding the distinction between the solstice turnaround and the Makara/Karka ingress.",
      icon: Flame,
      details: (
        <div className="space-y-2 text-muted-foreground leading-relaxed">
          <p>In Indian astronomical literature, two distinct definitions of Uttarayana exist:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-gold/15 bg-background/50 p-3">
              <strong className="text-gold-light block font-sans">
                Astronomical Definition (Sayana)
              </strong>
              <span>
                Begins on the <strong>Winter Solstice (~Dec 21)</strong> when the Sun reaches its
                southernmost declination (-23.44°) and turns northward. The daylight hours begin to
                increase from this day onward.
              </span>
            </div>
            <div className="rounded-lg border border-gold/15 bg-background/50 p-3">
              <strong className="text-gold-light block font-sans">
                Traditional Calendar Definition (Nirayana)
              </strong>
              <span>
                Celebrated on <strong>Makar Sankranti (~Jan 14-15)</strong> when the Sun enters
                sidereal Makara Rashi. Because of 1,740 years of axial precession, this religious
                festival now occurs ~24 days after the astronomical solstice turnaround.
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "regional-conventions",
      number: "६",
      title: "Regional Day 1 Solar Month Rules",
      sanskritTitle: "क्षेत्रीय पञ्चाङ्ग सिद्धान्त (Civil Day Transition Conventions)",
      summary:
        "How Tamil, Malayalam, Bengali, and Odia calendars determine Day 1 of the solar month.",
      icon: BookOpen,
      details: (
        <div className="space-y-2 text-muted-foreground leading-relaxed">
          <p>
            When the Sun transits into a new Rashi (Sankranti), when does Day 1 of that solar month
            begin on the civil calendar? Ancient astronomers developed localized civil rules:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 pt-1">
            <li>
              <strong className="text-gold-light">Tamil Calendar (Aparahna / Sunset Rule):</strong>{" "}
              If Sankranti occurs before local sunset, that day is Day 1. If it occurs after sunset,
              the next civil sunrise marks Day 1.
            </li>
            <li>
              <strong className="text-gold-light">
                Malayalam Calendar (Madhyanha / Noon Rule):
              </strong>{" "}
              If ingress occurs before astronomical solar noon (Madhyanha), that day is Day 1 of the
              month.
            </li>
            <li>
              <strong className="text-gold-light">Bengali Panjika (Danda Rule):</strong> If the
              transit occurs between sunrise and midnight, the subsequent civil day is Boishakh 1.
            </li>
            <li>
              <strong className="text-gold-light">Odisha Calendar:</strong> Follows the Biraja and
              Kohinoor Panjika traditions where Punya Kala is observed during the 16 Ghatis after
              transit.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full space-y-5 rounded-2xl border border-gold/25 bg-background/85 p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="border-b border-gold/15 pb-4 text-left">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
          <BookOpen className="h-4 w-4" />
          <span>खगोलीय शिक्षण एवं सिद्धान्त (Educational Curriculum)</span>
        </div>
        <h3 className="mt-1 font-deva text-2xl text-gold-gradient sm:text-3xl">
          The Science of the Solar Year
        </h3>
        <p className="mt-2 font-serif text-sm text-gold-soft/80 sm:text-base leading-relaxed">
          Clear, beginner-friendly explanations bridging celestial mechanics, Earth&rsquo;s axial
          tilt, and traditional Indian calendar wisdom.
        </p>
      </div>

      {/* Accordion Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isExpanded = expandedTopic === topic.id;

          return (
            <div
              key={topic.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? "border-gold/40 bg-[#090e18] shadow-lg"
                  : "border-gold/15 bg-background/50 hover:border-gold/30 hover:bg-[#0c1322]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className="flex w-full items-start justify-between p-4 text-left gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-gold/10 p-2 text-gold shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-deva text-xs text-gold-soft font-semibold block">
                      {topic.number}. {topic.sanskritTitle}
                    </span>
                    <h4 className="font-sans text-sm font-bold text-foreground">{topic.title}</h4>
                    <p className="mt-1 font-sans text-xs text-muted-foreground leading-normal">
                      {topic.summary}
                    </p>
                  </div>
                </div>

                <div className="text-gold-soft pt-1">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gold/10 px-4 pb-4 pt-3 text-xs">
                  {topic.details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
