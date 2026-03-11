// src/services/lunarService.ts
import { Solar, Lunar } from 'lunar-typescript';

export interface LunarDateInfo {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  lunarMonthName: string;
  lunarDayName: string;
  ganzhi: string;
  solarTerm?: string;
  isLeapMonth: boolean;
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

interface FestivalDateInput {
  calendarType: 'lunar' | 'solar' | 'solarTerm';
  date: {
    month: number;
    day: number;
    solarTerm?: string;
  };
}

/**
 * Get lunar date information for a given solar (Gregorian) date.
 */
export function getLunarDateInfo(year: number, month: number, day: number): LunarDateInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  const jieQi = lunar.getJieQi();

  return {
    lunarYear: lunar.getYear(),
    lunarMonth: Math.abs(lunar.getMonth()),
    lunarDay: lunar.getDay(),
    lunarMonthName: lunar.getMonthInChinese() + '月',
    lunarDayName: lunar.getDayInChinese(),
    ganzhi: lunar.getYearInGanZhi() + '年',
    solarTerm: jieQi || undefined,
    isLeapMonth: lunar.getMonth() < 0,
  };
}

/**
 * Convert a lunar date to a solar (Gregorian) date.
 * For leap months, pass isLeap = true.
 */
export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeap = false,
): SolarDate {
  const month = isLeap ? -lunarMonth : lunarMonth;
  const lunar = Lunar.fromYmd(lunarYear, month, lunarDay);
  const solar = lunar.getSolar();
  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
  };
}

/**
 * Get the solar date for a named solar term (jieqi) in a given year.
 * Uses the jieqi table from a Lunar object to efficiently look up dates,
 * rather than iterating day-by-day.
 */
export function getSolarTermDate(year: number, termName: string): SolarDate | null {
  // Use a date in the middle of the year to get the jieqi table
  // The table from any lunar date contains jieqi spanning roughly a year
  const solar = Solar.fromYmd(year, 6, 15);
  const lunar = solar.getLunar();
  const table = lunar.getJieQiTable();

  const solarObj = table[termName];
  if (solarObj && solarObj.getYear() === year) {
    return {
      year: solarObj.getYear(),
      month: solarObj.getMonth(),
      day: solarObj.getDay(),
    };
  }

  // If not found from mid-year, try from January (for early-year terms)
  // and from December (for late-year terms)
  const alternativeDates = [
    Solar.fromYmd(year, 1, 15),
    Solar.fromYmd(year, 12, 15),
  ];
  for (const altSolar of alternativeDates) {
    const altLunar = altSolar.getLunar();
    const altTable = altLunar.getJieQiTable();
    const altSolarObj = altTable[termName];
    if (altSolarObj && altSolarObj.getYear() === year) {
      return {
        year: altSolarObj.getYear(),
        month: altSolarObj.getMonth(),
        day: altSolarObj.getDay(),
      };
    }
  }

  return null;
}

/**
 * Resolve a festival date definition to a concrete solar date for a given year.
 * Supports lunar dates, solar dates, and solar-term-based dates.
 */
export function getFestivalSolarDate(year: number, festival: FestivalDateInput): SolarDate | null {
  switch (festival.calendarType) {
    case 'solar':
      return { year, month: festival.date.month, day: festival.date.day };

    case 'lunar':
      try {
        return lunarToSolar(year, festival.date.month, festival.date.day);
      } catch {
        return null;
      }

    case 'solarTerm':
      if (festival.date.solarTerm) {
        return getSolarTermDate(year, festival.date.solarTerm);
      }
      return null;

    default:
      return null;
  }
}
