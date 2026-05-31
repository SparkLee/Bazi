"use client";

import { useState } from "react";
import type { BaziChart } from "@/lib/bazi/types";

function buildText(chart: BaziChart): string {
  const bz = chart.pillars.map((p) => p.gan + p.zhi).join(" ");
  const a = chart.analysis;
  const lines = [
    `【知命 · 八字排盘】`,
    `${chart.input.gender === "male" ? "乾造（男）" : "坤造（女）"}`,
    `公历：${chart.solarText}`,
    `农历：${chart.lunarText}`,
    `八字：${bz}`,
    `生肖：${chart.shengXiao}　星座：${chart.xingZuo}`,
    `日主：${a.dayMaster}（${a.dayMasterYinYang}${a.dayMasterWuXing}）　${a.strength}`,
    `月令旺衰：${a.seasonState}　喜用：${a.favorable.join("、")}　忌神：${a.unfavorable.join("、")}`,
    `胎元：${chart.taiYuan}　命宫：${chart.mingGong}　身宫：${chart.shenGong}`,
    chart.shenSha.length
      ? `神煞：${chart.shenSha.map((s) => s.name).join("、")}`
      : "",
    chart.qiYunText,
  ];
  return lines.filter(Boolean).join("\n");
}

export default function ExportBar({
  chart,
  shareUrl,
  captureId,
}: {
  chart: BaziChart;
  shareUrl: string;
  captureId: string;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(null), 2000);
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      flash(`${label}已复制`);
    } catch {
      flash("复制失败，请手动复制");
    }
  }

  async function exportImage() {
    const el = document.getElementById(captureId);
    if (!el) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const canvas = await html2canvas(el, {
        backgroundColor: "#f7f3ec",
        scale: Math.min(2, window.devicePixelRatio || 1.5),
        useCORS: true,
      });
      const bz = chart.pillars.map((p) => p.gan + p.zhi).join("");
      const link = document.createElement("a");
      link.download = `命盘_${bz}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      flash("命盘图片已导出");
    } catch (e) {
      console.error(e);
      flash("导出失败");
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-medium text-foreground/70 transition hover:border-gold hover:text-gold disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={exportImage} disabled={busy} className={btn}>
        {busy ? "导出中…" : "导出命盘图片"}
      </button>
      <button onClick={() => copy(buildText(chart), "命盘文本")} className={btn}>
        复制命盘文本
      </button>
      <button onClick={() => copy(shareUrl, "分享链接")} className={btn}>
        复制分享链接
      </button>
      {msg && (
        <span className="text-xs text-emerald-600 animate-fade-up">{msg}</span>
      )}
    </div>
  );
}
