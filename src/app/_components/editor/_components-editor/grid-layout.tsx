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
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";

type Props = { 
  element: EditorElement;
};

export const GridLayoutComponent = ({ element }: Props) => {
  const { id, name, type, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);
  const [measureRef, containerHeight] = useElementHeight(false);

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

  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Translate.toString(sortable.transform),
    transition: sortable.transition,
  };

  const gridColumns = Array.isArray(content) ? content : [];

  const totalGridColumns = (computedStyles as any).gridColumns || 12;
  const columnSpans = (computedStyles as any).columnSpans || [];
  const gap = (computedStyles as any).gridGap || computedStyles.gap || "1rem";

  const defaultSpan = Math.floor(totalGridColumns / Math.max(gridColumns.length, 1));

  const generateGridTemplate = () => {
    // Her zaman tam grid template kullan, device'a göre hardcode yapma
      return `repeat(${totalGridColumns}, 1fr)`;
  };

  const gridTemplateColumns = generateGridTemplate();

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
              const columnSpan = columnSpans[index] || defaultSpan;

              return (
                <ColumnComponent
                  key={columnElement.id}
                  element={columnElement}
                  gridSpan={columnSpan}
                  totalGridColumns={totalGridColumns}
                  isPreviewMode={state.editor.previewMode || state.editor.liveMode}
                />
              );
            })}
          </SortableContext>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
        
        {/* Spacing Visualizer - only in edit mode and when selected */}
        {!state.editor.previewMode && !state.editor.liveMode && state.editor.selectedElement.id === id && (
          <SpacingVisualizer styles={computedStyles} />
        )}
      </div>
    </ElementContextMenu>
  );
};