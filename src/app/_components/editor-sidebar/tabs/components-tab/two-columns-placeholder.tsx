import { useDraggable } from "@dnd-kit/core";
import React from "react";

const TwoColumnsPlaceholder = () => {
    const draggable = useDraggable({
        id: "2col-draggable",
        data: {
            type: "2Col",
            name: "Two Columns",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px] cursor-grab active:cursor-grabbing"
        >
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"></div>
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full"></div>
        </div>
    );
};

export default TwoColumnsPlaceholder;