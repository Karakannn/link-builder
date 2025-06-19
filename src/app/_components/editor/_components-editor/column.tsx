import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { CSS } from '@dnd-kit/utilities';
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { GripVertical } from "lucide-react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";

type Props = {
  element: EditorElement;
  gridSpan?: number;
  totalGridColumns?: number;
  isDropTarget?: boolean;
  isPreviewMode?: boolean;
};

export const ColumnComponent = ({ 
  element, 
  gridSpan = 1, 
  totalGridColumns = 12,
  isDropTarget = false,
  isPreviewMode = false
}: Props) => {
  const { id, name, type, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);
  const { active: activeDrag } = useDndContext();

  const sortable = useSortable({
    id: id,
    data: {
      type: "column",
      elementId: id,
      name: name,
      element,
      containerId: id,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Add droppable functionality for the column content area
  const droppable = useDroppable({
    id: `droppable-${id}`,
    data: {
      type: "column",
      containerId: id,
    },
  });

  // Sürüklenen element'in bu column'ın child'ı olup olmadığını kontrol et
  const isDraggedElementChildOfThisColumn = () => {
    if (!activeDrag || !Array.isArray(content)) return false;
    
    const draggedElementId = activeDrag.id;
    // draggable- prefix'ini kaldır
    const cleanDraggedElementId = String(draggedElementId).replace('draggable-', '');
    
    // Recursive olarak content içinde dragged element'i ara
    const findElementInContent = (elements: EditorElement[]): boolean => {
      for (const element of elements) {
        if (element.id === cleanDraggedElementId) {
          return true;
        }
        if (Array.isArray(element.content)) {
          if (findElementInContent(element.content)) {
            return true;
          }
        }
      }
      return false;
    };
    
    return findElementInContent(content);
  };

  const shouldShowDropHere = (isDropTarget || droppable.isOver) && 
    !state.editor.liveMode && 
    !isDraggedElementChildOfThisColumn();

  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
  };

  const columnStyles = {
    ...computedStyles,
    gridColumn: `span ${gridSpan}`,
    minHeight: "120px",
    opacity: sortable.isDragging ? 0.3 : 1,
  };

  const childItems = Array.isArray(content) ? content.map(child => child.id) : [];

  return (
    <ElementContextMenu element={element}>
      <div
        ref={sortable.setNodeRef}
        style={columnStyles}
        className={clsx("relative p-6 transition-all group", {
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "!border-green-500 !border-2 !bg-green-50/50": shouldShowDropHere,
        })}
        onClick={handleSelectElement}
      >
        {/* Drag Handle - Only this area is draggable */}
        {!state.editor.liveMode && (
          <div
            className="absolute -top-3 -left-3 bg-gray-600 hover:bg-gray-700 text-white p-1 rounded cursor-grab active:cursor-grabbing transition-colors z-20"
            {...sortable.listeners}
            {...sortable.attributes}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={12} />
          </div>
        )}

        {/* Column size indicator */}
        {!state.editor.liveMode && (
          <div className="absolute -top-6 left-0 bg-gray-600 text-white text-xs px-2 py-1 rounded">
            {gridSpan}/{totalGridColumns} ({Math.round((gridSpan / totalGridColumns) * 100)}%)
          </div>
        )}

        {/* Drop zone indicator */}
        {shouldShowDropHere && !state.editor.liveMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium">
              Drop Element Here
            </span>
          </div>
        )}

        {/* Column Content - Droppable area */}
        <div
          ref={droppable.setNodeRef}
          className="min-h-[60px]"
        >
          {Array.isArray(content) && content.length > 0 ? (
            <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
              {content.map((childElement, index) => (
                <Recursive key={childElement.id} element={childElement} />
              ))}
            </SortableContext>
          ) : (
            !isPreviewMode && (
              <div className="min-h-[60px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded">
                Drop elements here
              </div>
            )
          )}
        </div>

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
        
        {/* Spacing Visualizer - only in edit mode and when selected */}
        {!isPreviewMode && state.editor.selectedElement.id === id && (
          <SpacingVisualizer styles={computedStyles} />
        )}
      </div>
    </ElementContextMenu>
  );
};