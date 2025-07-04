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
import { Play, Pause, Video as VideoIcon } from "lucide-react";
import { useElementSelection, useElementBorderHighlight } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, name, type, styles, content } = element;
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { handleSelectElement } = useElementSelection(element);
    const { getBorderClasses } = useElementBorderHighlight(element);
    
    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, state.editor.device);
    
    // Get computed content based on current device
    const computedContent = getElementContent(element, state.editor.device);

    // Extract video source from content
    const videoSrc = !Array.isArray(computedContent) ? computedContent.src || '' : '';

    // dnd-kit sortable
    const sortable = useSortable({
        id: id,
        data: {
            type: "video",
            elementId: id,
            name: "Video",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    useEffect(() => {
        setShowSpacingGuides(
            state.editor.selectedElement.id === id && !state.editor.liveMode
        );
    }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

    return (
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

            <iframe
                src={videoSrc}
                title="Video"
                className={clsx("w-full h-full border-0", {
                    "pointer-events-none": !state.editor.liveMode, // disabled edit mode
                })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />

            <DeleteElementButton element={element} />
        </div>
    );
};

export default VideoComponent;