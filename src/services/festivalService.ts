// src/services/festivalService.ts
import { Festival, RegionId, DayFestivalInfo } from '../types';
import { getFestivalsByRegions } from '../data';
import {
  getLunarDateInfo,
  getFestivalSolarDate,
  SolarDate,
} from './lunarService';

export interface ResolvedFestival {
  festival: Festival;
  solarDate: SolarDate;
}

export interface UpcomingFestival {
  festival: Festival;
  solarDate: SolarDate;
  daysUntil: number;
}

/**
 * Check if a festival date definition is resolvable (has valid month/day or solarTerm).
 * Festivals with month=0, day=0 and no solarTerm are "everyday" customs with no date.
 */
function isResolvable(festival: Festival): boolean {
  if (festival.calendarType === 'solarTerm') {
    return !!festival.date.solarTerm;
  }
  return festival.date.month > 0 && festival.date.day > 0;
}

// Cache resolved festival dates: "festivalId-year" -> SolarDate | null
const resolvedDateCache = new Map<string, SolarDate | null>();

/**
 * Resolve a festival to a solar date for a given year.
 * For lunar festivals, the year parameter is the lunar year.
 * Returns null if the festival cannot be resolved.
 */
function resolveFestivalDate(festival: Festival, year: number): SolarDate | null {
  if (!isResolvable(festival)) {
    return null;
  }
  const key = `${festival.id}-${year}`;
  if (resolvedDateCache.has(key)) {
    return resolvedDateCache.get(key)!;
  }
  const result = getFestivalSolarDate(year, {
    calendarType: festival.calendarType,
    date: festival.date,
  });
  resolvedDateCache.set(key, result);
  return result;
}

/**
 * Returns all festivals for a given solar calendar month and selected regions,
 * with their resolved solar dates.
 *
 * Handles year boundaries: lunar festivals from the previous/current lunar year
 * that fall into the requested solar month are included.
 */
export function getFestivalsForMonth(
  year: number,
  month: number,
  regions: RegionId[],
): ResolvedFestival[] {
  if (regions.length === 0 || month < 1 || month > 12) {
    return [];
  }

  const festivals = getFestivalsByRegions(regions);
  const results: ResolvedFestival[] = [];
  const seen = new Set<string>();

  // For each festival, try resolving with the current year and the previous year
  // (to handle year-boundary lunar festivals, e.g., lunar month 12 of year-1
  // may fall in January/February of the current solar year).
  const yearsToTry = [year, year - 1];

  for (const festival of festivals) {
    for (const tryYear of yearsToTry) {
      const solarDate = resolveFestivalDate(festival, tryYear);
      if (
        solarDate &&
        solarDate.year === year &&
        solarDate.month === month
      ) {
        const key = `${festival.id}-${solarDate.year}-${solarDate.month}-${solarDate.day}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ festival, solarDate });
        }
      }
    }
  }

  // Sort by day within the month
  results.sort((a, b) => a.solarDate.day - b.solarDate.day);
  return results;
}

/**
 * Returns all festivals that fall on a specific solar date.
 */
export function getFestivalsForDate(
  year: number,
  month: number,
  day: number,
  regions: RegionId[],
): Festival[] {
  if (regions.length === 0) {
    return [];
  }

  const festivals = getFestivalsByRegions(regions);
  const matched: Festival[] = [];
  const seen = new Set<string>();

  const yearsToTry = [year, year - 1];

  for (const festival of festivals) {
    for (const tryYear of yearsToTry) {
      const solarDate = resolveFestivalDate(festival, tryYear);
      if (
        solarDate &&
        solarDate.year === year &&
        solarDate.month === month &&
        solarDate.day === day
      ) {
        if (!seen.has(festival.id)) {
          seen.add(festival.id);
          matched.push(festival);
        }
      }
    }
  }

  return matched;
}

/**
 * Returns festivals within the next N days from today, sorted by proximity.
 */
export function getUpcomingFestivals(
  regions: RegionId[],
  daysAhead: number = 30,
): UpcomingFestival[] {
  if (regions.length === 0) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  const festivals = getFestivalsByRegions(regions);
  const results: UpcomingFestival[] = [];
  const seen = new Set<string>();

  const currentYear = today.getFullYear();
  // Try current year and next year to cover festivals near year boundary
  const yearsToTry = [currentYear, currentYear + 1];

  for (const festival of festivals) {
    for (const tryYear of yearsToTry) {
      const solarDate = resolveFestivalDate(festival, tryYear);
      if (!solarDate) {
        continue;
      }

      const festivalDate = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
      festivalDate.setHours(0, 0, 0, 0);
      const diffMs = festivalDate.getTime() - todayTime;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= daysAhead) {
        const key = `${festival.id}-${solarDate.year}-${solarDate.month}-${solarDate.day}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            festival,
            solarDate,
            daysUntil: diffDays,
          });
        }
      }
    }
  }

  results.sort((a, b) => a.daysUntil - b.daysUntil);
  return results;
}

/**
 * Calculates days until the next occurrence of a festival from today.
 * Returns -1 if the festival date cannot be resolved.
 */
export function getDaysUntilFestival(festival: Festival): number {
  if (!isResolvable(festival)) {
    return -1;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const currentYear = today.getFullYear();

  // Try current year first, then next year
  for (const tryYear of [currentYear, currentYear + 1]) {
    const solarDate = resolveFestivalDate(festival, tryYear);
    if (!solarDate) {
      continue;
    }

    const festivalDate = new Date(solarDate.year, solarDate.month - 1, solarDate.day);
    festivalDate.setHours(0, 0, 0, 0);
    const diffMs = festivalDate.getTime() - todayTime;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) {
      return diffDays;
    }
  }

  return -1;
}

/**
 * Returns complete day info including lunar date and festivals for a specific solar date.
 */
export function getDayFestivalInfo(
  year: number,
  month: number,
  day: number,
  regions: RegionId[],
): DayFestivalInfo {
  const lunarInfo = getLunarDateInfo(year, month, day);
  const festivals = getFestivalsForDate(year, month, day, regions);

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const lunarDateStr = `${lunarInfo.lunarMonthName}${lunarInfo.lunarDayName}`;

  return {
    date: dateStr,
    lunarDate: lunarDateStr,
    lunarMonth: lunarInfo.lunarMonthName,
    lunarDay: lunarInfo.lunarDayName,
    festivals,
    solarTerm: lunarInfo.solarTerm,
  };
}
