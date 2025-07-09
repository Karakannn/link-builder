"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Dummy overlay preview for now (can be replaced with real preview)
const OverlayPreview = () => (
    <div className="bg-background border border-border rounded-lg shadow-md w-[220px] mx-auto my-2 p-6 flex flex-col items-center justify-center">
        <div className="text-2xl mb-2">🎯</div>
        <div className="text-base font-medium text-foreground">Overlay</div>
        <div className="text-xs text-muted-foreground mt-1">Küçük önizleme</div>
    </div>
);

type Props = {
    overlay: {
        id: string;
        name: string;
        isEnabled: boolean;
        createdAt: string;
        updatedAt: string;
    };
    onEdit: (overlayId: string) => void;
    onDelete: (overlayId: string) => void;
    isLoading?: boolean;
};

export const OverlayCard = ({ overlay, onEdit, onDelete, isLoading }: Props) => {
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
                            {overlay.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={overlay.isEnabled ? "default" : "secondary"}>
                                {overlay.isEnabled ? "Aktif" : "Pasif"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="relative overflow-hidden rounded-md bg-muted h-40 flex items-center justify-center border border-border">
                    <div className={`transition-opacity duration-300 w-full ${isHovered ? "opacity-30" : "opacity-100"}`}>
                        <OverlayPreview />
                    </div>
                    {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-opacity duration-300">
                            <Button variant="secondary" className="gap-2" onClick={() => onEdit(overlay.id)} disabled={isLoading}>
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
                            {formatDistanceToNow(new Date(overlay.updatedAt), {
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
                        onClick={() => onEdit(overlay.id)}
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
                                <AlertDialogTitle>Overlay'ı Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                    "{overlay.name}" overlay'ını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(overlay.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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