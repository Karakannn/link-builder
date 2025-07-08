import { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { CSSProperties } from "react";
import Recursive from "./recursive";
import { CSS } from "@dnd-kit/utilities";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { GripVertical } from "lucide-react";
import { useDraggable, useDroppable, useDndContext } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useDevice, useLiveMode } from "@/providers/editor/editor-ui-context";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementHeight } from "@/hooks/editor/use-element-height";

type Props = {
    element: EditorElement;
    gridSpan?: number;
    totalGridColumns?: number;
    isPreviewMode?: boolean;
};

export const ColumnComponent = ({ element, gridSpan = 1, totalGridColumns = 12, isPreviewMode = false }: Props) => {
    const { id, name, type, content } = element;
    const { getBorderClasses, handleMouseEnter, handleMouseLeave } = useElementBorderHighlight(element);
    const isElementSelected = useIsElementSelected(id);
    const liveMode = useLiveMode();
    const device = useDevice();
    const { handleSelectElement } = useElementSelection(element);
    const { active } = useDndContext();
    const [measureRef, containerHeight] = useElementHeight(false);

    const isDraggingColumn = active?.data?.current?.type === 'column';
    const isDraggingThisColumn = active?.id === id;
    const isDraggingOtherColumn = isDraggingColumn && !isDraggingThisColumn;

    const draggable = useDraggable({
        id: id,
        data: {
            type: "column",
            elementId: id,
            name: name,
            element,
            containerId: id,
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: liveMode,
    });

    const droppable = useDroppable({
        id: `droppable-${id}`,
        data: {
            type: "column",
            containerId: id,
            draggedColumnId: active?.id,
        },
        disabled: liveMode,
    });

    const baseStyles = getElementStyles(element, device);
    const computedStyles = {
        ...baseStyles,
        transform: CSS.Translate.toString(draggable.transform),
        gridColumn: `span ${gridSpan}`,
        minHeight: "30px",
        opacity: draggable.isDragging ? 0.3 : 1,
        zIndex: isElementSelected ? 10 : 1,
        padding: "0px",
        margin: "0px",
        pointerEvents: (isDraggingColumn && !isDraggingThisColumn) ? 'none' as const : 'auto' as const,
    };

    const placeholderStyles = {
        ...baseStyles,
        gridColumn: `span ${gridSpan}`,
        minHeight: "30px",
        padding: "0px",
        margin: "0px",
    };

    if (draggable.isDragging) {
        return <DragPlaceholder style={placeholderStyles} height={containerHeight} />;
    }

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={(node) => {
                    draggable.setNodeRef(node);
                    droppable.setNodeRef(node);
                    measureRef(node);
                }}
                style={computedStyles as any}
                className={clsx("relative", getBorderClasses(), {
                    "cursor-grabbing": draggable.isDragging,
                    "opacity-50": draggable.isDragging,
                    "ring-2 ring-blue-300": isDraggingColumn && !isDraggingThisColumn,
                    "ring-2 ring-green-500": isDraggingThisColumn,
                    "ring-2 ring-green-500 bg-green-100/20": droppable.isOver && !isDraggingThisColumn,
                })}
                onClick={handleSelectElement}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
            >
                {/* Drag handle */}
                {!liveMode && isElementSelected && (
                    <div
                        className="absolute -top-4 -left-4 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded cursor-grab active:cursor-grabbing transition-colors z-20"
                        {...draggable.listeners}
                        {...draggable.attributes}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={16} />
                    </div>
                )}

                {/* Drop zone overlay */}
                {isDraggingOtherColumn && !liveMode && (
                    <div
                        className="absolute inset-0 pointer-events-auto z-[9999] transition-all duration-150 ease-out bg-green-500/30 border-2 border-green-500 shadow-lg"
                        style={{
                            height: containerHeight || 'auto',
                            minHeight: '30px'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-green-600 text-white px-4 py-3 rounded-md text-sm font-medium shadow-lg">
                                🎯 Bırak ve Değiştir
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {Array.isArray(content) && content.length > 0 && (
                    content.map((childElement, index) => (
                        <Recursive key={childElement.id} element={childElement} />
                    ))
                )}
                <DeleteElementButton element={element} />
                {!isPreviewMode && isElementSelected && <SpacingVisualizer styles={computedStyles as CSSProperties} />}
            </div>
        </EditorElementWrapper>
    );
};