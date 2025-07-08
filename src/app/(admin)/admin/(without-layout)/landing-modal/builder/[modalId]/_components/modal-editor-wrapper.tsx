"use client";

import { EditorElement } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React, { useEffect } from "react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { useDataActions } from "@/hooks/editor-actions/use-data-actions";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useDevice, useLiveMode, usePreviewMode } from "@/providers/editor/editor-ui-context";
import { useElements } from "@/providers/editor/editor-elements-provider";

type Props = {
    pageDetails: EditorElement[];
};

export const ModalEditorWrapper = ({ pageDetails }: Props) => {
    const device = useDevice();
    const previewMode = usePreviewMode();
    const elements = useElements();
    const liveMode = useLiveMode();

    const { loadData } = useDataActions();
    const { selectElement } = useElementActions();

    useEffect(() => {
        loadData(pageDetails, false);
    }, [pageDetails]);

    const handleClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            console.log("🖱️ Background clicked, clearing selection");
            selectElement();
        }
    };

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
            <div className="w-full h-full flex items-center justify-center p-8 bg-muted/20">
                <div className="relative min-w-[300px] min-h-[200px] max-w-[90vw] max-h-[90vh] overflow-hidden">
                    {Array.isArray(elements) &&
                        elements.map((childElement) => {
                            console.log("🎭 Rendering element in modal:", childElement);
                            return <Recursive key={childElement.id} element={childElement} />;
                        })}
                </div>
            </div>
        </div>
    );
};
