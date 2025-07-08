"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEditor } from "@/providers/editor/editor-provider";
import { X } from "lucide-react";
import { EditorElement } from "@/providers/editor/editor-provider";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";

interface LandingModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalContent?: EditorElement[];
    isPreview?: boolean; // Editörde önizleme için true, live preview için false
}

export function LandingModal({ isOpen, onClose, modalContent, isPreview = false }: LandingModalProps) {
    const { state } = useEditor();
    const { toggleLiveMode } = useUIActions();

    // Update modal when modal opens to force re-render
    useEffect(() => {
        if (isOpen) {
            toggleLiveMode(true);
        }
    }, [isOpen, toggleLiveMode]);

    // Use modalContent prop if available, otherwise fall back to editor state
    const elements = modalContent || state.editor.elements;

    // Filter out __body and get actual content elements
    const contentElements = elements.filter((element: EditorElement) => element.type !== "__body");

    // Live preview için sadece modal içeriği göster
    if (!isPreview) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-none max-h-none w-auto h-auto p-0 bg-transparent border-none shadow-none">
                    <DialogTitle asChild>
                        <VisuallyHidden>Modal İçeriği</VisuallyHidden>
                    </DialogTitle>
                    <div className="w-full h-full relative">
                        {/* Header with close button only */}
                        <div className="absolute top-2 right-2 z-50">
                            <button
                                onClick={onClose}
                                className="p-2 bg-background/80 backdrop-blur-sm hover:bg-background rounded-full transition-colors border border-border shadow-sm"
                            >
                                <X className="w-4 h-4 text-foreground" />
                            </button>
                        </div>

                        {/* Modal Content Only - No padding, no container */}
                        <div className="w-full h-full">
                            {contentElements.length > 0 ? (
                                <div>
                                    {contentElements.map((element) => (
                                        <Recursive key={element.id} element={element} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 text-muted-foreground text-center">
                                    <div>
                                        <p className="mb-2">Henüz içerik eklenmedi</p>
                                        <p className="text-sm">Modalınızın nasıl görüneceğini görmek için bazı elementler ekleyin</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Editörde önizleme için tam modal göster
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                <DialogTitle asChild>
                    <VisuallyHidden>Modal Önizle</VisuallyHidden>
                </DialogTitle>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-muted">
                        <h2 className="text-lg font-semibold text-foreground">Modal Önizle</h2>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 p-6 bg-muted/20">
                        <div className="max-w-md mx-auto">
                            {/* Modal Container */}
                            {/* Modal Content */}
                            <div className="p-6 min-h-[300px]">
                                {contentElements.length > 0 ? (
                                    <div>
                                        {contentElements.map((element) => (
                                            <Recursive key={element.id} element={element} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-48 text-muted-foreground text-center">
                                        <div>
                                            <p className="mb-2">Henüz içerik eklenmedi</p>
                                            <p className="text-sm">Modalınızın nasıl görüneceğini görmek için bazı elementler ekleyin</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                <p>Bu, ziyaretçilerinize görünecek landing modal'ınızdır</p>
                                <p className="mt-1">Değişiklikleri görmek için editörde değişiklik yapın ve "Modal Önizle" butonuna tekrar tıklayın</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
