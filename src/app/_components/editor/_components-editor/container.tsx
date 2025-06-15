import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import DropZoneWrapper, { Layout, Position } from "./dropzone-wrapper";

type Props = {
  element: EditorElement;
  layout?: Layout;
  insertPosition?: Position;
  active?: boolean;
};

export const Container = ({ element, layout = Layout.Vertical, insertPosition, active }: Props) => {
  const { id, name, type, styles, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);
  const [measureRef, containerHeight] = useElementHeight(false);
  const { over } = useDndContext();

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

  // Insert zone'a drop edilip edilmediğini kontrol et
  const isOverInsertZone = over?.data?.current?.type === 'insert';
  const isActive = active || sortable.isDragging;

  // Layout specific styles
  const getLayoutStyles = () => {
    switch (layout) {
      case Layout.Horizontal:
        return {
          display: 'flex',
          flexDirection: 'row' as const,
          gap: '1rem',
          flexWrap: 'wrap' as const,
        };
      case Layout.Grid:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        };
      case Layout.Vertical:
      default:
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '0.5rem',
        };
    }
  };

  if (isActive) {
    return (
      <DragPlaceholder
        style={computedStyles}
        height={containerHeight}
      />
    );
  }

  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={{
          ...computedStyles,
          ...getLayoutStyles(),
        }}
        className={clsx("relative transition-all group", {
          "max-w-full w-full": type === "container" || type === "2Col",
          "h-fit": type === "container",
          "h-full": type === "__body",
          "overflow-y-auto": type === "__body",
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
          "!border-yellow-400 !border-4": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "!border-green-500 !border-2 !bg-green-50/50": (sortable.isOver || sortable.isOver) && !state.editor.liveMode,
          "cursor-grab": type !== "__body" && !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
          "before:content-[''] before:absolute before:bg-blue-500": insertPosition && !isOverInsertZone,
          "before:left-0 before:right-0 before:h-[2px] before:-top-[15px]": insertPosition === Position.Before && layout === Layout.Vertical,
          "before:top-0 before:bottom-0 before:w-[2px] before:-left-[9px]": insertPosition === Position.Before && layout === Layout.Horizontal,
          "before:left-0 before:right-0 before:h-[2px] before:-bottom-[15px]": insertPosition === Position.After && layout === Layout.Vertical,
          "before:top-0 before:bottom-0 before:w-[2px] before:-right-[9px]": insertPosition === Position.After && layout === Layout.Horizontal,
        })}
        onClick={handleSelectElement}
        {...(type !== "__body" && !state.editor.liveMode ? sortable.listeners : {})}
        {...(type !== "__body" && !state.editor.liveMode ? sortable.attributes : {})}
      >
        {(sortable.isOver || sortable.isOver) && !state.editor.liveMode && !isOverInsertZone && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">Drop Here</span>
          </div>
        )}

        {Array.isArray(content) && content.length > 0 && (
          <>
            {content.map((childElement, index) => (
              <DropZoneWrapper
                key={childElement.id}
                elementId={childElement.id}
                containerId={id}
                index={index}
                layout={layout}
              >
                <Recursive element={childElement} layout={layout} />
              </DropZoneWrapper>
            ))}
          </>
        )}

        {Array.isArray(content) && content.length === 0 && (
          <div className="min-h-[50px] text-gray-400 text-center py-4">
            {type === "__body" ? "Page Body - Drop elements here" : "Empty Container"}
          </div>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  );
};