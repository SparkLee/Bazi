"use client";

import type { Pillar } from "@/lib/bazi/types";
import { WUXING_COLORS } from "@/lib/bazi/theory";
import { Section, InfoTip } from "./ui";

function GanZhiTile({
  char,
  wuXing,
  yinYang,
}: {
  char: string;
  wuXing: keyof typeof WUXING_COLORS;
  yinYang: string;
}) {
  const c = WUXING_COLORS[wuXing];
  return (
    <div
      className={`relative flex aspect-square w-full max-w-[72px] mx-auto items-center justify-center rounded-xl ring-1 ${c.bg} ${c.ring}`}
    >
      <span className={`font-serif text-3xl font-bold sm:text-4xl ${c.text}`}>
        {char}
      </span>
      <span
        className={`absolute bottom-0.5 right-1 text-[10px] ${c.text} opacity-70`}
      >
        {yinYang}
        {wuXing}
      </span>
    </div>
  );
}

export default function PillarsCard({ pillars }: { pillars: Pillar[] }) {
  return (
    <Section title="四柱八字" term="四柱八字" subtitle="年 · 月 · 日 · 时">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {pillars.map((p) => {
          const isDay = p.label === "日柱";
          return (
            <div
              key={p.label}
              className={`flex flex-col items-center rounded-xl p-2 sm:p-3 ${
                isDay ? "bg-gold/8 ring-1 ring-gold/30" : ""
              }`}
            >
              <div className="mb-1 text-xs font-medium text-foreground/50">
                {p.label}
              </div>
              <div className="mb-1.5 text-center text-[11px] sm:text-xs">
                <span className="text-accent font-medium">
                  {isDay ? "日主" : p.ganShiShen}
                </span>
              </div>

              <GanZhiTile
                char={p.gan}
                wuXing={p.ganWuXing}
                yinYang={p.ganYinYang}
              />
              <div className="my-1.5 h-px w-8 bg-line" />
              <GanZhiTile
                char={p.zhi}
                wuXing={p.zhiWuXing}
                yinYang={p.zhiYinYang}
              />

              <div className="mt-2 w-full space-y-0.5 text-center">
                {p.hiddenStems.map((h) => (
                  <div
                    key={h.gan}
                    className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px]"
                  >
                    <span className={`${WUXING_COLORS[h.wuXing].text} font-serif`}>
                      {h.gan}
                    </span>
                    <span className="text-foreground/45">{h.shiShen}</span>
                  </div>
                ))}
              </div>

              <dl className="mt-2 w-full space-y-1 border-t border-line pt-2 text-center text-[10px] text-foreground/55 sm:text-[11px]">
                <div>
                  <dt className="text-foreground/35">星运</dt>
                  <dd className="font-medium text-foreground/70">{p.diShi}</dd>
                </div>
                <div>
                  <dt className="text-foreground/35">纳音</dt>
                  <dd className="font-medium text-foreground/70">{p.naYin}</dd>
                </div>
                <div>
                  <dt className="text-foreground/35">空亡</dt>
                  <dd className="font-medium text-foreground/70">{p.xunKong}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground/45">
        <span className="inline-flex items-center gap-1">
          天干主星 <InfoTip term="十神" />
        </span>
        <span className="inline-flex items-center gap-1">
          地支藏干 <InfoTip term="地支藏干" />
        </span>
        <span className="inline-flex items-center gap-1">
          纳音 <InfoTip term="纳音" />
        </span>
      </p>
    </Section>
  );
}
