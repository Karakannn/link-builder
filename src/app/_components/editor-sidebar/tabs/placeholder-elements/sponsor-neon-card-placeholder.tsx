import { useDraggable } from "@dnd-kit/core";
import { CreditCard } from "lucide-react";
import React from "react";

const SponsorNeonCardPlaceholder = () => {
  const draggable = useDraggable({
    id: "sponsor-neon-card-draggable",
    data: {
      type: "sponsorNeonCard",
      name: "Sponsor Neon Card",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden"
      style={{
        background: "linear-gradient(45deg, #ff00aa, #00FFF1)",
        boxShadow: "0 0 20px rgba(255, 0, 170, 0.3)",
      }}
    >
      <div className="absolute inset-[2px] bg-gray-900 rounded-lg flex items-center justify-center">
        <CreditCard size={24} className="text-cyan-400 relative z-10" />
      </div>
    </div>
  );
};

export default SponsorNeonCardPlaceholder; 