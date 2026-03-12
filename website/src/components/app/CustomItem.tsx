import { useState, memo } from 'react';
import type { Custom } from '@shared/types';

interface CustomItemProps {
  custom: Custom;
  defaultOpen?: boolean;
}

function CustomItem({ custom, defaultOpen = false }: CustomItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`custom-item${isOpen ? ' custom-item--open' : ''}`}>
      <button
        className="custom-item__header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span>{custom.title}</span>
        <span className="custom-item__chevron">▼</span>
      </button>
      <div className="custom-item__body">
        <div className="custom-item__body-inner">
          <div className="custom-item__desc">{custom.description}</div>

          {custom.preparations && custom.preparations.length > 0 && (
            <>
              <div className="custom-item__sub-title">准备事项</div>
              <ul className="custom-item__prep-list">
                {custom.preparations.map((prep, i) => (
                  <li key={i}>{prep}</li>
                ))}
              </ul>
            </>
          )}

          {custom.timing && (
            <div className="custom-item__timing">
              时间：{custom.timing}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(CustomItem);
