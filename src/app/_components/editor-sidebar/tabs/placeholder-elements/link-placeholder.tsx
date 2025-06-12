import { useDraggable } from "@dnd-kit/core";
import { Link2Icon } from "lucide-react";
import React from "react";

const LinkPlaceholder = () => {
    const draggable = useDraggable({
        id: "link-draggable",
        data: {
            type: "link",
            name: "Link",
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
            <Link2Icon size={40} className="text-muted-foreground" />
        </div>
    );
};

export default LinkPlaceholder;