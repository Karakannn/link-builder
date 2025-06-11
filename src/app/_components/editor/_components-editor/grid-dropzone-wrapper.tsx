// src/app/_components/editor/_components-editor/grid-dropzone-wrapper.tsx
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor/editor-provider";

type GridDropZoneWrapperProps = {
  children: React.ReactNode;
  elementId: string;
  containerId: string;
  index: number;
};

const GridDropZoneWrapper = ({ children, elementId, containerId, index }: GridDropZoneWrapperProps) => {
  const { state } = useEditor();

  // Left drop zone - element'in soluna drop etmek için
  const leftDroppable = useDroppable({
    id: `left-${elementId}`,
    data: {
      type: 'insert',
      containerId: containerId,
      insertIndex: index,
      position: 'before',
      targetElementId: elementId,
      isGridDrop: true
    }
  });

  // Right drop zone - element'in sağına drop etmek için
  const rightDroppable = useDroppable({
    id: `right-${elementId}`,
    data: {
      type: 'insert',
      containerId: containerId,
      insertIndex: index + 1,
      position: 'after',
      targetElementId: elementId,
      isGridDrop: true
    }
  });

  // Live mode veya preview mode'da hiçbir wrapper eklemeden döndür
  if (state.editor.liveMode || state.editor.previewMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-full">
      {/* Left Drop Zone */}
      <div
        ref={leftDroppable.setNodeRef}
        className="absolute -left-2 top-0 bottom-0 w-4 z-10"
      >
        {leftDroppable.isOver && (
          <div className="h-full w-0.5 bg-blue-500 shadow-lg animate-pulse" 
               style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
        )}
      </div>

      {/* Element Content */}
      {children}

      {/* Right Drop Zone */}
      <div
        ref={rightDroppable.setNodeRef}
        className="absolute -right-2 top-0 bottom-0 w-4 z-10"
      >
        {rightDroppable.isOver && (
          <div className="h-full w-0.5 bg-blue-500 shadow-lg animate-pulse"
               style={{ position: 'absolute', right: '50%', transform: 'translateX(50%)' }} />
        )}
      </div>
    </div>
  );
};

export default GridDropZoneWrapper;