import React from "react";
import { type FestivalRule } from "@/services/astronomy-api";
import { Calendar, X, Sparkles, BookOpen, AlertCircle, Compass } from "lucide-react";

interface FestivalDetailModalProps {
  festival: FestivalRule | null;
  onClose: () => void;
}

export function FestivalDetailModal({ festival, onClose }: FestivalDetailModalProps) {
  if (!festival) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gold/30 bg-background/95 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-gold/20 p-1.5 text-gold hover:bg-gold/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
          <div className="rounded-xl border border-gold/30 bg-gold/10 p-2.5 text-gold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-deva text-2xl text-gold-gradient">
              {festival.names?.hindi || festival.name}
            </h3>
            <p className="font-sans text-xs text-muted-foreground">
              {festival.name} • {festival.region || "Pan-India"}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs leading-relaxed">
          {/* Rule Card */}
          <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 space-y-2">
            <span className="font-deva text-sm font-semibold text-gold block">
              खगोलीय तिथि-विधान (Astronomical Panchang Rule)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div className="rounded bg-background/60 p-2 border border-gold/10">
                <span className="text-muted-foreground block text-[10px]">मास (Month):</span>
                <span className="text-gold-light font-bold">
                  {festival.rule.lunar_month || festival.rule.solar_month || "Universal"}
                </span>
              </div>
              <div className="rounded bg-background/60 p-2 border border-gold/10">
                <span className="text-muted-foreground block text-[10px]">पक्ष (Paksha):</span>
                <span className="text-gold-light font-bold capitalize">
                  {festival.rule.paksha || "N/A"}
                </span>
              </div>
              <div className="rounded bg-background/60 p-2 border border-gold/10">
                <span className="text-muted-foreground block text-[10px]">तिथि (Tithi):</span>
                <span className="text-gold-light font-bold">
                  {festival.rule.tithi || "Special Solar Transit"}
                </span>
              </div>
            </div>
            {festival.notes && (
              <p className="text-muted-foreground text-[11px] pt-1">{festival.notes}</p>
            )}
          </div>

          {/* Dharmashastra & Kala Timing Nuance */}
          <div className="rounded-lg border border-gold/15 bg-background/50 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-gold">
              <BookOpen className="h-4 w-4" />
              <span className="font-deva text-xs font-semibold">
                धर्मसिन्धु एवं निर्णयसिन्धु विधान (Kala Observance Window)
              </span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              In traditional Indian calendrical science, a festival date is not determined merely by
              sunrise tithi. Different celebrations require the tithi to prevail during specific
              portions of the solar day (<em>Kalas</em>):
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
              <li>
                <strong>Pradosha Kala (प्रदोष काल):</strong> Twilight sunset window (critical for
                Lakshmi Puja / Diwali).
              </li>
              <li>
                <strong>Madhyanha (मध्याह्न काल):</strong> Solar midday (critical for Rama Navami &
                Ganesh Chaturthi).
              </li>
              <li>
                <strong>Nishita Kala (निशीथ काल):</strong> Astronomical midnight (critical for
                Krishna Janmashtami & Maha Shivaratri).
              </li>
              <li>
                <strong>Aparahna (अपराह्न काल):</strong> Late afternoon window for Pitru rituals.
              </li>
            </ul>
          </div>

          {/* Regional Month Conventions (Amanta vs Purnimanta) */}
          <div className="rounded-lg border border-gold/15 bg-gold/5 p-3 text-[11px] text-muted-foreground">
            <strong className="text-gold-soft block mb-1">
              Regional Difference Note (पूर्णिमान्त बनाम अमान्त):
            </strong>
            In North India (Purnimanta convention), months end on the Full Moon (Purnima). In South
            and Western India (Amanta convention), months end on the New Moon (Amavasya). Although
            the civil month name may differ by one fortnight during Krishna Paksha, the physical
            astronomical Tithi and planetary positions are strictly identical across India.
          </div>

          {/* Verification Status */}
          <div className="flex items-center justify-between border-t border-gold/15 pt-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              <span>
                Dataset Status:{" "}
                <span className="font-mono text-gold-soft capitalize">
                  {festival.verification_status || "Curated"}
                </span>
              </span>
            </div>
            <span className="font-mono text-[10px]">ID: {festival.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
