"use client";

import type { ShenSha } from "@/lib/bazi/types";
import { Section } from "./ui";

const TYPE_STYLE: Record<ShenSha["type"], string> = {
  吉: "border-emerald-200 bg-emerald-50/50 text-emerald-700",
  凶: "border-rose-200 bg-rose-50/50 text-rose-700",
  中: "border-amber-200 bg-amber-50/50 text-amber-700",
};

const DOT: Record<ShenSha["type"], string> = {
  吉: "bg-emerald-500",
  凶: "bg-rose-500",
  中: "bg-amber-500",
};

export default function ShenShaCard({ shenSha }: { shenSha: ShenSha[] }) {
  if (shenSha.length === 0) {
    return (
      <Section title="神煞" subtitle="命局未见常用神煞">
        <p className="text-sm text-foreground/50">
          当前四柱中未查出常见神煞。神煞是命理中的辅助符号，无则以正格五行十神为主论命。
        </p>
      </Section>
    );
  }

  return (
    <Section title="神煞" subtitle="吉凶辅星 · 点击查看查法与含义">
      <div className="grid gap-2 sm:grid-cols-2">
        {shenSha.map((s) => (
          <details
            key={s.name}
            className="group rounded-xl border border-line bg-background/30 p-3"
          >
            <summary className="flex cursor-pointer select-none items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[s.type]}`} />
              <span className="font-serif text-sm font-semibold text-ink">
                {s.name}
              </span>
              <span
                className={`rounded-full border px-1.5 py-0.5 text-[10px] ${TYPE_STYLE[s.type]}`}
              >
                {s.type}
              </span>
              <span className="ml-auto flex flex-wrap justify-end gap-1">
                {s.positions.map((p) => (
                  <span
                    key={p}
                    className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] text-gold"
                  >
                    {p}
                  </span>
                ))}
              </span>
            </summary>
            <div className="mt-2 space-y-1 text-xs">
              <p className="text-foreground/45">查法：{s.rule}</p>
              <p className="leading-relaxed text-foreground/65">{s.desc}</p>
              {s.verdict && (
                <p className="mt-1.5 rounded-lg bg-gold/8 px-2 py-1.5 leading-relaxed text-accent">
                  <span className="font-medium">联动旺衰：</span>
                  {s.verdict}
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
