"use client";

import { useEffect, useState } from "react";
import FunnelEditor from "@/app/_components/editor";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { X, Laptop, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverlayProvider } from "@/providers/overlay-provider";
import { getSiteOverlaySettings } from "@/actions/landing-modal";
import { ResponsiveDeviceDetector } from "@/components/global/responsive-device-detector";
import { GoogleAnalytics } from "@/app/custom-domain/[domain]/_components/google-analytics";

interface LivePreviewWrapperProps {
    pageContent: EditorElement[];
    siteId: string;
    initialModalSettings?: {
        enableLandingModal: boolean;
        selectedModalId: string | null;
        googleAnalyticsId?: string | null;
    } | null;
}

export function LivePreviewWrapper({ pageContent, siteId, initialModalSettings }: LivePreviewWrapperProps) {
    const { dispatch, state } = useEditor();
    const [overlaySettings, setOverlaySettings] = useState<{
        enableOverlay: boolean;
        overlayType: 'LANDING_MODAL' | 'LIVE_STREAM_CARD';
        selectedModalId: string | null;
        liveStreamLink?: string | null;
        googleAnalyticsId?: string | null;
    } | null>(initialModalSettings ? {
        enableOverlay: initialModalSettings.enableLandingModal,
        overlayType: 'LANDING_MODAL',
        selectedModalId: initialModalSettings.selectedModalId,
        liveStreamLink: null,
        googleAnalyticsId: initialModalSettings.googleAnalyticsId
    } : null);

    useEffect(() => {
        // Live mode'u aktif et
        dispatch({ type: "TOGGLE_LIVE_MODE", payload: { value: true } });
        // Preview mode'u aktif et
        dispatch({ type: "TOGGLE_PREVIEW_MODE" });
        
        // Eğer initialModalSettings yoksa, client-side'da yükle
        if (!initialModalSettings) {
            const loadOverlaySettings = async () => {
                try {
                    const result = await getSiteOverlaySettings(siteId);
                    if (result.status === 200 && result.settings) {
                        setOverlaySettings({
                            enableOverlay: result.settings.enableOverlay,
                            overlayType: result.settings.overlayType,
                            selectedModalId: result.settings.selectedModalId,
                            liveStreamLink: result.settings.liveStreamLink,
                            googleAnalyticsId: result.settings.googleAnalyticsId
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

    const shouldShowOverlay = overlaySettings?.enableOverlay && (
        (overlaySettings?.overlayType === 'LANDING_MODAL' && overlaySettings?.selectedModalId) ||
        (overlaySettings?.overlayType === 'LIVE_STREAM_CARD' && overlaySettings?.liveStreamLink)
    );

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
                            <span className="text-sm font-medium text-foreground">
                                {state.editor.device}
                            </span>
                        </div>
                        
                        {/* Close button */}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleClose}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Kapat
                        </Button>
                    </div>

                    {/* Live preview */}
                    <div className="w-full h-full">
                        <FunnelEditor 
                            pageDetails={pageContent} 
                            liveMode={true}
                        />
                    </div>

                    {/* Google Analytics - sadece gerekirse render et */}
                    {overlaySettings?.googleAnalyticsId && (
                        <GoogleAnalytics 
                            googleAnalyticsId={overlaySettings.googleAnalyticsId}
                        />
                    )}
                </div>
            </ResponsiveDeviceDetector>
        </OverlayProvider>
    );
} 