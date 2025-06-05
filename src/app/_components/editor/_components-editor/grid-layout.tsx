import { DeviceTypes, EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Recursive from "./recursive";
import { getElementStyles, getElementContent } from "@/lib/utils";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { v4 } from "uuid";
import { defaultStyles } from "@/lib/constants";

type Props = { element: EditorElement };

const GridLayoutComponent = ({ element }: Props) => {
  const { id, name, type, styles, content } = element;
  const { dispatch, state } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // dnd-kit draggable for moving this grid (NO DROPPABLE - sadece containerlar drop alabilir)
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: type,
      elementId: id,
      name: name,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Grid containers - element.content array'i olmalı (2Column gibi)
  const gridContainers = Array.isArray(content) ? content : [];

  // Grid ayarlarını styles'tan al
  const gridTemplateColumns = computedStyles.gridTemplateColumns || "repeat(3, minmax(0, 1fr))";
  const gap = computedStyles.gap || "1rem";

  // Columns sayısını hesapla
  const getColumnsFromTemplate = (template: string): number => {
    if (template.includes('repeat(')) {
      const match = template.match(/repeat\((\d+),/);
      return match ? parseInt(match[1]) : gridContainers.length;
    }
    // Custom template için container sayısını kullan
    return gridContainers.length;
  };

  const currentColumns = getColumnsFromTemplate(gridTemplateColumns as string);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Grid clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting grid:", id);
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  // Sadece draggable ref - droppable yok
  const setNodeRef = (node: HTMLDivElement | null) => {
    draggable.setNodeRef(node);
    containerRef.current = node;
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...computedStyles,
        display: 'grid',
        gridTemplateColumns,
        gap,
      } as React.CSSProperties}
      className={clsx("relative p-4 transition-all group min-h-[200px]", {
        "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
        "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        "cursor-grab": !state.editor.liveMode,
        "cursor-grabbing": draggable.isDragging,
        "opacity-50": draggable.isDragging,
      })}
      onClick={handleOnClickBody}
      {...(!state.editor.liveMode ? draggable.listeners : {})}
      {...(!state.editor.liveMode ? draggable.attributes : {})}
    >
      <Badge
        className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden z-10", {
          block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        })}
      >
        {element.name} ({currentColumns} columns)
      </Badge>

      {/* Grid containers - 2Column gibi yapı, DropZoneWrapper YOK */}
      {gridContainers.map((containerElement) => (
        <div key={containerElement.id} className="grid-item h-full">
          <Recursive element={containerElement} />
        </div>
      ))}

      {/* Eğer hiç container yoksa placeholder göster */}
      {!state.editor.liveMode && gridContainers.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-8 text-gray-400 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">🏗️</div>
            <div>Grid Layout</div>
            <div className="text-xs mt-1">Configure columns in settings</div>
          </div>
        </div>
      )}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white z-10">
          <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export default GridLayoutComponent;