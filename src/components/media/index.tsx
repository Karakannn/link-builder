import React from "react";
import UploadButton from "./upload-button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "../ui/command";
import MediaCard from "./media-card";
import { FolderSearch } from "lucide-react";
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
    data: MediaFile[];
    userId: string;
    siteId?: string;
};

const MediaComponent = ({ data, userId, siteId }: Props) => {
    return (
        <div className="flex flex-col gap-4 h-full w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl">Medyalar</h1>
                <UploadButton userId={userId} siteId={siteId} />
            </div>
            <Command className="bg-transparent">
                <CommandInput placeholder="Dosya adında ara..." />
                <CommandList className="max-h-full">
                    <CommandEmpty>Medya Dosyası Bulunamadı</CommandEmpty>
                    <div className="flex flex-wrap gap-4 pt-4">
                        {data?.map((file: MediaFile) => (
                            <CommandItem
                                key={file.id}
                                className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                            >
                                <MediaCard file={file} userId={userId} />
                            </CommandItem>
                        ))}
                        {!data?.length && (
                            <div className="flex items-center justify-center w-full h-full flex-col">
                                <FolderSearch size={200} className="dark:text-muted text-slate-300" />
                                <p className="text-muted-foreground">Boş! Gösterilecek dosya yok</p>
                            </div>
                        )}
                    </div>
                </CommandList>
            </Command>
        </div>
    );
};

export default MediaComponent;