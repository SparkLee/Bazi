import type { WuXing, YinYang } from "./types";

/** 十天干 */
export const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
/** 十二地支 */
export const DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

/** 天干五行 */
export const GAN_WUXING: Record<string, WuXing> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};

/** 天干阴阳 */
export const GAN_YINYANG: Record<string, YinYang> = {
  甲: "阳", 乙: "阴", 丙: "阳", 丁: "阴", 戊: "阳",
  己: "阴", 庚: "阳", 辛: "阴", 壬: "阳", 癸: "阴",
};

/** 地支五行 */
export const ZHI_WUXING: Record<string, WuXing> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};

/** 地支阴阳 */
export const ZHI_YINYANG: Record<string, YinYang> = {
  子: "阳", 丑: "阴", 寅: "阳", 卯: "阴", 辰: "阳", 巳: "阴",
  午: "阳", 未: "阴", 申: "阳", 酉: "阴", 戌: "阳", 亥: "阴",
};

/** 生肖 */
export const SHENG_XIAO: Record<string, string> = {
  子: "鼠", 丑: "牛", 寅: "虎", 卯: "兔", 辰: "龙", 巳: "蛇",
  午: "马", 未: "羊", 申: "猴", 酉: "鸡", 戌: "狗", 亥: "猪",
};

/** 五行生：key 生 value */
export const WUXING_SHENG: Record<WuXing, WuXing> = {
  木: "火", 火: "土", 土: "金", 金: "水", 水: "木",
};

/** 五行克：key 克 value */
export const WUXING_KE: Record<WuXing, WuXing> = {
  木: "土", 土: "水", 水: "火", 火: "金", 金: "木",
};

/** 生我者（生 me 的五行，即印） */
export function shengMe(me: WuXing): WuXing {
  return (Object.keys(WUXING_SHENG) as WuXing[]).find((k) => WUXING_SHENG[k] === me)!;
}

/** 我克者（财） */
export function keMe(me: WuXing): WuXing {
  return (Object.keys(WUXING_KE) as WuXing[]).find((k) => WUXING_KE[k] === me)!;
}

export const WUXING_COLORS: Record<WuXing, { bg: string; text: string; ring: string; hex: string }> = {
  木: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", hex: "#10b981" },
  火: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", hex: "#f43f5e" },
  土: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", hex: "#d97706" },
  金: { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-200", hex: "#eab308" },
  水: { bg: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-200", hex: "#0ea5e9" },
};

/** 十二时辰对照（用于时辰选择） */
export const SHI_CHEN: { name: string; zhi: string; range: string; startHour: number }[] = [
  { name: "子时", zhi: "子", range: "23:00 - 00:59", startHour: 23 },
  { name: "丑时", zhi: "丑", range: "01:00 - 02:59", startHour: 1 },
  { name: "寅时", zhi: "寅", range: "03:00 - 04:59", startHour: 3 },
  { name: "卯时", zhi: "卯", range: "05:00 - 06:59", startHour: 5 },
  { name: "辰时", zhi: "辰", range: "07:00 - 08:59", startHour: 7 },
  { name: "巳时", zhi: "巳", range: "09:00 - 10:59", startHour: 9 },
  { name: "午时", zhi: "午", range: "11:00 - 12:59", startHour: 11 },
  { name: "未时", zhi: "未", range: "13:00 - 14:59", startHour: 13 },
  { name: "申时", zhi: "申", range: "15:00 - 16:59", startHour: 15 },
  { name: "酉时", zhi: "酉", range: "17:00 - 18:59", startHour: 17 },
  { name: "戌时", zhi: "戌", range: "19:00 - 20:59", startHour: 19 },
  { name: "亥时", zhi: "亥", range: "21:00 - 22:59", startHour: 21 },
];

/** 十神归类：用于将十神映射到五大类 */
export const SHISHEN_CATEGORY: Record<string, "比劫" | "印枭" | "食伤" | "财才" | "官杀"> = {
  比肩: "比劫", 劫财: "比劫",
  正印: "印枭", 偏印: "印枭",
  食神: "食伤", 伤官: "食伤",
  正财: "财才", 偏财: "财才",
  正官: "官杀", 七杀: "官杀",
};

/** 术语解释（理论依据） */
export interface TermDef {
  term: string;
  short: string;
  detail: string;
}

export const TERMS: TermDef[] = [
  {
    term: "四柱八字",
    short: "年、月、日、时四组干支，共八个字",
    detail:
      "以出生的年、月、日、时四个时间单位，各用一个天干与一个地支表示，合称四柱，共八个字，故称八字。它本质上是一种以干支历法记录出生时刻的方式，是命理推演的基础坐标。",
  },
  {
    term: "天干地支",
    short: "十天干与十二地支的循环纪时系统",
    detail:
      "天干（甲乙丙丁戊己庚辛壬癸）与地支（子丑寅卯辰巳午未申酉戌亥）按固定顺序两两相配，形成六十甲子循环，是中国古代用于纪年、月、日、时的历法符号体系。",
  },
  {
    term: "日主（日元）",
    short: "日柱天干，代表命主自身",
    detail:
      "日柱的天干称为日主或日元，代表命主本人。整个八字的分析都以日主为中心，衡量其他干支对日主的生、克、扶、抑关系，从而判断五行旺衰与喜忌。",
  },
  {
    term: "五行",
    short: "木、火、土、金、水五种基本能量",
    detail:
      "五行是中国古代的物质与能量分类模型。相生：木生火、火生土、土生金、金生水、水生木；相克：木克土、土克水、水克火、火克金、金克木。命理通过五行的生克制化来描述系统的平衡状态。",
  },
  {
    term: "十神",
    short: "其他干支相对日主的十种关系",
    detail:
      "以日主为参照，根据五行生克与阴阳异同，将其他天干地支归为十类：比肩、劫财（同我）、食神、伤官（我生）、正财、偏财（我克）、正官、七杀（克我）、正印、偏印（生我）。十神是解读六亲、性格与社会关系的核心语言。",
  },
  {
    term: "地支藏干",
    short: "地支中暗藏的天干能量",
    detail:
      "每个地支内部都藏有一到三个天干，分为本气、中气、余气。藏干揭示了地支更细微的五行构成，是计算五行力量与判断格局时不可忽略的部分。",
  },
  {
    term: "纳音",
    short: "六十甲子配五行的另一套体系",
    detail:
      "纳音将六十甲子各配一种五行（如甲子乙丑海中金），源自古代音律与五行的对应，常用于古法论命与合婚参考。",
  },
  {
    term: "旺衰（得令）",
    short: "日主在出生月份的强弱状态",
    detail:
      "月令（月支）代表出生季节，对日主力量影响最大。日主五行在当令季节为旺、次为相，被克泄则为休囚死。得令与否是判断身强身弱的首要依据。",
  },
  {
    term: "身强身弱",
    short: "日主整体力量的强弱倾向",
    detail:
      "将生我（印）与同我（比劫）视为日主的助力，我生（食伤）、我克（财）、克我（官杀）视为耗力。两者力量对比决定日主偏强还是偏弱，是取用神的前提。",
  },
  {
    term: "用神 / 喜忌",
    short: "调节命局平衡所需的五行",
    detail:
      "本产品采用传统『扶抑法』：日主偏弱时，喜生扶之五行（印、比劫）为用神；日主偏强时，喜克泄耗之五行（官杀、食伤、财）为用神。用神为喜，反之为忌。这是格局平衡论的核心思路。",
  },
  {
    term: "大运",
    short: "每十年一换的运势阶段",
    detail:
      "大运依出生月柱，按阳男阴女顺行、阴男阳女逆行的规则排出，每柱主管约十年。结合原局与流年，可观察不同人生阶段五行力量的消长。",
  },
  {
    term: "真太阳时",
    short: "按经度校正的当地实际太阳时",
    detail:
      "中国统一使用东经120°的北京时间，而八字以出生地真实的太阳时为准。每偏离120°一度，时间相差约4分钟。校正后可避免出生在时辰交界处时排错时柱。",
  },
];

export const TERM_MAP: Record<string, TermDef> = Object.fromEntries(
  TERMS.map((t) => [t.term, t]),
);
