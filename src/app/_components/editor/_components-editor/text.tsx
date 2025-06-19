import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

type Props = {
    element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content, type } = element;
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);

    // dnd-kit draggable
    const draggable = useDraggable({
        id: `draggable-${id}`,
        data: {
            type: type,
            elementId: id,
            name: "Text",
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

    useEffect(() => {
        if (spanRef.current && !Array.isArray(content)) {
            spanRef.current.innerText = content.innerText as string;
        }
    }, [content]);

    useEffect(() => {
        setShowSpacingGuides(
            state.editor.selectedElement.id === id && !state.editor.liveMode
        );
    }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

    return (
        <ElementContextMenu element={element}>
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

                <span 
                    ref={spanRef} 
                    suppressHydrationWarning={true} 
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

                <BadgeElementName element={element} />
                <DeleteElementButton element={element} />
            </div>
        </ElementContextMenu>
    );
};

export default TextComponent;