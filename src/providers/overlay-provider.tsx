"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { EditorElement } from "@/providers/editor/editor-provider";

type OverlaySettings = {
    enableOverlay: boolean;
    selectedOverlayId: string | null;
    selectedCardId?: string | null;
    liveStreamLink?: string | null;
    googleAnalyticsId?: string | null;
};

type CompleteOverlayData = {
    settings: OverlaySettings;
    overlayContent: EditorElement[] | null;
    liveStreamContent: EditorElement[] | null;
} | null;

interface OverlayProviderProps {
    children: React.ReactNode;
    overlayData: CompleteOverlayData;
}

export const OverlayProvider = ({ children, overlayData }: OverlayProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-open overlay when data is ready and overlay is enabled
    useEffect(() => {
        if (overlayData?.settings?.enableOverlay && (overlayData.overlayContent || overlayData.liveStreamContent)) {
            setIsOpen(true);
        }
    }, [overlayData]);

    const handleClose = () => setIsOpen(false);

    // Early return if no overlay data or overlay not enabled
    if (!overlayData?.settings?.enableOverlay || (!overlayData.overlayContent && !overlayData.liveStreamContent)) {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center gap-6 p-4">
                            {/* Live Stream Card */}
                            {overlayData.liveStreamContent && (
                                <div className="w-full max-w-2xl">
                                    {overlayData.liveStreamContent.map((element) => (
                                        <Recursive key={element.id} element={element} />
                                    ))}
                                </div>
                            )}

                            {/* Overlay */}
                            {overlayData.overlayContent && (
                                <div className="p-6 min-h-[300px]">
                                    {overlayData.overlayContent.map((element) => (
                                        <Recursive key={element.id} element={element} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};