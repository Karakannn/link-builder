import { useEditorActions } from "@/providers/editor/editör-actions-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useMemo, useCallback } from "react";

export const useElementActions = () => {
    const { dispatch } = useEditorActions();

    const addElement = useCallback(
        (containerId: string, elementDetails: EditorElement) => {
            dispatch({
                type: "ADD_ELEMENT",
                payload: { containerId, elementDetails },
            });
        },
        [dispatch]
    );

    const updateElement = useCallback(
        (elementDetails: EditorElement) => {
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: { elementDetails },
            });
        },
        [dispatch]
    );

    const deleteElement = useCallback(
        (elementDetails: EditorElement) => {
            dispatch({
                type: "DELETE_ELEMENT",
                payload: { elementDetails },
            });
        },
        [dispatch]
    );

    const moveElement = useCallback(
        (elementId: string, targetContainerId: string) => {
            dispatch({
                type: "MOVE_ELEMENT",
                payload: { elementId, targetContainerId },
            });
        },
        [dispatch]
    );

    const insertElement = useCallback(
        (containerId: string, insertIndex: number, elementDetails: EditorElement) => {
            dispatch({
                type: "INSERT_ELEMENT",
                payload: { containerId, insertIndex, elementDetails },
            });
        },
        [dispatch]
    );

    const reorderElement = useCallback(
        (elementId: string, containerId: string, insertIndex: number) => {
            dispatch({
                type: "REORDER_ELEMENT",
                payload: { elementId, containerId, insertIndex },
            });
        },
        [dispatch]
    );

    const reorderLayers = useCallback(
        (activeId: string, overId: string) => {
            dispatch({
                type: "REORDER_LAYERS",
                payload: { activeId, overId },
            });
        },
        [dispatch]
    );

    const selectElement = useCallback(
        (elementDetails?: EditorElement) => {
            dispatch({
                type: "CHANGE_CLICKED_ELEMENT",
                payload: { elementDetails },
            });
        },
        [dispatch]
    );

    return useMemo(
        () => ({
            addElement,
            updateElement,
            deleteElement,
            moveElement,
            insertElement,
            reorderElement,
            reorderLayers,
            selectElement,
        }),
        [addElement, updateElement, deleteElement, moveElement, insertElement, reorderElement, reorderLayers, selectElement]
    );
};
