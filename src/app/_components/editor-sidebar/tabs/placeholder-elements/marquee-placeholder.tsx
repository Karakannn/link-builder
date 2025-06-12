import { useDraggable } from "@dnd-kit/core";
import { ArrowRight } from "lucide-react";
import React from "react";

const MarqueePlaceholder = () => {
  const draggable = useDraggable({
    id: "marquee-draggable",
    data: {
      type: "marquee",
      name: "Marquee",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        <div className="flex space-x-2 animate-pulse">
          <ArrowRight size={12} className="text-muted-foreground opacity-60" />
          <ArrowRight size={12} className="text-muted-foreground opacity-80" />
          <ArrowRight size={12} className="text-muted-foreground" />
        </div>
      </div>
      <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    </div>
  );
};

export default MarqueePlaceholder;