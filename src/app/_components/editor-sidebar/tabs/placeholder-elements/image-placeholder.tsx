"use client";
import { useDraggable } from "@dnd-kit/core";
import { Image as ImageIcon } from "lucide-react";
import React from "react";
import { useLiveMode } from "@/providers/editor/editor-ui-context";

const ImagePlaceholder = () => {
    
    const liveMode = useLiveMode();     

    const draggable = useDraggable({
        id: "image",
        data: {
            type: "image",
            name: "Image",
            isSidebarElement: true,
            isEditorElement: false,
        },
        disabled: liveMode,
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className={`
                w-[70px] h-[70px] rounded-lg bg-muted border-2 border-dashed border-slate-300 
                flex items-center justify-center cursor-grab active:cursor-grabbing
                hover:bg-slate-50 transition-colors
                ${draggable.isDragging ? "opacity-50" : ""}
            `}
        >
            <ImageIcon className="w-8 h-8 text-slate-500" />
        </div>
    );
};

export default ImagePlaceholder; 