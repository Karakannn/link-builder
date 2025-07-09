import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface OverlayTemplateSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateOverlay: (name: string) => void;
}

export const OverlayTemplateSelectionModal = ({
    isOpen,
    onClose,
    onCreateOverlay
}: OverlayTemplateSelectionModalProps) => {
    const [overlayName, setOverlayName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateOverlay = async () => {
        if (!overlayName.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            await onCreateOverlay(overlayName.trim());

            // Reset form
            setOverlayName("");
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isLoading) return; // Prevent closing while loading

        setOverlayName("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Yeni Overlay Oluştur</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Overlay Name Form */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="overlay-name">Overlay Adı</Label>
                            <Input
                                id="overlay-name"
                                value={overlayName}
                                onChange={(e) => setOverlayName(e.target.value)}
                                placeholder="Örn: Hoşgeldiniz Overlay'ı"
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && overlayName.trim()) {
                                        handleCreateOverlay();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                            İptal
                        </Button>
                        <Button
                            onClick={handleCreateOverlay}
                            disabled={!overlayName.trim() || isLoading}
                            className="gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {isLoading ? "Oluşturuluyor..." : "Overlay Oluştur"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};