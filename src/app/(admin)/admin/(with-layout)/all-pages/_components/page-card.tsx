import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Eye, Home, Trash2, Calendar, Loader2 } from "lucide-react";

type PageCardProps = {
    page: any;
    onEdit: (pageId: string) => void;
    onDelete: (pageId: string, pageTitle: string) => void;
    onSetAsHome: (pageId: string, pageTitle: string) => void;
};

export const PageCard = ({ page, onEdit, onDelete, onSetAsHome }: PageCardProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        setIsLoading(true);
        await onDelete(page.id, page.title);
        setIsLoading(false);
    };

    const handleSetAsHome = async () => {
        setIsLoading(true);
        await onSetAsHome(page.id, page.title);
        setIsLoading(false);
    };

    return (
        <Card className="border-dashed">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium truncate">
                        {page.title}
                    </CardTitle>
                    {page.isHome && <Home className="w-4 h-4 text-primary" />}
                </div>
                <CardDescription className="text-xs">/{page.slug}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(page.createdAt)}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(page.id)}
                        className="flex-1"
                    >
                        <Edit className="w-3 h-3 mr-1" />
                        Düzenle
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/admin/builder/${page.id}?live=true`, '_blank')}
                    >
                        <Eye className="w-3 h-3" />
                    </Button>

                    {!page.isHome && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSetAsHome}
                            disabled={isLoading}
                            title="Ana Sayfa Yap"
                        >
                            {isLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                <Home className="w-3 h-3" />
                            )}
                        </Button>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Trash2 className="w-3 h-3" />
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sayfayı Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <strong>"{page.title}"</strong> sayfasını silmek istediğinizden emin misiniz?
                                    Bu işlem geri alınamaz ve sayfa kalıcı olarak silinecektir.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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