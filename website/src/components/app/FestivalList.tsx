import { memo } from 'react';
import type { Festival, DayFestivalInfo } from '@shared/types';
import FestivalCard from './FestivalCard';

interface FestivalListProps {
  dayInfo: DayFestivalInfo | null;
  onViewFestival: (festival: Festival) => void;
}

function FestivalList({ dayInfo, onViewFestival }: FestivalListProps) {
  if (!dayInfo) {
    return null;
  }

  const hasFestivals = dayInfo.festivals.length > 0;

  return (
    <div className="festival-list">
      <div className="festival-list__header">
        <span className="festival-list__date-label">{dayInfo.date}</span>
        <span className="festival-list__lunar-label">
          {dayInfo.lunarMonth}{dayInfo.lunarDay}
        </span>
        {dayInfo.solarTerm && (
          <span className="festival-list__solar-term">
            {dayInfo.solarTerm}
          </span>
        )}
      </div>

      {hasFestivals ? (
        <div className="festival-list__items">
          {dayInfo.festivals.map((festival) => (
            <FestivalCard
              key={festival.id}
              festival={festival}
              onClick={() => onViewFestival(festival)}
            />
          ))}
        </div>
      ) : (
        <div className="festival-list__empty">
          <div className="festival-list__empty-icon">🍃</div>
          <div>当日暂无传统节日</div>
        </div>
      )}
    </div>
  );
}

export default memo(FestivalList);
