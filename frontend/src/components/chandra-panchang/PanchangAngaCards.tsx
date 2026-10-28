import React from "react";
import {
  type TithiItem,
  type NakshatraItem,
  type YogaItem,
  type KaranaItem,
  type NextTransitionResponse,
} from "@/services/astronomy-api";
import { Moon, Star, Compass, Layers, Calendar, Clock } from "lucide-react";

interface PanchangAngaCardsProps {
  tithi: TithiItem;
  nakshatra: NakshatraItem;
  yoga: YogaItem;
  karana: KaranaItem;
  weekdayName: string;
  weekdaySanskrit: string;
  nextTithiTransition: NextTransitionResponse | null;
  nextNakshatraTransition: NextTransitionResponse | null;
  nextYogaTransition: NextTransitionResponse | null;
  nextKaranaTransition: NextTransitionResponse | null;
}

export function PanchangAngaCards({
  tithi,
  nakshatra,
  yoga,
  karana,
  weekdayName,
  weekdaySanskrit,
  nextTithiTransition,
  nextNakshatraTransition,
  nextYogaTransition,
  nextKaranaTransition,
}: PanchangAngaCardsProps) {
  const formatCountdown = (transitionRes: NextTransitionResponse | null): string => {
    if (!transitionRes) return "Calculating transition...";
    const hrs = Math.floor(transitionRes.hours_remaining);
    const mins = Math.round((transitionRes.hours_remaining - hrs) * 60);
    const nextName = transitionRes.next_transition.to_name;
    const localTime = transitionRes.next_transition.transition_time_local;
    const timeMatch = localTime.match(/T(\d{2}:\d{2})/);
    const timeStr = timeMatch ? timeMatch[1] : localTime;

    return `${hrs}h ${mins}m remaining (ends at ${timeStr}, next: ${nextName})`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Tithi Card */}
      <div className="flex flex-col justify-between rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md transition-all hover:border-gold/40">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Moon className="h-4 w-4 text-gold" />
              १. तिथि (Tithi)
            </span>
            <span className="font-mono text-[11px] text-gold-soft">#{tithi.index} / 30</span>
          </div>

          <div className="mt-3">
            <h4 className="font-deva text-2xl font-bold text-gold-light">{tithi.name}</h4>
            <p className="text-xs text-gold-soft">
              {tithi.paksha} Paksha • Tithi {tithi.tithi_in_paksha}
            </p>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Elapsed in Tithi:</span>
              <span className="font-mono text-gold-light">
                {tithi.elapsed_deg_in_tithi.toFixed(2)}° / 12.00° (
                {(tithi.fraction_elapsed * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gold/10">
              <div
                className="h-full rounded-full bg-gold-gradient transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, tithi.fraction_elapsed * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 border-t border-gold/10 pt-2 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gold-soft" />
          <span className="truncate">{formatCountdown(nextTithiTransition)}</span>
        </div>
      </div>

      {/* 2. Nakshatra Card */}
      <div className="flex flex-col justify-between rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md transition-all hover:border-gold/40">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Star className="h-4 w-4 text-gold" />
              २. नक्षत्र (Nakshatra)
            </span>
            <span className="font-mono text-[11px] text-gold-soft">#{nakshatra.index} / 27</span>
          </div>

          <div className="mt-3">
            <h4 className="font-deva text-2xl font-bold text-gold-light">{nakshatra.name}</h4>
            <p className="text-xs text-gold-soft">
              Moon Sidereal Longitude: {nakshatra.sidereal_longitude_deg.toFixed(2)}°
            </p>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Elapsed in Sector:</span>
              <span className="font-mono text-gold-light">
                {nakshatra.elapsed_deg_in_nakshatra.toFixed(2)}° / 13.33° (
                {(nakshatra.fraction_elapsed * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gold/10">
              <div
                className="h-full rounded-full bg-gold-gradient transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, nakshatra.fraction_elapsed * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 border-t border-gold/10 pt-2 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gold-soft" />
          <span className="truncate">{formatCountdown(nextNakshatraTransition)}</span>
        </div>
      </div>

      {/* 3. Yoga Card */}
      <div className="flex flex-col justify-between rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md transition-all hover:border-gold/40">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Compass className="h-4 w-4 text-gold" />
              ३. योग (Yoga)
            </span>
            <span className="font-mono text-[11px] text-gold-soft">#{yoga.index} / 27</span>
          </div>

          <div className="mt-3">
            <h4 className="font-deva text-2xl font-bold text-gold-light">{yoga.name}</h4>
            <p className="text-xs text-gold-soft">
              Combined ($\lambda_{Sun} + \lambda_{Moon}$): {yoga.combined_longitude_deg.toFixed(2)}°
            </p>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Elapsed in Yoga:</span>
              <span className="font-mono text-gold-light">
                {yoga.elapsed_deg_in_yoga.toFixed(2)}° / 13.33° (
                {(yoga.fraction_elapsed * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gold/10">
              <div
                className="h-full rounded-full bg-gold-gradient transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, yoga.fraction_elapsed * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 border-t border-gold/10 pt-2 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gold-soft" />
          <span className="truncate">{formatCountdown(nextYogaTransition)}</span>
        </div>
      </div>

      {/* 4. Karana Card */}
      <div className="flex flex-col justify-between rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md transition-all hover:border-gold/40">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Layers className="h-4 w-4 text-gold" />
              ४. करण (Karana)
            </span>
            <span className="font-mono text-[11px] text-gold-soft">
              Half-Tithi #{karana.half_tithi_index} / 60
            </span>
          </div>

          <div className="mt-3">
            <h4 className="font-deva text-2xl font-bold text-gold-light">{karana.name}</h4>
            <p className="text-xs text-gold-soft">
              Type: <span className="capitalize">{karana.karana_type}</span> Karana
            </p>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Elapsed in Karana:</span>
              <span className="font-mono text-gold-light">
                {karana.elapsed_deg_in_karana.toFixed(2)}° / 6.00° (
                {(karana.fraction_elapsed * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gold/10">
              <div
                className="h-full rounded-full bg-gold-gradient transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, karana.fraction_elapsed * 100))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 border-t border-gold/10 pt-2 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0 text-gold-soft" />
          <span className="truncate">{formatCountdown(nextKaranaTransition)}</span>
        </div>
      </div>

      {/* 5. Vara / Weekday Card */}
      <div className="flex flex-col justify-between rounded-xl border border-gold/25 bg-background/80 p-4 shadow-lg backdrop-blur-md transition-all hover:border-gold/40">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-gold/15 pb-2">
            <span className="flex items-center gap-1.5 font-deva text-gold">
              <Calendar className="h-4 w-4 text-gold" />
              ५. वासर / वार (Vara)
            </span>
            <span className="font-mono text-[11px] text-gold-soft">Solar Day</span>
          </div>

          <div className="mt-3">
            <h4 className="font-deva text-2xl font-bold text-gold-light">{weekdaySanskrit}</h4>
            <p className="text-xs text-gold-soft">{weekdayName} (Civil Weekday)</p>
          </div>

          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            In Vedic timekeeping, each solar day begins precisely at local astronomical{" "}
            <strong>sunrise</strong> (सूर्योदय) rather than midnight.
          </p>
        </div>

        <div className="mt-4 border-t border-gold/10 pt-2 text-[11px] text-gold-soft/80">
          Governing Graha:{" "}
          {weekdayName === "Sunday"
            ? "Surya (Sun)"
            : weekdayName === "Monday"
              ? "Chandra (Moon)"
              : weekdayName === "Tuesday"
                ? "Mangala (Mars)"
                : weekdayName === "Wednesday"
                  ? "Budha (Mercury)"
                  : weekdayName === "Thursday"
                    ? "Guru (Jupiter)"
                    : weekdayName === "Friday"
                      ? "Shukra (Venus)"
                      : "Shani (Saturn)"}
        </div>
      </div>
    </div>
  );
}
