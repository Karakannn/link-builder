import { useDraggable } from "@dnd-kit/core";
import { ZapIcon } from "lucide-react";
import React from "react";

const AnimatedTextPlaceholder = () => {
    const draggable = useDraggable({
        id: "animated-text-draggable",
        data: {
            type: "animatedText",
            name: "Animated Text",
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
            <ZapIcon size={40} className="text-muted-foreground" />
        </div>
    );
};

export default AnimatedTextPlaceholder; 