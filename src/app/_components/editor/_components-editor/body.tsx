"use client";

import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { cn } from "@/lib/utils";
import Recursive from "./recursive";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";

interface BodyContainerProps {
    element: EditorElement;
}

export const BodyContainer = ({ element }: BodyContainerProps) => {
    const { state } = useEditor();
    const { id, name, type, content, styles } = element;
    const { selectElement } = useElementActions();
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);

    const droppable = useDroppable({
        id: id,
        data: {
            type: "__body",
            containerId: id,
        },
    });

    const isPreviewMode = state.editor.previewMode || state.editor.liveMode;

    const childItems = Array.isArray(content) ? content.map((child) => child.id) : [];

    const finalClassName = cn(
        "w-full h-auto min-h-[50px] transition-all duration-200 ease-in-out relative",
        getBorderClasses(),
        droppable.isOver && !isPreviewMode && "!border-green-500 !border-2 !bg-green-50/50"
    );

    return (
        <div
            ref={droppable.setNodeRef}
            className={finalClassName}
            onClick={() => selectElement(element)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-element-id={id}
            style={{
                ...styles,
                pointerEvents: "auto",
                zIndex: 1,
                height: "auto",
            }}
        >
            {/* Drop indicator */}
            {droppable.isOver && !isPreviewMode && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    style={{
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "2px dashed #22c55e",
                    }}
                >
                    <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg">Drop Here</span>
                </div>
            )}

            {/* Spacing Visualizer - only in edit mode */}
            {!isPreviewMode && <SpacingVisualizer styles={styles} />}

            {/* Content */}
            {Array.isArray(content) && content.length > 0 && (
                <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
                    {content.map((childElement) => (
                        <Recursive key={childElement.id} element={childElement} />
                    ))}
                </SortableContext>
            )}

            {Array.isArray(content) && content.length === 0 && <div className="min-h-[50px] text-gray-400 text-center py-4">Drop elements here</div>}
        </div>
    );
};
