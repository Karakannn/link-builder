"use client";

import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { EditorBtns } from "@/lib/constants";
import SidebarEditorButtonOverlay from "./sidebar-editor-buttons-overlay";

export const DragOverlayWrapper = () => {
  
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
      console.log("drag item", event);
    },
    onDragCancel: (event) => {
      setDraggedItem(null);
    },
    onDragEnd: (event) => {
      setDraggedItem(null);
      console.log("drag end", event);
    },
  });

  // Determine what to render based on the dragged item
  const renderDragOverlay = () => {
    if (!draggedItem) return null;

    // Check if it's a sidebar element (from dnd-kit with data.type)
    if (draggedItem.data?.current?.type && draggedItem.data?.current?.isSidebarElement) {
      const elementType = draggedItem.data.current.type as EditorBtns;
      return <SidebarEditorButtonOverlay type={elementType} />;
    }

    // Check if it's an editor element being moved
    if (draggedItem.data?.current?.type && draggedItem.data?.current?.isEditorElement) {
      const elementType = draggedItem.data.current.type as EditorBtns;
      return <SidebarEditorButtonOverlay type={elementType} />;
    }

    // Fallback for unknown drag items
    return (
      <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-gray-500">
        <div className="text-xs text-muted-foreground">Dragging...</div>
      </div>
    );
  };

  return <DragOverlay>{renderDragOverlay()}</DragOverlay>;
};