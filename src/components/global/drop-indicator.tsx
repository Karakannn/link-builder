import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { DropIndicatorState } from '@/hooks/use-drop-indicator';

type DropIndicatorProps = {
  state: DropIndicatorState;
};

export const DropIndicator = ({ state }: DropIndicatorProps) => {
  const { isVisible, position, layout, rect } = state;

  if (!isVisible || !rect || !position) return null;

  const isVertical = layout === 'vertical';
  const isBefore = position === 'before';

  const indicatorStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    pointerEvents: 'none',
    backgroundColor: 'red',
    border: '1px solid blue',
    opacity: 1,
    ...(isVertical ? {
      left: rect.left,
      width: rect.width,
      height: '12px',
      top: isBefore ? rect.top - 6 : rect.bottom + 6,
    } : {
      top: rect.top,
      height: rect.height,
      width: '12px',
      left: isBefore ? rect.left - 6 : rect.right + 6,
    })
  };

  return createPortal(
    <div
      className={cn(
        "drop-indicator",
        "transition-all duration-200 ease-in-out"
      )}
      style={indicatorStyles}
    />,
    document.body
  );
};