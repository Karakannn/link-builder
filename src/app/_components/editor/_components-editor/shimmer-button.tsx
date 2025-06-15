import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { useSortable } from "@dnd-kit/sortable";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { CSS } from '@dnd-kit/utilities';
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";

type Props = {
  element: EditorElement;
};

const ShimmerButtonComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);
  const { handleSelectElement } = useElementSelection(element);
  const [measureRef, containerHeight] = useElementHeight(false);


  const computedContent = getElementContent(element, state.editor.device);

  // Extract shimmer button specific props from content with defaults
  const shimmerProps = !Array.isArray(computedContent) ? computedContent : {};
  const shimmerColor = (shimmerProps.shimmerColor as string) || "#ffffff";
  const shimmerSize = (shimmerProps.shimmerSize as string) || "0.1em";
  const shimmerDuration = (shimmerProps.shimmerDuration as string) || "2s";
  const borderRadius = (shimmerProps.borderRadius as string) || "10px";
  const background = (shimmerProps.background as string) || "rgba(99, 102, 241, 1)";
  const buttonText = shimmerProps.innerText || "Tıkla";

  // dnd-kit sortable
  const sortable = useSortable({
    id,
    data: {
      type: "shimmerButton",
      elementId: id,
      name: "Shimmer Button",
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  };


  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);


  const setNodeRef = (node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
    measureRef(node);
  };


  if (sortable.isDragging) {
    return (
      <DragPlaceholder
        style={computedStyles}
        height={containerHeight}
      />
    );
  }

  return (
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
      onClick={handleSelectElement}
      {...(!state.editor.liveMode ? sortable.listeners : {})}
      {...(!state.editor.liveMode ? sortable.attributes : {})}
    >

      {showSpacingGuides && (
        <SpacingVisualizer
          marginTop={computedStyles.marginTop}
          marginRight={computedStyles.marginRight}
          marginBottom={computedStyles.marginBottom}
          marginLeft={computedStyles.marginLeft}
          paddingTop={computedStyles.paddingTop}
          paddingRight={computedStyles.paddingRight}
          paddingBottom={computedStyles.paddingBottom}
          paddingLeft={computedStyles.paddingLeft}
        />
      )}

      <ShimmerButton
        ref={buttonRef}
        shimmerColor={shimmerColor}
        shimmerSize={shimmerSize}
        shimmerDuration={shimmerDuration}
        borderRadius={borderRadius}
        background={background}
        className={clsx("w-full", {
          "pointer-events-none": !state.editor.liveMode, // disabled edit mode
        })}
      >
        {buttonText}
      </ShimmerButton>

      <BadgeElementName element={element} />
      <DeleteElementButton element={element} />
    </div>
  );
};

export default ShimmerButtonComponent;