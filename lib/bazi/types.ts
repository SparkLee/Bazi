export type WuXing = "木" | "火" | "土" | "金" | "水";
export type YinYang = "阳" | "阴";
export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";

export interface BaziInput {
  calendar: CalendarType;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  isLeapMonth: boolean;
  gender: Gender;
  /** 经度，用于真太阳时校正；为空则不校正 */
  longitude?: number | null;
  useTrueSolarTime: boolean;
}

/** 藏干（含十神与五行） */
export interface HiddenStem {
  gan: string;
  wuXing: WuXing;
  shiShen: string;
  /** 本气 / 中气 / 余气 */
  role: "本气" | "中气" | "余气";
  weight: number;
}

export interface Pillar {
  label: "年柱" | "月柱" | "日柱" | "时柱";
  /** 天干 */
  gan: string;
  ganWuXing: WuXing;
  ganYinYang: YinYang;
  /** 天干十神（日柱为日主） */
  ganShiShen: string;
  /** 地支 */
  zhi: string;
  zhiWuXing: WuXing;
  zhiYinYang: YinYang;
  /** 地支藏干 */
  hiddenStems: HiddenStem[];
  /** 纳音 */
  naYin: string;
  /** 十二长生（星运） */
  diShi: string;
  /** 空亡 */
  xunKong: string;
}

export interface WuXingStat {
  wuXing: WuXing;
  /** 加权得分 */
  score: number;
  /** 出现个数（天干+藏干计数） */
  count: number;
  /** 占比 0-1 */
  ratio: number;
}

export interface TenGodGroup {
  /** 五行 */
  wuXing: WuXing;
  /** 该五行相对日主的十神类别 */
  category: "比劫" | "印枭" | "食伤" | "财才" | "官杀";
  score: number;
}

export interface DaYunItem {
  startYear: number;
  endYear: number;
  startAge: number;
  endAge: number;
  ganZhi: string;
  gan: string;
  zhi: string;
  ganShiShen: string;
  ganWuXing: WuXing;
  zhiWuXing: WuXing;
  liuNian: LiuNianItem[];
  /** 是否处于该大运（当前年份落在区间内） */
  isCurrent: boolean;
}

export interface LiuYueItem {
  /** 干支 */
  ganZhi: string;
  /** 农历月名（正月、二月…） */
  monthName: string;
  ganShiShen: string;
}

export interface LiuNianItem {
  year: number;
  age: number;
  ganZhi: string;
  ganShiShen: string;
  liuYue: LiuYueItem[];
}

/** 神煞 */
export interface ShenSha {
  name: string;
  /** 吉 / 凶 / 中性 */
  type: "吉" | "凶" | "中";
  /** 出现的柱位 */
  positions: ("年柱" | "月柱" | "日柱" | "时柱")[];
  /** 查法（理论依据） */
  rule: string;
  /** 含义解读 */
  desc: string;
  /** 结合日主旺衰与喜用的联动吉凶判语 */
  verdict?: string;
}

export interface Analysis {
  dayMaster: string;
  dayMasterWuXing: WuXing;
  dayMasterYinYang: YinYang;
  /** 月令 */
  monthZhi: string;
  /** 日主在该月的旺衰状态 旺/相/休/囚/死 */
  seasonState: string;
  /** 同类力量（生我+同我） */
  supportScore: number;
  /** 异类力量（我生+我克+克我） */
  drainScore: number;
  /** 身强/身弱/均衡 */
  strength: "身强" | "身弱" | "均衡偏强" | "均衡偏弱";
  strengthRatio: number;
  /** 用神（喜用五行） */
  favorable: WuXing[];
  /** 忌神 */
  unfavorable: WuXing[];
  /** 取用神方法说明 */
  method: string;
  /** 推理步骤（可解释性） */
  reasoning: string[];
  /** 十神分组得分 */
  tenGodGroups: TenGodGroup[];
}

export interface BaziChart {
  input: BaziInput;
  solarText: string;
  lunarText: string;
  /** 实际用于排盘的阳历时间（经真太阳时校正后） */
  usedSolarText: string;
  trueSolarAdjustMinutes: number;
  shengXiao: string; // 生肖
  xingZuo: string; // 星座
  pillars: Pillar[];
  dayMaster: string;
  taiYuan: string; // 胎元
  mingGong: string; // 命宫
  shenGong: string; // 身宫
  wuXingStats: WuXingStat[];
  analysis: Analysis;
  qiYunText: string; // 起运
  daYun: DaYunItem[];
  shenSha: ShenSha[];
  interpret: Interpret;
}

/** 合婚单项维度 */
export interface HehunDimension {
  name: string;
  score: number;
  max: number;
  level: "吉" | "中" | "平" | "凶";
  detail: string;
}

/** 生肖配对（民间口诀） */
export interface ZodiacMatch {
  maleAnimal: string;
  femaleAnimal: string;
  level: string;
  verse: string;
  text: string;
}

/** 择吉日 */
export interface JiRi {
  solarText: string;
  weekday: string;
  lunarText: string;
  ganZhi: string;
  zhiXing: string;
  tianShen: string;
  chongShengXiao: string;
  yi: string[];
}

/** 合婚结果 */
export interface HehunResult {
  male: BaziChart;
  female: BaziChart;
  totalScore: number;
  grade: string;
  gradeDesc: string;
  dimensions: HehunDimension[];
  summary: string[];
  zodiac: ZodiacMatch;
  weddingDates: JiRi[];
}

/** 命理解读文案 */
export interface Interpret {
  /** 日主性格 */
  dayMasterPersonality: { title: string; text: string };
  /** 命局出现的十神解读 */
  tenGods: { name: string; category: string; keywords: string; text: string }[];
  /** 用神调候建议 */
  guidance: {
    summary: string;
    industries: string[];
    directions: string[];
    colors: { name: string; hex: string }[];
    advice: string[];
  };
}
