import { Solar } from "lunar-typescript";
import type { JiRi } from "./types";
import { SHENG_XIAO } from "./theory";

/** 黄道吉神 */
const HUANG_DAO = new Set([
  "青龙", "明堂", "金匮", "天德", "玉堂", "司命",
]);

/** 建除十二值星中较利嫁娶者 */
const GOOD_ZHI_XING = new Set(["成", "开", "定", "执", "危"]);

/**
 * 嫁娶择吉：从给定起始日起遍历，筛选「宜嫁娶」且不冲新人生肖的黄道吉日。
 * 以传统通书宜忌、黄道黑道、建除十二神为依据。
 */
export function pickWeddingDates(
  maleYearZhi: string,
  femaleYearZhi: string,
  count = 8,
  from: Date = new Date(),
): JiRi[] {
  const maleSx = SHENG_XIAO[maleYearZhi];
  const femaleSx = SHENG_XIAO[femaleYearZhi];
  const result: JiRi[] = [];

  let solar = Solar.fromDate(from);
  for (let i = 0; i < 500 && result.length < count; i++) {
    solar = solar.next(1);
    const lunar = solar.getLunar();

    const yi = lunar.getDayYi();
    if (!yi.includes("嫁娶")) continue;

    const chong = lunar.getDayChongShengXiao();
    if (chong === maleSx || chong === femaleSx) continue; // 避开冲新人

    const tianShen = lunar.getDayTianShen();
    const luck = lunar.getDayTianShenLuck();
    const zhiXing = lunar.getZhiXing();

    // 取黄道吉神 或 吉神+利嫁娶值星
    const isHuangDao = HUANG_DAO.has(tianShen);
    if (!(isHuangDao || (luck === "吉" && GOOD_ZHI_XING.has(zhiXing)))) continue;

    result.push({
      solarText: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`,
      weekday: "周" + solar.getWeekInChinese(),
      lunarText: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      ganZhi: lunar.getDayInGanZhi(),
      zhiXing,
      tianShen: `${tianShen}（${luck}）`,
      chongShengXiao: chong,
      yi: yi.filter((y) => ["嫁娶", "纳采", "订盟", "会亲友", "祈福"].includes(y)),
    });
  }

  return result;
}
