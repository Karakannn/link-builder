import React, { memo, useMemo, useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles, expandSpacingShorthand } from "@/lib/utils";
import { useElementHeight } from "@/hooks/editor/use-element-height";
import { DragPlaceholder } from "./drag-placeholder";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useLayout, Layout } from "@/hooks/use-layout";
import Recursive from "./recursive";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementById, useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useDevice, useIsEditMode } from "@/providers/editor/editor-ui-context";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
    layout?: Layout;
};

export const LiveStreamCardComponent = memo(({ element: initialElement, layout = "vertical" }: Props) => {
    const liveElement = useElementById(initialElement.id) || initialElement;
    const { id, name, type, styles, content } = liveElement;

    const device = useDevice();
    const isSelected = useIsElementSelected(id);
    const isEditMode = useIsEditMode();
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);

    const { getBorderClasses, handleMouseEnter, handleMouseLeave } = useElementBorderHighlight(liveElement);
    const [measureRef, containerHeight] = useElementHeight(false);
    const { getLayoutStyles } = useLayout();
    const { handleSelectElement } = useElementSelection(initialElement);

    const sortable = useMemo(
        () => ({
            id: id,
            data: {
                type,
                name,
                element: liveElement,
                elementId: id,
                isSidebarElement: false,
                isEditorElement: true,
            },
            disabled: type === "__body" || !isEditMode,
        }),
        [id, type, name, liveElement, isEditMode]
    );

    const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable(sortable);

    const computedStyles = useMemo(() => {
        const baseStyles = getElementStyles(liveElement, device);

        return expandSpacingShorthand({
            ...baseStyles,
            transform: CSS.Transform.toString(transform),
            transition,
            ...getLayoutStyles(layout),
        });
    }, [liveElement, transform, transition, layout, getLayoutStyles]);

    // Placeholder styles without transform - stays in place
    const placeholderStyles = useMemo(() => {
        const baseStyles = getElementStyles(liveElement, device);
        return expandSpacingShorthand({
            ...baseStyles,
            ...getLayoutStyles(layout),
        });
    }, [liveElement, layout, getLayoutStyles]);

    const setNodeRef = useCallback(
        (node: HTMLDivElement | null) => {
            setSortableRef(node);
            measureRef(node);
        },
        [setSortableRef, measureRef]
    );

    useEffect(() => {
        const shouldShowGuides = isSelected && isEditMode;
        if (showSpacingGuides !== shouldShowGuides) {
            setShowSpacingGuides(shouldShowGuides);
        }
    }, [isSelected, isEditMode, showSpacingGuides]);

    const containerClasses = useMemo(
        () =>
            clsx("relative group", getBorderClasses(), {
                "max-w-full w-full": type === "liveStreamCard",
                "h-fit": type === "liveStreamCard",
                "cursor-grabbing": isDragging,
                "opacity-50": isDragging,
                "outline-dashed outline-2 outline-blue-500": isSelected && isEditMode,
                "ring-2 ring-blue-500 ring-offset-2": isSelected && isEditMode && type !== "__body",
            }),
        [type, isDragging, isSelected, isEditMode]
    );

    if (isDragging) {
        return <DragPlaceholder style={placeholderStyles} height={containerHeight} />;
    }

    return (
        <EditorElementWrapper element={liveElement}>
            <div
                ref={setNodeRef}
                style={computedStyles as any}
                className={containerClasses}
                onClick={handleSelectElement}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
            >
                {/* Live Stream Card Content */}
                <div className="w-full">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-red-400 bg-red-50 rounded-lg p-6 min-h-[120px]">
                        <span className="text-red-500 text-2xl mb-2">🔴</span>
                        <span className="font-semibold text-red-500">Burada Live Stream Kartı Gözükecek</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Site ayarlarında bir canlı yayın kartı seçerseniz burada ziyaretçilere gösterilecek.</span>
                    </div>
                </div>

                {/* Editor Controls */}
                {isEditMode && (
                    <>
                        <DeleteElementButton element={liveElement} />
                        {showSpacingGuides && <SpacingVisualizer styles={liveElement.styles} />}
                    </>
                )}
            </div>
        </EditorElementWrapper>
    );
});

LiveStreamCardComponent.displayName = "LiveStreamCardComponent";

export default LiveStreamCardComponent; 