"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

type Props = {
    element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
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
        if (!state.editor.liveMode && !draggable.isDragging) {
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
                },
            });
        }
    };

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
            {...(!state.editor.liveMode ? draggable.listeners : {})}
            {...(!state.editor.liveMode ? draggable.attributes : {})}
        >
            {showSpacingGuides && (
                <SpacingVisualizer styles={computedStyles} />
            )}

            {!Array.isArray(computedContent) && (state.editor.previewMode || state.editor.liveMode) && (
                    <a
                        href={computedContent.href || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={clsx("block w-full h-full", {
                            "pointer-events-none": !state.editor.liveMode,
                        })}
                    >
                        <div className="w-full h-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors">
                            {computedContent.innerText || "Link"}
                        </div>
                    </a>
                )}

                {!Array.isArray(computedContent) && !state.editor.previewMode && !state.editor.liveMode && (
                    <div className="w-full h-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors cursor-pointer">
                        {computedContent.innerText || "Link"}
                </div>
            )}

                <BadgeElementName element={element} />
                <DeleteElementButton element={element} />
        </div>
        </ElementContextMenu>
    );
};

export default LinkComponent;