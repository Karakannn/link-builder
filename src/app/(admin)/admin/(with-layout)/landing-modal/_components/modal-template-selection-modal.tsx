"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface ModalTemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateModal: (name: string) => void;
}

export const ModalTemplateSelectionModal = ({ 
  isOpen, 
  onClose, 
  onCreateModal 
}: ModalTemplateSelectionModalProps) => {
  const [modalName, setModalName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateModal = async () => {
    if (!modalName.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onCreateModal(modalName.trim());
      
      // Reset form
      setModalName("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setModalName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Yeni Modal Oluştur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Modal Name Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="modal-name">Modal Adı</Label>
              <Input
                id="modal-name"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                placeholder="Örn: Hoşgeldiniz Modalı"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && modalName.trim()) {
                    handleCreateModal();
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
              onClick={handleCreateModal}
              disabled={!modalName.trim() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isLoading ? "Oluşturuluyor..." : "Modal Oluştur"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 