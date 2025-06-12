import { useDraggable } from "@dnd-kit/core";
import { Youtube } from "lucide-react";
import React from "react";

const VideoPlaceholder = () => {
    const draggable = useDraggable({
        id: "video-draggable",
        data: {
            type: "video",
            name: "Video",
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
            <Youtube size={40} className="text-muted-foreground" />
        </div>
    );
};

export default VideoPlaceholder;