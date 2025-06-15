import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor/editor-provider";

// Page component'inden enum'u al
export enum Position {
  Before = -1,
  After = 1,
}

type DropZoneWrapperProps = {
  children: React.ReactNode;
  elementId: string;
  containerId: string;
  index: number;
  activeIndex?: number;
};

const DropZoneWrapper = ({ children, elementId, containerId, index, activeIndex }: DropZoneWrapperProps) => {
  const { state } = useEditor();

  // useSortable ile insertBefore mantığı
  const {
    setNodeRef,
    over,
    isDragging
  } = useSortable({
    id: elementId,
    data: {
      type: 'element',
      containerId: containerId,
      index: index,
      elementId: elementId
    }
  });

  // insertPosition hesaplama - Page component'indeki gibi
  const insertPosition = over?.id === elementId && activeIndex !== undefined
    ? index > activeIndex
      ? Position.After
      : Position.Before
    : undefined;

  console.log("index", index);
  console.log("activeIndex", activeIndex);

  const isBefore = insertPosition === Position.Before;
  const isAfter = insertPosition === Position.After;

  // Live mode veya preview mode'da hiçbir wrapper eklemeden döndür
  if (state.editor.liveMode || state.editor.previewMode) {
    return <>{children}</>;
  }

  return (
    <div
      ref={setNodeRef}
      className={`
        relative w-full max-w-full
        ${insertPosition ? 'after:content-[""] after:absolute after:bg-blue-500' : ''}
        ${insertPosition ? 'after:left-0 after:right-0 after:h-[2px]' : ''}
        ${isBefore ? 'after:-top-[1px]' : ''}
        ${isAfter ? 'after:-bottom-[1px]' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      {/* Element Content - TAMAMEN NORMAL */}
      {children}
    </div>
  );
};

export default DropZoneWrapper;