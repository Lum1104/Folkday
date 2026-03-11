import { formatDate, getDaysInMonth, getMonthDays, isSameDay } from '../dateUtils';

describe('dateUtils', () => {
  it('formatDate should format date correctly', () => {
    expect(formatDate(2026, 3, 5)).toBe('2026-03-05');
  });

  it('getDaysInMonth should return correct days', () => {
    expect(getDaysInMonth(2026, 2)).toBe(28);
    expect(getDaysInMonth(2024, 2)).toBe(29); // leap year
    expect(getDaysInMonth(2026, 1)).toBe(31);
  });

  it('isSameDay should compare dates', () => {
    expect(isSameDay('2026-03-11', 2026, 3, 11)).toBe(true);
    expect(isSameDay('2026-03-11', 2026, 3, 12)).toBe(false);
  });
});
