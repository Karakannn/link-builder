"use client";

import { useEffect, useState } from "react";
import FunnelEditor from "@/app/_components/editor";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { X, Laptop, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingModalProvider } from "@/providers/landing-modal-provider";
import { LandingModalTrigger } from "@/app/custom-domain/[domain]/_components/landing-modal-trigger";
import { getSiteLandingModalSettings } from "@/actions/landing-modal";
import { ResponsiveDeviceDetector } from "@/components/global/responsive-device-detector";

interface LivePreviewWrapperProps {
    pageContent: EditorElement[];
    siteId: string;
    initialModalSettings?: {
        enableLandingModal: boolean;
        selectedModalId: string | null;
    } | null;
}

export function LivePreviewWrapper({ pageContent, siteId, initialModalSettings }: LivePreviewWrapperProps) {
    const { dispatch, state } = useEditor();
    const [landingModalSettings, setLandingModalSettings] = useState<{
        enableLandingModal: boolean;
        selectedModalId: string | null;
    } | null>(initialModalSettings || null);

    useEffect(() => {
        // Live mode'u aktif et
        dispatch({ type: "TOGGLE_LIVE_MODE", payload: { value: true } });
        // Preview mode'u aktif et
        dispatch({ type: "TOGGLE_PREVIEW_MODE" });
        
        // Eğer initialModalSettings yoksa, client-side'da yükle
        if (!initialModalSettings) {
            const loadLandingModalSettings = async () => {
                try {
                    const result = await getSiteLandingModalSettings(siteId);
                    if (result.status === 200 && result.settings) {
                        setLandingModalSettings({
                            enableLandingModal: result.settings.enableLandingModal,
                            selectedModalId: result.settings.selectedModalId
                        });
                    }
                } catch (error) {
                    console.error("❌ Error loading landing modal settings:", error);
                }
            };
            loadLandingModalSettings();
        }
    }, []); // SADECE ilk renderda çalışacak

    const handleClose = () => {
        window.close();
    };

    const shouldShowLandingModal = landingModalSettings?.enableLandingModal && landingModalSettings?.selectedModalId;

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
        <LandingModalProvider isPreview={false}>
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

                    {/* Landing modal trigger - sadece gerekirse render et */}
                    {shouldShowLandingModal && (
                        <LandingModalTrigger 
                            modalId={landingModalSettings.selectedModalId!}
                            siteId={siteId}
                        />
                    )}
                </div>
            </ResponsiveDeviceDetector>
        </LandingModalProvider>
    );
} 