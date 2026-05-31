"use client";

import type { Analysis } from "@/lib/bazi/types";
import { WUXING_COLORS } from "@/lib/bazi/theory";
import { Section, WuXingTag, InfoTip } from "./ui";

export default function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const strengthColor =
    analysis.strength === "身强"
      ? "text-rose-600"
      : analysis.strength === "身弱"
        ? "text-sky-600"
        : "text-amber-600";

  return (
    <Section
      title="日主旺衰与用神"
      term="用神 / 喜忌"
      subtitle={analysis.method}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-background/30 p-3 text-center">
          <div className="text-[11px] text-foreground/50">
            日主 <InfoTip term="日主（日元）" />
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <WuXingTag wuXing={analysis.dayMasterWuXing}>
              {analysis.dayMaster}
            </WuXingTag>
            <span className="font-serif text-lg text-ink">
              {analysis.dayMasterYinYang}
              {analysis.dayMasterWuXing}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-background/30 p-3 text-center">
          <div className="text-[11px] text-foreground/50">
            月令旺衰 <InfoTip term="旺衰（得令）" />
          </div>
          <div className={`mt-1 font-serif text-2xl font-bold ${strengthColor}`}>
            {analysis.seasonState}
          </div>
          <div className="text-[11px] text-foreground/40">
            生于 {analysis.monthZhi} 月
          </div>
        </div>
        <div className="rounded-xl border border-line bg-background/30 p-3 text-center">
          <div className="text-[11px] text-foreground/50">
            身强身弱 <InfoTip term="身强身弱" />
          </div>
          <div className={`mt-1 font-serif text-2xl font-bold ${strengthColor}`}>
            {analysis.strength}
          </div>
          <div className="text-[11px] text-foreground/40">
            同类占比 {(analysis.strengthRatio * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* 力量天平 */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[11px] text-foreground/50">
          <span>同类力量（印 + 比劫）{analysis.supportScore}</span>
          <span>异类力量（食伤 + 财 + 官杀）{analysis.drainScore}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full ring-1 ring-line">
          <div
            className="bg-rose-400/80"
            style={{ width: `${analysis.strengthRatio * 100}%` }}
          />
          <div
            className="bg-sky-400/80"
            style={{ width: `${(1 - analysis.strengthRatio) * 100}%` }}
          />
        </div>
      </div>

      {/* 喜用 / 忌神 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3">
          <div className="mb-2 text-xs font-medium text-emerald-700">
            喜用神（宜补）
          </div>
          <div className="flex gap-1.5">
            {analysis.favorable.map((w) => (
              <WuXingTag key={w} wuXing={w} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-background/30 p-3">
          <div className="mb-2 text-xs font-medium text-foreground/50">
            忌神（宜避）
          </div>
          <div className="flex gap-1.5">
            {analysis.unfavorable.map((w) => (
              <WuXingTag key={w} wuXing={w} />
            ))}
          </div>
        </div>
      </div>

      {/* 推演过程 */}
      <details className="mt-4 group" open>
        <summary className="cursor-pointer select-none text-sm font-medium text-accent">
          推演过程（点击展开/收起）
        </summary>
        <ol className="relative mt-2 space-y-1.5">
          <span
            aria-hidden
            className="absolute left-2 top-1.5 bottom-1.5 w-0.5 -translate-x-1/2 rounded bg-gold/30"
          />
          {analysis.reasoning.map((r, i) => (
            <li
              key={i}
              className="relative pl-7 text-[13px] leading-relaxed text-foreground/70"
            >
              <span className="absolute left-2 top-0.5 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-gold text-[9px] text-white">
                {i + 1}
              </span>
              {r}
            </li>
          ))}
        </ol>
      </details>
    </Section>
  );
}
