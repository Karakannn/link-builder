import { useDraggable } from "@dnd-kit/core";
import { Square } from "lucide-react";
import React from "react";

const AnimatedBorderButtonPlaceholder = () => {
  const draggable = useDraggable({
    id: "animated-border-button-draggable",
    data: {
      type: "animatedBorderButton",
      name: "Animated Border Button",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"
    >
      <div className="bg-gray-900 rounded-lg w-full h-full flex items-center justify-center">
        <Square size={24} className="text-purple-400" />
      </div>
    </div>
  );
};

export default AnimatedBorderButtonPlaceholder;