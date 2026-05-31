"use client";

import type { HehunResult } from "@/lib/bazi/types";
import { Section } from "./ui";

const LEVEL_COLOR: Record<string, string> = {
  吉: "text-emerald-600",
  中: "text-amber-600",
  平: "text-foreground/60",
  凶: "text-rose-600",
};
const LEVEL_BAR: Record<string, string> = {
  吉: "#10b981",
  中: "#d97706",
  平: "#9ca3af",
  凶: "#f43f5e",
};

function MiniChart({
  title,
  bazi,
  shengXiao,
  dayMaster,
  favorable,
}: {
  title: string;
  bazi: string;
  shengXiao: string;
  dayMaster: string;
  favorable: string[];
}) {
  return (
    <div className="rounded-xl border border-line bg-background/30 p-3">
      <div className="mb-1 text-xs font-medium text-accent">{title}</div>
      <div className="seal text-lg font-bold text-ink">{bazi}</div>
      <div className="mt-1 text-[11px] text-foreground/55">
        生肖{shengXiao} · 日主{dayMaster} · 喜用{favorable.join("")}
      </div>
    </div>
  );
}

const LEVEL_TONE: Record<string, string> = {
  上等婚: "text-emerald-600",
  中等婚: "text-amber-600",
  中下婚: "text-orange-600",
  下等婚: "text-rose-600",
};

export default function HehunResultCard({ result }: { result: HehunResult }) {
  const {
    male,
    female,
    totalScore,
    grade,
    gradeDesc,
    dimensions,
    summary,
    zodiac,
    weddingDates,
  } = result;
  const ring =
    totalScore >= 72
      ? "#10b981"
      : totalScore >= 58
        ? "#d97706"
        : "#f43f5e";

  return (
    <div className="space-y-5 animate-fade-up">
      <Section title="合婚总评" subtitle="双盘合参 · 综合契合度">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div
            className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${ring} ${totalScore * 3.6}deg, var(--line) 0deg)`,
            }}
          >
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-paper">
              <span className="font-serif text-3xl font-bold text-ink">
                {totalScore}
              </span>
              <span className="text-[10px] text-foreground/45">分 / 100</span>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="font-serif text-2xl font-bold" style={{ color: ring }}>
              {grade}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/65">
              {gradeDesc}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MiniChart
            title="男方 · 乾造"
            bazi={male.pillars.map((p) => p.gan + p.zhi).join(" ")}
            shengXiao={male.shengXiao}
            dayMaster={male.dayMaster}
            favorable={male.analysis.favorable}
          />
          <MiniChart
            title="女方 · 坤造"
            bazi={female.pillars.map((p) => p.gan + p.zhi).join(" ")}
            shengXiao={female.shengXiao}
            dayMaster={female.dayMaster}
            favorable={female.analysis.favorable}
          />
        </div>
      </Section>

      <Section title="生肖配对" subtitle="民间婚配口诀">
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center gap-1 font-serif">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-xl text-ink">
              {zodiac.maleAnimal}
            </span>
            <span className="text-gold">♥</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl text-ink">
              {zodiac.femaleAnimal}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold text-ink">
                「{zodiac.verse}」
              </span>
              <span
                className={`rounded-full border border-current px-2 py-0.5 text-xs font-medium ${LEVEL_TONE[zodiac.level] ?? "text-foreground/60"}`}
              >
                {zodiac.level}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/65">
              {zodiac.text}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-foreground/40">
          生肖配对源自年支的合、冲、刑、害关系与民间歌诀，仅为传统民俗参考，实际仍以八字综合合参为准。
        </p>
      </Section>

      <Section title="合参详情" subtitle="逐项剖析 · 各有依据">
        <div className="space-y-3">
          {dimensions.map((d) => (
            <div
              key={d.name}
              className="rounded-xl border border-line bg-background/30 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-semibold text-ink">
                  {d.name}
                </span>
                <span className={`text-xs font-medium ${LEVEL_COLOR[d.level]}`}>
                  {d.level}
                </span>
                <span className="ml-auto text-xs text-foreground/50">
                  {d.score} / {d.max}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/50">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(d.score / d.max) * 100}%`,
                    backgroundColor: LEVEL_BAR[d.level],
                  }}
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/65">
                {d.detail}
              </p>
            </div>
          ))}
        </div>

        <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
          {summary.map((s, i) => (
            <li
              key={i}
              className="flex gap-2 text-[13px] leading-relaxed text-foreground/70"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="结婚择吉" subtitle="近一年宜嫁娶之黄道吉日">
        {weddingDates.length === 0 ? (
          <p className="text-sm text-foreground/50">
            近一年内未筛得同时满足「宜嫁娶、黄道吉神、不冲新人生肖」的日子，可放宽条件或择日另算。
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {weddingDates.map((d, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-background/30 p-3"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-base font-semibold text-ink">
                    {d.solarText}
                  </span>
                  <span className="text-xs text-foreground/45">{d.weekday}</span>
                </div>
                <div className="mt-0.5 text-xs text-foreground/55">
                  农历{d.lunarText} · {d.ganZhi}日
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 ring-1 ring-emerald-200">
                    {d.tianShen}
                  </span>
                  <span className="rounded bg-sky-50 px-1.5 py-0.5 text-sky-700 ring-1 ring-sky-200">
                    {d.zhiXing}日
                  </span>
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-600 ring-1 ring-rose-200">
                    冲{d.chongShengXiao}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-foreground/55">
                  宜：{d.yi.join("、")}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-foreground/40">
          择日依通书每日宜忌、黄道黑道十二神与建除值星，并避开冲犯新人生肖之日。如需精细择吉（不将日、行嫁月、周堂等），建议另请专业核算。
        </p>
      </Section>
    </div>
  );
}
