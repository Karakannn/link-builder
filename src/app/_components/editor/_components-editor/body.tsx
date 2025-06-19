"use client";

import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { cn } from "@/lib/utils";
import Recursive from "./recursive";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BACKGROUND_ANIMATIONS, BackgroundAnimation } from "@/constants/background-animations";
import { useState, useEffect } from "react";

interface BodyContainerProps {
  element: EditorElement;
}

export const BodyContainer = ({ element }: BodyContainerProps) => {
  const { dispatch, state } = useEditor();
  const { id, name, type, content, styles } = element;

  const droppable = useDroppable({
    id: `droppable-${id}`,
    data: {
      type: "__body",
      containerId: id,
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  const isSelected = state.editor.selectedElement.id === id;
  const isPreviewMode = state.editor.previewMode || state.editor.liveMode;

  const childItems = Array.isArray(content) ? content.map(child => child.id) : [];

  // Get background animation from element itself (since content is array)
  const backgroundAnimation = element.backgroundAnimation || "none";

  // Get background animation class
  const backgroundAnimationConfig = BACKGROUND_ANIMATIONS.find(bg => bg.id === backgroundAnimation);
  const backgroundClass = backgroundAnimationConfig?.className || "";

  console.log("Body background debug:", {
    elementContent: element.content,
    isArray: Array.isArray(element.content),
    elementBackground: element.backgroundAnimation,
    backgroundAnimation,
    backgroundClass,
    backgroundAnimationConfig
  });

  const finalClassName = cn(
    "w-full h-full min-h-[50px] transition-all duration-200 ease-in-out relative cursor-pointer hover:ring-1 hover:ring-gray-300",
    backgroundClass,
    isSelected && !isPreviewMode && "border-2 border-blue-500",
    droppable.isOver && !isPreviewMode && "!border-green-500 !border-2 !bg-green-50/50"
  );

  return (
    <div
      ref={droppable.setNodeRef}
      className={finalClassName}
      onClick={handleClick}
      data-body-container="true"
      style={{
        ...styles,
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "50px",
        pointerEvents: "auto",
        zIndex: 1,
        ...(isSelected && !isPreviewMode && {
          border: "2px solid #3b82f6",
          boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)"
        })
      }}
    >
      {/* Background Animation Select - only in edit mode */}
      {!isPreviewMode && isSelected && (
        <div className="absolute top-4 right-4 z-20 bg-white rounded-lg shadow-lg p-2 border">
          <div className="text-xs font-medium text-gray-600 mb-1">Background</div>
          <Select value={backgroundAnimation} onValueChange={(value) => {
            dispatch({
              type: "UPDATE_ELEMENT",
              payload: {
                elementDetails: {
                  ...element,
                  backgroundAnimation: value as BackgroundAnimation,
                },
              },
            });
          }}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              {BACKGROUND_ANIMATIONS.map((animation) => (
                <SelectItem key={animation.id} value={animation.id}>
                  {animation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      {!isPreviewMode && <SpacingVisualizer styles={styles} />}
      
      {/* Content */}
      {Array.isArray(content) && content.length > 0 && (
        <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
          {content.map((childElement) => (
            <Recursive key={childElement.id} element={childElement} />
          ))}
        </SortableContext>
      )}

      {Array.isArray(content) && content.length === 0 && (
        <div className="min-h-[50px] text-gray-400 text-center py-4">
          Drop elements here
        </div>
      )}
    </div>
  );
};