import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ColumnComponent } from "./column";
import { getElementStyles } from "@/lib/utils";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { useDndMonitor } from "@dnd-kit/core";

type Props = { 
  element: EditorElement;
};

export const GridLayoutComponent = ({ element }: Props) => {
  const { id, name, type, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);
  const [measureRef, containerHeight] = useElementHeight(false);
  const [dropTargetColumnId, setDropTargetColumnId] = useState<string | null>(null);

  const sortable = useSortable({
    id: id,
    data: {
      type,
      name,
      element,
      elementId: id,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // DndMonitor ile drop target'ı takip et
  useDndMonitor({
    onDragOver: (event) => {
      const { over, active } = event;
      
      if (!over || !active) {
        setDropTargetColumnId(null);
        return;
      }

      // Sadece sidebar elementleri için drop target göster
      const isFromSidebar = active.data?.current?.isSidebarElement;
      const overType = over.data?.current?.type;
      
      if (isFromSidebar && overType === "column") {
        setDropTargetColumnId(over.id as string);
      } else {
        setDropTargetColumnId(null);
      }
    },
    onDragEnd: () => {
      setDropTargetColumnId(null);
    },
    onDragCancel: () => {
      setDropTargetColumnId(null);
    },
  });

  // Get computed styles based on current device
  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
  };

  // Grid columns - content array'indeki column'lar
  const gridColumns = Array.isArray(content) ? content : [];

  // Grid ayarlarını styles'tan al
  const totalGridColumns = (computedStyles as any).gridColumns || 12;
  const columnSpans = (computedStyles as any).columnSpans || [];
  const gap = (computedStyles as any).gridGap || computedStyles.gap || "1rem";

  const defaultSpan = Math.floor(totalGridColumns / Math.max(gridColumns.length, 1));

  // Generate grid template columns based on device
  const generateGridTemplate = () => {
    const device = state.editor.device;

    if (device === "Mobile") {
      return "1fr";
    } else if (device === "Tablet") {
      return "repeat(2, 1fr)";
    } else {
      return `repeat(${totalGridColumns}, 1fr)`;
    }
  };

  const gridTemplateColumns = generateGridTemplate();

  // Final grid styles
  const finalGridStyles = {
    ...computedStyles,
    display: 'grid',
    gridTemplateColumns: gridTemplateColumns,
    gap: gap,
  };

  const setNodeRef = (node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
    measureRef(node);
  };

  if (sortable.isDragging) {
    return (
      <DragPlaceholder
        style={finalGridStyles}
        height={containerHeight}
      />
    );
  }

  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={finalGridStyles}
        className={clsx("relative p-6 transition-all group min-h-[200px]", {
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleSelectElement}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
      >
        {Array.isArray(content) && content.length > 0 && (
          <SortableContext items={gridColumns.map((item) => item.id)} strategy={horizontalListSortingStrategy}>
            {gridColumns.map((columnElement, index) => {
              // Column span hesaplama - device'a göre
              let columnSpan: number;

              if (state.editor.device === "Desktop") {
                columnSpan = columnSpans[index] || defaultSpan;
              } else if (state.editor.device === "Mobile") {
                columnSpan = totalGridColumns;
              } else {
                columnSpan = Math.floor(totalGridColumns / 2);
              }

              return (
                <ColumnComponent
                  key={columnElement.id}
                  element={columnElement}
                  gridSpan={columnSpan}
                  totalGridColumns={totalGridColumns}
                  isDropTarget={dropTargetColumnId === columnElement.id} // Drop target state'i geçir
                />
              );
            })}
          </SortableContext>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  );
};