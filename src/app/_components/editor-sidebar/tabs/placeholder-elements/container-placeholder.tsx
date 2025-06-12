import { useDraggable } from "@dnd-kit/core";
import React from "react";

const ContainerPlaceholder = () => {
    const draggable = useDraggable({
        id: "container-draggable",
        data: {
            type: "container",
            name: "Container",
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
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
        </div>
    );
};

export default ContainerPlaceholder;