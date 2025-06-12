import { useDraggable } from "@dnd-kit/core";
import { Type } from "lucide-react";
import React from "react";

const AnimatedTextButtonPlaceholder = () => {
  const draggable = useDraggable({
    id: "animated-text-button-draggable",
    data: {
      type: "animatedTextButton",
      name: "Animated Text Button",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 bg-gray-800 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-20 -translate-x-full animate-pulse" />
      <Type size={24} className="text-gray-300 relative z-10" />
    </div>
  );
};

export default AnimatedTextButtonPlaceholder;