"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useSiteOverlaySettings, useOverlayContent, useLiveStreamCardContent } from "@/hooks/use-overlay-queries";

type OverlaySettings = {
    enableOverlay: boolean;
    selectedOverlayId: string | null;
    selectedCardId?: string | null;
    liveStreamLink?: string | null;
    googleAnalyticsId?: string | null;
};

interface OverlayProviderProps {
    children: React.ReactNode;
    siteId: string;
    initialSettings?: OverlaySettings | null;
}

export const OverlayProvider = ({ children, siteId, initialSettings }: OverlayProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Only fetch settings if no initial settings provided
    const { data: settingsData, isLoading: settingsLoading } = useSiteOverlaySettings(siteId);

    // Use initial settings or API response
    const settings = initialSettings || settingsData?.settings;
    const { selectedOverlayId, selectedCardId, enableOverlay } = settings || {};

    const { data: overlayData } = useOverlayContent(selectedOverlayId || null);
    const { data: cardData } = useLiveStreamCardContent(selectedCardId || null);

    // Parse overlay content
    const overlayContent = useMemo(() => {
        if (!selectedOverlayId || !overlayData?.content) return null;

        try {
            const parsed = JSON.parse(String(overlayData.content)) as EditorElement[];
            return parsed.length > 0 ? parsed : null;
        } catch {
            return null;
        }
    }, [selectedOverlayId, overlayData?.content]);

    // Parse live stream card content
    const liveStreamContent = useMemo(() => {
        if (!selectedCardId || !cardData?.card?.content) return null;

        try {
            const parsed = JSON.parse(String(cardData.card.content)) as EditorElement[];
            return parsed.length > 0 ? parsed : null;
        } catch {
            return null;
        }
    }, [selectedCardId, cardData?.card?.content]);

    // Auto-open overlay when data is ready
    const shouldShow = settings && enableOverlay && (overlayContent || liveStreamContent);
    if (shouldShow && !isOpen) setIsOpen(true);

    const handleClose = () => setIsOpen(false);

    return (
        <>
            {children}
            {isOpen && (overlayContent || liveStreamContent) && (
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
                            {liveStreamContent && (
                                <div className="w-full max-w-2xl">
                                    {liveStreamContent.map((element) => (
                                        <Recursive key={element.id} element={element} />
                                    ))}
                                </div>
                            )}

                            {/* Overlay */}
                            {overlayContent && (
                                <div className="p-6 min-h-[300px]">
                                    {overlayContent.map((element) => (
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