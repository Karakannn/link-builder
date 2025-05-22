import { EditorBtns } from "@/lib/constants";
import { DeviceTypes, EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useEffect, useRef } from "react";

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

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation();
        console.log("=== TEXT ELEMENT DRAG START ===");
        console.log("Element being dragged - ID:", id);
        console.log("Element being dragged - Type:", type);
        
        if (!type) {
            console.log("Type is null, cannot set drag data");
            return;
        }
        
        // Create a custom drag image for just this element
        if (containerRef.current) {
            // Create a clone of the element for the drag image
            const rect = containerRef.current.getBoundingClientRect();
            const ghostElement = containerRef.current.cloneNode(true) as HTMLElement;
            
            // Style the ghost element
            ghostElement.style.width = `${rect.width}px`;
            ghostElement.style.height = `${rect.height}px`;
            ghostElement.style.transform = 'translateX(-999px)';
            ghostElement.style.position = 'absolute';
            ghostElement.style.top = '0';
            ghostElement.style.left = '0';
            ghostElement.style.zIndex = '-1';
            ghostElement.style.opacity = '0.8';
            ghostElement.style.pointerEvents = 'none';
            
            // Add it to the document temporarily
            document.body.appendChild(ghostElement);
            
            // Set as drag image
            e.dataTransfer.setDragImage(ghostElement, rect.width / 2, rect.height / 2);
            
            // Remove after a short delay
            setTimeout(() => {
                document.body.removeChild(ghostElement);
            }, 100);
        }
        
        // Store information about the element being dragged
        e.dataTransfer.setData("type", type);
        e.dataTransfer.setData("elementId", id);
        
        // Also store the whole element for reference
        try {
            const elementForTransfer = {
                id,
                type,
                name: "Text",
                // Don't include the full content/styles to avoid circular refs
            };
            e.dataTransfer.setData("elementDetails", JSON.stringify(elementForTransfer));
            console.log("Element details stored in dataTransfer:", elementForTransfer);
        } catch (error) {
            console.log("Error storing element details:", error);
        }
        
        // Set the drag effect to move to indicate this is a reordering operation
        e.dataTransfer.effectAllowed = "move";
    };
    
    const handleDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
            ref={containerRef}
            style={computedStyles}
            className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all", {
                "!border-blue-500": state.editor.selectedElement.id === id,
                "!border-solid": state.editor.selectedElement.id === id,
                "!border-dashed border border-slate-300": !state.editor.liveMode,
                "cursor-move": !state.editor.liveMode,
            })}
            onClick={handleOnClickBody}
            draggable={!state.editor.liveMode}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <span ref={spanRef} suppressHydrationWarning={true} contentEditable={!state.editor.liveMode} onBlur={handleBlurElement} />

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default TextComponent;
