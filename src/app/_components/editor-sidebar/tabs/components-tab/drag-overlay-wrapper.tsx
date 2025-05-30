"use client";

import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";

export const DragOverlayWrapper = () => {
  
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
      console.log("drag item", event);
    },
    onDragCancel: (event) => {
      setDraggedItem(null);
    },
    onDragEnd: (event) => {
      setDraggedItem(null);
      console.log("drag end", event);
    },
  });

  const node = <div>no drag overlay</div>;

  return <DragOverlay>{node}</DragOverlay>;
};
