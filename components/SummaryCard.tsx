"use client";

import type { BaziChart } from "@/lib/bazi/types";
import { Stat } from "./ui";

export default function SummaryCard({ chart }: { chart: BaziChart }) {
  const bz = chart.pillars.map((p) => p.gan + p.zhi).join(" ");
  return (
    <div className="paper-card rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-foreground/50">八字</div>
          <div className="seal mt-1 text-2xl font-bold text-ink sm:text-3xl">
            {bz}
          </div>
        </div>
        <div className="text-right text-xs text-foreground/55">
          <div>{chart.input.gender === "male" ? "乾造（男）" : "坤造（女）"}</div>
          <div>
            生肖 {chart.shengXiao} · {chart.xingZuo}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="公历" value={chart.solarText} />
        <Stat label="农历" value={chart.lunarText} />
        <Stat
          label="排盘用时"
          value={
            chart.trueSolarAdjustMinutes !== 0
              ? `${chart.usedSolarText}（真太阳时校 ${chart.trueSolarAdjustMinutes > 0 ? "+" : ""}${chart.trueSolarAdjustMinutes}分）`
              : chart.usedSolarText
          }
        />
        <Stat label="胎元" value={chart.taiYuan} />
        <Stat label="命宫" value={chart.mingGong} />
        <Stat label="身宫" value={chart.shenGong} />
      </div>
    </div>
  );
}
