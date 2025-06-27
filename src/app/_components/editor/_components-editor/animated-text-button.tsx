import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";

type Props = {
  element: EditorElement;
};

const AnimatedTextButtonComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, name, type, styles, content } = element;
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device);

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "animated-text-button",
      elementId: id,
      name: "Animated Text Button",
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

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

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

  // Extract button specific props from content with defaults
  const buttonProps = !Array.isArray(computedContent) ? computedContent : {};
  const buttonText = buttonProps.innerText || "Text Button";
  const buttonClass = buttonProps.className || "bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold";

  return (
    <EditorElementWrapper element={element}>
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

        {!Array.isArray(computedContent) && (state.editor.previewMode || state.editor.liveMode) && (
          <button
            className="animated-text-button"
            style={{
              '--text-color': computedContent.textColor || '#000000',
              '--background-color': computedContent.backgroundColor || '#ffffff',
            } as React.CSSProperties}
          >
            {computedContent.innerText || "Animated Text Button"}
          </button>
        )}

        {!Array.isArray(computedContent) && !state.editor.previewMode && !state.editor.liveMode && (
          <div className="animated-text-button-preview">
            <div className="text-center p-4">
              <div className="text-sm text-gray-500 mb-2">Animated Text Button</div>
              <div className="text-xs text-gray-400">Click to edit</div>
            </div>
          </div>
        )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </EditorElementWrapper>
  );
};

export default AnimatedTextButtonComponent;