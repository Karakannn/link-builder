import { useDroppable } from "@dnd-kit/core";
import { useEditor } from "@/providers/editor/editor-provider";

type ColumnDropZoneWrapperProps = {
  children: React.ReactNode;
  columnId: string;
  gridLayoutId: string;
  index: number;
  gridSpan: number;           // ← Yeni prop
  totalGridColumns: number;   // ← Yeni prop
};

const ColumnDropZoneWrapper = ({ 
  children, 
  columnId, 
  gridLayoutId, 
  index, 
  gridSpan, 
  totalGridColumns 
}: ColumnDropZoneWrapperProps) => {
  const { state } = useEditor();

  // Column'un yüzdelik genişliğini hesapla
  const columnWidthPercentage = (gridSpan / totalGridColumns) * 100;
  
  // Drop zone genişliğini column genişliğine göre ayarla
  const dropZoneWidth = `${columnWidthPercentage}%`;

  // Left drop zone - column'un soluna drop etmek için
  const leftDroppable = useDroppable({
    id: `left-column-${columnId}`,
    data: {
      type: 'column-insert',
      containerId: gridLayoutId,
      insertIndex: index,
      position: 'before',
      targetElementId: columnId,
      isColumnDrop: true
    }
  });

  // Right drop zone - column'un sağına drop etmek için
  const rightDroppable = useDroppable({
    id: `right-column-${columnId}`,
    data: {
      type: 'column-insert',
      containerId: gridLayoutId,
      insertIndex: index + 1,
      position: 'after',
      targetElementId: columnId,
      isColumnDrop: true
    }
  });

  // Live mode veya preview mode'da hiçbir wrapper eklemeden döndür
  if (state.editor.liveMode || state.editor.previewMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-full" style={{ gridColumn: `span ${gridSpan}` }}>
      {/* Left Drop Zone - Column genişliğine göre ölçeklendir */}
      <div
        ref={leftDroppable.setNodeRef}
        className="absolute top-0 bottom-0 z-20"
        style={{ 
          left: '0',
          width: '8px', // Sabit genişlik
          transform: 'translateX(-50%)'
        }}
      >
        {leftDroppable.isOver && (
          <div 
            className="h-full w-1 bg-blue-500 shadow-lg animate-pulse"
            style={{ 
              position: 'absolute', 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }} 
          />
        )}
      </div>

      {/* Column Content */}
      {children}

      {/* Right Drop Zone - Column genişliğine göre ölçeklendir */}
      <div
        ref={rightDroppable.setNodeRef}
        className="absolute top-0 bottom-0 z-20"
        style={{ 
          right: '0',
          width: '8px', // Sabit genişlik
          transform: 'translateX(50%)'
        }}
      >
        {rightDroppable.isOver && (
          <div 
            className="h-full w-1 bg-blue-500 shadow-lg animate-pulse"
            style={{ 
              position: 'absolute', 
              right: '50%', 
              transform: 'translateX(50%)' 
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default ColumnDropZoneWrapper;