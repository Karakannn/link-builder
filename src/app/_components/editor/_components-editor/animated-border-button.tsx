import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

type Props = {
  element: EditorElement;
};

const AnimatedBorderButtonComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "animatedBorderButton",
      elementId: id,
      name: "Animated Border Button",
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
    if (!state.editor.liveMode && !draggable.isDragging) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  // Extract button specific props from content with defaults
  const buttonProps = !Array.isArray(computedContent) ? computedContent : {};
  const buttonText = buttonProps.innerText || "Border Button";
  const buttonClass = buttonProps.buttonClass || "default";

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

  return (
    <ElementContextMenu element={element}>
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
      {showSpacingGuides && (
        <SpacingVisualizer styles={computedStyles} />
      )}

        <div
        className={clsx("w-full", {
          "pointer-events-none": !state.editor.liveMode, // disabled edit mode
        })}
      >
        {buttonText}
        </div>

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
    </div>
    </ElementContextMenu>
  );
};

export default AnimatedBorderButtonComponent;