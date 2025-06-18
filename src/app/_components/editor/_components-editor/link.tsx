"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";

type Props = {
    element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const { dispatch, state } = useEditor();
    const { id, styles, content } = element;
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);
    
    // Get computed content based on current device
    const computedContent = getElementContent(element, state.editor.device);

    // dnd-kit draggable
    const draggable = useDraggable({
        id: `draggable-${id}`,
        data: {
            type: "link",
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
        if (spanRef.current) {
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...element,
                        content: {
                            innerText: spanRef.current.innerText,
                        },
                    },
                },
            });
        }
    };

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    useEffect(() => {
        if (spanRef.current && !Array.isArray(computedContent)) {
            spanRef.current.innerText = computedContent.innerText as string;
        }
    }, [computedContent]);

    useEffect(() => {
        setShowSpacingGuides(
            state.editor.selectedElement.id === id && !state.editor.liveMode
        );
    }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

    return (
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

            {state.editor.selectedElement.id === id && !state.editor.liveMode && <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">{state.editor.selectedElement.name}</Badge>}

            {!Array.isArray(computedContent) && (state.editor.previewMode || state.editor.liveMode) && (
                <Link href={computedContent.href || "#"} className={clsx({
                    "pointer-events-none": !state.editor.liveMode && !state.editor.previewMode, // Edit mode'da link tıklanabilir olmasın
                })}>
                    {computedContent.innerText}
                </Link>
            )}

            {!state.editor.previewMode && !state.editor.liveMode && (
                <span 
                    ref={spanRef} 
                    contentEditable={!state.editor.liveMode} 
                    onBlur={handleBlurElement}
                    className={clsx({
                        "select-none": state.editor.selectedElement.id !== id, // Seçili değilse text seçimi kapalı
                    })}
                    onClick={(e) => {
                        // Span içindeki tıklamayı da parent'a ilet
                        if (!state.editor.liveMode) {
                            e.stopPropagation();
                            handleOnClickBody(e as any);
                        }
                    }}
                />
            )}

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default LinkComponent;