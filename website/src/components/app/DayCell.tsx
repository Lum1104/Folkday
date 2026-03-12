import { memo, useMemo } from 'react';
import type { RegionId } from '@shared/types';
import { getLunarDateInfo } from '@shared/services/lunarService';

const REGION_COLOR_MAP: Record<RegionId, string> = {
  chaoshan: '#C0392B',
  minnan: '#E67E22',
  guangfu: '#D4A017',
  kejia: '#27826B',
};

interface DayCellProps {
  year: number;
  month: number;
  day: number;
  isSelected: boolean;
  isToday: boolean;
  festivalRegions: RegionId[];
  onClick: () => void;
}

function DayCell({
  year,
  month,
  day,
  isSelected,
  isToday,
  festivalRegions,
  onClick,
}: DayCellProps) {
  const lunarInfo = useMemo(
    () => getLunarDateInfo(year, month, day),
    [year, month, day]
  );

  const lunarLabel = lunarInfo.solarTerm ?? lunarInfo.lunarDayName;
  const hasSolarTerm = !!lunarInfo.solarTerm;

  const classNames = [
    'day-cell',
    isToday && 'day-cell--today',
    isSelected && 'day-cell--selected',
  ]
    .filter(Boolean)
    .join(' ');

  const uniqueRegions = useMemo(() => {
    return [...new Set(festivalRegions)];
  }, [festivalRegions]);

  return (
    <div className={classNames} onClick={onClick} role="button" tabIndex={0}>
      <span className="day-cell__solar">{day}</span>
      <span
        className={`day-cell__lunar${hasSolarTerm ? ' day-cell__lunar--term' : ''}`}
      >
        {lunarLabel}
      </span>
      {uniqueRegions.length > 0 && (
        <div className="day-cell__dots">
          {uniqueRegions.map((regionId) => (
            <span
              key={regionId}
              className="day-cell__dot"
              style={{ background: REGION_COLOR_MAP[regionId] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(DayCell);
