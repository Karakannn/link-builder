import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Home, Pencil, Trash2, Eye, CircleCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PageCardProps {
  page: any;
  onEdit?: (pageId: string) => void;
  onSetAsHome?: (pageId: string) => void;
  onDelete?: (pageId: string) => void;
}

export const PageCard = ({ page, onEdit = () => { }, onSetAsHome = () => { }, onDelete = () => { } }: PageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formattedDate = page.createdAt
    ? formatDistanceToNow(new Date(page.createdAt), {
      addSuffix: true,
      locale: tr,
    })
    : "Tarih bilgisi yok";

  const handleSetAsHome = async () => {
    setIsLoading(true);
    try {
      await onSetAsHome(page.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(page.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLivePreview = () => {
    // Sayfayı live modda yeni sekmede aç
    window.open(`/admin/builder/${page.id}?live=true`, '_blank');
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-lg">{page.title}</h3>
          </div>
          {page.isHome ? (
            <Badge variant="outline" className="flex items-center gap-1 p-2 border-green-600/50">
              <CircleCheck className="h-3 w-3 text-green-500" />
              <span>Aktif</span>
            </Badge>
          ) : (

            <Button
              variant="secondary"
              size="sm"
              className="gap-1 text-xs"
              onClick={handleSetAsHome}
              disabled={isLoading}
            >
               <CircleCheck className="size-3 text-gray-500" />
              Aktifleştir
            </Button>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Oluşturuldu: {formattedDate}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative overflow-hidden rounded-md bg-gray-50 h-32 flex items-center justify-center p-4 border">
          <div className={`transition-opacity duration-300 text-center ${isHovered ? "opacity-30" : "opacity-100"}`}>
            <p className="font-medium text-gray-800">{page.title}</p>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {page.slug} - {page.isHome ? "Ana Sayfa" : "Alt Sayfa"}
            </p>
          </div>

          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-opacity duration-300">
              <Button variant="secondary" className="gap-2" onClick={() => onEdit(page.id)} disabled={isLoading}>
                <Pencil className="h-4 w-4" />
                Sayfayı Düzenle
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-between pt-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => onEdit(page.id)} disabled={isLoading}>
            <Pencil className="h-3.5 w-3.5" />
            Düzenle
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleLivePreview}
            disabled={isLoading}
          >
            <Eye className="h-3.5 w-3.5" />
            Önizle
          </Button>

        </div>

        {!page.isHome && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1"
                disabled={isLoading}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sayfayı Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  "{page.title}" sayfasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Evet, Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};
