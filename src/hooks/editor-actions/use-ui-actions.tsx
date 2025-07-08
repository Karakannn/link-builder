import { useEditorActions } from "@/providers/editor/editör-actions-provider";
import { DeviceTypes } from "@/providers/editor/editor-provider";
import { useMemo, useCallback } from "react";

export const useUIActions = () => {
    const { dispatch } = useEditorActions();

    const changeDevice = useCallback(
        (device: DeviceTypes) => {
            dispatch({
                type: "CHANGE_DEVICE",
                payload: { device },
            });
        },
        [dispatch]
    );

    const togglePreviewMode = useCallback(() => {
        dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    }, [dispatch]);

    const toggleLiveMode = useCallback(
        (value?: boolean) => {
            dispatch({
                type: "TOGGLE_LIVE_MODE",
                payload: value !== undefined ? { value } : undefined,
            });
        },
        [dispatch]
    );

    const toggleLayerSidebar = useCallback(() => {
        dispatch({ type: "TOGGLE_LAYER_SIDEBAR" });
    }, [dispatch]);

    return useMemo(
        () => ({
            changeDevice,
            togglePreviewMode,
            toggleLiveMode,
            toggleLayerSidebar,
        }),
        [changeDevice, togglePreviewMode, toggleLiveMode, toggleLayerSidebar]
    );
};
