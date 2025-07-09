"use client";

import React, { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Page } from "@prisma/client";
import { upsertPage } from "@/actions/page";
import { saveLiveStreamCardContent } from "@/actions/live-stream-card";
import { saveOverlayContent } from "@/actions/overlay";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useElements } from "@/providers/editor/editor-elements-provider";

interface SaveButtonProps {
    pageDetails: Page;
    onSaveSuccess?: () => void;
}

export const SaveButton = memo(({ pageDetails, onSaveSuccess }: SaveButtonProps) => {
  
    const pathname = usePathname();
    const [isSaving, setIsSaving] = useState(false);
    const elements = useElements();
   
    const isLiveStreamCardPage = pathname?.includes("live-stream-cards");
    const isOverlayPage = pathname?.includes("overlay");

    const handleOnSave = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);
        const content = JSON.stringify(elements);

        try {
            let response;

            if (isLiveStreamCardPage) {
                const cardId = pageDetails.id;
                response = await saveLiveStreamCardContent(content, cardId);
                console.log("Stream card save response:", response);
            } else if (isOverlayPage) {
                const overlayId = pageDetails.id;
                response = await saveOverlayContent(content, overlayId);
                console.log("Overlay save response:", response);
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
                description: isLiveStreamCardPage
                    ? "Stream card başarıyla kaydedildi"
                    : isOverlayPage
                    ? "Overlay başarıyla kaydedildi"
                    : "Sayfa başarıyla kaydedildi",
            });
        } catch (error) {
            console.error("Save error:", error);
            toast("Hata!", {
                description: isLiveStreamCardPage ? "Stream card kaydedilemedi" : isOverlayPage ? "Overlay kaydedilemedi" : "Editör kaydedilemedi",
            });
        } finally {
            setIsSaving(false);
        }
    }, [isSaving, elements, isLiveStreamCardPage, isOverlayPage, pageDetails, onSaveSuccess]);

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
