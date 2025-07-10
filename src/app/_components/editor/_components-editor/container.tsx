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

export const Container = memo(({ element: initialElement, layout = "vertical" }: Props) => {
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

    // Generate custom CSS variables for animation colors
    const customAnimationStyles = useMemo(() => {
        const customClass = (styles as any).customClass;
        const animationColors = (styles as any).animationColors;
        
        if (!customClass || !animationColors?.[customClass]) {
            return {};
        }
        
        const colors = animationColors[customClass];
        const cssVars: Record<string, string> = {};
        
        // Generate CSS custom properties based on animation type
        if (customClass === "bg-gradient-waves" && colors) {
            cssVars['--gradient-color-1'] = colors.color1 || '#ee7752';
            cssVars['--gradient-color-2'] = colors.color2 || '#e73c7e';
            cssVars['--gradient-color-3'] = colors.color3 || '#23a6d5';
            cssVars['--gradient-color-4'] = colors.color4 || '#23d5ab';
        } else if (customClass === "bg-pulsing-orbs" && colors) {
            cssVars['--orb-color-1'] = colors.color1 || '#ff0096';
            cssVars['--orb-color-2'] = colors.color2 || '#0096ff';
        } else if (customClass === "bg-twinkling-stars" && colors) {
            cssVars['--star-bg-color'] = colors.color1 || '#0c0c2a';
            cssVars['--star-color'] = colors.color2 || '#ffffff';
        } else if (customClass === "bg-dot-pattern" && colors) {
            cssVars['--dot-color-1'] = colors.color1 || '#9ca3af';
        } else if (customClass === "bg-animated-grid" && colors) {
            cssVars['--grid-color-1'] = colors.color1 || '#9ca3af';
        }
        
        return cssVars;
    }, [styles]);

    const computedStyles = useMemo(() => {
        const baseStyles = getElementStyles(liveElement, device);

        return expandSpacingShorthand({
            ...baseStyles,
            transform: CSS.Transform.toString(transform),
            transition,
            ...getLayoutStyles(layout),
            ...customAnimationStyles,
        });
    }, [liveElement, transform, transition, layout, getLayoutStyles, customAnimationStyles]);

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

    const childContent = useMemo(() => {
        if (!Array.isArray(content)) return;

        if (content.length === 0) {
            return (
                <div className="min-h-[50px] text-gray-400 text-center py-4">{type === "__body" ? "Page Body - Drop elements here" : "Empty Container"}</div>
            );
        }

        return content.map((childElement, index) => {
            return <Recursive key={childElement.id} element={childElement} containerId={id} index={index} layout={layout} />;
        });
    }, [content, type, id, layout]);

    const containerClasses = useMemo(
        () => {
            // Get custom classes from styles
            const customClass = (styles as any).customClass;
            
            return clsx("relative group", getBorderClasses(), {
                "max-w-full w-full": type === "container" || type === "2Col",
                "h-fit": type === "container",
                "h-full": type === "__body",
                "overflow-y-auto": type === "__body",
                "cursor-grabbing": isDragging,
                "opacity-50": isDragging,
                "outline-dashed outline-2 outline-blue-500": isSelected && isEditMode,
                "ring-2 ring-blue-500 ring-offset-2": isSelected && isEditMode && type !== "__body",
            },
            // Apply custom classes if they exist
            customClass || ""
            );
        },
        [type, isDragging, isSelected, isEditMode, styles, getBorderClasses]
    );

    if (isDragging) {
        return <DragPlaceholder style={placeholderStyles} height={containerHeight} />;
    }

    return (
        <EditorElementWrapper element={liveElement}>
            <div
                ref={setNodeRef}
                style={computedStyles}
                className={containerClasses}
                onClick={handleSelectElement}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
                {...(type !== "__body" && isEditMode ? listeners : {})}
                {...(type !== "__body" && isEditMode ? attributes : {})}
            >
                {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}
                {childContent}
                {isSelected && isEditMode && type !== "__body" && <DeleteElementButton element={liveElement} />}
            </div>
        </EditorElementWrapper>
    );
});

export default Container;
