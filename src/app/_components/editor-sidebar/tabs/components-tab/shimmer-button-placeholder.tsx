import { EditorBtns } from "@/lib/constants";
import { useDraggable } from "@dnd-kit/core";
import { SparklesIcon } from "lucide-react";
import React from "react";

const ShimmerButtonPlaceholder = () => {
  const draggable = useDraggable({
    id: "shimmer-button",
    data: {
      type: "shimmerButton",
      name: "Shimmer Button",
      isSidebarElement: true,
      isEditorElement: false,
    },
  });

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <SparklesIcon size={40} className="text-muted-foreground" />
    </div>
  );
};

export default ShimmerButtonPlaceholder;
