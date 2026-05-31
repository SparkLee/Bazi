"use client";

import { TERMS } from "@/lib/bazi/theory";
import { Section } from "./ui";

export default function TheoryCard() {
  return (
    <Section
      title="理论依据 · 术语释义"
      subtitle="知其然，亦知其所以然"
    >
      <p className="mb-4 text-[13px] leading-relaxed text-foreground/60">
        本工具采用<strong className="text-accent">子平八字</strong>体系，以干支历法与二十四节气为时间基础，依据五行生克、十神关系与旺衰平衡进行推演。所有结论均来自可追溯的规则与数据，不含任何随机或臆测成分——它是一套<strong className="text-accent">逻辑模型</strong>，而非占卜。命运由多种因素共同决定，本结果仅供文化研究与自我认知参考。
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {TERMS.map((t) => (
          <details
            key={t.term}
            className="group rounded-xl border border-line bg-background/30 p-3"
          >
            <summary className="flex cursor-pointer select-none items-center justify-between text-sm font-medium text-ink">
              <span className="font-serif">{t.term}</span>
              <span className="text-xs text-foreground/40 transition group-open:rotate-180">
                ▾
              </span>
            </summary>
            <p className="mt-1 text-xs font-medium text-accent/80">{t.short}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground/60">
              {t.detail}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
