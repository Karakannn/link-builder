"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useDevice, useLiveMode } from "@/providers/editor/editor-ui-context";

type Props = {
    element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
    const { id, styles, content, type } = element;
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { selectElement, updateElement } = useElementActions();
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const isElementSelected = useIsElementSelected(id);
    const device = useDevice();
    const liveMode = useLiveMode();
   
    const computedStyles = getElementStyles(element, device);

    // dnd-kit sortable
    const sortable = useSortable({
        id: id,
        data: {
            type: type,
            elementId: id,
            name: "Link",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: liveMode,
    });

    const handleBlurElement = () => {
        if (linkRef.current) {
            updateElement({
                ...element,
                content: {
                    innerText: linkRef.current.innerText,
                    href: linkRef.current.href,
                },
            });
        }
    };

    useEffect(() => {
        if (linkRef.current && !Array.isArray(content)) {
            linkRef.current.innerText = content.innerText as string;
            linkRef.current.href = content.href as string;
        }
    }, [content]);

    useEffect(() => {
        setShowSpacingGuides(isElementSelected && !liveMode);
    }, [isElementSelected, id, liveMode]);

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={{
                    ...computedStyles,
                    transform: CSS.Transform.toString(sortable.transform),
                    transition: sortable.transition,
                }}
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

                <a
                    ref={linkRef}
                    suppressHydrationWarning={true}
                    contentEditable={!liveMode}
                    onBlur={handleBlurElement}
                    className={clsx({
                        "select-none": !isElementSelected,
                    })}
                    onClick={(e) => {
                        if (!liveMode) {
                            e.stopPropagation();
                            selectElement(element);
                        }
                    }}
                />
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default LinkComponent;
