"use client";

import { useEffect, useState } from "react";
import type { BaziInput, BaziChart, Gender, CalendarType } from "@/lib/bazi/types";
import { computeBazi } from "@/lib/bazi/engine";
import InputForm from "./InputForm";
import SummaryCard from "./SummaryCard";
import PillarsCard from "./PillarsCard";
import WuXingCard from "./WuXingCard";
import AnalysisCard from "./AnalysisCard";
import ShenShaCard from "./ShenShaCard";
import InterpretCard from "./InterpretCard";
import DaYunCard from "./DaYunCard";
import TheoryCard from "./TheoryCard";
import ExportBar from "./ExportBar";
import HehunPanel from "./HehunPanel";

function encodeInput(input: BaziInput): string {
  const p = new URLSearchParams();
  p.set("cal", input.calendar);
  p.set("y", String(input.year));
  p.set("m", String(input.month));
  p.set("d", String(input.day));
  p.set("h", String(input.hour));
  p.set("mi", String(input.minute));
  p.set("g", input.gender);
  p.set("leap", input.isLeapMonth ? "1" : "0");
  p.set("tst", input.useTrueSolarTime ? "1" : "0");
  if (input.longitude != null) p.set("lng", String(input.longitude));
  return p.toString();
}

function decodeInput(search: string): BaziInput | null {
  const p = new URLSearchParams(search);
  if (!p.has("y")) return null;
  const num = (k: string, d: number) => {
    const v = Number(p.get(k));
    return Number.isFinite(v) ? v : d;
  };
  return {
    calendar: (p.get("cal") as CalendarType) === "lunar" ? "lunar" : "solar",
    year: num("y", 1995),
    month: num("m", 6),
    day: num("d", 15),
    hour: num("h", 12),
    minute: num("mi", 0),
    gender: (p.get("g") as Gender) === "female" ? "female" : "male",
    isLeapMonth: p.get("leap") === "1",
    useTrueSolarTime: p.get("tst") === "1",
    longitude: p.has("lng") ? num("lng", 116.4) : null,
  };
}

export default function BaziApp() {
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initial, setInitial] = useState<BaziInput | undefined>(undefined);
  const [shareUrl, setShareUrl] = useState("");
  const [mode, setMode] = useState<"single" | "hehun">("single");

  // 从 URL 还原命盘
  useEffect(() => {
    const parsed = decodeInput(window.location.search);
    if (parsed) {
      setInitial(parsed);
      try {
        setChart(computeBazi(parsed));
        setShareUrl(window.location.href);
      } catch {
        /* ignore */
      }
    }
  }, []);

  function handleSubmit(input: BaziInput) {
    try {
      setError(null);
      const result = computeBazi(input);
      setChart(result);
      const qs = encodeInput(input);
      const url = `${window.location.origin}${window.location.pathname}?${qs}`;
      window.history.replaceState(null, "", `?${qs}`);
      setShareUrl(url);
      requestAnimationFrame(() => {
        document
          .getElementById("result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      console.error(e);
      setError("排盘失败，请检查日期是否有效（如农历闰月、月份天数等）。");
      setChart(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-paper px-3 py-1 text-xs text-gold">
          子平八字 · 传统命理排盘
        </div>
        <h1 className="seal text-4xl font-bold text-ink sm:text-5xl">知 命</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/55">
          基于干支历法、五行生克与十神旺衰的可解释排盘工具。四柱 · 五行 · 十神 · 神煞 · 用神 · 大运流年流月，每一项推演都有理论依据与计算过程，重在理解传统命理的逻辑，而非迷信。
        </p>
        <div className="mt-5 inline-flex rounded-xl border border-line bg-paper p-1 text-sm">
          {(
            [
              ["single", "单人排盘"],
              ["hehun", "合婚合参"],
            ] as ["single" | "hehun", string][]
          ).map(([m, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-5 py-1.5 font-medium transition ${
                mode === m
                  ? "bg-gold text-white shadow-sm"
                  : "text-foreground/60 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {mode === "hehun" ? (
        <HehunPanel />
      ) : (
      <div className="grid gap-5 lg:grid-cols-[360px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-6">
          <InputForm onSubmit={handleSubmit} initial={initial} />
          {error && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div id="result" className="space-y-5">
          {chart ? (
            <div className="space-y-5 animate-fade-up">
              <div className="flex justify-end">
                <ExportBar
                  chart={chart}
                  shareUrl={shareUrl}
                  captureId="capture"
                />
              </div>
              <div id="capture" className="space-y-5">
                <SummaryCard chart={chart} />
                <PillarsCard pillars={chart.pillars} />
                <WuXingCard stats={chart.wuXingStats} analysis={chart.analysis} />
                <AnalysisCard analysis={chart.analysis} />
                <ShenShaCard shenSha={chart.shenSha} />
                <InterpretCard interpret={chart.interpret} />
                <DaYunCard daYun={chart.daYun} qiYunText={chart.qiYunText} />
              </div>
              <TheoryCard />
            </div>
          ) : (
            <>
              <div className="paper-card flex min-h-[300px] flex-col items-center justify-center rounded-2xl p-8 text-center">
                <div className="seal mb-3 text-5xl text-gold/40">命</div>
                <p className="text-sm text-foreground/50">
                  填写左侧生辰信息，点击「起盘」即可查看四柱、五行、十神、神煞、用神与大运流年流月的完整推演。
                </p>
              </div>
              <TheoryCard />
            </>
          )}
        </div>
      </div>
      )}

      <footer className="mt-12 border-t border-line pt-6 text-center text-xs text-foreground/40">
        排盘历法基于天文算法（lunar-typescript），节气与干支精确到分。本工具仅供传统文化研究与自我认知参考。
      </footer>
    </main>
  );
}
