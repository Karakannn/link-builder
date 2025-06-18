"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";

type Props = {
    element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, name, type, styles, content } = element;
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    
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

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Video clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
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

    // Extract video specific props from content with defaults
    const videoProps = !Array.isArray(computedContent) ? computedContent : {};
    const videoSrc = videoProps.src || "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1";

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
            {...(!state.editor.liveMode ? draggable.listeners : {})}
            {...(!state.editor.liveMode ? draggable.attributes : {})}
        >
            {showSpacingGuides && (
                <SpacingVisualizer styles={computedStyles} />
            )}

            <iframe
                src={videoSrc}
                title="Video"
                className={clsx("w-full h-full border-0", {
                    "pointer-events-none": !state.editor.liveMode, // disabled edit mode
                })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default VideoComponent;