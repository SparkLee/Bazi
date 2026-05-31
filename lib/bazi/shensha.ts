import type { Pillar, ShenSha, Analysis, WuXing } from "./types";

type PillarName = "年柱" | "月柱" | "日柱" | "时柱";

/** 三合局：地支 → 局 */
const TRINE: Record<string, "水" | "金" | "火" | "木"> = {
  申: "水", 子: "水", 辰: "水",
  巳: "金", 酉: "金", 丑: "金",
  寅: "火", 午: "火", 戌: "火",
  亥: "木", 卯: "木", 未: "木",
};

/** 天乙贵人：以日干查地支 */
const TIAN_YI: Record<string, string[]> = {
  甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
  乙: ["子", "申"], 己: ["子", "申"],
  丙: ["亥", "酉"], 丁: ["亥", "酉"],
  辛: ["午", "寅"],
  壬: ["卯", "巳"], 癸: ["卯", "巳"],
};

/** 文昌贵人：以日干查地支 */
const WEN_CHANG: Record<string, string> = {
  甲: "巳", 乙: "午", 丙: "申", 丁: "酉", 戊: "申",
  己: "酉", 庚: "亥", 辛: "子", 壬: "寅", 癸: "卯",
};

/** 禄神：以日干查地支 */
const LU_SHEN: Record<string, string> = {
  甲: "寅", 乙: "卯", 丙: "巳", 丁: "午", 戊: "巳",
  己: "午", 庚: "申", 辛: "酉", 壬: "亥", 癸: "子",
};

/** 羊刃：阳日干查地支（禄前一位） */
const YANG_REN: Record<string, string> = {
  甲: "卯", 丙: "午", 戊: "午", 庚: "酉", 壬: "子",
};

/** 金舆：以日干查地支（禄后二位） */
const JIN_YU: Record<string, string> = {
  甲: "辰", 乙: "巳", 丙: "未", 丁: "申", 戊: "未",
  己: "申", 庚: "戌", 辛: "亥", 壬: "丑", 癸: "寅",
};

/** 红艳煞：以日干查地支 */
const HONG_YAN: Record<string, string> = {
  甲: "午", 乙: "午", 丙: "寅", 丁: "未", 戊: "辰",
  己: "辰", 庚: "戌", 辛: "酉", 壬: "子", 癸: "申",
};

/** 三合局取用：桃花/驿马/华盖/将星/劫煞 */
const TRINE_TARGET = {
  桃花: { 水: "酉", 金: "午", 火: "卯", 木: "子" },
  驿马: { 水: "寅", 金: "亥", 火: "申", 木: "巳" },
  华盖: { 水: "辰", 金: "丑", 火: "戌", 木: "未" },
  将星: { 水: "子", 金: "酉", 火: "午", 木: "卯" },
  劫煞: { 水: "巳", 金: "寅", 火: "亥", 木: "申" },
  亡神: { 水: "亥", 金: "申", 火: "巳", 木: "寅" },
  灾煞: { 水: "午", 金: "卯", 火: "子", 木: "酉" },
} as const;

/** 太极贵人：以日干查地支 */
const TAI_JI: Record<string, string[]> = {
  甲: ["子", "午"], 乙: ["子", "午"],
  丙: ["卯", "酉"], 丁: ["卯", "酉"],
  戊: ["辰", "戌", "丑", "未"], 己: ["辰", "戌", "丑", "未"],
  庚: ["寅", "亥"], 辛: ["寅", "亥"],
  壬: ["巳", "申"], 癸: ["巳", "申"],
};

/** 国印贵人：以日干查地支 */
const GUO_YIN: Record<string, string> = {
  甲: "戌", 乙: "亥", 丙: "丑", 丁: "寅", 戊: "丑",
  己: "寅", 庚: "辰", 辛: "巳", 壬: "未", 癸: "申",
};

/** 天医：以月支查（月支前一位地支） */
const TIAN_YI_HEAL: Record<string, string> = {
  寅: "丑", 卯: "寅", 辰: "卯", 巳: "辰", 午: "巳", 未: "午",
  申: "未", 酉: "申", 戌: "酉", 亥: "戌", 子: "亥", 丑: "子",
};

/** 三奇贵人：需三干按序相连 */
const SAN_QI: { name: string; seq: string[] }[] = [
  { name: "天上三奇", seq: ["甲", "戊", "庚"] },
  { name: "地下三奇", seq: ["乙", "丙", "丁"] },
  { name: "人中三奇", seq: ["壬", "癸", "辛"] },
];

/** 阴阳差错（日柱或时柱） */
const YIN_YANG_CHA_CUO = new Set([
  "丙子", "丁丑", "戊寅", "辛卯", "壬辰", "癸巳",
  "丙午", "丁未", "戊申", "辛酉", "壬戌", "癸亥",
]);

/** 十恶大败（日柱） */
const SHI_E_DA_BAI = new Set([
  "甲辰", "乙巳", "丙申", "丁亥", "戊戌",
  "己丑", "庚辰", "辛巳", "壬申", "癸亥",
]);

/** 天德贵人：以月支查（天干或地支） */
const TIAN_DE: Record<string, string> = {
  寅: "丁", 卯: "申", 辰: "壬", 巳: "辛", 午: "亥", 未: "甲",
  申: "癸", 酉: "寅", 戌: "丙", 亥: "乙", 子: "巳", 丑: "庚",
};

/** 月德贵人：以月支三合局查天干 */
const YUE_DE: Record<"水" | "金" | "火" | "木", string> = {
  火: "丙", 水: "壬", 木: "甲", 金: "庚",
};

/** 孤辰寡宿：以年支查 */
function guGua(yearZhi: string): { gu: string; gua: string } {
  if (["亥", "子", "丑"].includes(yearZhi)) return { gu: "寅", gua: "戌" };
  if (["寅", "卯", "辰"].includes(yearZhi)) return { gu: "巳", gua: "丑" };
  if (["巳", "午", "未"].includes(yearZhi)) return { gu: "申", gua: "辰" };
  return { gu: "亥", gua: "未" }; // 申酉戌
}

const KUI_GANG = new Set(["庚辰", "庚戌", "壬辰", "戊戌"]);

const PILLAR_NAMES: PillarName[] = ["年柱", "月柱", "日柱", "时柱"];

/** 在四柱地支中查找目标，返回命中的柱位 */
function findInZhi(pillars: Pillar[], targets: string[]): PillarName[] {
  const res: PillarName[] = [];
  pillars.forEach((p, i) => {
    if (targets.includes(p.zhi)) res.push(PILLAR_NAMES[i]);
  });
  return res;
}

/** 在四柱天干或地支中查找目标 */
function findInGanZhi(pillars: Pillar[], targets: string[]): PillarName[] {
  const res: PillarName[] = [];
  pillars.forEach((p, i) => {
    if (targets.includes(p.gan) || targets.includes(p.zhi))
      res.push(PILLAR_NAMES[i]);
  });
  return res;
}

/** 结合日主旺衰与喜用，给出神煞联动吉凶判语 */
function shenShaVerdict(
  s: ShenSha,
  analysis: Analysis,
  pillars: Pillar[],
): string {
  const strong =
    analysis.strength === "身强" || analysis.strength === "均衡偏强";

  // 特例：与旺衰强相关的神煞
  if (s.name === "羊刃") {
    return strong
      ? "日主已旺，羊刃助旺过甚，性烈易招是非血光，喜见官杀制刃为用。"
      : "日主偏弱，羊刃能帮身敌杀、增添魄力担当，反成我之助力。";
  }
  if (s.name === "魁罡") {
    return strong
      ? "日主有气，魁罡得扶，主聪颖刚毅、利于掌权决断，易成大器。"
      : "日主偏弱，难任魁罡之刚，恐起伏反复、刚极易折，宜柔以济之。";
  }

  // 通用：以神煞所临之柱的地支五行，判其是否为喜用
  const idx = PILLAR_NAMES.indexOf(s.positions[0]);
  const w: WuXing | undefined = idx >= 0 ? pillars[idx].zhiWuXing : undefined;
  const fav = w ? analysis.favorable.includes(w) : false;
  const unf = w ? analysis.unfavorable.includes(w) : false;

  if (s.type === "吉") {
    if (fav) return "所临之气正为喜用，吉力倍增、福泽更显。";
    if (unf) return "虽属吉神，惜所临为忌神，吉中带杂，宜善加引导运用。";
    return "以吉论之，主增福助运。";
  }
  if (s.type === "凶") {
    if (fav) return "所临恰为喜用，凶中藏机，制化得宜反可为用。";
    if (unf) return "又逢忌神相助，凶性较显，宜预为防范化解。";
    return "凶性平常，持正谨慎即可无虞。";
  }
  if (fav) return "所临为喜用，得宜则显其利。";
  if (unf) return "所临为忌神，宜留意其偏性。";
  return "吉凶参半，端看命局整体配合。";
}

export function computeShenSha(
  pillars: Pillar[],
  analysis?: Analysis,
): ShenSha[] {
  const [yearP, monthP, dayP] = pillars;
  const dayGan = dayP.gan;
  const yearZhi = yearP.zhi;
  const dayZhi = dayP.zhi;
  const monthZhi = monthP.zhi;

  const out: ShenSha[] = [];
  const push = (s: ShenSha) => {
    if (s.positions.length > 0) out.push(s);
  };

  // 天乙贵人
  push({
    name: "天乙贵人",
    type: "吉",
    positions: findInZhi(pillars, TIAN_YI[dayGan] ?? []),
    rule: `以日干「${dayGan}」查，见${(TIAN_YI[dayGan] ?? []).join("、")}`,
    desc: "命中第一吉神，主逢凶化吉、得贵人扶助、聪慧有福。",
  });

  // 文昌贵人
  push({
    name: "文昌贵人",
    type: "吉",
    positions: findInZhi(pillars, [WEN_CHANG[dayGan]]),
    rule: `以日干「${dayGan}」查，见${WEN_CHANG[dayGan]}`,
    desc: "主聪明好学、利于考试文书、有文采智慧。",
  });

  // 禄神
  push({
    name: "禄神",
    type: "吉",
    positions: findInZhi(pillars, [LU_SHEN[dayGan]]),
    rule: `以日干「${dayGan}」查，见${LU_SHEN[dayGan]}`,
    desc: "主衣食丰足、身体健康、自立有福禄。",
  });

  // 羊刃
  if (YANG_REN[dayGan]) {
    push({
      name: "羊刃",
      type: "凶",
      positions: findInZhi(pillars, [YANG_REN[dayGan]]),
      rule: `以阳日干「${dayGan}」查，见${YANG_REN[dayGan]}`,
      desc: "刚烈果决、行动力强，但易冲动、需防意外与口舌，宜以理智制之。",
    });
  }

  // 金舆
  push({
    name: "金舆",
    type: "吉",
    positions: findInZhi(pillars, [JIN_YU[dayGan]]),
    rule: `以日干「${dayGan}」查，见${JIN_YU[dayGan]}`,
    desc: "主富贵安稳、得相貌温和之配偶、享受好。",
  });

  // 红艳煞
  push({
    name: "红艳煞",
    type: "中",
    positions: findInZhi(pillars, [HONG_YAN[dayGan]]),
    rule: `以日干「${dayGan}」查，见${HONG_YAN[dayGan]}`,
    desc: "主多情浪漫、异性缘佳、富有魅力，感情上需多加把握。",
  });

  // 三合类：以年支与日支为基
  const bases = Array.from(new Set([yearZhi, dayZhi]));
  (Object.keys(TRINE_TARGET) as (keyof typeof TRINE_TARGET)[]).forEach((key) => {
    const targets = Array.from(
      new Set(bases.map((b) => TRINE_TARGET[key][TRINE[b]])),
    );
    const positions = findInZhi(pillars, targets);
    const meta: Record<
      keyof typeof TRINE_TARGET,
      { type: ShenSha["type"]; desc: string }
    > = {
      桃花: { type: "中", desc: "主人缘魅力、艺术审美、异性缘，亦称咸池，得用则风雅，失制则多情。" },
      驿马: { type: "中", desc: "主走动迁移、出行外出、变动奔波，利于外出发展与从事流动性事业。" },
      华盖: { type: "中", desc: "主聪明孤高、好玄学艺术宗教，有才华但易孤独清高。" },
      将星: { type: "吉", desc: "主有领导统御之才、掌权管理，文武皆宜，利于担当大任。" },
      劫煞: { type: "凶", desc: "主破耗夺取、需防小人盗失，但用神得力者反主魄力果断。" },
      亡神: { type: "凶", desc: "主内敛深沉、城府心机，逢之需防失意走神、暗中破耗，得制则智谋深远。" },
      灾煞: { type: "凶", desc: "主血光意外、突发灾厄，须注意安全与健康，逢吉神化解则无妨。" },
    };
    push({
      name: key,
      type: meta[key].type,
      positions,
      rule: `以年/日支查三合局，见${targets.join("、")}`,
      desc: meta[key].desc,
    });
  });

  // 天德贵人（月支查，天干地支皆可）
  push({
    name: "天德贵人",
    type: "吉",
    positions: findInGanZhi(pillars, [TIAN_DE[monthZhi]]),
    rule: `以月支「${monthZhi}」查，见${TIAN_DE[monthZhi]}`,
    desc: "主一生少灾、逢凶化吉、心地仁慈、得祖荫福报。",
  });

  // 月德贵人（月支三合查天干）
  const yueDeTarget = YUE_DE[TRINE[monthZhi]];
  push({
    name: "月德贵人",
    type: "吉",
    positions: findInGanZhi(pillars, [yueDeTarget]),
    rule: `以月支三合局查，见天干${yueDeTarget}`,
    desc: "与天德同为解厄之吉神，主善良温和、福泽深厚。",
  });

  // 孤辰 / 寡宿（年支查）
  const { gu, gua } = guGua(yearZhi);
  push({
    name: "孤辰",
    type: "凶",
    positions: findInZhi(pillars, [gu]),
    rule: `以年支「${yearZhi}」查，见${gu}`,
    desc: "主性格孤僻、六亲缘薄，男忌孤辰，宜修身养性、广结善缘。",
  });
  push({
    name: "寡宿",
    type: "凶",
    positions: findInZhi(pillars, [gua]),
    rule: `以年支「${yearZhi}」查，见${gua}`,
    desc: "主清高孤独、独立自处，女忌寡宿，宜主动经营人际与感情。",
  });

  // 太极贵人（日干查地支）
  push({
    name: "太极贵人",
    type: "吉",
    positions: findInZhi(pillars, TAI_JI[dayGan] ?? []),
    rule: `以日干「${dayGan}」查，见${(TAI_JI[dayGan] ?? []).join("、")}`,
    desc: "主好学深思、喜玄理探究，逢凶有救、利于钻研学问与终成事业。",
  });

  // 国印贵人（日干查地支）
  push({
    name: "国印贵人",
    type: "吉",
    positions: findInZhi(pillars, [GUO_YIN[dayGan]]),
    rule: `以日干「${dayGan}」查，见${GUO_YIN[dayGan]}`,
    desc: "主掌印信权柄、有信誉地位，利于公职管理、受人信赖。",
  });

  // 天医（月支查）
  push({
    name: "天医",
    type: "吉",
    positions: findInZhi(pillars, [TIAN_YI_HEAL[monthZhi]]),
    rule: `以月支「${monthZhi}」查前一辰，见${TIAN_YI_HEAL[monthZhi]}`,
    desc: "主心思细腻、利于医药卫生与照护他人，逢病多遇良医而解。",
  });

  // 魁罡（日柱本身）
  if (KUI_GANG.has(dayP.gan + dayP.zhi)) {
    out.push({
      name: "魁罡",
      type: "中",
      positions: ["日柱"],
      rule: `日柱为${dayP.gan}${dayP.zhi}（庚辰/庚戌/壬辰/戊戌之一）`,
      desc: "主聪明果断、性格刚烈、利于掌权，喜身旺，逢冲或身弱则反复多波折。",
    });
  }

  // 三奇贵人（年月日 或 月日时 三干按序相连）
  const ganSeqs: { label: string; gans: string[] }[] = [
    { label: "年月日", gans: [pillars[0].gan, pillars[1].gan, pillars[2].gan] },
    { label: "月日时", gans: [pillars[1].gan, pillars[2].gan, pillars[3].gan] },
  ];
  for (const sq of SAN_QI) {
    const hit = ganSeqs.find(
      (g) => g.gans[0] === sq.seq[0] && g.gans[1] === sq.seq[1] && g.gans[2] === sq.seq[2],
    );
    if (hit) {
      out.push({
        name: `三奇贵人·${sq.name}`,
        type: "吉",
        positions:
          hit.label === "年月日"
            ? ["年柱", "月柱", "日柱"]
            : ["月柱", "日柱", "时柱"],
        rule: `${hit.label}三干顺连「${sq.seq.join("")}」`,
        desc: "命带三奇者，主才华出众、胸怀博大、不同凡俗，多有特殊成就。",
      });
      break;
    }
  }

  // 阴阳差错（日柱或时柱）
  const yycPos: PillarName[] = [];
  if (YIN_YANG_CHA_CUO.has(dayP.gan + dayP.zhi)) yycPos.push("日柱");
  if (YIN_YANG_CHA_CUO.has(pillars[3].gan + pillars[3].zhi)) yycPos.push("时柱");
  if (yycPos.length) {
    out.push({
      name: "阴阳差错",
      type: "凶",
      positions: yycPos,
      rule: "日柱或时柱为阴阳差错十二组干支之一",
      desc: "主婚姻情感易生波折、与姻亲缘分较淡，宜多沟通体谅、慎择良配。",
    });
  }

  // 十恶大败（日柱）
  if (SHI_E_DA_BAI.has(dayP.gan + dayP.zhi)) {
    out.push({
      name: "十恶大败",
      type: "凶",
      positions: ["日柱"],
      rule: `日柱为${dayP.gan}${dayP.zhi}（十恶大败日之一）`,
      desc: "古谓禄气受损、根基偏薄，宜踏实积累、勿好高骛远，得吉助则可化解。",
    });
  }

  // 天罗地网（地支组合）
  const allZhi = pillars.map((p) => p.zhi);
  if (allZhi.includes("戌") && allZhi.includes("亥")) {
    out.push({
      name: "天罗",
      type: "凶",
      positions: findInZhi(pillars, ["戌", "亥"]),
      rule: "四柱地支同见戌、亥",
      desc: "主易受牵绊束缚、运途多阻，男命尤忌，宜守正待时、谨慎决断。",
    });
  }
  if (allZhi.includes("辰") && allZhi.includes("巳")) {
    out.push({
      name: "地网",
      type: "凶",
      positions: findInZhi(pillars, ["辰", "巳"]),
      rule: "四柱地支同见辰、巳",
      desc: "主进退维谷、纠缠难脱，女命尤忌，宜化解纠葛、循序而进。",
    });
  }

  if (analysis) {
    for (const s of out) s.verdict = shenShaVerdict(s, analysis, pillars);
  }

  return out;
}
