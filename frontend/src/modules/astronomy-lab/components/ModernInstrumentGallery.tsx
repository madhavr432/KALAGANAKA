/**
 * components/ModernInstrumentGallery.tsx
 * Section 5: Modern Scientific Astronomical Instrument Gallery.
 * Displays genuine photography, measurement principles, units, precision,
 * institutional attributions, and backend ephemeris calibration relationship
 * for contemporary state-of-the-art instruments (NIST Atomic Clocks, NASA DSN, ESO VLT, GNSS).
 */

import React from "react";
import {
  Cpu,
  MapPin,
  Calendar,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react";
import type { AstronomicalInstrument } from "../types/astronomyLab";

interface ModernInstrumentGalleryProps {
  instruments: AstronomicalInstrument[];
  selectedInstrument: AstronomicalInstrument;
  onSelectInstrument: (id: string) => void;
}

export function ModernInstrumentGallery({
  instruments,
  selectedInstrument,
  onSelectInstrument,
}: ModernInstrumentGalleryProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-cyan-500/25 bg-midnight-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-cyan-400" />
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Modern Astronomical Instrument Gallery
          </h2>
        </div>
        <p className="mt-1 font-deva text-sm text-cyan-300">
          आधुनिक खगोलीय एवं भौतिक यन्त्र — लेज़र, क्वांटम परमाणु मानक एवं अन्तरिक्ष राडार
        </p>
        <p className="mt-1 text-xs text-slate-300">
          Explore genuine photography and operating physics of contemporary scientific
          standards—including NIST primary frequency standards, NASA Deep Space Network, ESO VLT
          adaptive optics, and GNSS atomic constellations.
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
                ? "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20"
                : "border-white/10 bg-black/40 hover:border-cyan-500/30 hover:bg-black/60"
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
            <span className="font-deva text-[11px] text-cyan-300">{inst.nameHindi}</span>
          </button>
        ))}
      </div>

      {/* Selected Instrument Detail Card */}
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-cyan-500/30 bg-black/50 p-6 lg:grid-cols-12">
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
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
              >
                Institutional Source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Technical Specs & Operational Analysis (7 cols on lg) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-xl font-bold text-white">{selectedInstrument.name}</h3>
              <p className="font-deva text-xs text-cyan-300">{selectedInstrument.nameHindi}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> SI / NASA Verified
            </span>
          </div>

          {/* Metadata Badges */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>
                <strong>Location:</strong> {selectedInstrument.location}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>
                <strong>Operational Era:</strong> {selectedInstrument.eraOrYear}
              </span>
            </div>
          </div>

          {/* Measurement Principle */}
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Measurement Principle & Physics
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">
              {selectedInstrument.measurementPrinciple}
            </p>
          </div>

          {/* Metric Specifications Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-slate-400">Inputs Measured:</span>
              <p className="mt-0.5 font-medium text-white">{selectedInstrument.inputsMeasured}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-slate-400">Outputs Produced:</span>
              <p className="mt-0.5 font-medium text-white">{selectedInstrument.outputsProduced}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-slate-400">Primary Units:</span>
              <p className="mt-0.5 font-medium text-cyan-300">{selectedInstrument.units}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <span className="text-slate-400">Demonstrated Precision:</span>
              <p className="mt-0.5 font-mono font-medium text-emerald-400">
                {selectedInstrument.precisionOrUncertainty}
              </p>
            </div>
          </div>

          {/* Strengths & Limitations */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Modern Advantages</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                {selectedInstrument.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Physical Constraints</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                {selectedInstrument.limitations.map((l, idx) => (
                  <li key={idx}>{l}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Relation to KalaGanaka Software */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/25 p-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <Radio className="h-3.5 w-3.5 text-indigo-400" />
              Role in KalaGanaka Ephemeris Engine
            </span>
            <p className="mt-1 text-[11px] text-slate-200">
              {selectedInstrument.relationToSoftware}
            </p>
          </div>

          {/* References */}
          {selectedInstrument.references.length > 0 && (
            <div className="text-[11px] text-slate-400">
              <strong>Institutional Documentation:</strong>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedInstrument.references.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200"
                  >
                    <span>
                      {ref.title} ({ref.source})
                    </span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
