"use client";
import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash, Play, Pause } from "lucide-react";
import React, { useState, useRef } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

type Props = {
    element: EditorElement;
};

const GifComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, name, type, styles, content } = element;
    const [isPlaying, setIsPlaying] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);
    
    // Get computed content based on current device
    const computedContent = getElementContent(element, state.editor.device);

    // dnd-kit draggable
    const draggable = useDraggable({
        id: `draggable-${id}`,
        data: {
            type: "gif",
            elementId: id,
            name: "GIF",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const handleOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("GIF clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
        if (!state.editor.liveMode && !draggable.isDragging) {
            console.log("Selecting GIF:", id);
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

    const toggleGif = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (imgRef.current) {
            const gif = imgRef.current;
            if (isPlaying) {
                // Pause GIF by setting to a static frame (first frame)
                const staticSrc = gif.src.split('?')[0] + '?t=' + Date.now();
                gif.src = staticSrc;
                setIsPlaying(false);
            } else {
                // Resume GIF by reloading
                const originalSrc = (!Array.isArray(computedContent) ? computedContent.src : '') || '';
                gif.src = originalSrc + '?t=' + Date.now();
                setIsPlaying(true);
            }
        }
    };

    const gifProps = !Array.isArray(computedContent) ? computedContent : {};
    const src = gifProps.src || '';
    const alt = gifProps.alt || 'GIF';
    const autoplay = gifProps.autoplay !== false; // Default true
    const loop = gifProps.loop !== false; // Default true
    const controls = gifProps.controls || false;

    return (
        <div
            ref={draggable.setNodeRef}
            style={computedStyles}
            className={clsx("relative text-[16px] transition-all group", {
                "!border-blue-500": state.editor.selectedElement.id === id,
                "!border-solid": state.editor.selectedElement.id === id,
                "!border-dashed border border-slate-300": !state.editor.liveMode,
                "cursor-grab": !state.editor.liveMode,
                "cursor-grabbing": draggable.isDragging,
                "opacity-50": draggable.isDragging,
            })}
            onClick={handleOnClick}
            {...(!state.editor.liveMode ? draggable.listeners : {})}
            {...(!state.editor.liveMode ? draggable.attributes : {})}
        >
            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
                    {state.editor.selectedElement.name}
                </Badge>
            )}

            <div className="relative inline-block">
                {src ? (
                    <img 
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className={clsx("max-w-full h-auto rounded", {
                            "pointer-events-none": !state.editor.liveMode && !state.editor.previewMode,
                        })}
                        style={{
                            width: computedStyles.width || 'auto',
                            height: computedStyles.height || 'auto',
                            maxWidth: '100%',
                        }}
                        onLoad={() => {
                            if (!autoplay && imgRef.current) {
                                // If autoplay is false, pause immediately
                                setIsPlaying(false);
                            }
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px]">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">🎬</div>
                            <div>No GIF source</div>
                            <div className="text-sm">Add a GIF URL in settings</div>
                        </div>
                    </div>
                )}

                {/* Play/Pause controls for edit mode */}
                {controls && src && !state.editor.liveMode && (
                    <button
                        onClick={toggleGif}
                        className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        title={isPlaying ? "Pause GIF" : "Play GIF"}
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                )}

                {/* GIF indicator */}
                {src && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                        GIF
                    </div>
                )}
            </div>

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default GifComponent;