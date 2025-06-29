import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content, type } = element;
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { handleSelectElement } = useElementSelection(element);
    
    // dnd-kit sortable
    const sortable = useSortable({
        id: id,
        data: {
            type: type,
            elementId: id,
            name: "Text",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    // Get computed styles based on current device
    const computedStyles = {
        ...getElementStyles(element, state.editor.device),
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
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

    useEffect(() => {
        if (spanRef.current && !Array.isArray(content)) {
            spanRef.current.innerText = content.innerText as string;
        }
    }, [content]);

    useEffect(() => {
        setShowSpacingGuides(
            state.editor.selectedElement.id === id && !state.editor.liveMode
        );
    }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={computedStyles}
                className={clsx("relative transition-all", {
                    "!border-blue-500": state.editor.selectedElement.id === id,
                    "!border-solid": state.editor.selectedElement.id === id,
                    "!border-dashed border border-slate-300": !state.editor.liveMode,
                    "cursor-grab": !state.editor.liveMode,
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

                <span 
                    ref={spanRef} 
                    suppressHydrationWarning={true} 
                    contentEditable={!state.editor.liveMode} 
                    onBlur={handleBlurElement}
                    className={clsx({
                        "select-none": state.editor.selectedElement.id !== id,
                    })}
                    onClick={(e) => {
                        if (!state.editor.liveMode) {
                            e.stopPropagation();
                            handleSelectElement(e as any);
                        }
                    }}
                />
                <BadgeElementName element={element} />
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default TextComponent;