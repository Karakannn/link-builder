import { useDraggable } from "@dnd-kit/core";
import { Grid3X3 } from "lucide-react";
import React from "react";

const GridLayoutPlaceholder = () => {
    const draggable = useDraggable({
        id: "grid-layout-draggable",
        data: {
            type: "gridLayout",
            name: "Grid Layout",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-col gap-[2px] cursor-grab active:cursor-grabbing"
        >
            {/* Grid visualization */}
            <div className="flex gap-[2px] h-full">
                <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
                <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
                <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
            </div>
            {/* Grid icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Grid3X3 size={16} className="text-muted-foreground/70" />
            </div>
        </div>
    );
};

export default GridLayoutPlaceholder;