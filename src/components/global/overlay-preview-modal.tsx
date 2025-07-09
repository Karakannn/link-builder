"use client";

import { EditorElement } from "@/providers/editor/editor-provider";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";

interface OverlayPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    overlayContent?: EditorElement[];
    isPreview?: boolean;
}

export function OverlayPreviewModal({
    isOpen,
    onClose,
    overlayContent,
    isPreview = false
}: OverlayPreviewModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto">
                <div className="relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Overlay Preview Content */}
                    <div className="p-6 min-h-[300px]">
                        {overlayContent && overlayContent.length > 0 ? (
                            overlayContent.map((element) => (
                                <Recursive
                                    key={element.id}
                                    element={element}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center min-h-[200px] text-white">
                                <p>Overlay içeriği bulunamadı</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}