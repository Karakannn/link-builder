import { DeviceTypes, EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import DropZoneWrapper from "./dropzone-wrapper";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

type Props = { 
  element: EditorElement; 
  gridSpan?: number; // Column'un kaç grid birimini kaplayacağı
  totalGridColumns?: number; // Toplam grid sütun sayısı
};

export const ColumnComponent = ({ element, gridSpan = 1, totalGridColumns = 12 }: Props) => {
  const { id, name, type, styles, content } = element;
  const { dispatch, state } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // dnd-kit droppable for receiving drops (normal elements)
  const droppable = useDroppable({
    id: `droppable-${id}`,
    data: {
      type: "container", // Column içine normal elementler konabilir
      containerId: id,
    },
  });

  // dnd-kit draggable for column reordering within grid
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "column",
      elementId: id,
      name: name,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Column specific styles
  const columnStyles = {
    ...computedStyles,
    gridColumn: `span ${gridSpan}`,
    minHeight: "120px",
  };

  console.log(`🎨 Column ${element.name} (${id}) CSS:`, {
    gridSpan,
    totalGridColumns,
    gridColumnValue: `span ${gridSpan}`,
    finalStyles: columnStyles
  });

  useEffect(() => {
    if (droppable.isOver) {
      setIsDraggingOver(true);
    } else {
      setIsDraggingOver(false);
    }
  }, [droppable.isOver]);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.editor.liveMode && !draggable.isDragging) {
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

  const setNodeRef = (node: HTMLDivElement | null) => {
    droppable.setNodeRef(node);
    draggable.setNodeRef(node);
    containerRef.current = node;
  };

  if (draggable.isDragging) return null;

  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={columnStyles}
        className={clsx("relative p-6 transition-all group", {
          "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
          "!border-green-500 !border-2 !bg-green-50/50": isDraggingOver && !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": draggable.isDragging,
          "opacity-50": draggable.isDragging,
        })}
        onClick={handleOnClickBody}
        {...(!state.editor.liveMode ? draggable.listeners : {})}
        {...(!state.editor.liveMode ? draggable.attributes : {})}
      >
        <Badge
          className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {
            block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
          })}
        >
          {element.name}
        </Badge>

        {isDraggingOver && !state.editor.liveMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
              Buraya Bırak
            </span>
          </div>
        )}

        {/* Column Content */}
        {Array.isArray(content) &&
          content.map((childElement, index) => (
            <DropZoneWrapper key={childElement.id} elementId={childElement.id} containerId={id} index={index}>
              <Recursive element={childElement} />
            </DropZoneWrapper>
          ))}

        {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white z-10">
            <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
          </div>
        )}
      </div>
    </ElementContextMenu>
  );
};