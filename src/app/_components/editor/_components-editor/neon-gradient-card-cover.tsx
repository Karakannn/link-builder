import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { NeonGradientCardCover } from "@/components/ui/neon-gradient-card-cover";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
  element: EditorElement;
};

const NeonGradientCardCoverComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;

  // dnd-kit sortable
  const sortable = useSortable({
    id: id,
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

  const { handleSelectElement } = useElementSelection(element);

  // Extract card specific props from content with defaults
  const cardProps = !Array.isArray(computedContent) ? computedContent : {};
  const title = cardProps.title || "Card Title";
  const description = cardProps.description || "Card Description";
  const logo = cardProps.logo || null;
  const firstColor = cardProps.firstColor || "#ff00aa";
  const secondColor = cardProps.secondColor || "#00FFF1";
  const borderSize = cardProps.borderSize || 2;
  const borderRadius = cardProps.borderRadius || 20;

  if(sortable.isDragging) return null;

  return (
    <div
      ref={sortable.setNodeRef}
      style={{
        ...computedStyles,
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className={clsx("p-[2px] relative transition-all", {
        "!border-blue-500": state.editor.selectedElement.id === id,
        "!border-solid": state.editor.selectedElement.id === id,
        "!border-dashed border border-slate-300": !state.editor.liveMode,
        "cursor-grab": !state.editor.liveMode,
        "cursor-grabbing": sortable.isDragging,
        "opacity-50": sortable.isDragging,
      })}
      onClick={handleSelectElement}
      data-element-id={id}
      {...(!state.editor.liveMode ? sortable.listeners : {})}
      {...(!state.editor.liveMode ? sortable.attributes : {})}
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
      <BadgeElementName element={element} />
      <DeleteElementButton element={element} />
    </div>
  );
};

export default NeonGradientCardCoverComponent; 