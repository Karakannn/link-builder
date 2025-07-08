// src/app/_components/editor/_components-editor/text.tsx
// ⚡ OPTIMIZED VERSION - Replace existing text.tsx with this

import React, { memo, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

// 🚀 REACT 19: Import optimized context hooks

import type { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles, getElementContent } from "@/lib/utils";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useIsEditMode, useDevice } from "@/providers/editor/editor-ui-context";

type Props = {
    element: EditorElement;
};

// 🚀 REACT 19: Memoized Text Component
const TextComponent = memo(({ element }: Props) => {
    console.log(`📝 TextComponent render START: ${element.id}`);

    try {
        const { id, styles, content, type } = element;
        console.log(`✅ Text element destructured: ${id}`);

        // 🚀 REACT 19: Granular subscriptions
        console.log(`🔍 Getting hooks for TextComponent: ${id}`);

        const isSelected = useIsElementSelected(id);
        console.log(`✅ Hook 1 (useIsElementSelected): ${isSelected} for ${id}`);

        const isEditMode = useIsEditMode();
        console.log(`✅ Hook 2 (useIsEditMode): ${isEditMode} for ${id}`);

        const device = useDevice();
        console.log(`✅ Hook 3 (useDevice): ${device} for ${id}`);

        const { updateElement, selectElement } = useElementActions();
        console.log(`✅ Hook 4 (useElementActions) for ${id}`);

        // Local state and refs
        const spanRef = useRef<HTMLSpanElement | null>(null);
        console.log(`✅ Hook 5 (useRef) for ${id}`);

        const containerRef = useRef<HTMLDivElement>(null);
        console.log(`✅ Hook 6 (useRef) for ${id}`);

        const [showSpacingGuides, setShowSpacingGuides] = useState(false);
        console.log(`✅ Hook 7 (useState) for ${id}`);

        // 🚀 REACT 19: Memoized sortable configuration
        const sortableConfig = useMemo(() => {
            console.log(`🔧 Computing sortable config for TextComponent ${id}`);
            return {
                id: id,
                data: {
                    type: type,
                    elementId: id,
                    name: "Text",
                    isSidebarElement: false,
                    isEditorElement: true,
                },
                disabled: !isEditMode,
            };
        }, [id, type, isEditMode]);

        // dnd-kit sortable
        const sortable = useSortable(sortableConfig);
        console.log(`✅ Hook 8 (useSortable) for ${id}`);

        // 🚀 REACT 19: Memoized content computation
        const computedContent = useMemo(() => {
            console.log(`📄 Computing content for TextComponent ${id}`);
            return getElementContent(element, device);
        }, [element, device]);

        // 🚀 REACT 19: Memoized styles computation
        const computedStyles = useMemo(() => {
            console.log(`🎨 Computing styles for TextComponent ${id}`);
            return {
                ...getElementStyles(element, device),
                transform: CSS.Transform.toString(sortable.transform),
                transition: sortable.transition,
            };
        }, [element, device, sortable.transform, sortable.transition]);

        // 🚀 REACT 19: Optimized blur handler
        const handleBlurElement = useCallback(() => {
            console.log(`📝 Blur handler for TextComponent ${id}`);
            if (spanRef.current && isEditMode) {
                updateElement({
                    ...element,
                    content: {
                        ...computedContent,
                        innerText: spanRef.current.innerText,
                    },
                });
            }
        }, [updateElement, element, computedContent, isEditMode]);

        // 🚀 REACT 19: Optimized click handler
        const handleSelectElement = useCallback(
            (e: React.MouseEvent) => {
                console.log(`👆 Click handler for TextComponent ${id}`);
                e.stopPropagation();
                if (isEditMode) {
                    selectElement(element);
                }
            },
            [isEditMode, selectElement, element]
        );

        // 🚀 REACT 19: Effect for content synchronization
        useEffect(() => {
            console.log(`🔄 Syncing content for TextComponent ${id}`);
            if (spanRef.current && !Array.isArray(computedContent)) {
                spanRef.current.innerText = computedContent.innerText as string;
            }
        }, [computedContent, id]);

        // 🚀 REACT 19: Effect for spacing guides
        useEffect(() => {
            console.log(`📏 Setting spacing guides for TextComponent ${id}: ${isSelected && isEditMode}`);
            setShowSpacingGuides(isSelected && isEditMode);
        }, [isSelected, isEditMode]);

        // Extract text properties from content
        const textProps = !Array.isArray(computedContent) ? computedContent : {};
        const innerText = textProps.innerText || "Sponsor Title";

        console.log(`✅ TextComponent render SUCCESS: ${id}`);

        return (
            <EditorElementWrapper element={element}>
                <div
                    ref={sortable.setNodeRef}
                    style={computedStyles}
                    className={clsx("relative", {
                        "cursor-grabbing": sortable.isDragging,
                        "opacity-50": sortable.isDragging,
                        "outline-dashed outline-2 outline-blue-500": isSelected && isEditMode,
                    })}
                    onClick={handleSelectElement}
                    data-element-id={id}
                    {...(isEditMode ? sortable.listeners : {})}
                    {...(isEditMode ? sortable.attributes : {})}
                >
                    {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}

                    <span
                        ref={spanRef}
                        suppressHydrationWarning={true}
                        contentEditable={isEditMode && isSelected}
                        onBlur={handleBlurElement}
                        className={clsx("title", {
                            "select-none": !isSelected,
                        })}
                        onClick={handleSelectElement}
                    />

                    {/* Delete button */}
                    {isSelected && isEditMode && <DeleteElementButton element={element} />}
                </div>
            </EditorElementWrapper>
        );
    } catch (error) {
        console.error(`❌ ERROR in TextComponent for ${element.id}:`, error);
        throw error;
    }
});

TextComponent.displayName = "OptimizedTextComponent";

export default TextComponent;
