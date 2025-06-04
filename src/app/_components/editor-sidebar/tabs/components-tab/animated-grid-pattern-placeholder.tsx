import { useDraggable } from "@dnd-kit/core";
import { Grid3X3 } from "lucide-react";
import React from "react";

const AnimatedGridPatternPlaceholder = () => {
  const draggable = useDraggable({
    id: "animated-grid-pattern-draggable",
    data: {
      type: "animatedGridPattern",
      name: "Animated Grid Pattern",
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
      <div className="absolute inset-0 opacity-30">
        <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-[1px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-muted-foreground/30 animate-pulse" 
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
      <Grid3X3 size={24} className="text-muted-foreground relative z-10" />
    </div>
  );
};

export default AnimatedGridPatternPlaceholder;