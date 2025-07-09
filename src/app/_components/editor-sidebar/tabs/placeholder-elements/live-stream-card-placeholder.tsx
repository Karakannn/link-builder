import { useDraggable } from "@dnd-kit/core";
import { Video } from "lucide-react";
import React from "react";

const LiveStreamCardPlaceholder = () => {
    const draggable = useDraggable({
        id: "live-stream-card-draggable",
        data: {
            type: "liveStreamCard",
            name: "Live Stream Card",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-gradient-to-br from-red-500/10 to-purple-500/10 border-red-500/20 border rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            {/* Live indicator */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            
            {/* Main icon */}
            <Video size={24} className="text-red-500 relative z-10" />
            
            {/* Live text indicator */}
            <div className="absolute bottom-1 right-1 bg-red-500 text-white text-[6px] px-1 rounded font-bold">
                LIVE
            </div>
        </div>
    );
};

export default LiveStreamCardPlaceholder; 