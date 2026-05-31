import type { Pillar, Analysis, Interpret, WuXing } from "./types";
import { SHISHEN_CATEGORY } from "./theory";

/** 日干性格 */
const DAY_MASTER_PERSONALITY: Record<string, { title: string; text: string }> = {
  甲: {
    title: "甲木 · 参天之木",
    text: "如栋梁大树，正直向上、有担当与开拓精神，重原则、讲信誉。优点是仁厚进取、有领导力；需留意过于固执、不易变通。",
  },
  乙: {
    title: "乙木 · 花草藤蔓",
    text: "如柔韧花草，温和细腻、善于变通、适应力强。优点是亲和、有耐心、懂迂回；需留意优柔寡断、易受环境与他人影响。",
  },
  丙: {
    title: "丙火 · 太阳之火",
    text: "如烈日当空，热情开朗、光明磊落、乐于分享。优点是有感染力、积极外向；需留意性急直率、情绪起伏较大。",
  },
  丁: {
    title: "丁火 · 灯烛之火",
    text: "如灯烛温辉，内敛细致、体贴入微、富同理心与文艺气质。优点是专注耐心、思虑周全；需留意多思多虑、易钻牛角尖。",
  },
  戊: {
    title: "戊土 · 城墙厚土",
    text: "如高山厚土，稳重可靠、踏实包容、重信守诺。优点是有定力、值得信赖；需留意略显保守固执、变通不足。",
  },
  己: {
    title: "己土 · 田园之土",
    text: "如沃野良田，温厚务实、细心体贴、善于培育与照顾他人。优点是包容随和、耐心；需留意心思过细、易自我设限。",
  },
  庚: {
    title: "庚金 · 刀剑之金",
    text: "如金属矿石，刚毅果决、重义气、行动力强。优点是有魄力、讲义气、能任事；需留意过刚易折、言语直接。",
  },
  辛: {
    title: "辛金 · 珠玉之金",
    text: "如珠玉首饰，精致敏感、注重品味、追求完美。优点是细腻有审美、要求高；需留意敏感好胜、易计较。",
  },
  壬: {
    title: "壬水 · 江河之水",
    text: "如江河大海，聪明灵活、心胸开阔、足智多谋。优点是思维敏捷、应变力强；需留意好动难定、易随性而为。",
  },
  癸: {
    title: "癸水 · 雨露之水",
    text: "如雨露甘霖，温柔内秀、直觉敏锐、富想象力。优点是细腻善感、有灵性；需留意多愁善感、易缺乏安全感。",
  },
};

/** 十神含义 */
const TEN_GOD_INFO: Record<
  string,
  { keywords: string; text: string }
> = {
  比肩: {
    keywords: "自我 · 兄弟 · 独立",
    text: "代表自我、同辈与竞争。比肩旺者独立自主、重朋友义气、行动有主见，但易固执己见、不易妥协。",
  },
  劫财: {
    keywords: "合作 · social · 好胜",
    text: "代表竞争、合作与破耗。劫财者交际广、敢拼敢闯、善借力，但需防破财、合伙纠纷与冲动消费。",
  },
  食神: {
    keywords: "才华 · 福气 · 享受",
    text: "代表才艺、口福与表达。食神者温和有涵养、懂生活、有创造力，主衣食无忧、心宽福厚。",
  },
  伤官: {
    keywords: "才气 · 表现 · 叛逆",
    text: "代表才华外放与个性。伤官者聪明伶俐、表现欲强、有艺术天分，但易恃才傲物、需收敛锋芒。",
  },
  正财: {
    keywords: "正当财 · 务实 · 妻星",
    text: "代表稳定收入与务实经营。正财者勤俭踏实、重视家庭与积累，财运正而稳，宜稳扎稳打。",
  },
  偏财: {
    keywords: "活财 · 人缘 · 机遇",
    text: "代表流动之财与商业头脑。偏财者大方仗义、人缘佳、善抓机遇，财来财去，宜把握时机。",
  },
  正官: {
    keywords: "事业 · 自律 · 名声",
    text: "代表地位、责任与规范。正官者自律守法、有责任感、重名誉，利于从政、管理与稳定事业。",
  },
  七杀: {
    keywords: "权威 · 魄力 · 压力",
    text: "代表权力、竞争与压力。七杀者有魄力、能扛压、敢冒险，制化得当则成大器，过旺则压力重重。",
  },
  正印: {
    keywords: "学识 · 庇护 · 母亲",
    text: "代表学问、贵人与庇佑。正印者好学仁慈、有长辈缘、受人提携，主名誉、学业与心安。",
  },
  偏印: {
    keywords: "偏才 · 直觉 · 玄学",
    text: "代表偏门智慧与独特技艺。偏印者思维独到、直觉敏锐、擅长冷门专业，但易孤独、思虑过多。",
  },
};

/** 各五行：方位/颜色/行业 */
const WUXING_GUIDE: Record<
  WuXing,
  { direction: string; colors: { name: string; hex: string }[]; industries: string[] }
> = {
  木: {
    direction: "东方",
    colors: [
      { name: "青", hex: "#10b981" },
      { name: "绿", hex: "#34d399" },
    ],
    industries: ["教育文化", "出版传媒", "医药健康", "服装纺织", "林木园艺", "文职策划"],
  },
  火: {
    direction: "南方",
    colors: [
      { name: "红", hex: "#f43f5e" },
      { name: "紫", hex: "#a855f7" },
    ],
    industries: ["能源电力", "电子科技", "互联网", "餐饮美食", "美容时尚", "广告传媒"],
  },
  土: {
    direction: "中央 / 本地",
    colors: [
      { name: "黄", hex: "#d97706" },
      { name: "棕", hex: "#92400e" },
    ],
    industries: ["房地产", "建筑工程", "农业畜牧", "陶瓷玉石", "保险中介", "仓储管理"],
  },
  金: {
    direction: "西方",
    colors: [
      { name: "白", hex: "#e5e7eb" },
      { name: "金", hex: "#eab308" },
    ],
    industries: ["金融银行", "机械制造", "汽车五金", "IT 硬件", "珠宝首饰", "法律军警"],
  },
  水: {
    direction: "北方",
    colors: [
      { name: "黑", hex: "#1f2937" },
      { name: "蓝", hex: "#0ea5e9" },
    ],
    industries: ["贸易物流", "旅游运输", "水产渔业", "流通服务", "传媒娱乐", "清洁环保"],
  },
};

export function interpret(
  pillars: Pillar[],
  analysis: Analysis,
): Interpret {
  const dayGan = analysis.dayMaster;

  // 收集命局出现的十神（去重，按重要性出现顺序）
  const seen = new Set<string>();
  const tenGods: Interpret["tenGods"] = [];
  for (const p of pillars) {
    const candidates: string[] = [];
    if (p.ganShiShen && p.ganShiShen !== "日主") candidates.push(p.ganShiShen);
    for (const h of p.hiddenStems) if (h.shiShen) candidates.push(h.shiShen);
    for (const ss of candidates) {
      if (TEN_GOD_INFO[ss] && !seen.has(ss)) {
        seen.add(ss);
        tenGods.push({
          name: ss,
          category: SHISHEN_CATEGORY[ss] ?? "",
          keywords: TEN_GOD_INFO[ss].keywords,
          text: TEN_GOD_INFO[ss].text,
        });
      }
    }
  }

  // 用神调候建议
  const fav = analysis.favorable;
  const industries = Array.from(
    new Set(fav.flatMap((w) => WUXING_GUIDE[w].industries)),
  ).slice(0, 8);
  const directions = Array.from(
    new Set(fav.map((w) => WUXING_GUIDE[w].direction)),
  );
  const colors = Array.from(
    new Map(
      fav.flatMap((w) => WUXING_GUIDE[w].colors).map((c) => [c.name, c]),
    ).values(),
  );

  const favText = fav.join("、");
  const advice: string[] = [
    `日主${analysis.strength}，宜补益「${favText}」之气以求中和平衡。`,
    `居住与办公可多朝向${directions.join("、")}；居家与穿着可适度增加${colors
      .map((c) => c.name)
      .join("、")}等色调。`,
    `职业发展上，与「${favText}」相关的领域较为顺遂，可优先考虑。`,
    `日常与忌神「${analysis.unfavorable.join("、")}」相关的过旺环境宜适度节制，不必刻意排斥，重在调和。`,
  ];

  return {
    dayMasterPersonality:
      DAY_MASTER_PERSONALITY[dayGan] ?? {
        title: dayGan,
        text: "",
      },
    tenGods,
    guidance: {
      summary: `综合日主旺衰与五行流通，命局喜用「${favText}」。以下为基于喜用神的调候参考。`,
      industries,
      directions,
      colors,
      advice,
    },
  };
}
