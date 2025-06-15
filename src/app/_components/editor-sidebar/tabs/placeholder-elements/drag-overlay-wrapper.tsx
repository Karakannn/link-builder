"use client";

import { DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";

export const DragOverlayWrapper = () => {

  return (
    <DragOverlay
      dropAnimation={null}
      modifiers={[snapCenterToCursor]}
      style={{
        zIndex: 999,
      }}
    >
      <div
        className={cn(
          "flex opacity-90 pointer-events-none shadow-lg relative rounded border-2 border-blue-500",
        )}
      >

        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          Moving
        </div>
      </div>
    </DragOverlay>
  );
};