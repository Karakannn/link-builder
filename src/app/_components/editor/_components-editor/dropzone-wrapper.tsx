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

  // Live mode veya preview mode'da drop zone'ları gösterme
  if (state.editor.liveMode || state.editor.previewMode) {
    return <div className="relative">{children}</div>;
  }

  return (
    <div className="relative">
      {/* Top Drop Zone */}
      <div
        ref={topDroppable.setNodeRef}
        className={cn(
          "absolute -top-1 left-0 right-0 h-2 z-40 transition-all duration-200",
          {
            "bg-blue-500/30": topDroppable.isOver,
            "hover:bg-blue-500/10": !topDroppable.isOver,
          }
        )}
      >
        {topDroppable.isOver && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-lg animate-pulse" />
        )}
      </div>

      {/* Element Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom Drop Zone */}
      <div
        ref={bottomDroppable.setNodeRef}
        className={cn(
          "absolute -bottom-1 left-0 right-0 h-2 z-40 transition-all duration-200",
          {
            "bg-blue-500/30": bottomDroppable.isOver,
            "hover:bg-blue-500/10": !bottomDroppable.isOver,
          }
        )}
      >
        {bottomDroppable.isOver && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-lg animate-pulse" />
        )}
      </div>

      {/* Debug info - development için (production'da kaldırılabilir) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 text-xs bg-gray-800 text-white px-1 rounded opacity-0 hover:opacity-100 transition-opacity z-50">
          idx: {index}
        </div>
      )}
    </div>
  );
};

export default DropZoneWrapper;