import { memo } from 'react';
import type { RegionId } from '@shared/types';
import { getDaysInMonth } from '@shared/utils/dateUtils';
import DayCell from './DayCell';

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

interface FestivalMapEntry {
  regions: RegionId[];
  hasFestival: boolean;
}

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: { year: number; month: number; day: number };
  festivalMap: Map<number, FestivalMapEntry>;
  onSelectDate: (year: number, month: number, day: number) => void;
}

function CalendarGrid({
  year,
  month,
  selectedDate,
  festivalMap,
  onSelectDate,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayWeekday = new Date(year, month - 1, 1).getDay();
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const emptyCells = Array.from({ length: firstDayWeekday }, (_, i) => (
    <div key={`empty-${i}`} className="day-cell day-cell--empty" />
  ));

  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const isToday =
      year === todayYear && month === todayMonth && day === todayDay;
    const isSelected =
      year === selectedDate.year &&
      month === selectedDate.month &&
      day === selectedDate.day;
    const entry = festivalMap.get(day);
    const festivalRegions = entry?.regions ?? [];

    return (
      <DayCell
        key={day}
        year={year}
        month={month}
        day={day}
        isSelected={isSelected}
        isToday={isToday}
        festivalRegions={festivalRegions}
        onClick={() => onSelectDate(year, month, day)}
      />
    );
  });

  return (
    <div className="calendar-grid">
      <div className="calendar-grid__header">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar-grid__header-cell">
            {label}
          </div>
        ))}
      </div>
      {emptyCells}
      {dayCells}
    </div>
  );
}

export default memo(CalendarGrid);
