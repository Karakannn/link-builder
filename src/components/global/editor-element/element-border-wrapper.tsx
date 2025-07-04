// src/components/global/editor-element/element-border-wrapper.tsx
"use client";

import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useSmartBorders } from "@/hooks/use-smart-borders";
import { useBorderVisibility } from "@/providers/border-visibility-provider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import React, { forwardRef } from "react";

interface ElementBorderWrapperProps {
  element: EditorElement;
  children: React.ReactNode;
  className?: string;
  showLevelIndicator?: boolean;
  showTypeIndicator?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}

export const ElementBorderWrapper = forwardRef<HTMLDivElement, ElementBorderWrapperProps>(
  ({ 
    element, 
    children, 
    className,
    showLevelIndicator = false,
    showTypeIndicator = false,
    onMouseEnter,
    onMouseLeave,
    onClick,
    ...props 
  }, ref) => {
    const { state } = useEditor();
    const { setHoveredElement } = useBorderVisibility();
    const { 
      shouldShowBorder, 
      borderClass, 
      level, 
      isHovered 
    } = useSmartBorders(element);
    
    const isSelected = state.editor.selectedElement.id === element.id;
    const isPreviewMode = state.editor.previewMode || state.editor.liveMode;

    const handleMouseEnter = () => {
      if (!isPreviewMode) {
        setHoveredElement(element.id);
      }
      onMouseEnter?.();
    };

    const handleMouseLeave = () => {
      if (!isPreviewMode) {
        setHoveredElement(null);
      }
      onMouseLeave?.();
    };

    const handleClick = (e: React.MouseEvent) => {
      onClick?.(e);
    };

    // Element type'a göre ikon belirleme
    const getTypeIcon = () => {
      const typeIcons: Record<string, string> = {
        container: "📦",
        text: "📝",
        image: "🖼️",
        video: "🎥",
        link: "🔗",
        button: "🔘",
        "2Col": "📊",
        gridLayout: "⚏",
        column: "📋",
        marquee: "🎬",
        sponsorNeonCard: "💳",
        gif: "🎭",
        closableContainer: "📦✕",
        __body: "📄"
      };
      return typeIcons[element.type] || "🔷";
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative transition-all duration-200 group",
          shouldShowBorder && borderClass,
          {
            "cursor-grab": !isPreviewMode && element.type !== "__body",
            "cursor-pointer": !isPreviewMode,
            "hover:shadow-sm": !isPreviewMode && !shouldShowBorder,
            "z-10": isSelected || isHovered,
            "z-0": !isSelected && !isHovered,
          },
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-element-id={element.id}
        data-element-type={element.type}
        data-border-level={level}
        {...props}
      >
        {children}
        
        {/* Level indicator */}
        {!isPreviewMode && showLevelIndicator && level > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -left-2 text-xs px-1 py-0 h-4 z-20 bg-gray-600 text-white border-0"
          >
            L{level}
          </Badge>
        )}

        {/* Type indicator */}
        {!isPreviewMode && showTypeIndicator && (isSelected || isHovered) && (
          <Badge 
            variant="outline" 
            className="absolute -top-2 -right-2 text-xs px-1 py-0 h-4 z-20 bg-white border border-gray-300"
          >
            {getTypeIcon()} {element.type}
          </Badge>
        )}

        {/* Selection indicator */}
        {!isPreviewMode && isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white z-20" />
        )}

        {/* Hover indicator */}
        {!isPreviewMode && isHovered && !isSelected && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full border border-white z-20" />
        )}

        {/* Grid lines for containers */}
        {!isPreviewMode && (isSelected || isHovered) && 
         ['container', '2Col', 'gridLayout', 'closableContainer'].includes(element.type) && (
          <div className="absolute inset-0 pointer-events-none z-5">
            <div className="w-full h-full border-2 border-dashed border-blue-200 opacity-30" />
          </div>
        )}
      </div>
    );
  }
);

ElementBorderWrapper.displayName = "ElementBorderWrapper";