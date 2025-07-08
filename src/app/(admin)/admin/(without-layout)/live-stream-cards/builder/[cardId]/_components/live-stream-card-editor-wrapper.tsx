"use client";

import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useEffect } from "react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { useDataActions } from "@/hooks/editor-actions/use-data-actions";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useDevice, useLiveMode, usePreviewMode } from "@/providers/editor/editor-ui-context";

type Props = {
    pageDetails: EditorElement[];
};

export const LiveStreamCardEditorWrapper = ({ pageDetails }: Props) => {
    const { state } = useEditor();
    const { loadData } = useDataActions();
    const { selectElement } = useElementActions();
    const device = useDevice();
    const previewMode = usePreviewMode();
    const liveMode = useLiveMode();

    useEffect(() => {
        loadData(pageDetails, false);
    }, [pageDetails]);

    const handleClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            selectElement();
        }
    };

    console.log("🔴 LiveStreamCardEditorWrapper current state.editor.elements:", state.editor.elements);

    return (
        <div
            data-editor-container="true"
            className={clsx("use-automation-zoom-in h-[calc(100vh_-_97px)] overflow-auto bg-background transition-all rounded-md", {
                "!p-0 !mr-0 !ml-0": previewMode === true || liveMode === true,
                "!w-[850px]": device === "Tablet",
                "!w-[420px]": device === "Mobile",
                "w-full": device === "Desktop",
            })}
            onClick={handleClick}
        >
            {/* Stream Card Editor Container - Full width/height with centered card */}
            <div className="w-full h-full flex items-center justify-center p-8 bg-muted/20">
                {/* Stream Card Preview Area - Now editable container */}
                <div className="relative min-w-[300px] min-h-[200px] max-w-[90vw] max-h-[90vh] overflow-hidden">
                    {Array.isArray(state.editor.elements) &&
                        state.editor.elements.map((childElement) => {
                            console.log("🔴 Rendering element in stream card:", childElement);
                            return <Recursive key={childElement.id} element={childElement} />;
                        })}
                </div>
            </div>
        </div>
    );
};
