"use server";

import { client } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

// Type for creating media
export type CreateMediaType = {
    name: string;
    link: string;
    type: MediaType;
    alt?: string;
    size?: number;
    mimeType?: string;
    siteId?: string; // Optional - media can be site-specific or global to user
};

// Get all media for a user (global + site-specific)
export const getUserMedia = async (userId: string) => {
    const response = await client.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            media: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
    return response?.media || [];
};

// Get media for a specific site
export const getSiteMedia = async (siteId: string) => {
    const response = await client.site.findUnique({
        where: {
            id: siteId,
        },
        include: {
            media: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
    return response?.media || [];
};

// Get all media for a user (both global and from all their sites)
export const getAllUserMedia = async (userId: string) => {
    const response = await client.media.findMany({
        where: {
            userId: userId,
        },
        include: {
            site: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return response;
};

// Create media
export const createMedia = async (userId: string, media: CreateMediaType) => {
    const response = await client.media.create({
        data: {
            name: media.name,
            link: media.link,
            type: media.type,
            alt: media.alt,
            size: media.size,
            mimeType: media.mimeType,
            userId: userId,
            siteId: media.siteId, // Optional - can be null for global media
        },
    });

    return response;
};

// Update media
export const updateMedia = async (mediaId: string, updates: Partial<CreateMediaType>) => {
    const response = await client.media.update({
        where: {
            id: mediaId,
        },
        data: updates,
    });

    return response;
};

// Delete media
export const deleteMedia = async (mediaId: string) => {
    const response = await client.media.delete({
        where: {
            id: mediaId,
        },
    });
    return response;
};

// Get media by type for a user
export const getMediaByType = async (userId: string, type: MediaType, siteId?: string) => {
    const response = await client.media.findMany({
        where: {
            userId: userId,
            type: type,
            ...(siteId && { siteId: siteId }),
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return response;
};

// Get single media by ID
export const getMediaById = async (mediaId: string) => {
    const response = await client.media.findUnique({
        where: {
            id: mediaId,
        },
        include: {
            user: {
                select: {
                    firstname: true,
                    lastname: true,
                },
            },
            site: {
                select: {
                    name: true,
                },
            },
        },
    });
    return response;
};