"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";

type Props = {
    element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content, type } = element;
    const linkRef = useRef<HTMLAnchorElement | null>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);

    // dnd-kit draggable
    const draggable = useDraggable({
        id: `draggable-${id}`,
        data: {
            type: type,
            elementId: id,
            name: "Link",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

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
                ref={draggable.setNodeRef}
                style={computedStyles}
                className={clsx("relative transition-all", {
                    "!border-blue-500": state.editor.selectedElement.id === id,
                    "!border-solid": state.editor.selectedElement.id === id,
                    "!border-dashed border border-slate-300": !state.editor.liveMode,
                    "cursor-grab": !state.editor.liveMode,
                    "cursor-grabbing": draggable.isDragging,
                    "opacity-50": draggable.isDragging,
                })}
                onClick={handleOnClickBody}
                // Sadece edit mode'da drag listeners ekle
                {...(!state.editor.liveMode ? draggable.listeners : {})}
                {...(!state.editor.liveMode ? draggable.attributes : {})}
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
                        "select-none": state.editor.selectedElement.id !== id, // Seçili değilse text seçimi kapalı
                    })}
                    onClick={(e) => {
                        // Link içindeki tıklamayı da parent'a ilet
                        if (!state.editor.liveMode) {
                            e.stopPropagation();
                            handleOnClickBody(e as any);
                        }
                    }}
                />

                <BadgeElementName element={element} />
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default LinkComponent;