"use client";

import { useEffect, useState } from "react";
import FunnelEditor from "@/app/_components/editor";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { X, Laptop, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverlayProvider } from "@/providers/overlay-provider";
import { getSiteOverlaySettings } from "@/actions/overlay"; 
import { ResponsiveDeviceDetector } from "@/components/global/responsive-device-detector";
import { GoogleAnalytics } from "@/app/custom-domain/[domain]/_components/google-analytics";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";

interface LivePreviewWrapperProps {
    pageContent: EditorElement[];
    siteId: string;
    initialOverlaySettings?: {
        enableOverlay: boolean;
        selectedOverlayId: string | null; 
        googleAnalyticsId?: string | null;
    } | null;
}

export function LivePreviewWrapper({ pageContent, siteId, initialOverlaySettings }: LivePreviewWrapperProps) {

    const { state } = useEditor();

    const { toggleLiveMode, togglePreviewMode } = useUIActions();
    const [overlaySettings, setOverlaySettings] = useState<{
        enableOverlay: boolean;
        selectedOverlayId: string | null;
        selectedCardId?: string | null;
        liveStreamLink?: string | null;
        googleAnalyticsId?: string | null;
    } | null>(
        initialOverlaySettings
            ? {
                enableOverlay: initialOverlaySettings.enableOverlay,
                selectedOverlayId: initialOverlaySettings.selectedOverlayId,
                liveStreamLink: null,
                googleAnalyticsId: initialOverlaySettings.googleAnalyticsId,
            }
            : null
    );

    useEffect(() => {
        toggleLiveMode(true);
        togglePreviewMode();

        // Eğer initialOverlaySettings yoksa, client-side'da yükle
        if (!initialOverlaySettings) {
            const loadOverlaySettings = async () => {
                try {
                    console.log("🔴 Loading overlay settings for siteId:", siteId);
                    const result = await getSiteOverlaySettings(siteId);
                    console.log("🔴 Overlay settings result:", result);

                    if (result.status === 200 && result.settings) {
                        setOverlaySettings({
                            enableOverlay: result.settings.enableOverlay,
                            selectedOverlayId: result.settings.selectedOverlayId,
                            selectedCardId: result.settings.selectedCardId,
                            liveStreamLink: result.settings.liveStreamLink,
                            googleAnalyticsId: result.settings.googleAnalyticsId,
                        });
                        console.log("🔴 Set overlay settings:", {
                            enableOverlay: result.settings.enableOverlay,
                            selectedOverlayId: result.settings.selectedOverlayId,
                            selectedCardId: result.settings.selectedCardId,
                        });
                    }
                } catch (error) {
                    console.error("❌ Error loading overlay settings:", error);
                }
            };
            loadOverlaySettings();
        }
    }, []); // SADECE ilk renderda çalışacak

    const handleClose = () => {
        window.close();
    };

    const shouldShowOverlay =
        overlaySettings?.enableOverlay &&
        (overlaySettings?.selectedOverlayId || overlaySettings?.selectedCardId);

    console.log("🔴 Should show overlay?", {
        enableOverlay: overlaySettings?.enableOverlay,
        selectedOverlayId: overlaySettings?.selectedOverlayId,
        selectedCardId: overlaySettings?.selectedCardId,
        shouldShowOverlay
    });

    // Device icon component
    const getDeviceIcon = () => {
        switch (state.editor.device) {
            case "Mobile":
                return <Smartphone className="h-4 w-4" />;
            case "Tablet":
                return <Tablet className="h-4 w-4" />;
            default:
                return <Laptop className="h-4 w-4" />;
        }
    };

    return (
        <OverlayProvider siteId={siteId}>
            <ResponsiveDeviceDetector>
                <div className="w-full h-screen relative">
                    {/* Header with close button and device indicator */}
                    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                        {/* Device indicator */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border shadow-sm">
                            {getDeviceIcon()}
                            <span className="text-sm font-medium text-foreground">{state.editor.device}</span>
                        </div>

                        {/* Close button */}
                        <Button variant="secondary" size="sm" onClick={handleClose} className="gap-2">
                            <X className="h-4 w-4" />
                            Kapat
                        </Button>
                    </div>

                    {/* Live preview */}
                    <div className="w-full h-full">
                        <FunnelEditor pageDetails={pageContent} liveMode={true} />
                    </div>

                    {/* Google Analytics - sadece gerekirse render et */}
                    {overlaySettings?.googleAnalyticsId && <GoogleAnalytics googleAnalyticsId={overlaySettings.googleAnalyticsId} />}
                </div>
            </ResponsiveDeviceDetector>
        </OverlayProvider>
    );
}