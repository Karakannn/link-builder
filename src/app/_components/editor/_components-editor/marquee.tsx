import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";

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
  const { id, styles, content, type } = element;

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

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Marquee clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting marquee:", id);
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
      <Marquee className="h-full overflow-hidden">
        <MarqueeFade side="left" />
        <MarqueeContent
          direction={direction as "left" | "right"}
          speed={speed}
          pauseOnHover={pauseOnHover}
        >
          {items.map((item, index) => renderMarqueeItem(item, index))}
        </MarqueeContent>
        <MarqueeFade side="right" />
      </Marquee>
      
      {!state.editor.liveMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
          Marquee Element
        </div>
      )}

      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default MarqueeComponent;