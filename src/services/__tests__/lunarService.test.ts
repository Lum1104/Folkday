// src/services/__tests__/lunarService.test.ts
import {
  getLunarDateInfo,
  lunarToSolar,
  getSolarTermDate,
  getFestivalSolarDate,
} from '../lunarService';

describe('lunarService', () => {
  describe('getLunarDateInfo', () => {
    it('should return lunar date info for a solar date', () => {
      const info = getLunarDateInfo(2026, 1, 1);
      expect(info).toHaveProperty('lunarYear');
      expect(info).toHaveProperty('lunarMonth');
      expect(info).toHaveProperty('lunarDay');
      expect(info).toHaveProperty('lunarMonthName');
      expect(info).toHaveProperty('lunarDayName');
      expect(info).toHaveProperty('ganzhi');
      expect(info).toHaveProperty('isLeapMonth');
    });

    it('should return correct lunar date for 2026-01-01', () => {
      // 2026-01-01 is lunar year 2025, month 11, day 13
      const info = getLunarDateInfo(2026, 1, 1);
      expect(info.lunarYear).toBe(2025);
      expect(info.lunarMonth).toBe(11);
      expect(info.lunarDay).toBe(13);
      expect(info.isLeapMonth).toBe(false);
    });

    it('should return solarTerm when the date falls on one', () => {
      // 2026-04-05 is 清明
      const info = getLunarDateInfo(2026, 4, 5);
      expect(info.solarTerm).toBe('清明');
    });

    it('should return undefined solarTerm for a normal day', () => {
      const info = getLunarDateInfo(2026, 1, 1);
      expect(info.solarTerm).toBeUndefined();
    });

    it('should include ganzhi year info', () => {
      const info = getLunarDateInfo(2026, 3, 1);
      // Lunar year 2026 is 丙午年
      expect(info.ganzhi).toContain('年');
    });
  });

  describe('lunarToSolar', () => {
    it('should convert lunar date to solar date', () => {
      // 2026年正月初一 = 2026-02-17
      const result = lunarToSolar(2026, 1, 1);
      expect(result).toEqual({ year: 2026, month: 2, day: 17 });
    });

    it('should convert lunar mid-autumn to solar date', () => {
      // 八月十五 (Mid-Autumn)
      const result = lunarToSolar(2026, 8, 15);
      expect(result).toBeDefined();
      expect(result.year).toBe(2026);
      // Mid-Autumn 2026 falls in September or October
      expect(result.month).toBeGreaterThanOrEqual(9);
      expect(result.month).toBeLessThanOrEqual(10);
    });
  });

  describe('getSolarTermDate', () => {
    it('should return the solar date for Qingming in 2026', () => {
      const result = getSolarTermDate(2026, '清明');
      expect(result).toBeDefined();
      expect(result!.year).toBe(2026);
      expect(result!.month).toBe(4);
      expect(result!.day).toBeGreaterThanOrEqual(4);
      expect(result!.day).toBeLessThanOrEqual(6);
    });

    it('should return the solar date for Lichun (立春) in 2026', () => {
      const result = getSolarTermDate(2026, '立春');
      expect(result).toBeDefined();
      expect(result!.year).toBe(2026);
      expect(result!.month).toBe(2);
    });

    it('should return null for an invalid solar term name', () => {
      const result = getSolarTermDate(2026, '不存在的节气');
      expect(result).toBeNull();
    });
  });

  describe('getFestivalSolarDate', () => {
    it('should resolve lunar festival to solar date', () => {
      // 正月十五 (Lantern Festival)
      const result = getFestivalSolarDate(2026, {
        calendarType: 'lunar',
        date: { month: 1, day: 15 },
      });
      expect(result).toBeDefined();
      expect(result!.year).toBe(2026);
    });

    it('should resolve solar festival to solar date', () => {
      const result = getFestivalSolarDate(2026, {
        calendarType: 'solar',
        date: { month: 10, day: 1 },
      });
      expect(result).toEqual({ year: 2026, month: 10, day: 1 });
    });

    it('should resolve solar term festival to solar date', () => {
      const result = getFestivalSolarDate(2026, {
        calendarType: 'solarTerm',
        date: { month: 0, day: 0, solarTerm: '清明' },
      });
      expect(result).toBeDefined();
      expect(result!.year).toBe(2026);
      expect(result!.month).toBe(4);
    });

    it('should return null for solarTerm type without solarTerm name', () => {
      const result = getFestivalSolarDate(2026, {
        calendarType: 'solarTerm',
        date: { month: 0, day: 0 },
      });
      expect(result).toBeNull();
    });
  });
});
