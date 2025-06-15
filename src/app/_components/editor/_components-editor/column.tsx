import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import DropZoneWrapper from "./dropzone-wrapper";
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";

type Props = {
  element: EditorElement;
  gridSpan?: number; // Column'un kaç grid birimini kaplayacağı
  totalGridColumns?: number; // Toplam grid sütun sayısı
};

export const ColumnComponent = ({ element, gridSpan = 1, totalGridColumns = 12 }: Props) => {
  const { id, name, type, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);
  const [measureRef, containerHeight] = useElementHeight(false);

  // dnd-kit droppable for receiving drops (normal elements)
  const droppable = useDroppable({
    id: `droppable-${id}`,
    data: {
      type: "container", // Column içine normal elementler konabilir
      containerId: id,
    },
  });

  // dnd-kit sortable for column reordering within grid
  const sortable = useSortable({
    id: id,
    data: {
      type: "column",
      elementId: id,
      name: name,
      element,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  // Column specific styles
  const columnStyles = {
    ...computedStyles,
    gridColumn: `span ${gridSpan}`,
    minHeight: "120px",
  };


  const setNodeRef = (node: HTMLDivElement | null) => {
    /*     droppable.setNodeRef(node); */
    sortable.setNodeRef(node);
    measureRef(node);
  };

  if (sortable.isDragging) {
    return (
      <DragPlaceholder
        style={columnStyles}
        height={containerHeight}
      />
    );
  }

  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={columnStyles}
        className={clsx("relative p-6 transition-all group", {
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "!border-green-500 !border-2 !bg-green-50/50": droppable.isOver && !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleSelectElement}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
      >
     
        {/* Column Content */}
        {Array.isArray(content) &&
          content.map((childElement, index) => (
            <Recursive element={childElement} />
          ))}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  );
};