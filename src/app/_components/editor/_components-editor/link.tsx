"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementSelection, useElementBorderHighlight } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content, type } = element;
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { handleSelectElement } = useElementSelection(element);
    const { getBorderClasses } = useElementBorderHighlight(element);
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);

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
        disabled: state.editor.liveMode,
    });

    const handleBlurElement = () => {
        if (linkRef.current) {
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...element,
                        content: {
                            innerText: linkRef.current.innerText,
                            href: linkRef.current.href,
                        },
                    },
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
        setShowSpacingGuides(
            state.editor.selectedElement.id === id && !state.editor.liveMode
        );
    }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

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
                onClick={handleSelectElement}
                data-element-id={id}
                {...(!state.editor.liveMode ? sortable.listeners : {})}
                {...(!state.editor.liveMode ? sortable.attributes : {})}
            >
                {showSpacingGuides && (
                    <SpacingVisualizer styles={computedStyles} />
                )}

                <a 
                    ref={linkRef} 
                    suppressHydrationWarning={true} 
                    contentEditable={!state.editor.liveMode} 
                    onBlur={handleBlurElement}
                    className={clsx({
                        "select-none": state.editor.selectedElement.id !== id,
                    })}
                    onClick={(e) => {
                        if (!state.editor.liveMode) {
                            e.stopPropagation();
                            handleSelectElement(e as any);
                        }
                    }}
                />
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default LinkComponent;