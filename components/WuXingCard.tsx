"use client";

import type { WuXingStat, Analysis } from "@/lib/bazi/types";
import { WUXING_COLORS } from "@/lib/bazi/theory";
import { Section } from "./ui";

export default function WuXingCard({
  stats,
  analysis,
}: {
  stats: WuXingStat[];
  analysis: Analysis;
}) {
  const max = Math.max(...stats.map((s) => s.score), 0.01);
  const favSet = new Set(analysis.favorable);
  const unfavSet = new Set(analysis.unfavorable);

  return (
    <Section title="五行力量" term="五行" subtitle="天干 + 地支藏干加权统计">
      <div className="space-y-2.5">
        {stats.map((s) => {
          const c = WUXING_COLORS[s.wuXing];
          const tag =
            s.wuXing === analysis.dayMasterWuXing
              ? "日主"
              : favSet.has(s.wuXing)
                ? "喜用"
                : unfavSet.has(s.wuXing)
                  ? "忌"
                  : "";
          return (
            <div key={s.wuXing} className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-serif text-sm font-bold ring-1 ${c.bg} ${c.text} ${c.ring}`}
              >
                {s.wuXing}
              </div>
              <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-background/50">
                <div
                  className="h-full rounded-md transition-all duration-700"
                  style={{
                    width: `${(s.score / max) * 100}%`,
                    backgroundColor: c.hex,
                    opacity: 0.85,
                  }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-foreground/70">
                  {s.score} 分 · {(s.ratio * 100).toFixed(0)}%
                </span>
              </div>
              {tag && (
                <span
                  className={`w-9 shrink-0 text-center text-[10px] font-medium ${
                    tag === "忌"
                      ? "text-foreground/40"
                      : tag === "日主"
                        ? "text-accent"
                        : "text-emerald-600"
                  }`}
                >
                  {tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-foreground/45">
        计分规则：每个天干计 1 分；地支藏干按本气 1.0 / 中气 0.5 / 余气 0.3
        加权；月支本气当令再加权。此为透明的力量量化模型，便于追溯。
      </p>
    </Section>
  );
}
