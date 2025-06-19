"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { Play, Pause } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

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
                onClick={handleOnClick}
                {...(!state.editor.liveMode ? draggable.listeners : {})}
                {...(!state.editor.liveMode ? draggable.attributes : {})}
            >
                {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                    <BadgeElementName element={element} />
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
                                animationPlayState: isPlaying ? "running" : "paused",
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
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                            <button
                                onClick={toggleGif}
                                className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                        </div>
                    )}

                    {/* GIF indicator */}
                    {src && (
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                            GIF
                        </div>
                    )}
                </div>

                {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                    <DeleteElementButton element={element} />
                )}
            </div>
        </ElementContextMenu>
    );
};

export default GifComponent;