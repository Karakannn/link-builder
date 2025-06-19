"use client";

import { EditorElement } from "@/providers/editor/editor-provider";
import { useEditor } from "@/providers/editor/editor-provider";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ClosableContainerProps {
  element: EditorElement;
}

export const ClosableContainer = ({ element }: ClosableContainerProps) => {
  const { dispatch, state } = useEditor();
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Add droppable functionality
  const droppable = useDroppable({
    id: `droppable-${element.id}`,
    data: {
      type: "closableContainer",
      containerId: element.id,
    },
  });

  useEffect(() => {
    setMounted(true);
    
    // Find the editor body container for absolute positioning
    const bodyContainer = document.querySelector('[data-body-container="true"]');
    
    if (bodyContainer) {
      setPortalContainer(bodyContainer as HTMLElement);
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const isSelected = state.editor.selectedElement.id === element.id;
  const isAbsolute = element.styles.position === "absolute";
  const isPreviewMode = state.editor.previewMode || state.editor.liveMode;

  // Container content with responsive width
  const containerContent = (
    <div
      style={{
        ...element.styles,
        maxWidth: isPreviewMode ? "none" : (isAbsolute ? "calc(100vw - 400px)" : element.styles.maxWidth),
        maxHeight: isPreviewMode ? "none" : (isAbsolute ? "calc(100vh - 200px)" : element.styles.maxHeight),
        position: isAbsolute ? "absolute" : element.styles.position,
        top: element.styles.top,
        left: element.styles.left,
        right: element.styles.right,
        bottom: element.styles.bottom,
        zIndex: element.styles.zIndex || (isAbsolute ? 10 : "auto"),
      }}
      className={cn(
        "min-h-[50px] min-w-[100px]",
        isSelected && !isPreviewMode && "outline-dashed outline-2 outline-blue-500"
      )}
    >
      {Array.isArray(element.content) &&
        element.content.map((childElement) => (
          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );

  // For absolute positioning, use portal to render at editor body container level
  if (isAbsolute && mounted && portalContainer) {
    const childItems = Array.isArray(element.content) ? element.content.map(child => child.id) : [];

    const portalContent = (
      <div
        ref={droppable.setNodeRef}
        className={cn(
          "group relative",
          isSelected && !isPreviewMode && "ring-2 ring-blue-500 ring-offset-2",
          droppable.isOver && !isPreviewMode && "!border-green-500 !border-2 !bg-green-50/50"
        )}
        onClick={handleClick}
        style={{
          position: "absolute",
          top: element.styles.top,
          left: element.styles.left,
          right: element.styles.right,
          bottom: element.styles.bottom,
          width: element.styles.width,
          zIndex: element.styles.zIndex || 10,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        {/* Close button */}
        {isSelected && !isPreviewMode && (
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
            title="Close container"
          >
            <X size={14} />
          </button>
        )}

        {/* Drop indicator */}
        {droppable.isOver && !isPreviewMode && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" 
            style={{ 
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "2px dashed #22c55e"
            }}
          >
            <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg">
              Drop Here
            </span>
          </div>
        )}
        
        {/* Container content */}
        <div
          style={{
            ...element.styles,
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            zIndex: "auto",
            width: "100%",
            maxWidth: "100%",
          }}
          className={cn(
            "min-h-[50px] min-w-[100px]",
            isSelected && !isPreviewMode && "outline-dashed outline-2 outline-blue-500"
          )}
        >
          {Array.isArray(element.content) && element.content.length > 0 && (
            <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
              {element.content.map((childElement) => (
                <Recursive key={childElement.id} element={childElement} />
              ))}
            </SortableContext>
          )}

          {Array.isArray(element.content) && element.content.length === 0 && (
            <div className="min-h-[50px] text-gray-400 text-center py-4">
              Drop elements here
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(portalContent, portalContainer);
  }

  // Normal rendering for all other positioning
  return (
    <div
      ref={droppable.setNodeRef}
      className={cn(
        "group relative",
        isSelected && !isPreviewMode && "ring-2 ring-blue-500 ring-offset-2",
        droppable.isOver && !isPreviewMode && "!border-green-500 !border-2 !bg-green-50/50"
      )}
      onClick={handleClick}
    >
      {/* Close button */}
      {isSelected && !isPreviewMode && (
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
          title="Close container"
        >
          <X size={14} />
        </button>
      )}

      {/* Drop indicator */}
      {droppable.isOver && !isPreviewMode && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" 
          style={{ 
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            border: "2px dashed #22c55e"
          }}
        >
          <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg">
            Drop Here
          </span>
        </div>
      )}
      
      {/* Spacing Visualizer - only in edit mode */}
      {!isPreviewMode && <SpacingVisualizer styles={element.styles} />}
      
      {/* Container content */}
      {containerContent}
    </div>
  );
}; 