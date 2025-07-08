"use client";
import { Button } from "@/components/ui/button";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./_components-editor/recursive";
import { useDataActions } from "@/hooks/editor-actions/use-data-actions";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useDevice, usePreviewMode, useLiveMode, useLayerSidebarCollapsed } from "@/providers/editor/editor-ui-context";

type Props = {
    pageDetails: EditorElement[];
    liveMode?: boolean;
    layout?: "vertical" | "horizontal";
};

const FunnelEditor = ({ pageDetails, liveMode, layout = "vertical" }: Props) => {
    const { state } = useEditor();
    const { loadData } = useDataActions();
    const { toggleLiveMode, togglePreviewMode } = useUIActions();
    const { selectElement } = useElementActions();

    const device = useDevice();
    const previewMode = usePreviewMode();
    const editorLiveMode = useLiveMode();
    const layerSidebarCollapsed = useLayerSidebarCollapsed();

    console.log("previewMode", previewMode);
    console.log("liveMode", liveMode);

    useEffect(() => {
        if (liveMode) {
            toggleLiveMode(true);
        }
    }, [liveMode]);

    //CHALLENGE: make this more performant
    useEffect(() => {
        loadData(pageDetails, !!liveMode);
    }, [pageDetails]);

    const handleClick = () => {
        /* NOTE:Test empty state */
        selectElement();
    };

    const handleUnPreview = () => {
        togglePreviewMode();
        toggleLiveMode();
    };

    const isLiveMode = editorLiveMode || liveMode;

    return (
        <div
            data-editor-container="true"
            className={clsx("use-automation-zoom-in overflow-hidden overflow-y-auto mr-[385px] bg-background transition-all rounded-md", {
                "ml-80": !layerSidebarCollapsed,
                "ml-16": layerSidebarCollapsed,
                "!p-0 !mr-0 !ml-0": previewMode === true || liveMode === true,
                "h-[calc(100vh_-_97px)]": !isLiveMode,
                // Device-based widths only apply in edit mode, not in live mode
                "!w-[850px]": !isLiveMode && device === "Tablet",
                "!w-[420px]": !isLiveMode && device === "Mobile",
                "w-full": isLiveMode || device === "Desktop",
            })}
            onClick={handleClick}
        >
            {previewMode && (
                <Button variant={"ghost"} size={"icon"} className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]" onClick={handleUnPreview}>
                    <EyeOff />
                </Button>
            )}
            {Array.isArray(state.editor.elements) && state.editor.elements.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}
        </div>
    );
};

export default FunnelEditor;
