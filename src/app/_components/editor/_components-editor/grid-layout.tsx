import { DeviceTypes, EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { ColumnComponent } from "./column";
import ColumnDropZoneWrapper from "./column-dropzone-wrapper";
import { getElementStyles, getElementContent } from "@/lib/utils";
import { useDroppable, useDraggable } from "@dnd-kit/core";

type Props = { element: EditorElement };

export const GridLayoutComponent = ({ element }: Props) => {
  const { id, name, type, styles, content } = element;
  const { dispatch, state } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);
  
  // Grid columns - content array'indeki column'lar
  const gridColumns = Array.isArray(content) ? content : [];

  // Grid ayarlarını styles'tan al (burada sorun vardı!)
  const totalGridColumns = (computedStyles as any).gridColumns || 12;
  const columnSpans = (computedStyles as any).columnSpans || [];
  const gap = (computedStyles as any).gridGap || computedStyles.gap || "1rem";
  
  // Default span hesaplama
  const defaultSpan = Math.floor(totalGridColumns / Math.max(gridColumns.length, 1));

  console.log("🏗️ GridLayoutComponent render:", {
    elementId: id,
    deviceType: state.editor.device,
    gridColumnsCount: gridColumns.length,
    totalGridColumns,
    columnSpans,
    defaultSpan,
    gap,
    computedStyles: { gridColumns: (computedStyles as any).gridColumns, columnSpans: (computedStyles as any).columnSpans }
  });

  // Generate grid template columns based on device
  const generateGridTemplate = () => {
    const device = state.editor.device;
    
    if (device === "Mobile") {
      // Mobile'da tüm column'lar full width (alt alta)
      return "1fr";
    } else if (device === "Tablet") {
      // Tablet'te 2'li gruplar halinde
      return "repeat(2, 1fr)";
    } else {
      // Desktop'ta normal grid sistemi
      return `repeat(${totalGridColumns}, 1fr)`;
    }
  };

  const gridTemplateColumns = generateGridTemplate();
  
  // Final grid styles
  const finalGridStyles = {
    ...computedStyles,
    display: 'grid',
    gridTemplateColumns: gridTemplateColumns,
    gap: gap,
  };

  console.log("🏗️ Grid Layout CSS:", {
    device: state.editor.device,
    totalGridColumns,
    gridTemplateColumns,
    gap,
    finalGridStyles
  });

  // Event handlers
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
    draggable.setNodeRef(node);
    containerRef.current = node;
  };

  return (
    <div
      ref={setNodeRef}
      style={finalGridStyles}
      className={clsx("relative p-6 transition-all group min-h-[200px]", {
        "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode,
        "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        "cursor-grab": !state.editor.liveMode,
        "cursor-grabbing": draggable.isDragging,
        "opacity-50": draggable.isDragging,
      })}
      onClick={handleOnClickBody}
      {...(!state.editor.liveMode ? draggable.listeners : {})}
      {...(!state.editor.liveMode ? draggable.attributes : {})}
    >
      {/* Grid Layout Badge */}
      <Badge
        className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden z-10", {
          block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        })}
      >
        {element.name} ({gridColumns.length} sütun)
      </Badge>

      {/* Grid columns with drop zones */}
      {gridColumns.map((columnElement, index) => {
        // Column span hesaplama - device'a göre
        let columnSpan: number;
        
        if (state.editor.device === "Desktop") {
          // Desktop'ta columnSpans array'ini kullan veya default span
          columnSpan = columnSpans[index] || defaultSpan;
        } else if (state.editor.device === "Mobile") {
          // Mobile'da her column full width
          columnSpan = totalGridColumns;
        } else {
          // Tablet'te maksimum 2 column
          columnSpan = Math.floor(totalGridColumns / 2);
        }

        console.log(`🎨 Column ${index + 1} (${columnElement.name}) span calculation:`, {
          device: state.editor.device,
          columnSpan,
          columnSpansArray: columnSpans,
          defaultSpan,
          totalGridColumns
        });

        return (
          <ColumnDropZoneWrapper 
            key={columnElement.id} 
            columnId={columnElement.id}
            gridLayoutId={id}
            index={index}
            gridSpan={columnSpan}
            totalGridColumns={totalGridColumns}
          >
            <ColumnComponent 
              element={columnElement} 
              gridSpan={columnSpan}
              totalGridColumns={totalGridColumns}
            />
          </ColumnDropZoneWrapper>
        );
      })}

      {/* Delete Button */}
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white z-10">
          <Trash size={16} onClick={handleDeleteElement} className="cursor-pointer" />
        </div>
      )}
    </div>
  );
};