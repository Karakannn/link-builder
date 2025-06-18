import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Recursive from "./recursive";
import { getElementStyles } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";
import { Badge } from "@/components/ui/badge";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type Props = { element: EditorElement };

export const BodyContainer = ({ element }: Props) => {
    const { id, name, type, styles, content } = element;
    const { dispatch, state } = useEditor();


    const droppable = useDroppable({
        id: `droppable-${id}`,
        data: {
            type: "__body",
            containerId: id,
        },
    });


    const computedStyles = {
        ...getElementStyles(element, state.editor.device),
    };

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!state.editor.liveMode) {
            console.log("Selecting body:", id);
            dispatch({
                type: "CHANGE_CLICKED_ELEMENT",
                payload: {
                    elementDetails: element,
                },
            });
        }
    };

    const childItems = Array.isArray(content) ? content.map(child => child.id) : [];

    return (
        <ElementContextMenu element={element}>
            <div
                ref={droppable.setNodeRef}
                data-body-container="true"
                data-element-id={id}
                style={computedStyles}
                className={clsx("relative p-6", {
                    "max-w-full w-full": true,
                    "h-full": true,
                    "overflow-y-auto": true,
                    "!border-yellow-400 !border-4": state.editor.selectedElement.id === id && !state.editor.liveMode,
                    "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
                    "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
                    "!border-green-500 !border-2 !bg-green-50/50": droppable.isOver && !state.editor.liveMode,
                })}
                onClick={handleOnClickBody}
            >
                <Badge
                    className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {
                        block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
                    })}
                >
                    {element.name}
                </Badge>

                {droppable.isOver && !state.editor.liveMode && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">Drop Here</span>
                    </div>
                )}

                {Array.isArray(content) && content.length > 0 && (
                    <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
                        {content.map((childElement) => (
                            <Recursive key={childElement.id} element={childElement} />
                        ))}
                    </SortableContext>
                )}

                {Array.isArray(content) && content.length === 0 && (
                    <div className="min-h-[50px] text-gray-400 text-center py-4">
                        Page Body - Drop elements here
                    </div>
                )}

            </div>
        </ElementContextMenu>
    );
};