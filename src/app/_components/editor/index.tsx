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

    // Check if we're in live mode (live preview or custom domain)
    const isLiveMode = state.editor.liveMode || liveMode;

    return (
        /*   <><Pages layout={Layout.Horizontal} /></> */
        <div
            data-editor-container="true"
            className={clsx("use-automation-zoom-in overflow-hidden overflow-y-auto mr-[385px] bg-background transition-all rounded-md", {
                "ml-80": !state.editor.layerSidebarCollapsed,
                "ml-16": state.editor.layerSidebarCollapsed,
                "!p-0 !mr-0 !ml-0": state.editor.previewMode === true || state.editor.liveMode === true,
                "h-[calc(100vh_-_97px)]": !isLiveMode,
                // Device-based widths only apply in edit mode, not in live mode
                "!w-[850px]": !isLiveMode && state.editor.device === "Tablet",
                "!w-[420px]": !isLiveMode && state.editor.device === "Mobile",
                "w-full": isLiveMode || state.editor.device === "Desktop",
            })}
            onClick={handleClick}
        >
            {state.editor.previewMode && state.editor.liveMode && (
                <Button variant={"ghost"} size={"icon"} className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]" onClick={handleUnPreview}>
                    <EyeOff />
                </Button>
            )}
            {Array.isArray(state.editor.elements) && state.editor.elements.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}
        </div>
    );
};

export default FunnelEditor;
