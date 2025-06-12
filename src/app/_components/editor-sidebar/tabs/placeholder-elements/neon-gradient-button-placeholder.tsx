import { useDraggable } from "@dnd-kit/core";
import { Zap } from "lucide-react";
import React from "react";

const NeonGradientButtonPlaceholder = () => {
  const draggable = useDraggable({
    id: "neon-gradient-button-draggable",
    data: {
      type: "neonGradientButton",
      name: "Neon Gradient Button",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative"
      style={{
        background: "linear-gradient(45deg, #ff00aa, #00FFF1)",
        boxShadow: "0 0 20px rgba(255, 0, 170, 0.5)",
      }}
    >
      <div className="absolute inset-[2px] bg-gray-900 rounded-lg" />
      <Zap size={24} className="text-cyan-400 relative z-10" />
    </div>
  );
};

export default NeonGradientButtonPlaceholder;