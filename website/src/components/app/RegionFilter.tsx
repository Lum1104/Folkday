import { memo } from 'react';
import type { RegionId } from '@shared/types';

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

const ALL_REGIONS: RegionId[] = ['chaoshan', 'minnan', 'guangfu', 'kejia'];

interface RegionFilterProps {
  selectedRegions: RegionId[];
  onToggleRegion: (regionId: RegionId) => void;
}

function RegionFilter({ selectedRegions, onToggleRegion }: RegionFilterProps) {
  return (
    <div className="region-filter">
      {ALL_REGIONS.map((regionId) => {
        const isSelected = selectedRegions.includes(regionId);
        const color = REGION_COLOR_MAP[regionId];

        return (
          <button
            key={regionId}
            className={`region-filter__btn${isSelected ? ' region-filter__btn--selected' : ''}`}
            style={
              isSelected
                ? { background: color, borderColor: color, color: '#fff' }
                : { background: 'transparent', borderColor: color, color }
            }
            onClick={() => onToggleRegion(regionId)}
          >
            {REGION_NAME_MAP[regionId]}
          </button>
        );
      })}
    </div>
  );
}

export default memo(RegionFilter);
