import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Moon, Sun, Sparkles, ArrowLeft, Menu, X, Home, Scale } from "lucide-react";

export interface NavigationHeaderProps {
  currentFeature?:
    | "timekeeping"
    | "chandra-panchang"
    | "saur-panchang"
    | "assistant"
    | "astronomy-lab"
    | "analysis-lab";
  title?: string;
  subtitle?: string;
}

export const NAV_LINKS = [
  {
    to: "/timekeeping",
    label: "काल-गणना",
    enLabel: "Timekeeping",
    icon: Sun,
    id: "timekeeping",
  },
  {
    to: "/chandra-panchang",
    label: "चन्द्र पञ्चाङ्ग",
    enLabel: "Chandra Panchang",
    icon: Moon,
    id: "chandra-panchang",
  },
  {
    to: "/saur-panchang",
    label: "सौर पञ्चाङ्ग",
    enLabel: "Saur Panchang",
    icon: Sun,
    id: "saur-panchang",
  },
  {
    to: "/astronomy-lab",
    label: "वेधशाला प्रयोगशाला",
    enLabel: "Analysis Lab",
    icon: Scale,
    id: "astronomy-lab",
  },
  {
    to: "/assistant",
    label: "काल-संवाद",
    enLabel: "AI Assistant",
    icon: Sparkles,
    id: "assistant",
  },
] as const;

export function NavigationHeader({ currentFeature, title, subtitle }: NavigationHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left Branding & Home Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg border border-gold/20 bg-gold/5 px-2.5 py-1.5 font-sans text-xs font-medium text-gold-soft transition-colors hover:bg-gold/15 hover:text-gold"
            aria-label="Back to KalaGanaka Home"
          >
            <Home className="h-4 w-4 text-gold" />
            <span>Home</span>
          </Link>
          <div className="h-4 w-px bg-gold/20" />
          <Link to="/" className="group flex flex-col items-start leading-none">
            <span className="font-deva text-xl text-gold-gradient group-hover:opacity-90 sm:text-2xl">
              कलागणक
            </span>
            <span className="hidden font-sans text-[10px] tracking-widest text-gold-soft/70 uppercase sm:inline">
              KalaGanaka
            </span>
          </Link>

          {title && (
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
              <span className="text-gold/30">/</span>
              <span className="text-gold-light font-medium">{title}</span>
              {subtitle && <span className="text-gold-soft/60">({subtitle})</span>}
            </div>
          )}
        </div>

        {/* Center / Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = currentFeature === item.id || currentPath === item.to;
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs transition-all ${
                  isActive
                    ? "border border-gold/40 bg-gold/15 text-gold font-semibold shadow-[0_0_12px_rgba(234,179,8,0.2)]"
                    : "text-gold-soft hover:bg-gold/10 hover:text-gold border border-transparent"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-gold" : "text-gold-soft/80"}`} />
                <span>{item.enLabel}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-gold/20 bg-gold/10 p-2 text-gold hover:bg-gold/20"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mt-3 border-t border-gold/15 pt-3 md:hidden">
          <nav className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg border border-gold/15 bg-background/80 p-2.5 text-xs text-gold-soft hover:bg-gold/10"
            >
              <Home className="h-4 w-4 text-gold" />
              <span>मुख्य पृष्ठ (Home)</span>
            </Link>
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = currentFeature === item.id || currentPath === item.to;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs transition-colors ${
                    isActive
                      ? "border border-gold/40 bg-gold/20 text-gold font-semibold"
                      : "border border-gold/15 bg-background/80 text-gold-soft hover:bg-gold/10"
                  }`}
                >
                  <Icon className="h-4 w-4 text-gold" />
                  <div>
                    <div className="font-deva text-[11px] leading-tight text-gold-light">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{item.enLabel}</div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
