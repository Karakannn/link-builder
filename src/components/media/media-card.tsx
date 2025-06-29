"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Image from "next/image";
import { Copy, MoreHorizontal, Trash, FileText, Music, Video } from "lucide-react";
import { toast } from "sonner";
import { deleteMedia } from "@/actions/media";
import { useQueryClient } from "@tanstack/react-query";
import { MediaType } from "@prisma/client";

type MediaFile = {
    id: string;
    name: string;
    link: string;
    type: MediaType;
    alt?: string;
    size?: number;
    mimeType?: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    siteId?: string;
};

type Props = {
    file: MediaFile;
    userId: string;
};

const MediaCard = ({ file, userId }: Props) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteMedia(file.id);
            
            // Invalidate and refetch user media query
            await queryClient.invalidateQueries({
                queryKey: ['user-media', userId]
            });
            
            toast.message("Dosya Silindi", {
                description: "Dosya başarıyla silindi",
            });
            
            router.refresh();
        } catch (error) {
            console.error("Error deleting media:", error);
            toast.error("Hata", {
                description: "Dosya silinemedi",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderPreview = () => {
        switch (file.type) {
            case "IMAGE":
                return <Image src={file.link} alt="preview image" fill className="object-cover rounded-lg" />;
            case "VIDEO":
                return (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                        <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                );
            case "AUDIO":
                return (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                        <Music className="h-12 w-12 text-muted-foreground" />
                    </div>
                );
            case "DOCUMENT":
            default:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                    </div>
                );
        }
    };

    return (
        <AlertDialog>
            <DropdownMenu>
                <article className="w-full border rounded-lg bg-slate-900">
                    <div className="relative w-full h-40">
                        {renderPreview()}
                    </div>
                    <p className="opacity-0 h-0 w-0">{file.name}</p>
                    <div className="p-4 relative">
                        <p className="text-muted-foreground">{file.createdAt.toDateString()}</p>
                        <p>{file.name}</p>
                        <div className="absolute top-4 right-4 p-[1px] ">
                            <DropdownMenuTrigger>
                                <MoreHorizontal className="cursor-pointer" />
                            </DropdownMenuTrigger>
                        </div>
                    </div>
                    <DropdownMenuContent className="z-[99]">
                        <DropdownMenuLabel>Menü</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="flex gap-2"
                            onClick={() => {
                                navigator.clipboard.writeText(file.link);
                                toast("Panoya Kopyalandı");
                            }}
                        >
                            <Copy size={15} /> Dosya Bağlantısını Kopyala
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="flex gap-2">
                                <Trash size={15} /> Dosyayı Sil
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </article>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">Emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription className="text-left">Bu dosyayı silmek istediğinizden emin misiniz? Bu dosyayı kullanan tüm alt hesaplar artık bu dosyaya erişemeyecek!</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center">
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="bg-destructive hover:bg-destructive"
                        onClick={handleDelete}
                    >
                        Sil
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default MediaCard;
