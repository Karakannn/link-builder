import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor/editor-provider";

export enum Position {
  Before = -1,
  After = 1,
}

export enum Layout {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

type DropZoneWrapperProps = {
  children: React.ReactNode;
  elementId: string;
  containerId: string;
  index: number;
  layout?: Layout;
  insertPosition?: Position;
};

const DropZoneWrapper = ({
  children,
  elementId,
  containerId,
  index,
  layout = Layout.Vertical,
  insertPosition
}: DropZoneWrapperProps) => {
  const { state } = useEditor();

  const isVertical = layout === Layout.Vertical;
  const isHorizontal = layout === Layout.Horizontal;
  const isBefore = insertPosition === Position.Before;
  const isAfter = insertPosition === Position.After;

  // Before drop zone - element'in öncesine drop etmek için
  const beforeDroppable = useDroppable({
    id: `before-${elementId}`,
    data: {
      type: 'insert',
      containerId: containerId,
      insertIndex: index,
      position: 'before',
      targetElementId: elementId,
      layout: layout
    }
  });

  // After drop zone - element'in sonrasına drop etmek için  
  const afterDroppable = useDroppable({
    id: `after-${elementId}`,
    data: {
      type: 'insert',
      containerId: containerId,
      insertIndex: index + 1,
      position: 'after',
      targetElementId: elementId,
      layout: layout
    }
  });

  // Live mode veya preview mode'da hiçbir wrapper eklemeden döndür
  if (state.editor.liveMode || state.editor.previewMode) {
    return <>{children}</>;
  }

  return (
    <div className={cn(
      "relative",
      {
        // Vertical layout - elements stack vertically
        "w-full": isVertical,
        // Horizontal layout - elements side by side  
        "inline-block": isHorizontal,
      }
    )}>
      {/* Before Drop Zone */}
      <div
        ref={beforeDroppable.setNodeRef}
        className={cn(
          "absolute z-10",
          {
            // Vertical: Top drop zone
            "-top-2 left-0 right-0 h-4 w-full": isVertical,
            // Horizontal: Left drop zone  
            "-left-2 top-0 bottom-0 w-4 h-full": isHorizontal,
          }
        )}
      >
        {beforeDroppable.isOver && (
          <div
            className={cn(
              "bg-blue-500 shadow-lg animate-pulse",
              {
                // Vertical: Horizontal line
                "w-full h-2": isVertical,
                // Horizontal: Vertical line
                "h-full w-2": isHorizontal,
              }
            )}
            style={{
              position: 'absolute',
              ...(isVertical ? {
                top: '50%',
                transform: 'translateY(-50%)'
              } : {
                left: '50%',
                transform: 'translateX(-50%)'
              })
            }}
          />
        )}
      </div>

      {/* Element Content - Insert position styling */}
      <div className={cn(
        "transition-all duration-200",
        {
          // Insert position effects - similar to Pages example
          "relative": insertPosition,
          // Before indicators
          "before:content-[''] before:absolute before:bg-blue-500": insertPosition && !beforeDroppable.isOver && !afterDroppable.isOver,
          // Vertical before
          "before:left-0 before:right-0 before:h-[2px] before:-top-[15px]": isBefore && isVertical,
          // Horizontal before  
          "before:top-0 before:bottom-0 before:w-[2px] before:-left-[9px]": isBefore && isHorizontal,
          // Vertical after
          "before:left-0 before:right-0 before:h-[2px] before:-bottom-[15px]": isAfter && isVertical,
          // Horizontal after
          "before:top-0 before:bottom-0 before:w-[2px] before:-right-[9px]": isAfter && isHorizontal,
        }
      )}>
        {children}
      </div>

      {/* After Drop Zone */}
      <div
        ref={afterDroppable.setNodeRef}
        className={cn(
          "absolute z-10",
          {
            // Vertical: Bottom drop zone
            "-bottom-2 left-0 right-0 h-4 w-full": isVertical,
            // Horizontal: Right drop zone
            "-right-2 top-0 bottom-0 w-4 h-full": isHorizontal,
          }
        )}
      >
        {afterDroppable.isOver && (
          <div
            className={cn(
              "bg-blue-500 shadow-lg animate-pulse",
              {
                // Vertical: Horizontal line
                "w-full h-2": isVertical,
                // Horizontal: Vertical line  
                "h-full w-2": isHorizontal,
              }
            )}
            style={{
              position: 'absolute',
              ...(isVertical ? {
                bottom: '50%',
                transform: 'translateY(50%)'
              } : {
                right: '50%',
                transform: 'translateX(50%)'
              })
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DropZoneWrapper;