import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import DropZoneWrapper from "./dropzone-wrapper";

type Props = { element: EditorElement };

export const Container = ({ element }: Props) => {
  const { id, name, type, styles, content } = element;
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
    disabled: type === "__body" || state.editor.liveMode,
  });

  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  const setNodeRef = (node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
    measureRef(node);
  };

  const childItems = Array.isArray(content) ? content.map(child => child.id) : [];

  if (sortable.isDragging) {
    /*   return (
        <DragPlaceholder
          style={computedStyles}
          height={containerHeight}
        />
      ); */

    return
  }
  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={computedStyles}
        className={clsx("relative transition-all group", {
          "max-w-full w-full": type === "container" || type === "2Col",
          "h-fit": type === "container",
          "h-full": type === "__body",
          "overflow-y-auto ": type === "__body",
          "flex flex-col md:!flex-row": type === "2Col",
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
          "!border-yellow-400 !border-4": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "!border-green-500 !border-2 !bg-green-50/50": sortable.isOver && !state.editor.liveMode,
          "cursor-grab": type !== "__body" && !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleSelectElement}
        {...(type !== "__body" && !state.editor.liveMode ? sortable.listeners : {})}
        {...(type !== "__body" && !state.editor.liveMode ? sortable.attributes : {})}
      >
        {sortable.isOver && !state.editor.liveMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">Drop Here</span>
          </div>
        )}

        {Array.isArray(content) && content.length > 0 && (
          <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
            {content.map((childElement, index) => (
              <DropZoneWrapper
                key={childElement.id}
                elementId={childElement.id}
                index={index}
              >
                <Recursive element={childElement} />
              </DropZoneWrapper>
            ))}
          </SortableContext>
        )}

        {Array.isArray(content) && content.length === 0 && (
          <div className="min-h-[50px] text-gray-400 text-center py-4">
            Empty Container
          </div>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  );
};