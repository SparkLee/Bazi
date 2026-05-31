"use client";

import { useRef, useState } from "react";
import type { BaziInput, HehunResult } from "@/lib/bazi/types";
import { computeBazi } from "@/lib/bazi/engine";
import { computeHehun } from "@/lib/bazi/hehun";
import InputForm from "./InputForm";
import HehunResultCard from "./HehunResult";

const maleDefault: BaziInput = {
  calendar: "solar",
  year: 1992,
  month: 8,
  day: 18,
  hour: 10,
  minute: 0,
  isLeapMonth: false,
  gender: "male",
  longitude: null,
  useTrueSolarTime: false,
};

const femaleDefault: BaziInput = {
  ...maleDefault,
  year: 1994,
  month: 3,
  day: 22,
  hour: 16,
  gender: "female",
};

export default function HehunPanel() {
  const maleRef = useRef<BaziInput>(maleDefault);
  const femaleRef = useRef<BaziInput>(femaleDefault);
  const [result, setResult] = useState<HehunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function hePan() {
    try {
      setError(null);
      const m = computeBazi({ ...maleRef.current, gender: "male" });
      const f = computeBazi({ ...femaleRef.current, gender: "female" });
      setResult(computeHehun(m, f));
      requestAnimationFrame(() => {
        document
          .getElementById("hehun-result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      console.error(e);
      setError("合婚失败，请检查双方出生信息是否有效。");
      setResult(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <InputForm
          title="男方 · 乾造"
          showSubmit={false}
          lockGender
          initial={maleDefault}
          onChange={(v) => (maleRef.current = v)}
        />
        <InputForm
          title="女方 · 坤造"
          showSubmit={false}
          lockGender
          initial={femaleDefault}
          onChange={(v) => (femaleRef.current = v)}
        />
      </div>

      <button
        onClick={hePan}
        className="w-full rounded-xl bg-gradient-to-b from-accent to-[#6f4536] py-3 font-serif text-base font-semibold tracking-wider text-white shadow-md transition hover:brightness-110 active:scale-[0.99]"
      >
        合 参
      </button>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div id="hehun-result">
        {result ? (
          <HehunResultCard result={result} />
        ) : (
          <div className="paper-card flex min-h-[200px] flex-col items-center justify-center rounded-2xl p-8 text-center">
            <div className="seal mb-3 text-5xl text-gold/40">缘</div>
            <p className="text-sm text-foreground/50">
              分别填写男女双方生辰，点击「合参」查看生肖、夫妻宫、日主、纳音、五行与用神的合婚综合评估。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
