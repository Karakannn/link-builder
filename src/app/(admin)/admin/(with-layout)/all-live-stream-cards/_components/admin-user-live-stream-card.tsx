"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Video, User, Calendar, Loader2 } from "lucide-react";
import { formatLastUpdated } from "@/lib/utils";

type Props = {
  user: any;
  cards: any[];
  onAddCard: () => void;
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
  onUpdateName: (cardId: string, name: string) => void;
  loadingStates: Record<string, boolean>;
};

export const UserLiveStreamCard = ({ 
  user, 
  cards, 
  onAddCard, 
  onEdit, 
  onDelete, 
  onUpdateName,
  loadingStates 
}: Props) => {
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleStartEdit = (card: any) => {
    setEditingCardId(card.id);
    setEditingName(card.name);
  };

  const handleSaveEdit = () => {
    if (editingCardId && editingName.trim()) {
      onUpdateName(editingCardId, editingName.trim());
      setEditingCardId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditingName("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-lg">
                  {user?.firstname && user?.lastname 
                    ? `${user.firstname} ${user.lastname}`
                    : user?.email || "Bilinmeyen Kullanıcı"
                  }
                </CardTitle>
                <CardDescription className="text-sm">
                  {user?.email}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="ml-2">
              {cards.length} stream card
            </Badge>
          </div>
          <Button onClick={onAddCard} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Stream Card Ekle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Bu kullanıcının henüz stream card'ı yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    {editingCardId === card.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                        />
                        <Button size="sm" onClick={handleSaveEdit} disabled={loadingStates[card.id]}>
                          {loadingStates[card.id] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Kaydet"
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          İptal
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{card.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatLastUpdated(new Date(card.updatedAt))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(card.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStartEdit(card)}
                  >
                    Düzenle
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loadingStates[card.id]}
                      >
                        {loadingStates[card.id] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
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
                        <AlertDialogAction onClick={() => onDelete(card.id)}>
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 