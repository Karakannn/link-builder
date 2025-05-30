import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React, { CSSProperties, useEffect, useRef } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  element: EditorElement;
};

const ShimmerButtonComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "shimmerButton",
      elementId: id,
      name: "Shimmer Button",
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
    console.log("ShimmerButton clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    // Sadece edit mode'da ve drag değilken çalışsın
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting shimmer button:", id);
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

  // Extract shimmer button specific props from content with defaults
  const shimmerProps = !Array.isArray(computedContent) ? computedContent : {};
  const shimmerColor = (shimmerProps.shimmerColor as string) || "#ffffff";
  const shimmerSize = (shimmerProps.shimmerSize as string) || "0.1em";
  const shimmerDuration = (shimmerProps.shimmerDuration as string) || "2s";
  const borderRadius = (shimmerProps.borderRadius as string) || "10px";
  const background = (shimmerProps.background as string) || "rgba(99, 102, 241, 1)";
  const buttonText = shimmerProps.innerText || "Tıkla";

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
      // Sadece edit mode'da drag listeners ekle
      {...(!state.editor.liveMode ? draggable.listeners : {})}
      {...(!state.editor.liveMode ? draggable.attributes : {})}
    >
      <ShimmerButton
        ref={buttonRef}
        shimmerColor={shimmerColor}
        shimmerSize={shimmerSize}
        shimmerDuration={shimmerDuration}
        borderRadius={borderRadius}
        background={background}
        className={clsx("w-full", {
          "pointer-events-none": !state.editor.liveMode, // Edit mode'da button tıklanabilir olmasın
        })}
      >
        {buttonText}
      </ShimmerButton>

      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default ShimmerButtonComponent;