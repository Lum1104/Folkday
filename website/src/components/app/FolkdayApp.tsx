import { useState, useCallback, useEffect } from 'react';
import type { Festival, RegionId } from '@shared/types';
import { REGION_LIST } from '@shared/types';
import CalendarView from './CalendarView';
import FestivalDetail from './FestivalDetail';
import RegionFilter from './RegionFilter';
import './app.css';

const STORAGE_KEY = 'folkday_selected_regions';

function loadRegions(): RegionId[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RegionId[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return REGION_LIST.map((r) => r.id);
}

export default function FolkdayApp() {
  const today = new Date();
  const [selectedRegions, setSelectedRegions] = useState<RegionId[]>(loadRegions);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  });
  const [viewingFestival, setViewingFestival] = useState<Festival | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedRegions));
  }, [selectedRegions]);

  const handleToggleRegion = useCallback((regionId: RegionId) => {
    setSelectedRegions((prev) => {
      if (prev.includes(regionId)) {
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== regionId);
      }
      return [...prev, regionId];
    });
  }, []);

  const handleChangeMonth = useCallback(
    (year: number, month: number) => {
      setCurrentYear(year);
      setCurrentMonth(month);
    },
    []
  );

  const handleSelectDate = useCallback(
    (year: number, month: number, day: number) => {
      setSelectedDate({ year, month, day });
    },
    []
  );

  const handleViewFestival = useCallback((festival: Festival) => {
    setViewingFestival(festival);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setViewingFestival(null);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header__title">节知 Folkday</div>
        <div className="app-header__right">
          <RegionFilter
            selectedRegions={selectedRegions}
            onToggleRegion={handleToggleRegion}
          />
        </div>
      </header>

      <main className="app-main">
        <div className="app-main__calendar">
          <CalendarView
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            selectedRegions={selectedRegions}
            onChangeMonth={handleChangeMonth}
            onSelectDate={handleSelectDate}
            onViewFestival={handleViewFestival}
          />
        </div>

        <div
          className={`detail-overlay${viewingFestival ? ' is-open' : ''}`}
          onClick={handleCloseDetail}
        />
        <FestivalDetail festival={viewingFestival} onClose={handleCloseDetail} />
      </main>
    </div>
  );
}
