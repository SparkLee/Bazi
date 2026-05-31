"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { WUXING_COLORS, TERM_MAP } from "@/lib/bazi/theory";
import type { WuXing } from "@/lib/bazi/types";

export function WuXingTag({
  wuXing,
  children,
  size = "md",
}: {
  wuXing: WuXing;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const c = WUXING_COLORS[wuXing];
  const sz =
    size === "lg"
      ? "text-2xl w-12 h-12 sm:w-14 sm:h-14"
      : size === "sm"
        ? "text-xs w-6 h-6"
        : "text-base w-9 h-9";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md font-serif font-semibold ring-1 ${c.bg} ${c.text} ${c.ring} ${sz}`}
    >
      {children ?? wuXing}
    </span>
  );
}

export function Section({
  title,
  subtitle,
  term,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  term?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`paper-card rounded-2xl p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-baseline gap-2">
        <h2 className="font-serif text-xl font-semibold text-ink flex items-center gap-1.5">
          <span className="inline-block h-4 w-1 rounded-full bg-gold" />
          {title}
        </h2>
        {term && <InfoTip term={term} />}
        {subtitle && (
          <span className="text-xs text-foreground/50">{subtitle}</span>
        )}
      </div>
      {children}
    </section>
  );
}

/** 术语解释气泡：体现可解释性 */
export function InfoTip({ term, label }: { term: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const def = TERM_MAP[term];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!def) return null;

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-gold/50 text-[10px] leading-none text-gold transition hover:bg-gold hover:text-white"
        aria-label={`${term} 释义`}
      >
        {label ?? "?"}
      </button>
      {open && (
        <span className="absolute left-1/2 top-6 z-30 w-64 -translate-x-1/2 rounded-xl border border-line bg-paper p-3 text-left shadow-xl">
          <span className="mb-1 block font-serif text-sm font-semibold text-accent">
            {def.term}
          </span>
          <span className="mb-1.5 block text-xs font-medium text-foreground/70">
            {def.short}
          </span>
          <span className="block text-xs leading-relaxed text-foreground/60">
            {def.detail}
          </span>
        </span>
      )}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-background/40 px-3 py-2">
      <div className="text-[11px] text-foreground/50">{label}</div>
      <div className="mt-0.5 font-serif text-sm font-medium text-ink">
        {value}
      </div>
    </div>
  );
}
