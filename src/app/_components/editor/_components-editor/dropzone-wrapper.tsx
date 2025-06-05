import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor/editor-provider";

type DropZoneWrapperProps = {
  children: React.ReactNode;
  elementId: string;
  containerId: string;
  index: number;
};

const DropZoneWrapper = ({ children, elementId, containerId, index }: DropZoneWrapperProps) => {
  const { state } = useEditor();

  // Top drop zone - element'in üstüne drop etmek için
  const topDroppable = useDroppable({
    id: `top-${elementId}`,
    data: {
      type: 'insert',
      containerId: containerId,
      insertIndex: index,
      position: 'before',
      targetElementId: elementId
    }
  });

  // Bottom drop zone - element'in altına drop etmek için
  const bottomDroppable = useDroppable({
    id: `bottom-${elementId}`,
    data: {
      type: 'insert',
      containerId: containerId,
      insertIndex: index + 1,
      position: 'after',
      targetElementId: elementId
    }
  });

  // Live mode veya preview mode'da hiçbir wrapper eklemeden döndür
  if (state.editor.liveMode || state.editor.previewMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full max-w-full">
      {/* Top Drop Zone - Element'in üzerinde overlay */}
      <div
        ref={topDroppable.setNodeRef}
        className="absolute -top-2 left-0 right-0 h-4 z-40 w-full"
      >
        {topDroppable.isOver && (
          <div className="w-full h-0.5 bg-blue-500 shadow-lg animate-pulse" 
               style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
        )}
      </div>

      {/* Element Content - TAMAMEN NORMAL */}
      {children}

      {/* Bottom Drop Zone - Element'in altında overlay */}
      <div
        ref={bottomDroppable.setNodeRef}
        className="absolute -bottom-2 left-0 right-0 h-4 z-40 w-full"
      >
        {bottomDroppable.isOver && (
          <div className="w-full h-0.5 bg-blue-500 shadow-lg animate-pulse"
               style={{ position: 'absolute', bottom: '50%', transform: 'translateY(50%)' }} />
        )}
      </div>
    </div>
  );
};

export default DropZoneWrapper;