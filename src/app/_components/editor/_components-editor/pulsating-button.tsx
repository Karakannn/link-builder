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
import { PulsatingButton } from "@/components/ui/pulsating-button";

type Props = {
    element: EditorElement;
};

const PulsatingButtonComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content, type } = element;
    const buttonRef = useRef<HTMLButtonElement | null>(null);
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
            name: "Pulsating Button",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const handleBlurElement = () => {
        if (buttonRef.current) {
            const currentContent = Array.isArray(content) ? {} : content;
            console.log("🔧 PulsatingButton - Blur Element - Current Content:", currentContent);
            
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...element,
                        content: {
                            ...currentContent,
                            innerText: buttonRef.current.innerText,
                            pulseColor: (currentContent as any).pulseColor || "#808080",
                            duration: (currentContent as any).duration || "1.5s",
                            href: (currentContent as any).href || "",
                        } as any,
                    },
                },
            });
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!state.editor.liveMode) {
            e.stopPropagation();
            handleSelectElement(e as any);
        } else {
            // Live mode'da link açma işlevi
            const contentData = Array.isArray(content) ? {} : content;
            const href = (contentData as any).href;
            if (href && !e.defaultPrevented) {
                e.preventDefault();
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        }
    };

    useEffect(() => {
        if (buttonRef.current && !Array.isArray(content)) {
            buttonRef.current.innerText = content.innerText as string;
        }
    }, [content]);

    useEffect(() => {
        setShowSpacingGuides(
            state.editor.selectedElement.id === id && !state.editor.liveMode
        );
    }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

    const contentData = Array.isArray(content) ? {} : content;
    const pulseColor = (contentData as any).pulseColor || "#808080";
    const duration = (contentData as any).duration || "1.5s";
    
    console.log("🔧 PulsatingButton - Render - Content Data:", contentData);
    console.log("🔧 PulsatingButton - Render - Pulse Color:", pulseColor);
    console.log("🔧 PulsatingButton - Render - Duration:", duration);

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

                <PulsatingButton
                    ref={buttonRef}
                    pulseColor={pulseColor}
                    duration={duration}
                    suppressHydrationWarning={true}
                    contentEditable={!state.editor.liveMode}
                    onBlur={handleBlurElement}
                    className={clsx({
                        "select-none": state.editor.selectedElement.id !== id,
                    })}
                    onClick={handleButtonClick}
                >
                    {!Array.isArray(content) ? content.innerText : "Click me"}
                </PulsatingButton>
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default PulsatingButtonComponent; 