import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { NeonGradientCardCover } from "@/components/ui/neon-gradient-card-cover";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  element: EditorElement;
};

const NeonGradientCardCoverComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "neonGradientCardCover",
      elementId: id,
      name: "Neon Card Cover",
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
    console.log("NeonGradientCardCover clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting neon gradient card cover:", id);
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

  // Extract card specific props from content with defaults
  const cardProps = !Array.isArray(computedContent) ? computedContent : {};
  const title = cardProps.title || "Card Title";
  const description = cardProps.description || "Card Description";
  const logo = cardProps.logo || null;
  const firstColor = cardProps.firstColor || "#ff00aa";
  const secondColor = cardProps.secondColor || "#00FFF1";
  const borderSize = cardProps.borderSize || 2;
  const borderRadius = cardProps.borderRadius || 20;

  if(draggable.isDragging) return null;

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
      <NeonGradientCardCover
        title={title}
        description={description}
        logo={logo}
        borderSize={borderSize}
        borderRadius={borderRadius}
        neonColors={{ firstColor, secondColor }}
        className={clsx("w-full", {
          "pointer-events-none": !state.editor.liveMode,
        })}
      />

      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default NeonGradientCardCoverComponent; 