import { DeviceTypes, EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Recursive from "./recursive";
import { getElementStyles, getElementContent } from "@/lib/utils";
import { useDroppable, useDraggable } from "@dnd-kit/core";

type Props = { element: EditorElement };

const GridLayoutComponent = ({ element }: Props) => {
  const { id, name, type, styles, content } = element;
  const { dispatch, state } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // dnd-kit droppable for receiving drops
  const droppable = useDroppable({ 
    id: `droppable-${id}`,
    data: {
      type: 'container',
      containerId: id
    }
  });

  // dnd-kit draggable for moving this grid
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

  // Get computed styles and content based on current device
  const computedStyles = getElementStyles(element, state.editor.device);
  const computedContent = getElementContent(element, state.editor.device);

  // Get grid settings from content
  const gridContent = !Array.isArray(computedContent) ? computedContent : {};
  const columns = gridContent.columns || 3;
  const gap = gridContent.gap || "1rem";
  const minColumnWidth = gridContent.minColumnWidth || "200px";

  // Monitor dnd-kit drag state for visual feedback
  useEffect(() => {
    if (droppable.isOver) {
      setIsDraggingOver(true);
    } else {
      setIsDraggingOver(false);
    }
  }, [droppable.isOver]);

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

  // Combine droppable and draggable refs
  const setNodeRef = (node: HTMLDivElement | null) => {
    droppable.setNodeRef(node);
    draggable.setNodeRef(node);
    containerRef.current = node;
  };

  // Create grid template columns based on settings
  const template = gridContent.template;
  const autoFit = gridContent.autoFit;
  
  let gridTemplateColumns;
  if (template && template.trim()) {
    // Custom template provided
    gridTemplateColumns = template;
  } else if (autoFit) {
    // Auto-fit columns
    gridTemplateColumns = `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`;
  } else {
    // Standard equal columns
    gridTemplateColumns = `repeat(${columns}, minmax(${minColumnWidth}, 1fr))`;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...computedStyles,
        display: 'grid',
        gridTemplateColumns,
        gap,
        '--grid-columns': columns,
        '--grid-gap': gap,
        '--min-column-width': minColumnWidth,
      } as React.CSSProperties}
      className={clsx("relative p-4 transition-all group min-h-[100px]", {
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
        {element.name} ({columns} columns)
      </Badge>

      {isDraggingOver && !state.editor.liveMode && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium">Drop Here</span>
        </div>
      )}

      {/* Grid items */}
      {Array.isArray(content) && content.map((childElement, index) => (
        <div key={childElement.id} className="grid-item">
          <Recursive element={childElement} />
        </div>
      ))}

      {/* Show grid structure in edit mode */}
      {!state.editor.liveMode && Array.isArray(content) && content.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-8 text-gray-400 text-sm">
          {columns}-Column Grid Layout
          <br />
          Drag components here
        </div>
      )}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white">
          <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export default GridLayoutComponent;