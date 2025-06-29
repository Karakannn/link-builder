import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { CSS } from '@dnd-kit/utilities';
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { GripVertical } from "lucide-react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";

type Props = {
  element: EditorElement;
  gridSpan?: number;
  totalGridColumns?: number;
  isPreviewMode?: boolean;
};

export const ColumnComponent = ({
  element,
  gridSpan = 1,
  totalGridColumns = 12,
  isPreviewMode = false
}: Props) => {
  const { id, name, type, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);

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
    <EditorElementWrapper element={element}>
      <div
        ref={sortable.setNodeRef}
        style={columnStyles}
        className={clsx("relative transition-all group", {
          "max-w-full w-full": true,
          "h-fit": true,
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleSelectElement}
        data-element-id={id}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
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

        {Array.isArray(content) && content.length > 0 && (
          <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
            {content.map((childElement, index) => (
              <Recursive key={childElement.id} element={childElement} />
            ))}
          </SortableContext>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />

        {/* Spacing Visualizer - only in edit mode and when selected */}
        {!isPreviewMode && state.editor.selectedElement.id === id && (
          <SpacingVisualizer styles={computedStyles} />
        )}
      </div>
    </EditorElementWrapper>
  );
};