import { useMemo, useEffect } from 'react';
import type { Festival, RegionId } from '@shared/types';
import { getDaysUntilFestival } from '@shared/services/festivalService';
import CountdownBadge from './CountdownBadge';
import CustomItem from './CustomItem';

const REGION_COLOR_MAP: Record<RegionId, string> = {
  chaoshan: '#C0392B',
  minnan: '#E67E22',
  guangfu: '#D4A017',
  kejia: '#27826B',
};

const REGION_NAME_MAP: Record<RegionId, string> = {
  chaoshan: '潮汕',
  minnan: '闽南',
  guangfu: '广府',
  kejia: '客家',
};

const IMPORTANCE_LABELS: Record<string, string> = {
  high: '重要',
  medium: '中等',
  low: '一般',
};

const CALENDAR_TYPE_LABELS: Record<string, string> = {
  lunar: '农历',
  solar: '公历',
  solarTerm: '节气',
};

interface FestivalDetailProps {
  festival: Festival | null;
  onClose: () => void;
}

export default function FestivalDetail({ festival, onClose }: FestivalDetailProps) {
  const isOpen = festival !== null;

  // Prevent body scroll when detail is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const dateInfo = useMemo(() => {
    if (!festival) return null;

    const daysUntil = getDaysUntilFestival(festival);
    // For lunar/solarTerm festivals, we approximate the display date
    const displayMonth = festival.date.month;
    const displayDay = festival.date.day;

    const calendarTypeLabel = CALENDAR_TYPE_LABELS[festival.calendarType] ?? festival.calendarType;

    let lunarInfo = null;
    if (festival.calendarType === 'lunar') {
      // Show lunar date directly from festival data
      lunarInfo = {
        lunarMonthName: `${displayMonth}月`,
        lunarDayName: `${displayDay}日`,
      };
    }

    return {
      calendarTypeLabel,
      displayMonth,
      displayDay,
      lunarInfo,
      daysUntil,
    };
  }, [festival]);

  const regionColor = festival ? REGION_COLOR_MAP[festival.region] : undefined;

  return (
    <div className={`festival-detail${isOpen ? ' is-open' : ''}`}>
      {festival && (
        <>
          <div className="festival-detail__header">
            <button className="festival-detail__back" onClick={onClose}>
              ← 返回
            </button>
            <div className="festival-detail__title">{festival.name}</div>
          </div>

          <div className="festival-detail__content">
            <div className="festival-detail__meta">
              <CountdownBadge festival={festival} />
              <span
                className="festival-detail__region-tag"
                style={{ background: regionColor }}
              >
                {REGION_NAME_MAP[festival.region]}
              </span>
              <span className="festival-detail__importance-tag">
                {IMPORTANCE_LABELS[festival.importance] ?? festival.importance}
              </span>
            </div>

            {dateInfo && (
              <div className="festival-detail__date-info">
                <div>
                  <strong>日历类型：</strong>
                  {dateInfo.calendarTypeLabel}
                </div>
                <div>
                  <strong>日期：</strong>
                  {festival.calendarType === 'solarTerm' && festival.date.solarTerm
                    ? festival.date.solarTerm
                    : `${dateInfo.displayMonth}月${dateInfo.displayDay}日`}
                </div>
                {dateInfo.lunarInfo && (
                  <div>
                    <strong>农历：</strong>
                    {dateInfo.lunarInfo.lunarMonthName}
                    {dateInfo.lunarInfo.lunarDayName}
                  </div>
                )}
              </div>
            )}

            <p className="festival-detail__description">
              {festival.description}
            </p>

            {festival.customs.length > 0 && (
              <>
                <div className="festival-detail__section-title">传统习俗</div>
                <div className="festival-detail__customs">
                  {festival.customs.map((custom, index) => (
                    <CustomItem
                      key={index}
                      custom={custom}
                      defaultOpen={index === 0}
                    />
                  ))}
                </div>
              </>
            )}

            {festival.tags.length > 0 && (
              <div className="festival-detail__tags">
                {festival.tags.map((tag) => (
                  <span key={tag} className="festival-detail__tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
