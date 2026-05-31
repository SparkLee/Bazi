import { Solar, Lunar, EightChar } from "lunar-typescript";
import type {
  BaziInput,
  BaziChart,
  Pillar,
  HiddenStem,
  WuXingStat,
  DaYunItem,
  LiuNianItem,
  WuXing,
} from "./types";
import {
  GAN_WUXING,
  GAN_YINYANG,
  ZHI_WUXING,
  ZHI_YINYANG,
  SHENG_XIAO,
} from "./theory";
import { analyze } from "./analysis";
import { computeShenSha } from "./shensha";
import { interpret } from "./interpret";

/** 藏干本气/中气/余气权重（用于五行力量加权） */
const HIDDEN_WEIGHTS = [1.0, 0.5, 0.3];
const HIDDEN_ROLES: HiddenStem["role"][] = ["本气", "中气", "余气"];

/** 北京时间基准经度 */
const STANDARD_LONGITUDE = 120;

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** 根据经度计算真太阳时（经度时差）校正分钟数 */
function trueSolarOffsetMinutes(longitude: number): number {
  return Math.round((longitude - STANDARD_LONGITUDE) * 4);
}

function buildHiddenStems(
  hideGan: string[],
  shiShenZhi: string[],
): HiddenStem[] {
  return hideGan.map((gan, i) => ({
    gan,
    wuXing: GAN_WUXING[gan],
    shiShen: shiShenZhi[i] ?? "",
    role: HIDDEN_ROLES[i] ?? "余气",
    weight: HIDDEN_WEIGHTS[i] ?? 0.2,
  }));
}

function computeWuXingStats(pillars: Pillar[]): WuXingStat[] {
  const score: Record<WuXing, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const count: Record<WuXing, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };

  for (const p of pillars) {
    // 天干：每个计 1 分
    score[p.ganWuXing] += 1;
    count[p.ganWuXing] += 1;
    // 月支本气当令，额外加权
    const monthBonus = p.label === "月柱" ? 1 : 0;
    for (const h of p.hiddenStems) {
      const bonus = h.role === "本气" ? monthBonus : 0;
      score[h.wuXing] += h.weight + bonus;
      count[h.wuXing] += 1;
    }
  }

  const total = (Object.values(score) as number[]).reduce((a, b) => a + b, 0) || 1;
  return (Object.keys(score) as WuXing[]).map((w) => ({
    wuXing: w,
    score: Math.round(score[w] * 100) / 100,
    count: count[w],
    ratio: score[w] / total,
  }));
}

export function computeBazi(input: BaziInput): BaziChart {
  let hour = input.hour;
  let minute = input.minute;
  let adjustMinutes = 0;

  // 真太阳时校正（仅作用于阳历输入或换算后的阳历时刻）
  let solar: Solar;
  let lunar: Lunar;

  if (input.calendar === "solar") {
    if (input.useTrueSolarTime && input.longitude != null) {
      adjustMinutes = trueSolarOffsetMinutes(input.longitude);
    }
    const base = Solar.fromYmdHms(
      input.year,
      input.month,
      input.day,
      hour,
      minute,
      0,
    );
    // 通过儒略日加减分钟实现校正，自动处理跨日/跨时辰
    const adjusted =
      adjustMinutes !== 0
        ? Solar.fromJulianDay(base.getJulianDay() + adjustMinutes / 1440)
        : base;
    solar = adjusted;
    lunar = solar.getLunar();
    hour = solar.getHour();
    minute = solar.getMinute();
  } else {
    const lunarMonth = input.isLeapMonth ? -input.month : input.month;
    lunar = Lunar.fromYmdHms(
      input.year,
      lunarMonth,
      input.day,
      hour,
      minute,
      0,
    );
    solar = lunar.getSolar();
    if (input.useTrueSolarTime && input.longitude != null) {
      adjustMinutes = trueSolarOffsetMinutes(input.longitude);
      if (adjustMinutes !== 0) {
        solar = Solar.fromJulianDay(solar.getJulianDay() + adjustMinutes / 1440);
        lunar = solar.getLunar();
      }
    }
  }

  const ec: EightChar = lunar.getEightChar();

  const yearPillar: Pillar = {
    label: "年柱",
    gan: ec.getYearGan(),
    ganWuXing: GAN_WUXING[ec.getYearGan()],
    ganYinYang: GAN_YINYANG[ec.getYearGan()],
    ganShiShen: ec.getYearShiShenGan(),
    zhi: ec.getYearZhi(),
    zhiWuXing: ZHI_WUXING[ec.getYearZhi()],
    zhiYinYang: ZHI_YINYANG[ec.getYearZhi()],
    hiddenStems: buildHiddenStems(ec.getYearHideGan(), ec.getYearShiShenZhi()),
    naYin: ec.getYearNaYin(),
    diShi: ec.getYearDiShi(),
    xunKong: ec.getYearXunKong(),
  };

  const monthPillar: Pillar = {
    label: "月柱",
    gan: ec.getMonthGan(),
    ganWuXing: GAN_WUXING[ec.getMonthGan()],
    ganYinYang: GAN_YINYANG[ec.getMonthGan()],
    ganShiShen: ec.getMonthShiShenGan(),
    zhi: ec.getMonthZhi(),
    zhiWuXing: ZHI_WUXING[ec.getMonthZhi()],
    zhiYinYang: ZHI_YINYANG[ec.getMonthZhi()],
    hiddenStems: buildHiddenStems(ec.getMonthHideGan(), ec.getMonthShiShenZhi()),
    naYin: ec.getMonthNaYin(),
    diShi: ec.getMonthDiShi(),
    xunKong: ec.getMonthXunKong(),
  };

  const dayPillar: Pillar = {
    label: "日柱",
    gan: ec.getDayGan(),
    ganWuXing: GAN_WUXING[ec.getDayGan()],
    ganYinYang: GAN_YINYANG[ec.getDayGan()],
    ganShiShen: ec.getDayShiShenGan(),
    zhi: ec.getDayZhi(),
    zhiWuXing: ZHI_WUXING[ec.getDayZhi()],
    zhiYinYang: ZHI_YINYANG[ec.getDayZhi()],
    hiddenStems: buildHiddenStems(ec.getDayHideGan(), ec.getDayShiShenZhi()),
    naYin: ec.getDayNaYin(),
    diShi: ec.getDayDiShi(),
    xunKong: ec.getDayXunKong(),
  };

  const timePillar: Pillar = {
    label: "时柱",
    gan: ec.getTimeGan(),
    ganWuXing: GAN_WUXING[ec.getTimeGan()],
    ganYinYang: GAN_YINYANG[ec.getTimeGan()],
    ganShiShen: ec.getTimeShiShenGan(),
    zhi: ec.getTimeZhi(),
    zhiWuXing: ZHI_WUXING[ec.getTimeZhi()],
    zhiYinYang: ZHI_YINYANG[ec.getTimeZhi()],
    hiddenStems: buildHiddenStems(ec.getTimeHideGan(), ec.getTimeShiShenZhi()),
    naYin: ec.getTimeNaYin(),
    diShi: ec.getTimeDiShi(),
    xunKong: ec.getTimeXunKong(),
  };

  const pillars = [yearPillar, monthPillar, dayPillar, timePillar];
  const wuXingStats = computeWuXingStats(pillars);
  const analysis = analyze(pillars, wuXingStats, ec.getDayGan(), monthPillar.zhi);

  // 大运 / 流年
  const genderCode = input.gender === "male" ? 1 : 0;
  const yun = ec.getYun(genderCode);
  const daYunRaw = yun.getDaYun(9);
  const currentYear = new Date().getFullYear();

  const daYun: DaYunItem[] = daYunRaw
    .filter((d) => d.getGanZhi())
    .map((d) => {
      const gz = d.getGanZhi();
      const gan = gz.charAt(0);
      const zhi = gz.charAt(1);
      const liuNian: LiuNianItem[] = d
        .getLiuNian(10)
        .map((ln) => {
          const lgz = ln.getGanZhi();
          const liuYue = ln.getLiuYue().map((ly) => {
            const ygz = ly.getGanZhi();
            return {
              ganZhi: ygz,
              monthName: ly.getMonthInChinese() + "月",
              ganShiShen: shiShenOf(ec.getDayGan(), ygz.charAt(0)),
            };
          });
          return {
            year: ln.getYear(),
            age: ln.getAge(),
            ganZhi: lgz,
            ganShiShen: shiShenOf(ec.getDayGan(), lgz.charAt(0)),
            liuYue,
          };
        });
      return {
        startYear: d.getStartYear(),
        endYear: d.getEndYear(),
        startAge: d.getStartAge(),
        endAge: d.getEndAge(),
        ganZhi: gz,
        gan,
        zhi,
        ganShiShen: gan ? shiShenOf(ec.getDayGan(), gan) : "",
        ganWuXing: GAN_WUXING[gan],
        zhiWuXing: ZHI_WUXING[zhi],
        liuNian,
        isCurrent:
          currentYear >= d.getStartYear() && currentYear <= d.getEndYear(),
      };
    });

  const startSolar = yun.getStartSolar();
  const qiYunText = `出生后约 ${yun.getStartYear()} 年 ${yun.getStartMonth()} 个月 ${yun.getStartDay()} 天起运（约 ${startSolar.getYear()} 年）`;

  return {
    input,
    solarText: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${pad(solar.getHour())}:${pad(solar.getMinute())}`,
    lunarText: `${lunar.getYearInChinese()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${lunar.getTimeZhi()}时`,
    usedSolarText: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${pad(solar.getHour())}:${pad(solar.getMinute())}`,
    trueSolarAdjustMinutes: adjustMinutes,
    shengXiao: SHENG_XIAO[yearPillar.zhi],
    xingZuo: solar.getXingZuo(),
    pillars,
    dayMaster: ec.getDayGan(),
    taiYuan: ec.getTaiYuan(),
    mingGong: ec.getMingGong(),
    shenGong: ec.getShenGong(),
    wuXingStats,
    analysis,
    qiYunText,
    daYun,
    shenSha: computeShenSha(pillars, analysis),
    interpret: interpret(pillars, analysis),
  };
}

// 十神查表（日干 + 目标干）
import { LunarUtil } from "lunar-typescript";
function shiShenOf(dayGan: string, targetGan: string): string {
  const v = LunarUtil.SHI_SHEN[dayGan + targetGan];
  return v ?? "";
}
