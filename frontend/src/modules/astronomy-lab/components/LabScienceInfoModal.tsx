/**
 * components/LabScienceInfoModal.tsx
 * Interactive Scientific Knowledge & FAQ Modal.
 * Accessible dialog explaining the physics, mathematical foundations, coordinate frames,
 * and historical sources behind astronomical discrepancies and instruments.
 */

import React, { useState, useEffect } from "react";
import {
  X,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { SCIENTIFIC_FAQS } from "../constants/labConstants";
import type { ScientificFaqItem } from "../types/astronomyLab";

interface LabScienceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicId?: string;
}

export function LabScienceInfoModal({ isOpen, onClose, initialTopicId }: LabScienceInfoModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    initialTopicId || SCIENTIFIC_FAQS[0]?.id || null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (initialTopicId) {
      setExpandedId(initialTopicId);
    }
  }, [initialTopicId]);

  // Handle ESC key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredFaqs = SCIENTIFIC_FAQS.filter((faq) => {
    const q = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.questionHindi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-gold/30 bg-[#090d1a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-gold/30 bg-gold/15 p-2 text-gold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white sm:text-xl">
                Scientific Reference & Analytical FAQ
              </h2>
              <p className="font-deva text-xs text-gold-soft">
                वैज्ञानिक सन्दर्भ एवं अनुसन्धान सम्बन्धी प्रश्नोत्तरी
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-slate-400 hover:border-white/30 hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="border-b border-white/5 bg-black/40 px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search scientific explanations, formulas, or coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Content Body: Scrollable FAQ list */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition-colors hover:border-gold/30"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-white">{faq.question}</h3>
                    <p className="mt-0.5 font-deva text-xs text-gold-soft">{faq.questionHindi}</p>
                  </div>
                  <div className="mt-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/10 bg-white/5 p-4 space-y-3 text-xs">
                    <p className="leading-relaxed text-slate-200">{faq.answer}</p>

                    {faq.technicalDetails && (
                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-[11px] text-indigo-200">
                        <strong className="block text-indigo-300 font-semibold mb-1">
                          Technical & Mathematical Notes:
                        </strong>
                        {faq.technicalDetails}
                      </div>
                    )}

                    {faq.scientificCitations.length > 0 && (
                      <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400">
                        <strong>Academic Citations:</strong>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-300">
                          {faq.scientificCitations.map((cit, idx) => (
                            <li key={idx}>{cit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching scientific explanations found for "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-6 py-3.5 text-xs text-slate-400">
          <span>KalaGanaka Empirical Astronomy Verification Engine</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gold/40 bg-gold/20 px-4 py-1.5 text-xs font-semibold text-white hover:bg-gold/30"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
}
