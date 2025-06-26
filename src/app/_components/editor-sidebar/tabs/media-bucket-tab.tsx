"use client";
import { getUserMedia } from "@/actions/media";
import MediaComponent from "@/components/media";
import React from "react";
import { useQuery } from "@tanstack/react-query";

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

type Props = {
    userId: string;
    siteId?: string;
};

const MediaBucketTab = ({ userId, siteId }: Props) => {
    const { data = [], isLoading } = useQuery({
        queryKey: ['user-media', userId],
        queryFn: () => getUserMedia(userId),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    if (isLoading) {
        return (
            <div className="h-full p-4 flex items-center justify-center">
                <div className="text-muted-foreground">Loading media files...</div>
            </div>
        );
    }

    return (
        <div className="h-full p-4">
            <MediaComponent data={data as MediaFile[]} userId={userId} siteId={siteId} />
        </div>
    );
};

export default MediaBucketTab;