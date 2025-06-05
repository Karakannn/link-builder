import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  element: EditorElement;
};

const AnimatedGridPatternComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "animatedGridPattern",
      elementId: id,
      name: "Animated Grid Pattern",
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("AnimatedGridPattern clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting animated grid pattern:", id);
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

  // Extract pattern specific props from content with defaults
  const patternProps = !Array.isArray(computedContent) ? computedContent : {};
  const width = patternProps.width || 40;
  const height = patternProps.height || 40;
  const numSquares = patternProps.numSquares || 50;
  const maxOpacity = patternProps.maxOpacity || 0.5;
  const duration = patternProps.duration || 4;
  const repeatDelay = patternProps.repeatDelay || 0.5;

  return (
    <div
      ref={draggable.setNodeRef}
      style={computedStyles}
      className={clsx("relative transition-all", {
        "!border-blue-500": state.editor.selectedElement.id === id,
        "!border-solid": state.editor.selectedElement.id === id,
        "!border-dashed border border-slate-300": !state.editor.liveMode,
        "cursor-grab": !state.editor.liveMode,
        "cursor-grabbing": draggable.isDragging,
        "opacity-50": draggable.isDragging,
      })}
      onClick={handleOnClickBody}
      {...(!state.editor.liveMode ? draggable.listeners : {})}
      {...(!state.editor.liveMode ? draggable.attributes : {})}
    >
      <AnimatedGridPattern
        width={width}
        height={height}
        numSquares={numSquares}
        maxOpacity={maxOpacity}
        duration={duration}
        repeatDelay={repeatDelay}
        className="inset-0 h-full w-full"
      />
      
      {!state.editor.liveMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
          Animated Grid Pattern
        </div>
      )}

      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default AnimatedGridPatternComponent;