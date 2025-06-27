"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Image, Video, Search, Trash, Download, Copy, Calendar } from "lucide-react";
import { toast } from "sonner";
import { deleteMedia } from "@/actions/media";
import { useQueryClient } from "@tanstack/react-query";
import UploadMediaForm from "@/components/forms/upload-media";

type MediaFile = {
    id: string;
    name: string;
    link: string;
    type: "IMAGE" | "VIDEO";
    alt?: string;
    size?: number;
    mimeType?: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    siteId?: string;
};

interface Props {
    media: MediaFile[];
    userId: string;
}

export function MediaList({ media, userId }: Props) {
    const [isAddingMedia, setIsAddingMedia] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    // Filter media based on search term
    const filteredMedia = media.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.alt && file.alt.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDeleteMedia = async (mediaId: string) => {
        if (!confirm("Bu medya dosyasını silmek istediğinize emin misiniz?")) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteMedia(mediaId);
            toast.success("Medya başarıyla silindi!");
            
            // Invalidate and refetch user media query
            queryClient.invalidateQueries({
                queryKey: ['user-media', userId]
            });
        } catch (error) {
            console.error("Medya silme hatası:", error);
            toast.error("Medya silme hatası");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Bağlantı kopyalandı!");
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "Bilinmiyor";
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTypeBadge = (type: "IMAGE" | "VIDEO") => {
        if (type === "IMAGE") {
            return <Badge variant="default" className="bg-blue-100 text-blue-800"><Image className="h-3 w-3 mr-1" />Görsel</Badge>;
        } else {
            return <Badge variant="default" className="bg-purple-100 text-purple-800"><Video className="h-3 w-3 mr-1" />Video</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Medya Kütüphanesi</h2>
                    <p className="text-muted-foreground">Yüklediğiniz görsel ve videoları yönetin</p>
                </div>
                <Dialog open={isAddingMedia} onOpenChange={setIsAddingMedia}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Medya Yükle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Medya Yükle</DialogTitle>
                            <DialogDescription>Medya kütüphanenize görsel veya video yükleyin</DialogDescription>
                        </DialogHeader>
                        <div className="pt-4">
                            <UploadMediaForm userId={userId} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Medya dosyalarında ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
                {filteredMedia.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-8">
                            <Image className="h-10 w-10 text-muted-foreground mb-3" />
                            <h3 className="text-base font-medium mb-1">
                                {searchTerm ? "Medya dosyası bulunamadı" : "Henüz medya yüklenmedi"}
                            </h3>
                            <p className="text-xs text-muted-foreground text-center mb-2">
                                {searchTerm 
                                    ? "Arama kriterlerinizi değiştirin" 
                                    : "Sayfalarınızda kullanmak için görsel veya video yükleyin"
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {filteredMedia.map((file) => (
                            <Card key={file.id} className="overflow-hidden">
                                <CardHeader className="pb-2 px-3 py-2">
                                    <div className="flex items-center justify-between">
                                        {getTypeBadge(file.type)}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteMedia(file.id)}
                                            disabled={isLoading}
                                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                            title="Sil"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2 px-3 pb-3">
                                    <div className="w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
                                        {file.type === "IMAGE" ? (
                                            <img
                                                src={file.link}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={file.link}
                                                className="w-full h-full object-cover"
                                                controls
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 pt-2">
                                        <p className="text-xs font-medium truncate">{file.name}</p>
                                        <span className="flex items-center text-[10px] text-muted-foreground">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(file.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex space-x-1 pt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(file.link)}
                                            className="flex-1 text-xs h-7"
                                            title="Bağlantıyı Kopyala"
                                        >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Kopyala
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(file.link, '_blank')}
                                            className="flex-1 text-xs h-7"
                                            title="İndir"
                                        >
                                            <Download className="h-3 w-3 mr-1" />
                                            İndir
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
} 