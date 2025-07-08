import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { ColumnComponent } from "./column";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { usePreviewMode, useLiveMode, useDevice } from "@/providers/editor/editor-ui-context";

type Props = {
    element: EditorElement;
};

export const GridLayoutComponent = ({ element }: Props) => {
    const { id, name, type, content } = element;
    const { state } = useEditor();
    const { selectElement } = useElementActions();
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const [measureRef, containerHeight] = useElementHeight(false);

    const previewMode = usePreviewMode();
    const liveMode = useLiveMode();
    const device = useDevice();

    const sortable = useSortable({
        id: id,
        data: {
            type,
            name,
            element,
            elementId: id,
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: liveMode,
    });

    const computedStyles = {
        ...getElementStyles(element, device),
        transform: CSS.Translate.toString(sortable.transform),
        transition: sortable.transition,
    };

    const gridColumns = Array.isArray(content) ? content : [];

    const totalGridColumns = (computedStyles as any).gridColumns || 12;
    const columnSpans = (computedStyles as any).columnSpans || [];
    const gap = (computedStyles as any).gridGap || computedStyles.gap || "1rem";

    const defaultSpan = Math.floor(totalGridColumns / Math.max(gridColumns.length, 1));

    const generateGridTemplate = () => {
        // Her zaman tam grid template kullan, device'a göre hardcode yapma
        return `repeat(${totalGridColumns}, 1fr)`;
    };

    const gridTemplateColumns = generateGridTemplate();

    const finalGridStyles = {
        ...computedStyles,
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
        gap: gap,
    };

    const setNodeRef = (node: HTMLDivElement | null) => {
        sortable.setNodeRef(node);
        measureRef(node);
    };

    if (sortable.isDragging) {
        return <DragPlaceholder style={finalGridStyles} height={containerHeight} />;
    }

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={setNodeRef}
                style={finalGridStyles}
                className={clsx("relative", getBorderClasses(), {
                    "cursor-grabbing": sortable.isDragging,
                    "opacity-50": sortable.isDragging,
                })}
                onClick={() => selectElement(element)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
                {...(!liveMode ? sortable.listeners : {})}
                {...(!liveMode ? sortable.attributes : {})}
            >
                {Array.isArray(content) && content.length > 0 && (
                    <SortableContext items={gridColumns.map((item) => item.id)} strategy={horizontalListSortingStrategy}>
                        {gridColumns.map((columnElement, index) => {
                            const columnSpan = columnSpans[index] || defaultSpan;

                            return (
                                <ColumnComponent
                                    key={columnElement.id}
                                    element={columnElement}
                                    gridSpan={columnSpan}
                                    totalGridColumns={totalGridColumns}
                                    isPreviewMode={previewMode || liveMode}
                                />
                            );
                        })}
                    </SortableContext>
                )}

                <DeleteElementButton element={element} />

                {/* Spacing Visualizer - only in edit mode and when selected */}
                {!previewMode && !liveMode && state.editor.selectedElement.id === id && <SpacingVisualizer styles={computedStyles} />}
            </div>
        </EditorElementWrapper>
    );
};
