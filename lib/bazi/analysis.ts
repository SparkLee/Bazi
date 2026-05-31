import type { Pillar, WuXingStat, Analysis, WuXing, TenGodGroup } from "./types";
import {
  GAN_WUXING,
  GAN_YINYANG,
  ZHI_WUXING,
  WUXING_SHENG,
  WUXING_KE,
  shengMe,
  keMe,
} from "./theory";

/** 判断日主在月令的旺衰状态：旺/相/休/囚/死 */
function seasonState(dayWuXing: WuXing, monthWuXing: WuXing): string {
  if (dayWuXing === monthWuXing) return "旺";
  if (WUXING_SHENG[monthWuXing] === dayWuXing) return "相"; // 月令生日主
  if (WUXING_SHENG[dayWuXing] === monthWuXing) return "休"; // 日主生月令（泄气）
  if (WUXING_KE[dayWuXing] === monthWuXing) return "囚"; // 日主克月令（耗力）
  if (WUXING_KE[monthWuXing] === dayWuXing) return "死"; // 月令克日主
  return "—";
}

function categoryOf(
  dayWuXing: WuXing,
  target: WuXing,
): TenGodGroup["category"] {
  if (target === dayWuXing) return "比劫";
  if (shengMe(dayWuXing) === target) return "印枭";
  if (WUXING_SHENG[dayWuXing] === target) return "食伤";
  if (WUXING_KE[dayWuXing] === target) return "财才";
  return "官杀"; // keMe(dayWuXing) === target
}

export function analyze(
  pillars: Pillar[],
  wuXingStats: WuXingStat[],
  dayGan: string,
  monthZhi: string,
): Analysis {
  const dayWuXing = GAN_WUXING[dayGan];
  const monthWuXing = ZHI_WUXING[monthZhi];
  const scoreMap = new Map<WuXing, number>(
    wuXingStats.map((s) => [s.wuXing, s.score]),
  );

  const tenGodGroups: TenGodGroup[] = wuXingStats.map((s) => ({
    wuXing: s.wuXing,
    category: categoryOf(dayWuXing, s.wuXing),
    score: s.score,
  }));

  const sameWx = dayWuXing;
  const yinWx = shengMe(dayWuXing); // 生我（印）
  const shiShangWx = WUXING_SHENG[dayWuXing]; // 我生（食伤）
  const caiWx = WUXING_KE[dayWuXing]; // 我克（财）
  const guanWx = keMe(dayWuXing); // 克我（官杀）

  const supportScore =
    (scoreMap.get(sameWx) ?? 0) + (scoreMap.get(yinWx) ?? 0);
  const drainScore =
    (scoreMap.get(shiShangWx) ?? 0) +
    (scoreMap.get(caiWx) ?? 0) +
    (scoreMap.get(guanWx) ?? 0);

  const total = supportScore + drainScore || 1;
  const ratio = supportScore / total;

  // 月令得令也增强日主：以季节状态微调判断
  const state = seasonState(dayWuXing, monthWuXing);
  const stateBonus =
    state === "旺" ? 0.06 : state === "相" ? 0.03 : state === "死" ? -0.06 : state === "囚" ? -0.03 : 0;
  const adjRatio = Math.min(0.99, Math.max(0.01, ratio + stateBonus));

  let strength: Analysis["strength"];
  if (adjRatio >= 0.58) strength = "身强";
  else if (adjRatio >= 0.5) strength = "均衡偏强";
  else if (adjRatio >= 0.42) strength = "均衡偏弱";
  else strength = "身弱";

  const isStrong = strength === "身强" || strength === "均衡偏强";

  const favorable: WuXing[] = isStrong
    ? [guanWx, shiShangWx, caiWx]
    : [yinWx, sameWx];
  const unfavorable: WuXing[] = isStrong
    ? [sameWx, yinWx]
    : [shiShangWx, caiWx, guanWx];

  const method = "扶抑取用法（旺者抑之、弱者扶之，以求五行流通中和）";

  const f = (n: number) => Math.round(n * 100) / 100;
  const reasoning: string[] = [
    `日主为「${dayGan}」，五行属${dayWuXing}（${GAN_YINYANG[dayGan]}${dayWuXing}）。`,
    `生于「${monthZhi}」月（月令属${monthWuXing}），日主处于「${state}」的状态——月令对日主力量影响最大。`,
    `同类力量（比劫${f(scoreMap.get(sameWx) ?? 0)} + 印枭${f(scoreMap.get(yinWx) ?? 0)}）合计 ${f(supportScore)} 分。`,
    `异类力量（食伤${f(scoreMap.get(shiShangWx) ?? 0)} + 财${f(scoreMap.get(caiWx) ?? 0)} + 官杀${f(scoreMap.get(guanWx) ?? 0)}）合计 ${f(drainScore)} 分。`,
    `同类占比约 ${(adjRatio * 100).toFixed(0)}%（已结合月令旺衰微调），据此判定为「${strength}」。`,
    isStrong
      ? `日主偏旺，宜泄宜克：取「${favorable.join("、")}」为喜用神以耗其有余；忌再增「${unfavorable.join("、")}」。`
      : `日主偏弱，宜生宜扶：取「${favorable.join("、")}」为喜用神以补其不足；忌再泄克「${unfavorable.join("、")}」。`,
  ];

  return {
    dayMaster: dayGan,
    dayMasterWuXing: dayWuXing,
    dayMasterYinYang: GAN_YINYANG[dayGan],
    monthZhi,
    seasonState: state,
    supportScore: f(supportScore),
    drainScore: f(drainScore),
    strength,
    strengthRatio: adjRatio,
    favorable: Array.from(new Set(favorable)),
    unfavorable: Array.from(new Set(unfavorable)),
    method,
    reasoning,
    tenGodGroups,
  };
}
