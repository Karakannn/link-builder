import { useDraggable } from "@dnd-kit/core";
import { FileImage, Play } from "lucide-react";
import React from "react";

const GifPlaceholder = () => {
    const draggable = useDraggable({
        id: "gif-draggable",
        data: {
            type: "gif",
            name: "GIF",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 animate-pulse" />
            
            {/* Main icon */}
            <FileImage size={24} className="text-purple-600 relative z-10" />
            
            {/* Play indicator */}
            <div className="absolute bottom-1 right-1 bg-purple-600 rounded-full p-1">
                <Play size={8} className="text-white fill-current" />
            </div>
            
            {/* GIF label */}
            <div className="absolute top-1 left-1 bg-purple-600 text-white text-[8px] px-1 rounded font-bold">
                GIF
            </div>
        </div>
    );
};

export default GifPlaceholder;