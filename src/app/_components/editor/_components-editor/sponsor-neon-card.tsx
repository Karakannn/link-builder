// src/app/_components/editor/_components-editor/sponsor-neon-card.tsx
// ⚡ OPTIMIZED VERSION - Replace existing sponsor-neon-card.tsx with this

"use client";

import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import clsx from "clsx";

// 🚀 REACT 19: Import optimized context hooks

import type { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import Recursive from "./recursive";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import { SponsorNeonCard } from "@/components/ui/sponsor-neon-card";
import { useElementBorderHighlight, useElementSelection } from "@/hooks/editor/use-element-selection";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useIsEditMode, useDevice } from "@/providers/editor/editor-ui-context";

interface Props {
    element: EditorElement;
    layout?: "vertical" | "horizontal";
}

const SponsorNeonCardComponent = memo(({ element, layout = "vertical" }: Props) => {

    try {
        const { id, styles, content, type } = element;

        const isSelected = useIsElementSelected(id);
        const isEditMode = useIsEditMode();
        const device = useDevice();

        const { selectElement } = useElementActions();
        const [showSpacingGuides, setShowSpacingGuides] = useState(false);
        const { getBorderClasses, handleMouseEnter, handleMouseLeave } = useElementBorderHighlight(element);
        const { handleSelectElement } = useElementSelection(element);

        const sortableConfig = useMemo(() => {
            return {
                id: id,
                data: {
                    type,
                    name: "Sponsor Neon Card",
                    element,
                    elementId: id,
                    isSidebarElement: false,
                    isEditorElement: true,
                },
                disabled: !isEditMode,
            };
        }, [id, type, element, isEditMode]);

        const sortable = useSortable(sortableConfig);

        // 🚀 REACT 19: Memoized styles computation
        const computedStyles = useMemo(() => {
            return {
                ...getElementStyles(element, device),
                transform: CSS.Transform.toString(sortable.transform),
                transition: sortable.transition,
            };
        }, [element, device, sortable.transform, sortable.transition]) as any;

        // 🚀 REACT 19: Memoized style extraction
        const cardProps = useMemo(() => {
            const borderSize = computedStyles.borderSize || 2;
            const borderRadius = computedStyles.borderRadius;
            const neonColor = computedStyles.neonColor || "#ff00aa";
            const animationDelay = computedStyles.animationDelay || 0;
            const animationType = computedStyles.animationType || "blink";
            const href = computedStyles.href || "";

            let parsedBorderRadius = 12;
            if (typeof borderRadius === "string") {
                parsedBorderRadius = parseInt(borderRadius.replace("px", "")) || 12;
            } else if (typeof borderRadius === "number") {
                parsedBorderRadius = borderRadius;
            }

            return {
                borderSize,
                borderRadius: parsedBorderRadius,
                neonColor,
                animationDelay: animationDelay as number,
                animationType,
                href,
            };
        }, [computedStyles]);

        // 🚀 REACT 19: Memoized child items
        const childItems = useMemo(() => {
            return Array.isArray(content) ? content.map((child) => child.id) : [];
        }, [content]);

        // 🚀 REACT 19: Optimized click handler
        const handleClick = useCallback(
            (e: React.MouseEvent) => {
                console.log(`👆 Click handler for ${id}`);
                e.stopPropagation();
                if (isEditMode) {
                    selectElement(element);
                }
            },
            [isEditMode, selectElement, element]
        );

        // 🚀 REACT 19: Effect for spacing guides
        useEffect(() => {
            setShowSpacingGuides(isSelected && isEditMode);
        }, [isSelected, isEditMode]);


        // 🚀 REACT 19: Early return for dragging state
        if (sortable.isDragging) {
            return null;
        }

        // 🚀 REACT 19: Memoized container classes
        const containerClasses = useMemo(() => {
            return clsx("relative z-10", getBorderClasses(), {
                "cursor-grabbing": sortable.isDragging,
                "opacity-50": sortable.isDragging,
            });
        }, [getBorderClasses, sortable.isDragging]);

        // 🚀 REACT 19: Memoized child content
        const childContent = useMemo(() => {

            if (!Array.isArray(content) || content.length === 0) {
                return null;
            }

            return (
                content.map((childElement, index) => {
                    return <Recursive key={childElement.id} element={childElement} containerId={id} index={index} layout={layout} />;
                })
            );
        }, [content, childItems, id, layout]);


        return (
            <ElementContextMenu element={element}>
                <div
                    ref={sortable.setNodeRef}
                    style={computedStyles}
                    className={containerClasses}
                    onClick={handleSelectElement}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    data-element-id={id}
                    {...(isEditMode ? sortable.listeners : {})}
                    {...(isEditMode ? sortable.attributes : {})}
                >
                    {/* Spacing Visualizer */}
                    {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}

                    {/* Sponsor Neon Card UI */}
                    <SponsorNeonCard
                        borderSize={cardProps.borderSize}
                        borderRadius={cardProps.borderRadius}
                        neonColor={cardProps.neonColor}
                        animationDelay={cardProps.animationDelay}
                        animationType={cardProps.animationType}
                        href={cardProps.href}
                        className="w-full min-h-[100px]"
                    >
                        {childContent}
                    </SponsorNeonCard>

                    {/* Delete Button */}
                    {isSelected && isEditMode && <DeleteElementButton element={element} />}
                </div>
            </ElementContextMenu>
        );
    } catch (error) {
        console.error(`❌ ERROR in SponsorNeonCard for ${element.id}:`, error);
        throw error;
    }
});

SponsorNeonCardComponent.displayName = "OptimizedSponsorNeonCardComponent";

export default SponsorNeonCardComponent;
