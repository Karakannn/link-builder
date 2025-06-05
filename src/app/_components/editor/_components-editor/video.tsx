"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

type Props = {
    element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, name, type, styles, content } = element;
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);
    
    // Get computed content based on current device
    const computedContent = getElementContent(element, state.editor.device);

    // dnd-kit draggable
    const draggable = useDraggable({
        id: `draggable-${id}`,
        data: {
            type: "video",
            elementId: id,
            name: "Video",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const handleOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Video clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
        // Sadece edit mode'da ve drag değilken çalışsın
        if (!state.editor.liveMode && !draggable.isDragging) {
            console.log("Selecting video:", id);
            dispatch({
                type: "CHANGE_CLICKED_ELEMENT",
                payload: {
                    elementDetails: element,
                },
            });
        }
    };

    const handleDeleteElement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    return (
        <div
            ref={draggable.setNodeRef}
            style={computedStyles}
            className={clsx("p-[2px] w-full relative text-[16px] transition-all", {
                "!border-blue-500": state.editor.selectedElement.id === id,
                "!border-solid": state.editor.selectedElement.id === id,
                "!border-dashed border border-slate-300": !state.editor.liveMode,
                "cursor-grab": !state.editor.liveMode,
                "cursor-grabbing": draggable.isDragging,
                "opacity-50": draggable.isDragging,
            })}
            onClick={handleOnClick}
            // Sadece edit mode'da drag listeners ekle
            {...(!state.editor.liveMode ? draggable.listeners : {})}
            {...(!state.editor.liveMode ? draggable.attributes : {})}
        >
            {state.editor.selectedElement.id === id && !state.editor.liveMode && <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">{state.editor.selectedElement.name}</Badge>}

            {!Array.isArray(computedContent) && (
                <iframe 
                    width={computedStyles.width || "560"} 
                    height={computedStyles.height || "315"} 
                    src={computedContent.src} 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    className={clsx({
                        "pointer-events-none": !state.editor.liveMode && !state.editor.previewMode, // Edit mode'da iframe tıklanabilir olmasın
                    })}
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

export default VideoComponent;