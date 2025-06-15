import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useCallback } from "react";

export const useElementSelection = (element: EditorElement) => {
    const { state, dispatch } = useEditor();

    const handleSelectElement = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("clickeddd");

        if (!state.editor.liveMode/* TODO:  && !sortable.isDragging */) {
            dispatch({
                type: "CHANGE_CLICKED_ELEMENT",
                payload: {
                    elementDetails: element,
                },
            });
        }
    }, [element, dispatch]);

    return {
        handleSelectElement,
    };
};