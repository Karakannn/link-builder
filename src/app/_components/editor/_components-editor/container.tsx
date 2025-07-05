import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Recursive from "./recursive";
import { expandSpacingShorthand } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementSelection, useElementBorderHighlight } from "@/hooks/editor/use-element-selection";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useLayout, Layout } from "@/hooks/use-layout";

type Props = {
  element: EditorElement;
  layout?: Layout;
};

export const Container = ({ element, layout = 'vertical' }: Props) => {
  const { id, name, type, styles, content } = element;
  const { state } = useEditor();
  const { handleSelectElement } = useElementSelection(element);
  const { 
    getBorderClasses, 
    handleMouseEnter, 
    handleMouseLeave,
    isSelected 
  } = useElementBorderHighlight(element);
  const [measureRef, containerHeight] = useElementHeight(false);
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);
  const { getLayoutStyles } = useLayout();

  const sortable = useSortable({
    id: id,
    data: {
      type,
      name,
      element,
      elementId: id,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: type === "__body" || state.editor.liveMode,
  });

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🔧 Container clicked:", { id, name, type, styles });
    handleSelectElement(e);
  };

  const computedStyles = expandSpacingShorthand({
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  });

  const setNodeRef = (node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
    measureRef(node);
  };

  useEffect(() => {
    const shouldShowGuides = isSelected && !state.editor.liveMode;
    setShowSpacingGuides(shouldShowGuides);
  }, [isSelected, state.editor.liveMode, type]);

  if (sortable.isDragging) {
    return (
      <DragPlaceholder
        style={computedStyles}
        height={containerHeight}
      />
    );
  }

  return (
    <EditorElementWrapper element={element}>
      <div
        ref={setNodeRef}
        style={{
          ...computedStyles,
          ...getLayoutStyles(layout),
        }}
        className={clsx("relative group", getBorderClasses(), {
          "max-w-full w-full": type === "container" || type === "2Col",
          "h-fit": type === "container",
          "h-full": type === "__body",
          "overflow-y-auto": type === "__body",
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleContainerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-element-id={id}
        {...(type !== "__body" && !state.editor.liveMode ? sortable.listeners : {})}
        {...(type !== "__body" && !state.editor.liveMode ? sortable.attributes : {})}
      >
        {showSpacingGuides && (
          <SpacingVisualizer styles={computedStyles} />
        )}

        {Array.isArray(content) && content.length > 0 && content.map((childElement, index) => (
          <Recursive
            key={childElement.id}
            element={childElement}
            containerId={id}
            index={index}
            layout={layout}
          />
        ))}

        {Array.isArray(content) && content.length === 0 && (
          <div className="min-h-[50px] text-gray-400 text-center py-4">
            {type === "__body" ? "Page Body - Drop elements here" : "Empty Container"}
          </div>
        )}

        <DeleteElementButton element={element} />
      </div>
    </EditorElementWrapper>
  );
};