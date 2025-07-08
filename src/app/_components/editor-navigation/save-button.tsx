"use client";

import React, { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEditor } from "@/providers/editor/editor-provider";
import { Page } from "@prisma/client";
import { upsertPage } from "@/actions/page";
import { saveLandingModalContent } from "@/actions/landing-modal";
import { saveLiveStreamCardContent } from "@/actions/live-stream-card";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface SaveButtonProps {
    pageDetails: Page;
    onSaveSuccess?: () => void;
}

export const SaveButton = memo(({ pageDetails, onSaveSuccess }: SaveButtonProps) => {
    const { state } = useEditor(); // Sadece elements için
    const pathname = usePathname();
    const [isSaving, setIsSaving] = useState(false);

    // Check page types
    const isLandingModalPage = pathname?.includes("landing-modal");
    const isLiveStreamCardPage = pathname?.includes("live-stream-cards");

    const handleOnSave = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);
        const content = JSON.stringify(state.editor.elements);

        try {
            let response;

            if (isLandingModalPage) {
                const modalId = pageDetails.id;
                response = await saveLandingModalContent(content, modalId);
                console.log("Modal save response:", response);
            } else if (isLiveStreamCardPage) {
                const cardId = pageDetails.id;
                response = await saveLiveStreamCardContent(content, cardId);
                console.log("Stream card save response:", response);
            } else {
                response = await upsertPage({
                    ...pageDetails,
                    content: content,
                });
                console.log("Page save response:", response);
            }

            // Call success callback
            onSaveSuccess?.();

            toast("Başarılı", {
                description: isLandingModalPage
                    ? "Modal başarıyla kaydedildi"
                    : isLiveStreamCardPage
                    ? "Stream card başarıyla kaydedildi"
                    : "Sayfa başarıyla kaydedildi",
            });
        } catch (error) {
            console.error("Save error:", error);
            toast("Hata!", {
                description: isLandingModalPage ? "Modal kaydedilemedi" : isLiveStreamCardPage ? "Stream card kaydedilemedi" : "Editör kaydedilemedi",
            });
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, state.editor.elements, isLandingModalPage, isLiveStreamCardPage, pageDetails, onSaveSuccess]);

    return (
        <Button onClick={handleOnSave} disabled={isSaving}>
            {isSaving ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Kaydediliyor...
                </>
            ) : (
                "Kaydet"
            )}
        </Button>
    );
});
