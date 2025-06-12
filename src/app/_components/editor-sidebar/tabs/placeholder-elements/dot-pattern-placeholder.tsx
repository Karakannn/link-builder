import { useDraggable } from "@dnd-kit/core";
import { MoreHorizontal } from "lucide-react";
import React from "react";

const DotPatternPlaceholder = () => {
  const draggable = useDraggable({
    id: "dot-pattern-draggable",
    data: {
      type: "dotPattern",
      name: "Dot Pattern",
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
      style={{
        backgroundImage: `radial-gradient(circle, rgba(156, 163, 175, 0.4) 1px, transparent 1px)`,
        backgroundSize: '6px 6px',
        backgroundPosition: '0 0, 3px 3px',
      }}
    >
      <MoreHorizontal size={24} className="text-muted-foreground relative z-10" />
    </div>
  );
};

export default DotPatternPlaceholder;