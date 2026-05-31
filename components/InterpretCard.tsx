"use client";

import type { Interpret } from "@/lib/bazi/types";
import { Section } from "./ui";

export default function InterpretCard({ interpret }: { interpret: Interpret }) {
  const { dayMasterPersonality: dm, tenGods, guidance } = interpret;
  return (
    <Section title="命理解读" subtitle="日主性格 · 十神 · 调候建议">
      {/* 日主性格 */}
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
        <h3 className="font-serif text-base font-semibold text-accent">
          {dm.title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/70">
          {dm.text}
        </p>
      </div>

      {/* 十神 */}
      {tenGods.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-ink">
            命局十神（{tenGods.length}）
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {tenGods.map((g) => (
              <div
                key={g.name}
                className="rounded-xl border border-line bg-background/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-semibold text-accent">
                    {g.name}
                  </span>
                  <span className="rounded bg-line/60 px-1.5 py-0.5 text-[10px] text-foreground/55">
                    {g.category}
                  </span>
                  <span className="ml-auto text-[10px] text-foreground/40">
                    {g.keywords}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/65">
                  {g.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 用神调候建议 */}
      <div className="mt-4 rounded-xl border border-line bg-background/30 p-4">
        <h3 className="mb-2 text-sm font-medium text-ink">用神调候建议</h3>
        <p className="mb-3 text-xs leading-relaxed text-foreground/60">
          {guidance.summary}
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <div className="mb-1.5 text-[11px] text-foreground/45">有利方位</div>
            <div className="flex flex-wrap gap-1.5">
              {guidance.directions.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700 ring-1 ring-sky-200"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] text-foreground/45">有利色彩</div>
            <div className="flex flex-wrap gap-1.5">
              {guidance.colors.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-xs text-foreground/65"
                >
                  <span
                    className="h-3 w-3 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 text-[11px] text-foreground/45">适宜领域</div>
            <div className="flex flex-wrap gap-1.5">
              {guidance.industries.map((it) => (
                <span
                  key={it}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 ring-1 ring-emerald-200"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
          {guidance.advice.map((a, i) => (
            <li
              key={i}
              className="flex gap-2 text-[13px] leading-relaxed text-foreground/70"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-foreground/40">
        以上解读由命局十神结构与喜用神规则生成，属命理逻辑推断，仅供自我认知与文化参考。
      </p>
    </Section>
  );
}
