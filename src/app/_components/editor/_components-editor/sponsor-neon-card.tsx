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
import { useElementBorderHighlight } from "@/hooks/editor/use-element-selection";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useIsEditMode, useDevice } from "@/providers/editor/editor-ui-context";

interface Props {
    element: EditorElement;
    layout?: "vertical" | "horizontal";
}

// 🚀 REACT 19: Memoized SponsorNeonCard Component
const SponsorNeonCardComponent = memo(({ element, layout = "vertical" }: Props) => {
    console.log(`🌟 SponsorNeonCard render START: ${element.id}`);

    try {
        const { id, styles, content, type } = element;
        console.log(`✅ Element destructured: ${id}`);

        // 🚀 REACT 19: Granular subscriptions
        console.log(`🔍 Getting hooks for: ${id}`);

        const isSelected = useIsElementSelected(id);
        console.log(`✅ Hook 1 (useIsElementSelected): ${isSelected} for ${id}`);

        const isEditMode = useIsEditMode();
        console.log(`✅ Hook 2 (useIsEditMode): ${isEditMode} for ${id}`);

        const device = useDevice();
        console.log(`✅ Hook 3 (useDevice): ${device} for ${id}`);

        const { selectElement } = useElementActions();
        console.log(`✅ Hook 4 (useElementActions) for ${id}`);

        // Local state
        const [showSpacingGuides, setShowSpacingGuides] = useState(false);
        console.log(`✅ Hook 5 (useState) for ${id}`);

        // 🚀 REACT 19: Memoized border highlight hook
        const { getBorderClasses, handleMouseEnter, handleMouseLeave } = useElementBorderHighlight(element);
        console.log(`✅ Hook 6 (useElementBorderHighlight) for ${id}`);

        // 🚀 REACT 19: Memoized sortable configuration
        const sortableConfig = useMemo(() => {
            console.log(`🔧 Computing sortableConfig for ${id}`);
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
        console.log(`✅ Hook 7 (useSortable) for ${id}`);

        // 🚀 REACT 19: Memoized styles computation
        const computedStyles = useMemo(() => {
            console.log(`🎨 Computing styles for ${id}`);
            return {
                ...getElementStyles(element, device),
                transform: CSS.Transform.toString(sortable.transform),
                transition: sortable.transition,
            };
        }, [element, device, sortable.transform, sortable.transition]) as any;

        // 🚀 REACT 19: Memoized style extraction
        const cardProps = useMemo(() => {
            console.log(`🃏 Computing cardProps for ${id}`);
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
            console.log(`👶 Computing childItems for ${id}`);
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
            console.log(`📏 Setting spacing guides for ${id}: ${isSelected && isEditMode}`);
            setShowSpacingGuides(isSelected && isEditMode);
        }, [isSelected, isEditMode]);

        console.log(`🔍 Checking dragging state for ${id}: ${sortable.isDragging}`);

        // 🚀 REACT 19: Early return for dragging state
        if (sortable.isDragging) {
            console.log(`🏃 Early return - dragging for ${id}`);
            return null;
        }

        // 🚀 REACT 19: Memoized container classes
        const containerClasses = useMemo(() => {
            console.log(`🎭 Computing container classes for ${id}`);
            return clsx("relative z-10", getBorderClasses(), {
                "cursor-grabbing": sortable.isDragging,
                "opacity-50": sortable.isDragging,
            });
        }, [getBorderClasses, sortable.isDragging]);

        // 🚀 REACT 19: Memoized child content
        const childContent = useMemo(() => {
            console.log(`👨‍👩‍👧‍👦 Computing child content for ${id}, content length: ${Array.isArray(content) ? content.length : "not array"}`);

            if (!Array.isArray(content) || content.length === 0) {
                console.log(`❌ No child content for ${id}`);
                return null;
            }

            console.log(`✅ Rendering ${content.length} children for ${id}`);
            return (
                <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
                    {content.map((childElement, index) => {
                        console.log(`🔄 Rendering child ${index}: ${childElement.type} - ${childElement.id}`);
                        return <Recursive key={childElement.id} element={childElement} containerId={id} index={index} layout={layout} />;
                    })}
                </SortableContext>
            );
        }, [content, childItems, id, layout]);

        console.log(`✅ SponsorNeonCard render SUCCESS: ${id}`);

        return (
            <ElementContextMenu element={element}>
                <div
                    ref={sortable.setNodeRef}
                    style={computedStyles}
                    className={containerClasses}
                    onClick={handleClick}
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
