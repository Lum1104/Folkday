import { memo } from 'react';
import type { Festival, RegionId } from '@shared/types';
import CountdownBadge from './CountdownBadge';

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

interface FestivalCardProps {
  festival: Festival;
  onClick: () => void;
}

function FestivalCard({ festival, onClick }: FestivalCardProps) {
  const regionColor = REGION_COLOR_MAP[festival.region];
  const regionName = REGION_NAME_MAP[festival.region];
  const truncatedDesc =
    festival.description.length > 60
      ? festival.description.slice(0, 60) + '…'
      : festival.description;

  return (
    <div
      className="festival-card"
      style={{ borderLeftColor: regionColor }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="festival-card__body">
        <div className="festival-card__top">
          <span className="festival-card__name">{festival.name}</span>
          <span
            className="festival-card__region-tag"
            style={{
              background: `${regionColor}14`,
              color: regionColor,
            }}
          >
            {regionName}
          </span>
          <span
            className={`festival-card__importance festival-card__importance--${festival.importance}`}
            title={festival.importance}
          />
        </div>
        <div className="festival-card__desc">{truncatedDesc}</div>
      </div>
      <div className="festival-card__right">
        <CountdownBadge festival={festival} />
      </div>
    </div>
  );
}

export default memo(FestivalCard);
