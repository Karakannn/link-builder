import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { NeonCard } from "@/components/ui/neon-card";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import Recursive from "./recursive";
import DropZoneWrapper, { Layout } from "./dropzone-wrapper";

type Props = {
  element: EditorElement;
};

const NeonCardComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);

  const sortable = useSortable({
    id: id,
    data: {
      type,
      name: "Neon Card",
      element,
      elementId: id,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.editor.liveMode && !sortable.isDragging) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  // Extract card specific props from content with defaults
  const cardProps = !Array.isArray(computedContent) ? computedContent : {};
  const firstColor = cardProps.firstColor || "#ff00aa";
  const secondColor = cardProps.secondColor || "#00FFF1";
  const borderSize = cardProps.borderSize || 2;
  const borderRadius = cardProps.borderRadius || 20;

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

  if (sortable.isDragging) return null;

  const setNodeRef = (node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
  };

  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={computedStyles}
        className={clsx("relative transition-all", {
          "!border-blue-500": state.editor.selectedElement.id === id,
          "!border-solid": state.editor.selectedElement.id === id,
          "!border-dashed border border-slate-300": !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleOnClickBody}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
      >
        {showSpacingGuides && (
          <SpacingVisualizer styles={computedStyles} />
        )}

        <NeonCard
          borderSize={borderSize}
          borderRadius={borderRadius}
          neonColors={{ firstColor, secondColor }}
          className="w-full min-h-[200px]"
        >
          {/* Render child elements */}
          {Array.isArray(content) && content.length > 0 && (
            <>
              {content.map((childElement, index) => (
                <DropZoneWrapper
                  key={childElement.id}
                  elementId={childElement.id}
                  containerId={id}
                  index={index}
                  layout={Layout.Vertical}
                >
                  <Recursive element={childElement} />
                </DropZoneWrapper>
              ))}
            </>
          )}

          {/* Empty state */}
          {Array.isArray(content) && content.length === 0 && (
            <div className="min-h-[150px] text-gray-400 text-center py-8 flex items-center justify-center">
              Drop elements here to create your neon card content
            </div>
          )}
        </NeonCard>
        
        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  );
};

export default NeonCardComponent; 