import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementStyles, getElementContent } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { useDevice, useLiveMode } from "@/providers/editor/editor-ui-context";

type Props = {
    element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
    const { id, styles, content, type } = element;
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { selectElement, updateElement } = useElementActions();
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const device = useDevice();
    const liveMode = useLiveMode();
    // Get computed content based on current device
    const computedContent = getElementContent(element, device);

    // dnd-kit sortable
    const sortable = useSortable({
        id: id,
        data: {
            type: type,
            elementId: id,
            name: "Text",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: liveMode,
    });

    // Get computed styles based on current device
    const computedStyles = {
        ...getElementStyles(element, device),
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
    };

    const handleBlurElement = () => {
        if (spanRef.current) {
            updateElement({
                ...element,
                content: {
                    ...computedContent,
                    innerText: spanRef.current.innerText,
                },
            });
        }
    };

    useEffect(() => {
        if (spanRef.current && !Array.isArray(computedContent)) {
            spanRef.current.innerText = computedContent.innerText as string;
        }
    }, [computedContent]);

    useEffect(() => {
        setShowSpacingGuides(isSelected && !liveMode);
    }, [isSelected, liveMode]);

    // Extract text properties from content
    const textProps = !Array.isArray(computedContent) ? computedContent : {};
    const innerText = textProps.innerText || "Sponsor Title";

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={computedStyles}
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
                {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}

                <span
                    ref={spanRef}
                    suppressHydrationWarning={true}
                    contentEditable={!liveMode}
                    onBlur={handleBlurElement}
                    className={clsx("title", {
                        "select-none": !isSelected,
                    })}
                    onClick={(e) => {
                        if (!liveMode) {
                            e.stopPropagation();
                            selectElement(element);
                        }
                    }}
                />

                {/* Badge ve Delete button artık kendi görünürlük logic'ini kullanıyor */}
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default TextComponent;
