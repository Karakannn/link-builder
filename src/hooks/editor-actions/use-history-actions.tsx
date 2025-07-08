import { useEditorActions } from "@/providers/editor/editör-actions-provider";
import { useMemo, useCallback } from "react";

export const useHistoryActions = () => {
    const { dispatch } = useEditorActions();

    const undo = useCallback(() => {
        dispatch({ type: "UNDO" });
    }, [dispatch]);

    const redo = useCallback(() => {
        dispatch({ type: "REDO" });
    }, [dispatch]);

    return useMemo(
        () => ({
            undo,
            redo,
        }),
        [undo, redo]
    );
};
