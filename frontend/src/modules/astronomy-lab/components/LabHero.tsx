/**
 * components/LabHero.tsx
 * Hero banner and primary tab navigation for Module 5: Ancient vs Modern Astronomy Lab.
 */

import React from "react";
import { Link } from "@tanstack/react-router";
import {
  Scale,
  BookOpen,
  Compass,
  Telescope,
  Binary,
  LineChart,
  Layers,
  Sparkles,
  CheckCircle,
  Home,
} from "lucide-react";
import type { LabTabId } from "../hooks/useAstronomyLabState";

interface LabHeroProps {
  activeTab: LabTabId;
  setActiveTab: (tab: LabTabId) => void;
  isBackendOnline: boolean | null;
  onOpenInfo: (faqId: string) => void;
}

export function LabHero({ activeTab, setActiveTab, isBackendOnline, onOpenInfo }: LabHeroProps) {
  const TABS: Array<{ id: LabTabId; label: string; icon: React.ElementType; tag: string }> = [
    { id: "formulas", label: "Formulas & Sources", icon: BookOpen, tag: "सूत्र एवं ग्रन्थ" },
    {
      id: "ancient-instruments",
      label: "Ancient Instruments",
      icon: Compass,
      tag: "प्राचीन यन्त्र",
    },
    { id: "modern-instruments", label: "Modern Instruments", icon: Telescope, tag: "आधुनिक उपकरण" },
    {
      id: "instrument-comparison",
      label: "Instrument Comparison",
      icon: Scale,
      tag: "तुलनात्मक अध्ययन",
    },
    { id: "numerical-engine", label: "Numerical Engine", icon: Binary, tag: "गणना प्रयोगशाला" },
    { id: "difference-analysis", label: "Difference Graphs", icon: LineChart, tag: "अन्तर आलेख" },
    {
      id: "unit-compatibility",
      label: "Unit Compatibility",
      icon: Layers,
      tag: "इकाई व निर्देशांक",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-midnight/90 via-midnight-card/85 to-midnight/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
      {/* Decorative Celestial Rings */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/10 bg-radial from-amber-600/10 to-transparent blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full border border-cyan-500/10 bg-radial from-blue-900/10 to-transparent blur-xl"
        aria-hidden
      />

      <div className="relative z-10 space-y-6">
        {/* Module Sub-Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-xs font-semibold text-gold-light hover:bg-gold/25 hover:text-white transition-all shadow-sm"
            title="Return to KalaGanaka Home Page"
          >
            <Home className="h-3.5 w-3.5 text-gold" />
            <span>Home (मुख्य पृष्ठ)</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-light">
            <Scale className="h-3.5 w-3.5" />
            <span>Module 5 • प्राचीन एवं आधुनिक वेधशाला प्रयोगशाला</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
              isBackendOnline
                ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                : "border-amber-500/30 bg-amber-950/40 text-amber-300"
            }`}
          >
            <CheckCircle className="h-3 w-3" />
            <span>
              {isBackendOnline
                ? "FastAPI & NASA JPL DE421 Connected"
                : "Checking Ephemeris Connection..."}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenInfo("why-do-methods-differ")}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10"
          >
            <Sparkles className="h-3 w-3 text-gold-soft" />
            <span>Why Do Calculations Differ? ⓘ</span>
          </button>
        </div>

        {/* Heading and Subtitle */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ancient vs Modern{" "}
            <span className="bg-gradient-to-r from-gold via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              Astronomy Lab
            </span>
          </h1>
          <p className="font-serif text-sm font-medium text-slate-200 sm:text-lg">
            “Explore how traditional Indian astronomical methods and modern scientific techniques
            calculate, measure, and interpret celestial phenomena.”
          </p>
          <p className="font-deva text-xs text-gold-soft sm:text-sm">
            प्राचीन सिद्धान्त एवं आधुनिक दृग्गणित का निष्पक्ष, वैज्ञानिक एवं प्रमाणिक विश्लेषण
          </p>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "border-gold bg-gradient-to-r from-gold/20 to-amber-500/10 text-gold-light shadow-lg shadow-gold/15"
                    : "border-white/10 bg-black/40 text-slate-300 hover:border-white/25 hover:bg-black/60 hover:text-white"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-gold" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
