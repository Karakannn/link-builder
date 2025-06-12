import { useDraggable } from "@dnd-kit/core";
import { Layers } from "lucide-react";
import React from "react";

const RetroGridPlaceholder = () => {
  const draggable = useDraggable({
    id: "retro-grid-draggable",
    data: {
      type: "retroGrid",
      name: "Retro Grid",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 bg-gradient-to-b from-purple-900 to-pink-900 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(139, 69, 19, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 69, 19, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px',
        transform: 'perspective(100px) rotateX(20deg)',
      }}
    >
      <Layers size={20} className="text-orange-300 relative z-10" />
    </div>
  );
};

export default RetroGridPlaceholder;