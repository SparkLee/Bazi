"use client";

import { useState } from "react";
import type { DaYunItem } from "@/lib/bazi/types";
import { WUXING_COLORS } from "@/lib/bazi/theory";
import { Section } from "./ui";

export default function DaYunCard({
  daYun,
  qiYunText,
}: {
  daYun: DaYunItem[];
  qiYunText: string;
}) {
  const currentIdx = daYun.findIndex((d) => d.isCurrent);
  const [selected, setSelected] = useState(currentIdx >= 0 ? currentIdx : 0);
  const [selYear, setSelYear] = useState<number | null>(null);
  const active = daYun[selected];
  const thisYear = new Date().getFullYear();
  const activeYear =
    active?.liuNian.find((l) => l.year === selYear) ??
    active?.liuNian.find((l) => l.year === thisYear) ??
    null;

  return (
    <Section title="大运 · 流年 · 流月" term="大运" subtitle={qiYunText}>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 thin-scroll">
        {daYun.map((d, i) => {
          const gc = WUXING_COLORS[d.ganWuXing];
          const zc = WUXING_COLORS[d.zhiWuXing];
          return (
            <button
              key={i}
              onClick={() => {
                setSelected(i);
                setSelYear(null);
              }}
              className={`flex w-16 shrink-0 flex-col items-center rounded-xl border p-2 transition ${
                selected === i
                  ? "border-gold bg-gold/10 ring-1 ring-gold"
                  : "border-line hover:border-gold/50"
              } ${d.isCurrent ? "shadow-[0_0_0_2px_rgba(176,141,87,0.25)]" : ""}`}
            >
              <span className="text-[10px] text-foreground/45">{d.startAge}岁</span>
              <span className="text-[10px] text-accent/70 mb-0.5">
                {d.ganShiShen || "—"}
              </span>
              <span className={`font-serif text-lg font-bold ${gc.text}`}>
                {d.gan}
              </span>
              <span className={`font-serif text-lg font-bold ${zc.text}`}>
                {d.zhi}
              </span>
              <span className="mt-0.5 text-[9px] text-foreground/40">
                {d.startYear}
              </span>
              {d.isCurrent && (
                <span className="mt-0.5 rounded-full bg-accent px-1 text-[8px] text-white">
                  当前
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-3 rounded-xl border border-line bg-background/30 p-3">
          <div className="mb-2 text-xs text-foreground/60">
            <span className="font-serif text-base font-semibold text-ink">
              {active.ganZhi}
            </span>{" "}
            运 · {active.startYear}–{active.endYear} 年（{active.startAge}–
            {active.endAge} 岁）· 点击流年查看流月
          </div>
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
            {active.liuNian.map((ln) => {
              const isNow = ln.year === thisYear;
              const isSel = activeYear?.year === ln.year;
              return (
                <button
                  key={ln.year}
                  onClick={() => setSelYear(ln.year)}
                  className={`rounded-lg border p-1.5 text-center transition ${
                    isSel
                      ? "border-gold bg-gold/15 ring-1 ring-gold"
                      : isNow
                        ? "border-accent bg-accent/10"
                        : "border-line bg-paper hover:border-gold/50"
                  }`}
                >
                  <div className="text-[9px] text-foreground/40">{ln.year}</div>
                  <div className="font-serif text-sm font-medium text-ink">
                    {ln.ganZhi}
                  </div>
                  <div className="text-[9px] text-accent/70">{ln.ganShiShen}</div>
                </button>
              );
            })}
          </div>

          {activeYear && (
            <div className="mt-3 border-t border-line pt-3">
              <div className="mb-2 text-xs text-foreground/60">
                <span className="font-serif text-sm font-semibold text-ink">
                  {activeYear.year} 年（{activeYear.ganZhi}）
                </span>{" "}
                流月：
              </div>
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-12">
                {activeYear.liuYue.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-line bg-paper p-1.5 text-center"
                  >
                    <div className="text-[9px] text-foreground/40">
                      {m.monthName}
                    </div>
                    <div className="font-serif text-sm font-medium text-ink">
                      {m.ganZhi}
                    </div>
                    <div className="text-[9px] text-accent/70">
                      {m.ganShiShen}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
