import { useDraggable } from "@dnd-kit/core";
import { MousePointer } from "lucide-react";
import React, { useState } from "react";

const InteractiveGridPatternPlaceholder = () => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  
  const draggable = useDraggable({
    id: "interactive-grid-pattern-draggable",
    data: {
      type: "interactiveGridPattern",
      name: "Interactive Grid Pattern",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden group"
    >
      <div className="absolute inset-0 p-1">
        <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-[1px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className={`bg-muted-foreground/20 transition-all duration-200 ${
                hoveredCell === i ? 'bg-muted-foreground/60' : ''
              }`}
              onMouseEnter={() => setHoveredCell(i)}
              onMouseLeave={() => setHoveredCell(null)}
            />
          ))}
        </div>
      </div>
      <MousePointer size={20} className="text-muted-foreground relative z-10 group-hover:text-foreground transition-colors" />
    </div>
  );
};

export default InteractiveGridPatternPlaceholder;