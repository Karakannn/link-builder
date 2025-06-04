import { useDraggable } from "@dnd-kit/core";
import { Sparkles } from "lucide-react";
import React from "react";

const AnimatedShinyButtonPlaceholder = () => {
  const draggable = useDraggable({
    id: "animated-shiny-button-draggable",
    data: {
      type: "animatedShinyButton",
      name: "Animated Shiny Button",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      <Sparkles size={24} className="text-white relative z-10" />
    </div>
  );
};

export default AnimatedShinyButtonPlaceholder;