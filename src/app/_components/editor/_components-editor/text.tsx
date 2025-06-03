import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
    element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content, type } = element;
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
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

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    useEffect(() => {
        if (spanRef.current && !Array.isArray(content)) {
            spanRef.current.innerText = content.innerText as string;
        }
    }, [content]);

    return (
        <div
            ref={draggable.setNodeRef}
            style={computedStyles}
            className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all", {
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

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default TextComponent;