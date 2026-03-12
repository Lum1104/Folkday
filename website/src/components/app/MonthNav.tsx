import { memo } from 'react';

interface MonthNavProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

function MonthNav({ year, month, onPrev, onNext, onToday }: MonthNavProps) {
  return (
    <div className="month-nav">
      <button
        className="month-nav__btn"
        onClick={onPrev}
        aria-label="上个月"
      >
        ‹
      </button>
      <span className="month-nav__label">
        {year}年{month}月
      </span>
      <button
        className="month-nav__btn"
        onClick={onNext}
        aria-label="下个月"
      >
        ›
      </button>
      <button className="month-nav__today" onClick={onToday}>
        今天
      </button>
    </div>
  );
}

export default memo(MonthNav);
