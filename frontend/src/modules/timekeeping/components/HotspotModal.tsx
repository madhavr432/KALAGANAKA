/**
 * HotspotModal.tsx
 * Dialog displayed when a user clicks any 3D hotspot on the Konark Chakra.
 */

import React from "react";
import { EducationalHotspot } from "../types/timekeeping";
import { X, Sparkles, BookOpen, Clock, ShieldCheck } from "lucide-react";

interface HotspotModalProps {
  hotspot: EducationalHotspot | null;
  onClose: () => void;
}

export function HotspotModal({ hotspot, onClose }: HotspotModalProps) {
  if (!hotspot) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/40 bg-background/95 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gold/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-2 text-gold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-deva text-lg text-gold-gradient">{hotspot.title}</h3>
              <p className="font-sans text-xs text-muted-foreground">{hotspot.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gold/20 p-1 text-gold-soft hover:bg-gold/10 hover:text-gold transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs leading-relaxed text-muted-foreground">
          {/* Main Architectural Description */}
          <div className="rounded-xl border border-gold/15 bg-gold/5 p-3.5">
            <h4 className="flex items-center gap-1.5 font-semibold text-gold text-xs uppercase tracking-wider mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Architectural & Symbolic Form</span>
            </h4>
            <p className="text-foreground/90 font-serif text-sm leading-relaxed">
              {hotspot.description}
            </p>
          </div>

          {/* Timekeeping Interpretation */}
          <div>
            <h4 className="flex items-center gap-1.5 font-semibold text-gold-soft text-xs uppercase tracking-wider mb-1">
              <Clock className="h-3.5 w-3.5 text-gold" />
              <span>Timekeeping Role</span>
            </h4>
            <p className="rounded-lg border border-gold/15 bg-background/60 p-3 text-foreground/80">
              {hotspot.timekeepingRole}
            </p>
          </div>

          {/* Historical Context & Archaeology */}
          <div>
            <h4 className="flex items-center gap-1.5 font-semibold text-gold-soft text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              <span>Historical Inscription & Temple Tradition</span>
            </h4>
            <p className="rounded-lg border border-gold/15 bg-background/60 p-3 text-foreground/80">
              {hotspot.historicalContext}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-gold/15 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gold-gradient px-4 py-1.5 font-sans text-xs font-bold text-slate-950 shadow-md hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
