"use client";

import { useEffect } from "react";
import FunnelEditor from "@/app/_components/editor";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { X, Laptop, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDeviceDetector } from "@/components/global/responsive-device-detector";
import { GoogleAnalytics } from "@/app/custom-domain/[domain]/_components/google-analytics";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";
import { OverlayProvider } from "@/providers/overlay-provider";

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

type Props = {
    pageContent: EditorElement[];
    siteId: string;
    overlayData: CompleteOverlayData;
};

export function LivePreviewWrapper({ pageContent, siteId, overlayData }: Props) {
    const { state } = useEditor();
    const { toggleLiveMode, togglePreviewMode } = useUIActions();

    useEffect(() => {
        toggleLiveMode(true);
        togglePreviewMode();
    }, []);

    const deviceIcons = { Mobile: Smartphone, Tablet, Desktop: Laptop };
    const Icon = deviceIcons[state.editor.device as keyof typeof deviceIcons] || Laptop;

    return (
        <OverlayProvider overlayData={overlayData}>
            <ResponsiveDeviceDetector>
                <div className="w-full h-screen relative">
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm">
                            {state.editor.device === "Mobile" ? <Smartphone className="h-4 w-4" /> :
                                state.editor.device === "Tablet" ? <Tablet className="h-4 w-4" /> :
                                    <Laptop className="h-4 w-4" />}
                            <span className="text-sm font-medium">{state.editor.device}</span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => window.close()}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <FunnelEditor pageDetails={pageContent} liveMode />
                    {overlayData?.settings?.googleAnalyticsId && (
                        <GoogleAnalytics googleAnalyticsId={overlayData.settings.googleAnalyticsId} />
                    )}
                </div>
            </ResponsiveDeviceDetector>
        </OverlayProvider>
    );
}