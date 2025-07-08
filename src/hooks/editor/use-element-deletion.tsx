import { EditorElement } from "@/providers/editor/editor-provider";
import { useCallback } from "react";
import { useElementActions } from "../editor-actions/use-element-actions";

export const useElementDeletion = (element: EditorElement, canDelete: boolean = true) => {
    const { deleteElement } = useElementActions();

    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (canDelete) {
                deleteElement(element);
            }
        },
        [element, deleteElement, canDelete]
    );

    return {
        handleDelete,
        canDelete,
    };
};
