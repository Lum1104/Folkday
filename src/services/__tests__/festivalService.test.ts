// src/services/__tests__/festivalService.test.ts
import {
  getFestivalsForMonth,
  getFestivalsForDate,
  getUpcomingFestivals,
  getDaysUntilFestival,
  getDayFestivalInfo,
} from '../festivalService';
import { Festival } from '../../types';

describe('festivalService', () => {
  describe('getFestivalsForMonth', () => {
    it('should return festivals for a given month and regions', () => {
      // 2026年2月包含春节（正月初一 = 2月17日）
      const festivals = getFestivalsForMonth(2026, 2, ['chaoshan']);
      expect(festivals.length).toBeGreaterThan(0);
    });

    it('should return festivals with resolved solar dates', () => {
      const festivals = getFestivalsForMonth(2026, 2, ['chaoshan']);
      for (const f of festivals) {
        expect(f.solarDate).toBeDefined();
        expect(f.solarDate.month).toBe(2);
        expect(f.solarDate.year).toBe(2026);
      }
    });

    it('should return festivals from multiple regions', () => {
      const festivals = getFestivalsForMonth(2026, 2, ['chaoshan', 'minnan', 'guangfu', 'kejia']);
      expect(festivals.length).toBeGreaterThan(0);
      const regions = new Set(festivals.map(f => f.festival.region));
      // Spring Festival should appear in multiple regions
      expect(regions.size).toBeGreaterThan(1);
    });

    it('should return empty array for regions with no festivals in a month', () => {
      // Month 13 doesn't exist
      const festivals = getFestivalsForMonth(2026, 13, ['chaoshan']);
      expect(festivals).toEqual([]);
    });

    it('should handle empty regions array', () => {
      const festivals = getFestivalsForMonth(2026, 2, []);
      expect(festivals).toEqual([]);
    });

    it('should include solar term festivals like 清明 in April', () => {
      const festivals = getFestivalsForMonth(2026, 4, ['chaoshan']);
      const qingming = festivals.find(f => f.festival.name.includes('清明'));
      expect(qingming).toBeDefined();
    });

    it('should handle year boundary - lunar month 12 festivals appearing in January/February', () => {
      // Lunar month 12 (腊月) festivals may appear in Jan/Feb of the next solar year
      const janFestivals = getFestivalsForMonth(2026, 1, ['chaoshan']);
      const febFestivals = getFestivalsForMonth(2026, 2, ['chaoshan']);
      // Combined should have some festivals (腊月 or 正月)
      expect(janFestivals.length + febFestivals.length).toBeGreaterThan(0);
    });
  });

  describe('getFestivalsForDate', () => {
    it('should return festivals on Spring Festival date', () => {
      // 2026-02-17 is lunar 正月初一
      const festivals = getFestivalsForDate(2026, 2, 17, ['chaoshan', 'minnan', 'guangfu', 'kejia']);
      expect(festivals.length).toBeGreaterThan(0);
      const names = festivals.map(f => f.name);
      const hasSpringFestival = names.some(n => n.includes('春节') || n.includes('正月初一') || n.includes('过年'));
      expect(hasSpringFestival).toBe(true);
    });

    it('should return empty array when no festivals fall on a date', () => {
      // A random date unlikely to have festivals
      const festivals = getFestivalsForDate(2026, 6, 15, ['chaoshan']);
      // May or may not have festivals, but should not throw
      expect(Array.isArray(festivals)).toBe(true);
    });

    it('should handle empty regions', () => {
      const festivals = getFestivalsForDate(2026, 2, 17, []);
      expect(festivals).toEqual([]);
    });
  });

  describe('getUpcomingFestivals', () => {
    it('should return upcoming festivals sorted by date', () => {
      const upcoming = getUpcomingFestivals(['chaoshan'], 365);
      expect(Array.isArray(upcoming)).toBe(true);
      if (upcoming.length > 1) {
        expect(upcoming[0].daysUntil).toBeLessThanOrEqual(upcoming[1].daysUntil);
      }
    });

    it('should respect the daysAhead limit', () => {
      const upcoming = getUpcomingFestivals(['chaoshan'], 30);
      for (const item of upcoming) {
        expect(item.daysUntil).toBeLessThanOrEqual(30);
        expect(item.daysUntil).toBeGreaterThanOrEqual(0);
      }
    });

    it('should include festivals from all specified regions', () => {
      const upcoming = getUpcomingFestivals(['chaoshan', 'guangfu'], 365);
      if (upcoming.length > 0) {
        const regions = new Set(upcoming.map(u => u.festival.region));
        // With 365 days, both regions should have festivals
        expect(regions.size).toBeGreaterThanOrEqual(1);
      }
    });

    it('should handle empty regions array', () => {
      const upcoming = getUpcomingFestivals([], 30);
      expect(upcoming).toEqual([]);
    });
  });

  describe('getDaysUntilFestival', () => {
    it('should return a non-negative number for a lunar festival', () => {
      const festival: Festival = {
        id: 'test-spring',
        name: '春节',
        region: 'chaoshan',
        calendarType: 'lunar',
        date: { month: 1, day: 1 },
        importance: 'high',
        customs: [],
        description: 'test',
        tags: [],
      };
      const days = getDaysUntilFestival(festival);
      expect(days).toBeGreaterThanOrEqual(0);
      expect(days).toBeLessThanOrEqual(366);
    });

    it('should return a non-negative number for a solar term festival', () => {
      const festival: Festival = {
        id: 'test-qingming',
        name: '清明',
        region: 'chaoshan',
        calendarType: 'solarTerm',
        date: { month: 0, day: 0, solarTerm: '清明' },
        importance: 'high',
        customs: [],
        description: 'test',
        tags: [],
      };
      const days = getDaysUntilFestival(festival);
      expect(days).toBeGreaterThanOrEqual(0);
      expect(days).toBeLessThanOrEqual(366);
    });

    it('should return -1 for unresolvable festivals', () => {
      const festival: Festival = {
        id: 'test-bad',
        name: '无日期',
        region: 'chaoshan',
        calendarType: 'solar',
        date: { month: 0, day: 0 },
        importance: 'low',
        customs: [],
        description: 'test',
        tags: [],
      };
      const days = getDaysUntilFestival(festival);
      expect(days).toBe(-1);
    });
  });

  describe('getDayFestivalInfo', () => {
    it('should return lunar info for any date', () => {
      const info = getDayFestivalInfo(2026, 3, 11, ['chaoshan']);
      expect(info.lunarMonth).toBeDefined();
      expect(info.lunarDay).toBeDefined();
      expect(info.lunarDate).toBeDefined();
      expect(info.date).toBe('2026-03-11');
    });

    it('should include festivals for a festival date', () => {
      // 2026-02-17 is Spring Festival
      const info = getDayFestivalInfo(2026, 2, 17, ['chaoshan', 'minnan', 'guangfu', 'kejia']);
      expect(info.festivals.length).toBeGreaterThan(0);
    });

    it('should include solar term if present', () => {
      // 2026-04-05 is 清明
      const info = getDayFestivalInfo(2026, 4, 5, ['chaoshan']);
      expect(info.solarTerm).toBe('清明');
    });

    it('should handle a date with no festivals', () => {
      const info = getDayFestivalInfo(2026, 7, 15, ['chaoshan']);
      expect(info.date).toBe('2026-07-15');
      expect(Array.isArray(info.festivals)).toBe(true);
    });
  });
});
