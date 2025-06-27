"use client";

import { useEffect, useState } from "react";
import FunnelEditor from "@/app/_components/editor";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingModalProvider } from "@/providers/landing-modal-provider";
import { LandingModalTrigger } from "@/app/custom-domain/[domain]/_components/landing-modal-trigger";
import { getSiteLandingModalSettings } from "@/actions/landing-modal";

interface LivePreviewWrapperProps {
    pageContent: EditorElement[];
    siteId: string;
}

export function LivePreviewWrapper({ pageContent, siteId }: LivePreviewWrapperProps) {
    const { dispatch } = useEditor();
    const [landingModalSettings, setLandingModalSettings] = useState<{
        enableLandingModal: boolean;
        selectedModalId: string | null;
    } | null>(null);

    useEffect(() => {
        // Live mode'u aktif et
        dispatch({ type: "TOGGLE_LIVE_MODE", payload: { value: true } });
        
        // Preview mode'u aktif et
        dispatch({ type: "TOGGLE_PREVIEW_MODE" });

        // Site landing modal ayarlarını yükle
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
    }, [dispatch, siteId]);

    const handleClose = () => {
        window.close();
    };

    const shouldShowLandingModal = landingModalSettings?.enableLandingModal && landingModalSettings?.selectedModalId;

    return (
        <LandingModalProvider isPreview={false}>
            <div className="w-full h-screen relative">
                {/* Close button */}
                <div className="absolute top-4 right-4 z-50">
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
        </LandingModalProvider>
    );
} 