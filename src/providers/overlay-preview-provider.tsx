"use client";

import { createContext, useContext, useState } from "react";
import { OverlayPreviewModal } from "@/components/global/overlay-preview-modal";
import { EditorElement } from "@/providers/editor/editor-provider";

interface OverlayPreviewContextType {
    isOpen: boolean;
    overlayContent: EditorElement[] | null;
    openPreview: (content?: EditorElement[]) => void;
    closePreview: () => void;
}

const OverlayPreviewContext = createContext<OverlayPreviewContextType>({
    isOpen: false,
    overlayContent: null,
    openPreview: () => { },
    closePreview: () => { },
});

export function OverlayPreviewProvider({ children, isPreview = false }: { children: React.ReactNode; isPreview?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [overlayContent, setOverlayContent] = useState<EditorElement[] | null>(null);

    const openPreview = (content?: EditorElement[]) => {
        if (content) {
            setOverlayContent(content);
        }
        setIsOpen(true);
    };

    const closePreview = () => {
        setIsOpen(false);
        setOverlayContent(null);
    };

    return (
        <OverlayPreviewContext.Provider value={{ isOpen, overlayContent, openPreview, closePreview }}>
            {children}
            <OverlayPreviewModal
                isOpen={isOpen}
                onClose={closePreview}
                overlayContent={overlayContent || undefined}
                isPreview={isPreview}
            />
        </OverlayPreviewContext.Provider>
    );
}

export const useOverlayPreview = () => {
    const context = useContext(OverlayPreviewContext);
    if (!context) {
        throw new Error("useOverlayPreview must be used within an OverlayPreviewProvider");
    }
    return context;
};