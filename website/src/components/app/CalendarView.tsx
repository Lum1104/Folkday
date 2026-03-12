import { useMemo, useCallback } from 'react';
import type { Festival, RegionId } from '@shared/types';
import { getFestivalsForMonth } from '@shared/services/festivalService';
import { getDayFestivalInfo } from '@shared/services/festivalService';
import MonthNav from './MonthNav';
import CalendarGrid from './CalendarGrid';
import FestivalList from './FestivalList';

interface CalendarViewProps {
  year: number;
  month: number;
  selectedDate: { year: number; month: number; day: number };
  selectedRegions: RegionId[];
  onChangeMonth: (year: number, month: number) => void;
  onSelectDate: (year: number, month: number, day: number) => void;
  onViewFestival: (festival: Festival) => void;
}

export default function CalendarView({
  year,
  month,
  selectedDate,
  selectedRegions,
  onChangeMonth,
  onSelectDate,
  onViewFestival,
}: CalendarViewProps) {
  const festivalMap = useMemo(() => {
    const resolved = getFestivalsForMonth(year, month, selectedRegions);
    const map = new Map<number, { regions: RegionId[]; hasFestival: boolean }>();

    for (const item of resolved) {
      const day = item.solarDate.day;
      if (item.solarDate.year === year && item.solarDate.month === month) {
        const existing = map.get(day);
        if (existing) {
          if (!existing.regions.includes(item.festival.region)) {
            existing.regions.push(item.festival.region);
          }
        } else {
          map.set(day, {
            regions: [item.festival.region],
            hasFestival: true,
          });
        }
      }
    }

    return map;
  }, [year, month, selectedRegions]);

  const dayInfo = useMemo(() => {
    return getDayFestivalInfo(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day,
      selectedRegions
    );
  }, [selectedDate.year, selectedDate.month, selectedDate.day, selectedRegions]);

  const handlePrev = useCallback(() => {
    if (month === 1) {
      onChangeMonth(year - 1, 12);
    } else {
      onChangeMonth(year, month - 1);
    }
  }, [year, month, onChangeMonth]);

  const handleNext = useCallback(() => {
    if (month === 12) {
      onChangeMonth(year + 1, 1);
    } else {
      onChangeMonth(year, month + 1);
    }
  }, [year, month, onChangeMonth]);

  const handleToday = useCallback(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    onChangeMonth(y, m);
    onSelectDate(y, m, d);
  }, [onChangeMonth, onSelectDate]);

  return (
    <>
      <MonthNav
        year={year}
        month={month}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <CalendarGrid
        year={year}
        month={month}
        selectedDate={selectedDate}
        festivalMap={festivalMap}
        onSelectDate={onSelectDate}
      />
      <FestivalList dayInfo={dayInfo} onViewFestival={onViewFestival} />
    </>
  );
}
