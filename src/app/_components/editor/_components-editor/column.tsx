import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";

type Props = {
  element: EditorElement;
  gridSpan?: number;
  totalGridColumns?: number;
  isDropTarget?: boolean; // DndContext'ten gelecek drop indicator
};

export const ColumnComponent = ({ 
  element, 
  gridSpan = 1, 
  totalGridColumns = 12,
  isDropTarget = false
}: Props) => {
  const { id, name, type, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);

  // Sadece sortable - droppable kaldırıldı
  const sortable = useSortable({
    id: id,
    data: {
      type: "column",
      elementId: id,
      name: name,
      element,
      containerId: id, // Drop detection için containerId eklendi
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
  };

  // Column specific styles
  const columnStyles = {
    ...computedStyles,
    gridColumn: `span ${gridSpan}`,
    minHeight: "120px",
    opacity: sortable.isDragging ? 0.3 : 1,
  };

  return (
    <ElementContextMenu element={element}>
      <div
        ref={sortable.setNodeRef}
        style={columnStyles}
        className={clsx("relative p-6 transition-all group", {
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          // Drop indicator - DndContext'ten gelecek
          "!border-green-500 !border-2 !bg-green-50/50": isDropTarget && !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
        })}
        onClick={handleSelectElement}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
      >
        {/* Column size indicator */}
        {!state.editor.liveMode && (
          <div className="absolute -top-6 left-0 bg-gray-600 text-white text-xs px-2 py-1 rounded">
            {gridSpan}/{totalGridColumns} ({Math.round((gridSpan / totalGridColumns) * 100)}%)
          </div>
        )}

        {/* Drop zone indicator - DndContext tarafından kontrol ediliyor */}
        {isDropTarget && !state.editor.liveMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium z-10">
              Drop Element Here
            </span>
          </div>
        )}

        {/* Column Content */}
        {Array.isArray(content) && content.length > 0 ? (
          content.map((childElement, index) => (
            <Recursive key={childElement.id} element={childElement} />
          ))
        ) : (
          <div className="min-h-[60px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded">
            Drop elements here
          </div>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  );
};