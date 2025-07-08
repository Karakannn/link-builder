import { useEditorActions } from "@/providers/editor/editör-actions-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useMemo, useCallback } from "react";

export const useDataActions = () => {
    const { dispatch } = useEditorActions();

    const loadData = useCallback(
        (elements: EditorElement[], withLive: boolean = false) => {
            dispatch({
                type: "LOAD_DATA",
                payload: { elements, withLive },
            });
        },
        [dispatch]
    );

    const setPageId = useCallback(
        (pageId: string) => {
            dispatch({
                type: "SET_PAGE_ID",
                payload: { pageId },
            });
        },
        [dispatch]
    );

    return useMemo(
        () => ({
            loadData,
            setPageId,
        }),
        [loadData, setPageId]
    );
};
