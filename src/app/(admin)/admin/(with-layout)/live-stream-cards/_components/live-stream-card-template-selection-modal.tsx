"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Video, Play } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreateCard: (name: string) => void;
};

export const LiveStreamCardTemplateSelectionModal = ({ isOpen, onClose, onCreateCard }: Props) => {
  const [cardName, setCardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!cardName.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      await onCreateCard(cardName.trim());
      setCardName("");
      onClose();
    } catch (error) {
      console.error("Error creating stream card:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isCreating) {
      handleCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Yeni Stream Card Oluştur
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-name">Stream Card Adı</Label>
            <Input
              id="card-name"
              placeholder="Örn: Canlı Yayın Kartı"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isCreating}
            />
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Varsayılan Stream Card Şablonu</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Kırmızı gradient arka plan</p>
              <p>• Canlı yayın başlığı</p>
              <p>• İzleme butonu</p>
              <p>• Responsive tasarım</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreate}
              disabled={!cardName.trim() || isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Stream Card Oluştur
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isCreating}>
              İptal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 