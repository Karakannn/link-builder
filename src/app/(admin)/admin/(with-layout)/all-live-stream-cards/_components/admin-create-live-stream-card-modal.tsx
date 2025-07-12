"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminCreateLiveStreamCardFromTemplate } from "@/actions/live-stream-card";
import { createSafeLiveStreamCardTemplate } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  users?: any[];
  existingCards: any[];
  type: "user" | "global";
  onCreateCard?: (name: string) => void;
  onSuccess?: () => void;
};

export const CreateLiveStreamCardModal = ({ 
  isOpen, 
  onClose, 
  user, 
  users = [], 
  existingCards, 
  type,
  onCreateCard,
  onSuccess
}: Props) => {
  const [cardName, setCardName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCard = async () => {
    if (!cardName.trim()) {
      toast.error("Stream card adı boş olamaz");
      return;
    }

    if (type === "user" && !user) {
      toast.error("Kullanıcı seçilmedi");
      return;
    }

    if (type === "global" && !selectedUserId) {
      toast.error("Kullanıcı seçilmedi");
      return;
    }

    // Check if card name already exists for the user
    const targetUserId = type === "user" ? user.id : selectedUserId;
    const userCards = existingCards.filter(c => c.userId === targetUserId);
    const nameExists = userCards.some(c => c.name.toLowerCase() === cardName.toLowerCase());

    if (nameExists) {
      toast.error(`"${cardName}" isimli bir stream card zaten mevcut`);
      return;
    }

    setIsCreating(true);
    try {
      const basicContent = createSafeLiveStreamCardTemplate(cardName);
      const result = await adminCreateLiveStreamCardFromTemplate(cardName, basicContent, targetUserId);
      
      if (result.status === 200) {
        toast.success(`"${cardName}" stream card'ı başarıyla oluşturuldu!`);
        setCardName("");
        setSelectedUserId("");
        onClose();
        onSuccess?.();
      } else {
        toast.error(result.message || "Stream card oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setCardName("");
    setSelectedUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "user" ? "Kullanıcıya Stream Card Ekle" : "Yeni Stream Card Oluştur"}
          </DialogTitle>
          <DialogDescription>
            {type === "user" 
              ? `${user?.firstname || user?.email} kullanıcısı için yeni bir stream card oluşturun.`
              : "Seçilen kullanıcı için yeni bir stream card oluşturun."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {type === "global" && (
            <div className="grid gap-2">
              <Label htmlFor="user">Kullanıcı Seç</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Kullanıcı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstname && user.lastname 
                        ? `${user.firstname} ${user.lastname} (${user.email})`
                        : user.email
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="card-name">Stream Card Adı</Label>
            <Input
              id="card-name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Stream card adını girin"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCard();
              }}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            İptal
          </Button>
          <Button 
            onClick={handleCreateCard} 
            disabled={isCreating || !cardName.trim() || (type === "global" && !selectedUserId)}
          >
            {isCreating ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 