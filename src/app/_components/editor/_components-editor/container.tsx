import { DeviceTypes, EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Recursive from "./recursive";
import { EditorBtns } from "@/lib/constants";
import { getElementStyles } from "@/lib/utils";
import { useDroppable, useDraggable } from "@dnd-kit/core";

type Props = { element: EditorElement };

const Container = ({ element }: Props) => {
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

  // dnd-kit draggable for moving this container (if it's not __body)
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: type,
      elementId: id,
      name: name,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: type === "__body", // Body can't be moved
  });

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Debug log when this component renders
  useEffect(() => {
    console.log(`Container rendered: id=${id}, type=${type}, name=${name}`);
  }, [id, type, name]);

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
    console.log("Container clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    // Sadece edit mode'da ve drag değilken çalışsın
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting container:", id);
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

  return (
    <div
      ref={setNodeRef}
      style={computedStyles}
      className={clsx("relative p-6 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": type === "__body",
        "overflow-y-auto ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
        "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        "!border-green-500 !border-2 !bg-green-50/50": isDraggingOver && !state.editor.liveMode,
        "cursor-grab": type !== "__body" && !state.editor.liveMode,
        "cursor-grabbing": draggable.isDragging,
        "opacity-50": draggable.isDragging,
      })}
      onClick={handleOnClickBody}
      // Sadece __body değilse drag listeners ekle
      {...(type !== "__body" && !state.editor.liveMode ? draggable.listeners : {})}
      {...(type !== "__body" && !state.editor.liveMode ? draggable.attributes : {})}
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
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">Drop Here</span>
        </div>
      )}

      {Array.isArray(content) && content.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body" && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
          <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};

export default Container;