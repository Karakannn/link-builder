import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useCallback } from "react";

export const useElementDeletion = (element: EditorElement, canDelete: boolean = true) => {
    const { dispatch } = useEditor();

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (canDelete) {
            dispatch({
                type: "DELETE_ELEMENT",
                payload: {
                    elementDetails: element,
                },
            });
        }
    }, [element, dispatch, canDelete]);

    return {
        handleDelete,
        canDelete,
    };
};