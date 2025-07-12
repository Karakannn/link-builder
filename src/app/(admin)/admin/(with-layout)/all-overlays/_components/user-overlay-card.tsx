"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Monitor, User, Calendar, Loader2 } from "lucide-react";
import { formatLastUpdated } from "@/lib/utils";

type Props = {
  user: any;
  overlays: any[];
  onAddOverlay: () => void;
  onEdit: (overlayId: string) => void;
  onDelete: (overlayId: string) => void;
  onUpdateName: (overlayId: string, name: string) => void;
  loadingStates: Record<string, boolean>;
};

export const UserOverlayCard = ({ 
  user, 
  overlays, 
  onAddOverlay, 
  onEdit, 
  onDelete, 
  onUpdateName,
  loadingStates 
}: Props) => {
  const [editingOverlayId, setEditingOverlayId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleStartEdit = (overlay: any) => {
    setEditingOverlayId(overlay.id);
    setEditingName(overlay.name);
  };

  const handleSaveEdit = () => {
    if (editingOverlayId && editingName.trim()) {
      onUpdateName(editingOverlayId, editingName.trim());
      setEditingOverlayId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingOverlayId(null);
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
              {overlays.length} overlay
            </Badge>
          </div>
          <Button onClick={onAddOverlay} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Overlay Ekle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {overlays.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Bu kullanıcının henüz overlay'i yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {overlays.map((overlay) => (
              <div key={overlay.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    {editingOverlayId === overlay.id ? (
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
                        <Button size="sm" onClick={handleSaveEdit} disabled={loadingStates[overlay.id]}>
                          {loadingStates[overlay.id] ? (
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
                        <p className="font-medium">{overlay.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatLastUpdated(new Date(overlay.updatedAt))}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(overlay.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStartEdit(overlay)}
                  >
                    Düzenle
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={loadingStates[overlay.id]}
                      >
                        {loadingStates[overlay.id] ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Overlay'i Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          "{overlay.name}" overlay'ini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(overlay.id)}>
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