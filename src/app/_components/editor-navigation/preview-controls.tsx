"use client";

import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { EyeIcon, Square } from "lucide-react";
import { useEditor } from "@/providers/editor/editor-provider";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";
import { useLandingModal } from "@/providers/landing-modal-provider";
import { usePathname } from "next/navigation";

export const PreviewControls = memo(() => {
    const { state } = useEditor();
    const { toggleLiveMode, togglePreviewMode } = useUIActions();
    const { openModal } = useLandingModal();
    const pathname = usePathname();

    const isLandingModalPage = pathname?.includes("landing-modal");
    const isLiveStreamCardPage = pathname?.includes("live-stream-cards");

    const handlePreviewClick = useCallback(() => {
        togglePreviewMode();
        toggleLiveMode();
    }, [togglePreviewMode, toggleLiveMode]);

    const handlePreviewModalClick = useCallback(() => {
        openModal(state.editor.elements);
    }, [openModal, state.editor.elements]);

    return (
        <>
            <Button variant={"ghost"} size={"icon"} className="hover:bg-slate-800" onClick={handlePreviewClick}>
                <EyeIcon />
            </Button>

            {isLandingModalPage && (
                <Button variant="outline" onClick={handlePreviewModalClick} className="ml-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
                    <Square className="w-4 h-4 mr-2" />
                    Modal Önizle
                </Button>
            )}

            {isLiveStreamCardPage && (
                <Button variant="outline" onClick={handlePreviewModalClick} className="ml-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700">
                    <Square className="w-4 h-4 mr-2" />
                    Stream Card Önizle
                </Button>
            )}
        </>
    );
});
