import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  element: EditorElement;
};

const NeonGradientButtonComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "neonGradientButton",
      elementId: id,
      name: "Neon Gradient Button",
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
    console.log("NeonGradientButton clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting neon gradient button:", id);
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

  // Extract button specific props from content with defaults
  const buttonProps = !Array.isArray(computedContent) ? computedContent : {};
  const buttonText = buttonProps.innerText || "Neon Button";
  const firstColor = buttonProps.firstColor || "#ff00aa";
  const secondColor = buttonProps.secondColor || "#00FFF1";
  const borderSize = buttonProps.borderSize || 2;
  const borderRadius = buttonProps.borderRadius || 20;

  return (
    <div
      ref={draggable.setNodeRef}
      style={computedStyles}
      className={clsx("p-[2px] relative transition-all", {
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
      <NeonGradientCard
        borderSize={borderSize}
        borderRadius={borderRadius}
        neonColors={{ firstColor, secondColor }}
        className={clsx("w-full h-12 flex items-center justify-center cursor-pointer text-white font-medium", {
          "pointer-events-none": !state.editor.liveMode,
        })}
      >
        {buttonText}
      </NeonGradientCard>

      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default NeonGradientButtonComponent;