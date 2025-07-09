import { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { ColumnComponent } from "./column";
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { usePreviewMode, useLiveMode, useDevice } from "@/providers/editor/editor-ui-context";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useElementSelection } from "@/hooks/editor/use-element-selection";
import React, { useEffect } from "react";
import { useDndContext } from "@dnd-kit/core";

type Props = {
    element: EditorElement;
};

export const GridLayoutComponent = ({ element }: Props) => {
    const { id, name, type, content } = element;
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const [measureRef] = useElementHeight(false);
    const isElementSelected = useIsElementSelected(id);
    const { handleSelectElement } = useElementSelection(element);
    const previewMode = usePreviewMode();
    const liveMode = useLiveMode();
    const device = useDevice();
    const { active, over } = useDndContext();

    const computedStyles = {
        ...getElementStyles(element, device),
    };

    const gridColumns = Array.isArray(content) ? content : [];

    const totalGridColumns = (computedStyles as any).gridColumns || 12;
    const columnSpans = (computedStyles as any).columnSpans || [];
    const gap = (computedStyles as any).gridGap || computedStyles.gap || "1rem";

    const defaultSpan = Math.floor(totalGridColumns / Math.max(gridColumns.length, 1));

    const generateGridTemplate = () => {
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
        measureRef(node);
    };

    // Drag end eventi dinle - sadece column drag'i için
    useEffect(() => {
        // Drag bittiğinde ve over var ise kontrol et
        if (!active && over) {
            console.log('🔥 Drag ended with over:', over.id);
            return;
        }

        // Aktif drag varsa ve column ise ve bu grid'e ait ise
        if (active?.data?.current?.type === 'column' &&
            gridColumns.some(col => col.id === active.id) &&
            over?.id &&
            gridColumns.some(col => col.id === over.id) &&
            active.id !== over.id) {

            console.log('🔥 Valid column drop detected, will reorder on drag end');
        }
    }, [active, over, gridColumns]);

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={setNodeRef}
                style={finalGridStyles}
                className={clsx("relative", getBorderClasses(), {
                    "cursor-pointer": !liveMode,
                })}
                onClick={handleSelectElement}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
            >
                {Array.isArray(content) && content.length > 0 && (
                    gridColumns.map((columnElement, index) => {
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
                    })
                )}

                <DeleteElementButton element={element} />

                {/* Spacing Visualizer - only in edit mode and when selected */}
                {!previewMode && !liveMode && isElementSelected && <SpacingVisualizer styles={computedStyles} />}
            </div>
        </EditorElementWrapper>
    );
};