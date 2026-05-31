import type {
  BaziChart,
  HehunResult,
  HehunDimension,
  WuXing,
  ZodiacMatch,
} from "./types";
import {
  GAN_WUXING,
  WUXING_SHENG,
  WUXING_KE,
  ZHI_WUXING,
  SHENG_XIAO,
} from "./theory";
import { pickWeddingDates } from "./zeri";

/** 地支六合 */
const LIU_HE: Record<string, string> = {
  子: "丑", 丑: "子", 寅: "亥", 亥: "寅", 卯: "戌", 戌: "卯",
  辰: "酉", 酉: "辰", 巳: "申", 申: "巳", 午: "未", 未: "午",
};

/** 三合局分组 */
const SAN_HE: string[][] = [
  ["申", "子", "辰"],
  ["巳", "酉", "丑"],
  ["寅", "午", "戌"],
  ["亥", "卯", "未"],
];

/** 地支六冲 */
const LIU_CHONG: Record<string, string> = {
  子: "午", 午: "子", 丑: "未", 未: "丑", 寅: "申", 申: "寅",
  卯: "酉", 酉: "卯", 辰: "戌", 戌: "辰", 巳: "亥", 亥: "巳",
};

/** 地支六害 */
const LIU_HAI: Record<string, string> = {
  子: "未", 未: "子", 丑: "午", 午: "丑", 寅: "巳", 巳: "寅",
  卯: "辰", 辰: "卯", 申: "亥", 亥: "申", 酉: "戌", 戌: "酉",
};

/** 相刑（无序对，含自刑） */
const XING_PAIRS = new Set([
  "寅巳", "巳寅", "巳申", "申巳", "寅申", "申寅",
  "丑戌", "戌丑", "戌未", "未戌", "丑未", "未丑",
  "子卯", "卯子",
  "辰辰", "午午", "酉酉", "亥亥",
]);

/** 天干五合 */
const GAN_HE: Record<string, string> = {
  甲: "己", 己: "甲", 乙: "庚", 庚: "乙", 丙: "辛", 辛: "丙",
  丁: "壬", 壬: "丁", 戊: "癸", 癸: "戊",
};

const GAN_HE_NAME: Record<string, string> = {
  甲己: "中正之合", 乙庚: "仁义之合", 丙辛: "威制之合",
  丁壬: "淫昵之合", 戊癸: "无情之合",
};

type ZhiRel =
  | "六合"
  | "三合"
  | "六冲"
  | "相害"
  | "相刑"
  | "比和"
  | "相生"
  | "相克";

function inSanHe(a: string, b: string): boolean {
  return SAN_HE.some((g) => g.includes(a) && g.includes(b));
}

function zhiRelation(a: string, b: string): ZhiRel {
  if (LIU_HE[a] === b) return "六合";
  if (a !== b && inSanHe(a, b)) return "三合";
  if (LIU_CHONG[a] === b) return "六冲";
  if (LIU_HAI[a] === b) return "相害";
  if (XING_PAIRS.has(a + b)) return "相刑";
  const wa = ZHI_WUXING[a];
  const wb = ZHI_WUXING[b];
  if (wa === wb) return "比和";
  if (WUXING_SHENG[wa] === wb || WUXING_SHENG[wb] === wa) return "相生";
  return "相克";
}

const ZHI_SCORE: Record<ZhiRel, { score: number; level: HehunDimension["level"] }> = {
  六合: { score: 20, level: "吉" },
  三合: { score: 18, level: "吉" },
  相生: { score: 15, level: "中" },
  比和: { score: 14, level: "中" },
  相克: { score: 8, level: "平" },
  相害: { score: 6, level: "凶" },
  相刑: { score: 5, level: "凶" },
  六冲: { score: 3, level: "凶" },
};

/** 纳音末字五行 */
function naYinWuXing(naYin: string): WuXing {
  return naYin.charAt(naYin.length - 1) as WuXing;
}

/** 取命局五行最旺的前 n 个 */
function topElements(chart: BaziChart, n: number): WuXing[] {
  return [...chart.wuXingStats]
    .sort((x, y) => y.score - x.score)
    .slice(0, n)
    .map((s) => s.wuXing);
}

/** 六害对应的民间婚配歌诀 */
const HAI_VERSE: Record<string, string> = {
  鼠羊: "羊鼠相逢一旦休", 牛马: "自古白马怕青牛",
  虎蛇: "蛇虎婚配如刀错", 兔龙: "玉兔见龙云端泪",
  鸡狗: "金鸡玉犬难躲避", 猴猪: "猪与猿猴不到头",
};

function haiVerse(a: string, b: string): string {
  return HAI_VERSE[a + b] ?? HAI_VERSE[b + a] ?? "六害相逢，缘浅情深需珍重";
}

/** 生肖配对（民间口诀） */
function zodiacMatch(maleZhi: string, femaleZhi: string): ZodiacMatch {
  const ma = SHENG_XIAO[maleZhi];
  const fa = SHENG_XIAO[femaleZhi];
  const rel = zhiRelation(maleZhi, femaleZhi);
  const base = { maleAnimal: ma, femaleAnimal: fa };
  switch (rel) {
    case "六合":
      return {
        ...base,
        level: "上等婚",
        verse: `${ma}${fa}六合`,
        text: `属${ma}与属${fa}六合相配，天生一对、和顺美满，琴瑟相调，乃上等良缘。`,
      };
    case "三合":
      return {
        ...base,
        level: "上等婚",
        verse: `${ma}${fa}三合`,
        text: `属${ma}与属${fa}三合，情投意合、互助互旺，同心同德，主婚姻和美。`,
      };
    case "六冲":
      return {
        ...base,
        level: "下等婚",
        verse: `${ma}${fa}相冲`,
        text: `属${ma}与属${fa}六冲，个性迥异、聚散难定，民间视为下等婚配，须以包容退让化解。`,
      };
    case "相害":
      return {
        ...base,
        level: "下等婚",
        verse: haiVerse(ma, fa),
        text: `「${haiVerse(ma, fa)}」——属${ma}与属${fa}相害，易生暗耗龃龉，宜多体谅、坦诚相待。`,
      };
    case "相刑":
      return {
        ...base,
        level: "中下婚",
        verse: `${ma}${fa}相刑`,
        text: `属${ma}与属${fa}相刑，相处中易有口角刑伤，属中下婚配，贵在以礼相待、互相成全。`,
      };
    case "比和":
      return {
        ...base,
        level: "中等婚",
        verse: `${ma}${fa}比和`,
        text: `属${ma}与属${fa}同气相求、性情相近，属中等婚配，宜在相似中寻求互补。`,
      };
    default:
      return {
        ...base,
        level: "中等婚",
        verse: `${ma}${fa}相${rel === "相生" ? "生" : "见"}`,
        text: `属${ma}与属${fa}生肖关系平和（${rel}），属中等婚配，重在用心经营、彼此扶持。`,
      };
  }
}

export function computeHehun(
  male: BaziChart,
  female: BaziChart,
): HehunResult {
  const dimensions: HehunDimension[] = [];

  // 1. 生肖（年支）
  const mYearZhi = male.pillars[0].zhi;
  const fYearZhi = female.pillars[0].zhi;
  const yearRel = zhiRelation(mYearZhi, fYearZhi);
  dimensions.push({
    name: "生肖年支",
    score: ZHI_SCORE[yearRel].score,
    max: 20,
    level: ZHI_SCORE[yearRel].level,
    detail: `男${male.shengXiao}（${mYearZhi}）与女${female.shengXiao}（${fYearZhi}）年支${yearRel}。${
      yearRel === "六合" || yearRel === "三合"
        ? "生肖相合，缘分天成、相处融洽。"
        : yearRel === "六冲"
          ? "生肖相冲，个性差异较大，需多包容退让。"
          : yearRel === "相刑" || yearRel === "相害"
            ? "生肖有刑害，易生摩擦，宜以诚相待、彼此体谅。"
            : "生肖关系平和，可正常相处经营。"
    }`,
  });

  // 2. 夫妻宫（日支）
  const mDayZhi = male.pillars[2].zhi;
  const fDayZhi = female.pillars[2].zhi;
  const dayRel = zhiRelation(mDayZhi, fDayZhi);
  dimensions.push({
    name: "夫妻宫日支",
    score: ZHI_SCORE[dayRel].score,
    max: 20,
    level: ZHI_SCORE[dayRel].level,
    detail: `双方日支（夫妻宫）${mDayZhi}与${fDayZhi}${dayRel}。${
      dayRel === "六合" || dayRel === "三合"
        ? "夫妻宫相合，婚后亲密和睦、情投意合。"
        : dayRel === "六冲"
          ? "夫妻宫相冲，易聚少离多或意见相左，宜加强沟通。"
          : dayRel === "相刑" || dayRel === "相害"
            ? "夫妻宫有刑害，相处中需留意口角与小矛盾。"
            : "夫妻宫关系平稳，感情可细水长流。"
    }`,
  });

  // 3. 日主（日干）
  const mGan = male.dayMaster;
  const fGan = female.dayMaster;
  let ganScore = 12;
  let ganLevel: HehunDimension["level"] = "中";
  let ganText = "";
  if (GAN_HE[mGan] === fGan) {
    ganScore = 20;
    ganLevel = "吉";
    const key = GAN_HE_NAME[mGan + fGan] ?? GAN_HE_NAME[fGan + mGan] ?? "天干五合";
    ganText = `日主${mGan}与${fGan}天干五合（${key}），夫妻情意相投、彼此吸引。`;
  } else {
    const wm = GAN_WUXING[mGan];
    const wf = GAN_WUXING[fGan];
    if (wm === wf) {
      ganScore = 12;
      ganLevel = "中";
      ganText = `日主同为${wm}，志趣相近、易生共鸣，但也需避免过于相似而缺乏互补。`;
    } else if (WUXING_SHENG[wm] === wf || WUXING_SHENG[wf] === wm) {
      ganScore = 15;
      ganLevel = "中";
      ganText = `日主五行${wm}与${wf}相生，一方能滋养扶持另一方，相处和顺。`;
    } else {
      ganScore = 7;
      ganLevel = "平";
      ganText = `日主五行${wm}与${wf}相克，价值观或处事方式有别，宜互相迁就。`;
    }
  }
  dimensions.push({
    name: "日主天干",
    score: ganScore,
    max: 20,
    level: ganLevel,
    detail: ganText,
  });

  // 4. 年命纳音
  const mNa = naYinWuXing(male.pillars[0].naYin);
  const fNa = naYinWuXing(female.pillars[0].naYin);
  let naScore = 12;
  let naLevel: HehunDimension["level"] = "中";
  let naText = "";
  if (mNa === fNa) {
    naScore = 12;
    naLevel = "中";
    naText = `双方年命纳音同属${mNa}，性情相类、和合无碍。`;
  } else if (WUXING_SHENG[mNa] === fNa || WUXING_SHENG[fNa] === mNa) {
    naScore = 15;
    naLevel = "吉";
    naText = `年命纳音${male.pillars[0].naYin}与${female.pillars[0].naYin}五行相生，古法谓之上等婚配。`;
  } else if (WUXING_KE[mNa] === fNa || WUXING_KE[fNa] === mNa) {
    naScore = 6;
    naLevel = "凶";
    naText = `年命纳音${mNa}与${fNa}相克，传统视为需化解之处，可借五行通关调和。`;
  } else {
    naScore = 12;
    naText = `年命纳音${mNa}与${fNa}关系平和。`;
  }
  dimensions.push({
    name: "年命纳音",
    score: naScore,
    max: 15,
    level: naLevel,
    detail: naText,
  });

  // 5. 五行互补
  const merged: Record<WuXing, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const s of male.wuXingStats) merged[s.wuXing] += s.score;
  for (const s of female.wuXingStats) merged[s.wuXing] += s.score;
  const vals = Object.values(merged);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals) || 1;
  const missing = vals.filter((v) => v === 0).length;
  const balance = minV / maxV; // 0~1
  const wuxingScore = Math.max(0, Math.round(15 * balance) - missing * 3);
  dimensions.push({
    name: "五行互补",
    score: wuxingScore,
    max: 15,
    level: balance > 0.5 ? "吉" : balance > 0.3 ? "中" : "平",
    detail:
      missing > 0
        ? `两命合并后仍缺 ${missing} 种五行，整体偏枯，宜后天补益调和。`
        : `两命合并后五行${balance > 0.5 ? "较为均衡，彼此截长补短" : "尚可，部分五行偏旺偏弱"}，相互补益度${(balance * 100).toFixed(0)}%。`,
  });

  // 6. 用神互补
  const mTop = topElements(female, 3); // 女方能提供的旺气
  const fTop = topElements(male, 3); // 男方能提供的旺气
  const maleGet = male.analysis.favorable.filter((w) => mTop.includes(w));
  const femaleGet = female.analysis.favorable.filter((w) => fTop.includes(w));
  const dirM = male.analysis.favorable.length
    ? (maleGet.length / male.analysis.favorable.length) * 7.5
    : 0;
  const dirF = female.analysis.favorable.length
    ? (femaleGet.length / female.analysis.favorable.length) * 7.5
    : 0;
  const yongScore = Math.round(dirM + dirF);
  dimensions.push({
    name: "用神互补",
    score: yongScore,
    max: 15,
    level: yongScore >= 10 ? "吉" : yongScore >= 5 ? "中" : "平",
    detail: `男方喜用「${male.analysis.favorable.join("、")}」，女方命局可提供${maleGet.length ? `「${maleGet.join("、")}」` : "较少"}；女方喜用「${female.analysis.favorable.join("、")}」，男方可提供${femaleGet.length ? `「${femaleGet.join("、")}」` : "较少"}。${
      yongScore >= 10
        ? "彼此正是对方所需，旺夫益妻、互为贵人。"
        : yongScore >= 5
          ? "有一定互补，相处中可彼此助益。"
          : "用神互补有限，需各自留意自身调候。"
    }`,
  });

  const sum = dimensions.reduce((a, d) => a + d.score, 0);
  const maxSum = dimensions.reduce((a, d) => a + d.max, 0);
  const totalScore = Math.round((sum / maxSum) * 100);

  let grade: string;
  let gradeDesc: string;
  if (totalScore >= 85) {
    grade = "天作之合";
    gradeDesc = "八字契合度极高，珠联璧合、琴瑟和鸣。";
  } else if (totalScore >= 72) {
    grade = "良缘佳配";
    gradeDesc = "整体相合度高，是值得珍惜的好姻缘。";
  } else if (totalScore >= 58) {
    grade = "中等姻缘";
    gradeDesc = "基础尚好，用心经营便能长久和美。";
  } else if (totalScore >= 45) {
    grade = "需多磨合";
    gradeDesc = "存在一些差异，需更多包容、沟通与体谅。";
  } else {
    grade = "差异较大";
    gradeDesc = "命理差异明显，若真心相爱更需彼此努力与化解。";
  }

  const summary: string[] = [];
  const good = dimensions.filter((d) => d.level === "吉");
  const bad = dimensions.filter((d) => d.level === "凶");
  if (good.length)
    summary.push(`优势：${good.map((d) => d.name).join("、")}表现良好，是这段关系的稳固基石。`);
  if (bad.length)
    summary.push(`需留意：${bad.map((d) => d.name).join("、")}存在不和，建议以理解与让步来化解。`);
  summary.push(
    "命理合婚仅供参考，真正的幸福取决于双方的真诚、沟通与共同经营，切勿以此作为感情取舍的唯一依据。",
  );

  const zodiac = zodiacMatch(male.pillars[0].zhi, female.pillars[0].zhi);
  const weddingDates = pickWeddingDates(
    male.pillars[0].zhi,
    female.pillars[0].zhi,
    8,
  );

  return {
    male,
    female,
    totalScore,
    grade,
    gradeDesc,
    dimensions,
    summary,
    zodiac,
    weddingDates,
  };
}
