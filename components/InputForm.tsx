"use client";

import { useEffect, useMemo, useState } from "react";
import type { BaziInput, CalendarType, Gender } from "@/lib/bazi/types";
import { SHI_CHEN } from "@/lib/bazi/theory";
import { InfoTip } from "./ui";

const CITY_PRESETS: { name: string; lng: number }[] = [
  { name: "北京", lng: 116.4 },
  { name: "上海", lng: 121.47 },
  { name: "广州", lng: 113.26 },
  { name: "成都", lng: 104.07 },
  { name: "西安", lng: 108.95 },
  { name: "乌鲁木齐", lng: 87.62 },
  { name: "哈尔滨", lng: 126.63 },
];

export default function InputForm({
  onSubmit,
  onChange,
  initial,
  title = "录入生辰",
  submitLabel = "起 盘",
  showSubmit = true,
  lockGender = false,
}: {
  onSubmit?: (input: BaziInput) => void;
  onChange?: (input: BaziInput) => void;
  initial?: BaziInput;
  title?: string;
  submitLabel?: string;
  showSubmit?: boolean;
  lockGender?: boolean;
}) {
  const [calendar, setCalendar] = useState<CalendarType>(initial?.calendar ?? "solar");
  const [year, setYear] = useState(initial?.year ?? 1995);
  const [month, setMonth] = useState(initial?.month ?? 6);
  const [day, setDay] = useState(initial?.day ?? 15);
  const [hour, setHour] = useState(initial?.hour ?? 12);
  const [minute, setMinute] = useState(initial?.minute ?? 0);
  const [isLeapMonth, setIsLeapMonth] = useState(initial?.isLeapMonth ?? false);
  const [gender, setGender] = useState<Gender>(initial?.gender ?? "male");
  const [useTrueSolarTime, setUseTrueSolarTime] = useState(
    initial?.useTrueSolarTime ?? false,
  );
  const [longitude, setLongitude] = useState<number>(initial?.longitude ?? 116.4);
  // 录入方式：exact 精确时刻 / shichen 仅时辰（族谱式）
  const [timeMode, setTimeMode] = useState<"exact" | "shichen">("exact");
  const [shiChenZhi, setShiChenZhi] = useState<string>(() => {
    const h = initial?.hour ?? 12;
    return (
      SHI_CHEN.find((s) =>
        s.startHour === 23 ? h === 23 || h === 0 : h >= s.startHour && h < s.startHour + 2,
      )?.zhi ?? "午"
    );
  });

  // 时辰 → 代表小时（取时辰区间中点，子时取子正 0 时）
  const repHour = useMemo(() => {
    const s = SHI_CHEN.find((x) => x.zhi === shiChenZhi);
    return s ? (s.startHour + 1) % 24 : 12;
  }, [shiChenZhi]);

  const shiChen = useMemo(() => {
    const h = hour;
    return (
      SHI_CHEN.find((s) =>
        s.startHour === 23 ? h === 23 || h === 0 : h >= s.startHour && h < s.startHour + 2,
      )?.name ?? ""
    );
  }, [hour]);

  const effHour = timeMode === "exact" ? hour : repHour;
  const effMinute = timeMode === "exact" ? minute : 0;

  const current: BaziInput = {
    calendar,
    year,
    month,
    day,
    hour: effHour,
    minute: effMinute,
    isLeapMonth: calendar === "lunar" ? isLeapMonth : false,
    gender,
    longitude: useTrueSolarTime ? longitude : null,
    useTrueSolarTime,
  };

  useEffect(() => {
    onChange?.(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar, year, month, day, effHour, effMinute, isLeapMonth, gender, useTrueSolarTime, longitude]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(current);
  }

  const fieldCls =
    "w-full rounded-lg border border-line bg-background/40 px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold/40";
  const labelCls = "mb-1 block text-xs font-medium text-foreground/60";

  return (
    <form onSubmit={submit} className="paper-card rounded-2xl p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
        <div className="ml-auto inline-flex rounded-lg border border-line p-0.5 text-sm">
          {(["solar", "lunar"] as CalendarType[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCalendar(c)}
              className={`rounded-md px-3 py-1 transition ${
                calendar === c
                  ? "bg-gold text-white shadow-sm"
                  : "text-foreground/60 hover:text-ink"
              }`}
            >
              {c === "solar" ? "公历" : "农历"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-medium text-foreground/55">出生时间</span>
        <div className="inline-flex rounded-lg border border-line p-0.5 text-xs">
          {(
            [
              ["exact", "精确时刻"],
              ["shichen", "仅时辰"],
            ] as ["exact" | "shichen", string][]
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setTimeMode(m)}
              className={`rounded-md px-2.5 py-1 transition ${
                timeMode === m
                  ? "bg-gold text-white shadow-sm"
                  : "text-foreground/60 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {timeMode === "shichen" && (
          <span className="text-[11px] text-foreground/40">族谱常用，只知时辰</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className={labelCls}>年</label>
          <input
            type="number"
            min={1900}
            max={2100}
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls}>月</label>
          <input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls}>日</label>
          <input
            type="number"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(+e.target.value)}
            className={fieldCls}
          />
        </div>
        {timeMode === "exact" ? (
          <>
            <div>
              <label className="mb-1 block whitespace-nowrap text-[11px] font-medium text-foreground/60">
                时 (24h)
                {shiChen && <span className="ml-1 text-gold">· {shiChen}</span>}
              </label>
              <select
                value={hour}
                onChange={(e) => setHour(+e.target.value)}
                className={fieldCls}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")} 时
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>分</label>
              <input
                type="number"
                min={0}
                max={59}
                value={minute}
                onChange={(e) => setMinute(+e.target.value)}
                className={fieldCls}
              />
            </div>
          </>
        ) : (
          <div className="col-span-2">
            <label className={labelCls}>时辰</label>
            <select
              value={shiChenZhi}
              onChange={(e) => setShiChenZhi(e.target.value)}
              className={fieldCls}
            >
              {SHI_CHEN.map((s) => (
                <option key={s.zhi} value={s.zhi}>
                  {s.name}（{s.range}）
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelCls}>性别</label>
          <div className="flex h-[38px] overflow-hidden rounded-lg border border-line">
            {(
              [
                ["male", "男"],
                ["female", "女"],
              ] as [Gender, string][]
            ).map(([g, t]) => (
              <button
                key={g}
                type="button"
                disabled={lockGender}
                onClick={() => setGender(g)}
                className={`flex-1 text-sm transition ${
                  gender === g
                    ? "bg-accent text-white"
                    : "text-foreground/60 hover:bg-background/60"
                } ${lockGender ? "cursor-not-allowed" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {calendar === "lunar" && (
        <label className="mt-3 flex items-center gap-2 text-sm text-foreground/70">
          <input
            type="checkbox"
            checked={isLeapMonth}
            onChange={(e) => setIsLeapMonth(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          闰月
        </label>
      )}

      <div className="mt-4 rounded-xl border border-line bg-background/30 p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <input
            type="checkbox"
            checked={useTrueSolarTime}
            onChange={(e) => setUseTrueSolarTime(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          按真太阳时校正
          <InfoTip term="真太阳时" />
        </label>
        {useTrueSolarTime && (
          <div className="mt-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {CITY_PRESETS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setLongitude(c.lng)}
                  className={`rounded-full px-2.5 py-1 text-xs transition ${
                    Math.abs(longitude - c.lng) < 0.01
                      ? "bg-gold text-white"
                      : "border border-line text-foreground/60 hover:border-gold"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <label className={labelCls}>出生地经度（东经，°）</label>
            <input
              type="number"
              step="0.01"
              min={73}
              max={135}
              value={longitude}
              onChange={(e) => setLongitude(+e.target.value)}
              className={fieldCls}
            />
            <p className="mt-1 text-[11px] text-foreground/45">
              以东经 120° 北京时间为基准，每偏离 1° 校正约 4 分钟。
            </p>
          </div>
        )}
      </div>

      {showSubmit && (
        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-gradient-to-b from-accent to-[#6f4536] py-3 font-serif text-base font-semibold tracking-wider text-white shadow-md transition hover:brightness-110 active:scale-[0.99]"
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
