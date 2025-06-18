"use client";

import { EditorElement } from "@/providers/editor/editor-provider";
import { useEditor } from "@/providers/editor/editor-provider";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ClosableContainerProps {
  element: EditorElement;
}

export const ClosableContainer = ({ element }: ClosableContainerProps) => {
  const { dispatch, state } = useEditor();
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Find the editor body container
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
        // Remove width constraints in preview mode for full responsiveness
        maxWidth: isPreviewMode ? "none" : (isAbsolute ? "calc(100vw - 400px)" : element.styles.maxWidth),
        maxHeight: isPreviewMode ? "none" : (isAbsolute ? "calc(100vh - 200px)" : element.styles.maxHeight),
        // Ensure absolute positioning works correctly
        position: isAbsolute ? "absolute" : element.styles.position,
        top: element.styles.top,
        left: element.styles.left,
        right: element.styles.right,
        bottom: element.styles.bottom,
        zIndex: element.styles.zIndex || (isAbsolute ? 1000 : "auto"),
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

  // For absolute positioning, use portal to render at body container level
  if (isAbsolute && mounted && portalContainer) {
    const portalContent = (
      <div
        className={cn(
          "group",
          isSelected && !isPreviewMode && "ring-2 ring-blue-500 ring-offset-2"
        )}
        onClick={handleClick}
        style={{
          position: "static", // Don't interfere with absolute positioning
        }}
      >
        {/* Close button - positioned relative to the container */}
        {isSelected && !isPreviewMode && (
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-[9999] bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
            title="Close container"
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
            }}
          >
            <X size={14} />
          </button>
        )}
        
        {/* Container content */}
        {containerContent}
      </div>
    );

    return createPortal(portalContent, portalContainer);
  }

  // Normal rendering for all other positioning
  return (
    <div
      className={cn(
        "group relative",
        isSelected && !isPreviewMode && "ring-2 ring-blue-500 ring-offset-2"
      )}
      onClick={handleClick}
    >
      {/* Close button */}
      {isSelected && !isPreviewMode && (
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
          title="Close container"
        >
          <X size={14} />
        </button>
      )}
      
      {/* Spacing Visualizer - only in edit mode */}
      {!isPreviewMode && <SpacingVisualizer styles={element.styles} />}
      
      {/* Container content */}
      {containerContent}
    </div>
  );
}; 