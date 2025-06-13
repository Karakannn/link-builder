"use client";

import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useState } from "react";
import { EditorBtns } from "@/lib/constants";
import SidebarEditorButtonOverlay from "./sidebar-editor-buttons-overlay";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { cn } from "@/lib/utils";

interface DesignerElementOverlayProps {
  element: EditorElement;
  className?: string;
}

const DesignerElementOverlay = ({ element, className }: DesignerElementOverlayProps) => {
  return (
    <div 
      className={cn(
        "flex opacity-90 pointer-events-none shadow-lg relative rounded",
        className
      )}
      style={{
        maxWidth: '300px',
        maxHeight: '200px',
        border: '2px solid #3b82f6',
      }}
    >
      <div className="w-full h-full overflow-hidden relative">
        <Recursive element={element} />
      </div>
      
      {/* Scaled indicator */}
      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 rounded">
        Preview
      </div>
    </div>
  );
};

export const DragOverlayWrapper = () => {
  
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { state } = useEditor();
  
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

  // Helper function to find element by ID in editor elements
  const findElementById = (elements: EditorElement[], id: string): EditorElement | null => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (Array.isArray(element.content)) {
        const found = findElementById(element.content, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Determine what to render based on the dragged item
  const renderDragOverlay = () => {
    if (!draggedItem) return null;

    const isDesignerElement = draggedItem.data?.current?.isEditorElement;
    const elementId = draggedItem.data?.current?.elementId;

    // Check if it's a designer element (from editor) being moved
    if (isDesignerElement && elementId) {
      const element = findElementById(state.editor.elements, elementId);
      if (element) {
        return <DesignerElementOverlay element={element} />;
      }
    }

    // Check if it's a sidebar element (from dnd-kit with data.type)
    if (draggedItem.data?.current?.type && draggedItem.data?.current?.isSidebarElement) {
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

  return (
    <DragOverlay 
      dropAnimation={null}
      adjustScale={false}
      modifiers={[snapCenterToCursor]}
    >
      {renderDragOverlay()}
    </DragOverlay>
  );
};