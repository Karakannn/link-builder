"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Edit,
  Trash2,
  Calendar,
  User,
  Loader2,
  AlertTriangle,
  Plus,
  Video
} from "lucide-react";
import { createLiveStreamCardFromTemplate, deleteLiveStreamCard, updateLiveStreamCardName } from "@/actions/live-stream-card";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiveStreamCardTemplateSelectionModal } from "./live-stream-card-template-selection-modal";
import { LiveStreamCardCard } from "./live-stream-card-card";

type CardsData = {
  status: number;
  cards?: any[];
  message?: string;
};

type Props = {
  cardsData: CardsData;
};

const AllLiveStreamCards = ({ cardsData }: Props) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleEdit = (cardId: string) => {
    router.push("/admin/live-stream-cards/builder/" + cardId);
  };

  const handleCreateCard = async (name: string) => {
    setIsCreatingCard(true);
    try {
      // Create a basic stream card with default template
      const basicCardContent = [
        {
          id: "stream-card-container",
          name: "Stream Card Container",
          type: "container",
          styles: {
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px 0 rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          },
          content: [
            {
              id: "stream-card-title",
              name: "Stream Card Title",
              type: "text",
              styles: {
                fontSize: "24px",
                fontWeight: "bold",
                color: "#EF4444",
                marginBottom: "20px",
                textAlign: "center",
              },
              content: {
                innerText: name,
              },
            },
            {
              id: "stream-card-description",
              name: "Stream Card Description",
              type: "text",
              styles: {
                fontSize: "16px",
                color: "#FFFFFF",
                marginBottom: "20px",
                textAlign: "center",
              },
              content: {
                innerText: "🔴 Canlı Yayın Başladı!",
              },
            },
          ],
        },
      ];
      
      const result = await createLiveStreamCardFromTemplate(name, basicCardContent);
      
      if (result.status === 200) {
        toast.success("Stream card başarıyla oluşturuldu!");
        router.refresh();
      } else {
        toast.error(result.message || "Stream card oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    setLoadingStates(prev => ({ ...prev, [cardId]: true }));
    try {
      const result = await deleteLiveStreamCard(cardId);
      
      if (result.status === 200) {
        toast.success("Stream card başarıyla silindi!");
        router.refresh();
      } else {
        toast.error(result.message || "Stream card silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [cardId]: false }));
    }
  };

  if (cardsData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{cardsData.message || "Stream card'lar yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Stream Card'larım</h2>
          <p className="text-muted-foreground mt-1">
            {cardsData.cards ? `${cardsData.cards.length} stream card` : "Stream card bulunamadı"}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2" disabled={isCreatingCard}>
          {isCreatingCard ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isCreatingCard ? "Oluşturuluyor..." : "Yeni Stream Card Oluştur"}
        </Button>
      </div>

      {/* Cards Grid */}
      {!cardsData.cards || cardsData.cards.length === 0 ? (
        <div className="p-8 text-center bg-muted rounded-lg border border-border">
          <h3 className="text-lg font-medium text-foreground mb-2">Henüz stream card bulunamadı</h3>
          <p className="text-muted-foreground mb-4">İlk stream card'ınızı oluşturmak için yukarıdaki butonu kullanın</p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="gap-2" disabled={isCreatingCard}>
            {isCreatingCard ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isCreatingCard ? "Oluşturuluyor..." : "İlk Stream Card'ımı Oluştur"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData.cards.map((card) => (
            <LiveStreamCardCard 
              key={card.id} 
              card={card} 
              onEdit={handleEdit}
              onDelete={handleDeleteCard}
              isLoading={loadingStates[card.id]}
            />
          ))}
        </div>
      )}

      {/* Template Selection Modal */}
      <LiveStreamCardTemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCard={handleCreateCard}
      />
    </div>
  );
};

export default AllLiveStreamCards; 