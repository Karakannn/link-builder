import { EditorBtns } from "@/lib/constants";
import { SparklesIcon } from "lucide-react";
import React from "react";

const ShimmerButtonPlaceholder = () => {
    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return;
        console.log("=== SHIMMER BUTTON COMPONENT DRAG START ===");
        console.log("Setting type in dataTransfer:", type);
        e.dataTransfer.setData("type", type);
        // Set effectAllowed to copy to indicate this is a creation operation
        e.dataTransfer.effectAllowed = "copy";
        try {
            console.log("Verification - shimmer button type set:", e.dataTransfer.getData("type"));
        } catch (error) {
            console.log("Cannot read dataTransfer during dragStart in some browsers");
        }
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