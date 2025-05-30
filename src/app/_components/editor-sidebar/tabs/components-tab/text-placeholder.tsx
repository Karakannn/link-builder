import { useDraggable } from "@dnd-kit/core";
import { TypeIcon } from "lucide-react";
import React from "react";

const TextPlaceholder = () => {
    const draggable = useDraggable({
        id: "text-draggable",
        data: {
            type: "text",
            name: "Text",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
            <TypeIcon size={40} className="text-muted-foreground" />
        </div>
    );
};

export default TextPlaceholder;