import { useDndContext } from "@dnd-kit/core";
import { useEditor } from "@/providers/editor/editor-provider";

export enum Position {
  Before = -1,
  After = 1,
}

type DropZoneWrapperProps = {
  children: React.ReactNode;
  elementId: string;
  index: number;
};

const DropZoneWrapper = ({ children, elementId, index }: DropZoneWrapperProps) => {
  const { state } = useEditor();
  const { active, over } = useDndContext();

  // Live mode'da wrapper eklemeden döndür
  if (state.editor.liveMode) {
    return <>{children}</>;
  }

  // Active elementın index'ini hesapla - sortable'dan al
  const activeIndex = active?.data?.current?.sortable?.index ?? -1;

  // insertPosition hesaplama - Pages component'indeki mantıkla aynı
  const insertPosition = over?.id === elementId && activeIndex !== -1
    ? index > activeIndex
      ? Position.After
      : Position.Before
    : undefined;

  const isBefore = insertPosition === Position.Before;
  const isAfter = insertPosition === Position.After;

  // Debug logları - sadece over olduğunda
  if (over?.id === elementId || insertPosition) {
    console.log("🔍 DropZone:", {
      elementId,
      index,
      activeIndex,
      insertPosition,
      overId: over?.id
    });
  }

  return (
    <div
      className={`
        relative w-full
        ${insertPosition ? 'after:content-["Drop_here"] after:absolute after:bg-blue-500 after:text-white after:text-xs after:font-medium after:px-2 after:py-1 after:rounded after:left-1/2 after:transform after:-translate-x-1/2 after:z-50 after:whitespace-nowrap after:shadow-lg' : ''}
        ${insertPosition ? 'before:content-[""] before:absolute before:bg-blue-500 before:left-0 before:right-0 before:h-[3px] before:z-40 before:rounded-full' : ''}
        ${isBefore ? 'after:-top-6 before:-top-[2px]' : ''}
        ${isAfter ? 'after:bottom-[-24px] before:-bottom-[2px]' : ''}
        ${insertPosition ? 'transition-all duration-150' : ''}
      `}
    >
      {children}
    </div>
  );
};

export default DropZoneWrapper;