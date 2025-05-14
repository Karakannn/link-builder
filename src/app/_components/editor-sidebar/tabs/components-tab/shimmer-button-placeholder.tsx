import { EditorBtns } from "@/lib/constants";
import { SparklesIcon } from "lucide-react";
import React from "react";

const ShimmerButtonPlaceholder = () => {
    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return;
        e.dataTransfer.setData("type", type);
    };
    return (
        <div 
            draggable 
            onDragStart={(e) => handleDragStart(e, "shimmerButton")} 
            className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
        >
            <SparklesIcon size={40} className="text-muted-foreground" />
        </div>
    );
};

export default ShimmerButtonPlaceholder; 