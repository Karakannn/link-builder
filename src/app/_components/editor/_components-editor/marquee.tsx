import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import Image from "next/image";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementSelection, useElementBorderHighlight } from "@/hooks/editor/use-element-selection";
import { useLayout, Layout } from "@/hooks/use-layout";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

type Props = {
  element: EditorElement;
  layout?: Layout;
};

interface MarqueeItemData {
  type: "text" | "image";
  content: string;
  alt?: string; // For images
  width?: number;
  height?: number;
}

const MarqueeComponent = ({ element, layout = 'vertical' }: Props) => {
  const { state } = useEditor();
  const { id, name, type, styles, content } = element;
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);
  const { handleSelectElement } = useElementSelection(element);
  const { getBorderClasses } = useElementBorderHighlight(element);

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device);

  // dnd-kit sortable
  const sortable = useSortable({
    id: id,
    data: {
      type: "marquee",
      elementId: id,
      name: "Marquee",
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

  // Extract marquee specific props from content with defaults
  const marqueeProps = !Array.isArray(computedContent) ? computedContent : {};
  const direction = marqueeProps.direction || "left";
  const speed = marqueeProps.speed || 50;
  const pauseOnHover = marqueeProps.pauseOnHover || true;
  const items: MarqueeItemData[] = marqueeProps.items || [
    { type: "text", content: "Sample Text 1" },
    { type: "text", content: "Sample Text 2" },
    { type: "text", content: "Sample Text 3" },
  ];

  const renderMarqueeItem = (item: MarqueeItemData, index: number) => {
    switch (item.type) {
      case "text":
        return (
          <MarqueeItem key={index} className="text-lg font-medium">
            {item.content}
          </MarqueeItem>
        );
      case "image":
        return (
          <MarqueeItem key={index}>
            <Image
              src={item.content}
              alt={item.alt || "Marquee image"}
              width={item.width || 100}
              height={item.height || 100}
              className="rounded-lg object-cover"
            />
          </MarqueeItem>
        );
      default:
        return (
          <MarqueeItem key={index} className="text-lg font-medium">
            {item.content}
          </MarqueeItem>
        );
    }
  };

  return (
    <ElementContextMenu element={element}>
    <div
      ref={sortable.setNodeRef}
      style={{
        ...computedStyles,
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className={clsx("relative", getBorderClasses(), {
        "cursor-grabbing": sortable.isDragging,
        "opacity-50": sortable.isDragging,
      })}
      onClick={handleSelectElement}
      data-element-id={id}
      {...(!state.editor.liveMode ? sortable.listeners : {})}
      {...(!state.editor.liveMode ? sortable.attributes : {})}
    >
        {showSpacingGuides && (
          <SpacingVisualizer styles={computedStyles} />
        )}

        <div className="w-full h-full overflow-hidden">
          <div className="flex animate-marquee">
            {Array.isArray(computedContent) ? (
              computedContent.map((item, index) => (
                <div key={index} className="flex-shrink-0 mx-4">
                  {item.type === "text" && (
                    <span className="text-white">{item.content}</span>
                  )}
                  {item.type === "image" && (
                    <Image
                      src={item.src}
                      alt={item.alt || "Marquee image"}
                      width={item.width || 50}
                      height={item.height || 50}
                      className="object-cover"
                    />
                  )}
        </div>
              ))
            ) : (
              <span className="text-white">Marquee Content</span>
      )}
          </div>
        </div>

        <DeleteElementButton element={element} />
    </div>
    </ElementContextMenu>
  );
};

export default MarqueeComponent;