import { useDraggable } from "@dnd-kit/core";
import { X } from "lucide-react";
import React from "react";

const ClosableContainerPlaceholder = () => {
    const draggable = useDraggable({
        id: "closable-container-draggable",
        data: {
            type: "closableContainer",
            name: "Closable Container",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-col gap-[2px] cursor-grab active:cursor-grabbing relative"
        >
            {/* Container visualization */}
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full relative">
                {/* Close button indicator */}
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center">
                    <X size={8} className="text-white" />
                </div>
            </div>
        </div>
    );
};

export default ClosableContainerPlaceholder; 