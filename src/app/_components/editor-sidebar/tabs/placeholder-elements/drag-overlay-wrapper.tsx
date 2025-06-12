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
  // Element boyutlarını tahmin et (type'a göre)
  const estimateElementSize = (element: EditorElement) => {
    const type = element.type;
    let estimatedWidth = 200;
    let estimatedHeight = 80;

    switch (type) {
      case "container":
      case "2Col":
      case "gridLayout":
        estimatedWidth = 400;
        estimatedHeight = 200;
        break;
      case "video":
        estimatedWidth = 560;
        estimatedHeight = 315;
        break;
      case "text":
      case "link":
        estimatedWidth = 150;
        estimatedHeight = 40;
        break;
      default:
        estimatedWidth = 200;
        estimatedHeight = 80;
    }

    // Styles'dan gerçek boyutları kontrol et
    if (element.styles.width) {
      const width = parseInt(element.styles.width.toString().replace('px', ''));
      if (!isNaN(width)) estimatedWidth = width;
    }
    if (element.styles.height) {
      const height = parseInt(element.styles.height.toString().replace('px', ''));
      if (!isNaN(height)) estimatedHeight = height;
    }

    return { width: estimatedWidth, height: estimatedHeight };
  };

  const { width: estWidth, height: estHeight } = estimateElementSize(element);
  
  // Büyük elementler için küçültme kararı
  const shouldScale = estWidth > 250 || estHeight > 120;
  const maxOverlayWidth = 200;
  const maxOverlayHeight = 100;
  
  let overlayWidth = shouldScale ? maxOverlayWidth : Math.min(estWidth, maxOverlayWidth);
  let overlayHeight = shouldScale ? maxOverlayHeight : Math.min(estHeight, maxOverlayHeight);
  
  // Scale faktörü hesapla
  const scaleX = overlayWidth / estWidth;
  const scaleY = overlayHeight / estHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  return (
    <div 
      className={cn(
        "flex opacity-90 pointer-events-none shadow-lg relative",
        className
      )}
      style={{
        width: `${overlayWidth}px`,
        height: `${overlayHeight}px`,
      }}
    >
      <div className="w-full h-full overflow-hidden relative rounded">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${100 / scale}%`,
            height: `${100 / scale}%`,
          }}
        >
          <Recursive element={element} />
        </div>
      </div>
      
      {/* Boyut bilgisi badge'i */}
      {shouldScale && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 rounded">
          {Math.round(scale * 100)}%
        </div>
      )}
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