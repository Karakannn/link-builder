"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Dummy stream card preview for now (can be replaced with real preview)
const StreamCardPreview = () => (
  <div className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border-red-500/20 border rounded-lg shadow-md w-[220px] mx-auto my-2 p-6 flex flex-col items-center justify-center">
    <div className="text-2xl mb-2">🔴</div>
    <div className="text-base font-medium text-foreground">Stream Card</div>
    <div className="text-xs text-muted-foreground mt-1">Küçük önizleme</div>
  </div>
);

type Props = {
  card: {
    id: string;
    name: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
  isLoading?: boolean;
};

export const LiveStreamCardCard = ({ card, onEdit, onDelete, isLoading }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Card
      className="w-full transition-all duration-300 hover:shadow-lg group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {card.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={card.isEnabled ? "default" : "secondary"}>
                {card.isEnabled ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative overflow-hidden rounded-md bg-muted h-40 flex items-center justify-center border border-border">
          <div className={`transition-opacity duration-300 w-full ${isHovered ? "opacity-30" : "opacity-100"}`}>
            <StreamCardPreview />
          </div>
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-opacity duration-300">
              <Button variant="secondary" className="gap-2" onClick={() => onEdit(card.id)} disabled={isLoading}>
                <Edit className="h-4 w-4" />
                Düzenle
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(card.updatedAt), {
                addSuffix: true,
                locale: tr,
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(card.id)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Düzenle
          </Button>
          <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Stream Card'ı Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  "{card.name}" stream card'ını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(card.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Evet, Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}; 