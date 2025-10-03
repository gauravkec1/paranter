import React from 'react';
import { useVirtualScrolling } from '@/hooks/useVirtualScrolling';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedList = <T,>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
}: VirtualizedListProps<T>) => {
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
  } = useVirtualScrolling(items, {
    itemHeight,
    containerHeight: height,
    overscan: 5,
  });

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};