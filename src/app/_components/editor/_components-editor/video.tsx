"use client";
import { EditorElement } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useDevice, useLiveMode } from "@/providers/editor/editor-ui-context";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
    const { id, name, type, styles, content } = element;
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { handleSelectElement } = useElementSelection(element);
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const isElementSelected = useIsElementSelected(id);
    const device = useDevice();
    const liveMode = useLiveMode();

    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, device);

    // Get computed content based on current device
    const computedContent = getElementContent(element, device);

    // Extract video source from content
    const videoSrc = !Array.isArray(computedContent) ? computedContent.src || "" : "";

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
        disabled: liveMode,
    });

    useEffect(() => {
        setShowSpacingGuides(isElementSelected && !liveMode);
    }, [isElementSelected, id, liveMode]);

    return (
        <div
            ref={sortable.setNodeRef}
            style={sortable.transform ? { transform: CSS.Transform.toString(sortable.transform) } : undefined}
            className={clsx("relative group", getBorderClasses(), sortable.isDragging && "opacity-50")}
            onClick={handleSelectElement}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-element-id={id}
        >
            {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}

            <iframe
                src={videoSrc}
                title="Video"
                className={clsx("w-full h-full border-0", {
                    "pointer-events-none": !liveMode, // disabled edit mode
                })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />

            <DeleteElementButton element={element} />
        </div>
    );
};

export default VideoComponent;
