import { EditorBtns } from "@/lib/constants";
import { TypeIcon } from "lucide-react";
import React from "react";

const TextPlaceholder = () => {
    const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return;
        console.log("=== TEXT COMPONENT DRAG START ===");
        console.log("Setting type in dataTransfer:", type);
        e.dataTransfer.setData("type", type);
        // Set effectAllowed to copy to indicate this is a creation operation
        e.dataTransfer.effectAllowed = "copy";
        try {
            console.log("Verification - text type set:", e.dataTransfer.getData("type"));
        } catch (error) {
            console.log("Cannot read dataTransfer during dragStart in some browsers");
        }
    };
    return (
        <div
            draggable
            onDragStart={(e) => {
                handleDragState(e, "text");
            }}
            className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
        >
            <TypeIcon size={40} className="text-muted-foreground" />
        </div>
    );
};

export default TextPlaceholder;
