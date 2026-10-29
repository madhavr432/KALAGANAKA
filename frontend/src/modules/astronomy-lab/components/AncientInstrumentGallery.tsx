/**
 * components/AncientInstrumentGallery.tsx
 * Section 4: Ancient Astronomical Instrument Gallery.
 * Displays genuine photography, measurement principles, units, precision,
 * institutional attributions, and software relationship for historic Indian instruments.
 */

import React, { useState } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Info,
  Maximize2,
} from "lucide-react";
import type { AstronomicalInstrument } from "../types/astronomyLab";

interface AncientInstrumentGalleryProps {
  instruments: AstronomicalInstrument[];
  selectedInstrument: AstronomicalInstrument;
  onSelectInstrument: (id: string) => void;
}

export function AncientInstrumentGallery({
  instruments,
  selectedInstrument,
  onSelectInstrument,
}: AncientInstrumentGalleryProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-gold/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Ancient Astronomical Instrument Gallery
          </h2>
        </div>
        <p className="mt-1 font-deva text-sm text-gold-soft">
          प्राचीन भारतीय वेधशाला यन्त्र — सिद्धान्त, संरचना एवं छाया-मापन
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Explore genuine historical photographs and operational mechanics of classical Indian
          astronomical instruments, documented by UNESCO and the Archaeological Survey of India.
        </p>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {instruments.map((inst) => (
          <button
            key={inst.id}
            type="button"
            onClick={() => onSelectInstrument(inst.id)}
            className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
              selectedInstrument.id === inst.id
                ? "border-gold bg-gold/20 shadow-lg shadow-gold/15"
                : "border-white/10 bg-black/40 hover:border-gold/30 hover:bg-black/60"
            }`}
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900">
              <img
                src={inst.imageUrl}
                alt={inst.imageAlt}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <strong className="mt-2 block text-xs text-white">{inst.name}</strong>
            <span className="font-deva text-[11px] text-gold-soft">{inst.nameHindi}</span>
          </button>
        ))}
      </div>

      {/* Selected Instrument Detail Card */}
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-gold/30 bg-black/50 p-6 lg:grid-cols-12">
        {/* Left: High-Res Photograph + Attribution (5 cols on lg) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-black shadow-inner">
            <img
              src={selectedInstrument.imageUrl}
              alt={selectedInstrument.imageAlt}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-black/80 p-2 text-[10px] text-slate-300 backdrop-blur-md">
              {selectedInstrument.imageCaption}
            </div>
          </div>

          {/* Institutional Attribution Box */}
          <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>
                <strong>Attribution:</strong> {selectedInstrument.imageAttribution}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>
                <strong>License:</strong> {selectedInstrument.imageLicense}
              </span>
              <a
                href={selectedInstrument.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gold hover:underline"
              >
                <span>Wikimedia Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Software Relationship Note */}
          <div className="rounded-xl border border-gold/20 bg-gold/10 p-3 text-xs text-gold-light">
            <strong className="block font-semibold">Relation to KalaGanaka:</strong>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-200">
              {selectedInstrument.relationToSoftware}
            </p>
          </div>
        </div>

        {/* Right: Technical Specifications & Mechanics (7 cols on lg) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="border-b border-white/10 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-slate-300">
                <MapPin className="h-3 w-3 text-gold-soft" />
                {selectedInstrument.location.split("(")[0]}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-slate-300">
                <Calendar className="h-3 w-3 text-gold-soft" />
                {selectedInstrument.eraOrYear}
              </span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-white">
              {selectedInstrument.name}
            </h3>
            <p className="font-deva text-base text-gold-soft">
              {selectedInstrument.nameHindi}{" "}
              {selectedInstrument.nameSanskrit && `• ${selectedInstrument.nameSanskrit}`}
            </p>
          </div>

          {/* Measurement Principle */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
              Measurement Principle & Physical Architecture
            </span>
            <p className="leading-relaxed text-slate-200">
              {selectedInstrument.measurementPrinciple}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-muted-foreground">Primary Purpose:</span>
              <strong className="block text-white mt-0.5">
                {selectedInstrument.primaryPurpose}
              </strong>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-muted-foreground">Units:</span>
              <strong className="block text-gold-light mt-0.5">{selectedInstrument.units}</strong>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-muted-foreground">Demonstrated Precision:</span>
              <strong className="block text-emerald-400 mt-0.5">
                {selectedInstrument.precisionOrUncertainty}
              </strong>
            </div>
          </div>

          {/* Strengths and Limitations */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="space-y-1 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-emerald-200">
              <strong className="text-emerald-300">Proven Strengths:</strong>
              <ul className="list-inside list-disc space-y-0.5 text-slate-300">
                {selectedInstrument.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-amber-200">
              <strong className="text-amber-300">Physical Limitations:</strong>
              <ul className="list-inside list-disc space-y-0.5 text-slate-300">
                {selectedInstrument.limitations.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Verified References */}
          <div className="border-t border-white/10 pt-3 text-xs">
            <span className="font-semibold text-slate-400">
              Institutional & Scholarly References:
            </span>
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedInstrument.references.map((ref, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
                >
                  <span>
                    {ref.title} ({ref.source})
                  </span>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
