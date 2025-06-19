import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

type Props = {
  element: EditorElement;
};

interface MarqueeItemData {
  type: "text" | "image";
  content: string;
  alt?: string; // For images
  width?: number;
  height?: number;
}

const MarqueeComponent = ({ element }: Props) => {
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
      type: "marquee",
      elementId: id,
      name: "Marquee",
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

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
    </div>
    </ElementContextMenu>
  );
};

export default MarqueeComponent;