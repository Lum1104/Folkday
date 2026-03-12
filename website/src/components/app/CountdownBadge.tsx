import { memo, useMemo } from 'react';
import type { Festival } from '@shared/types';
import { getDaysUntilFestival } from '@shared/services/festivalService';

interface CountdownBadgeProps {
  festival: Festival;
}

function CountdownBadge({ festival }: CountdownBadgeProps) {
  const days = useMemo(() => getDaysUntilFestival(festival), [festival]);

  if (days < 0) {
    return null;
  }

  let label: string;
  let modifier: string;

  if (days === 0) {
    label = '今天';
    modifier = 'today';
  } else if (days === 1) {
    label = '明天';
    modifier = 'tomorrow';
  } else if (days === 2) {
    label = '后天';
    modifier = 'soon';
  } else if (days <= 30) {
    label = `${days}天后`;
    modifier = 'soon';
  } else {
    label = `${days}天后`;
    modifier = 'later';
  }

  return (
    <span className={`countdown-badge countdown-badge--${modifier}`}>
      {label}
    </span>
  );
}

export default memo(CountdownBadge);
