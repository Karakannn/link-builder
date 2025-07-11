"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicSiteOverlaySettings, getPublicOverlayContent } from "@/actions/overlay";
import { getPublicLiveStreamCardContent } from "@/actions/live-stream-card";

// Hook for fetching site overlay settings
export const useSiteOverlaySettings = (siteId: string) => {
    return useQuery({
        queryKey: ["site-overlay-settings", siteId],
        queryFn: () => getPublicSiteOverlaySettings(siteId),
        enabled: !!siteId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    });
};

// Hook for fetching overlay content
export const useOverlayContent = (overlayId: string | null) => {
    console.log("🔴 Overlay ID:", overlayId);
    return useQuery({
        queryKey: ["overlay-content", overlayId],
        queryFn: () => getPublicOverlayContent(overlayId!),
        enabled: !!overlayId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    });
};

// Hook for fetching live stream card content
export const useLiveStreamCardContent = (cardId: string | null) => {
    return useQuery({
        queryKey: ["live-stream-card-content", cardId],
        queryFn: () => getPublicLiveStreamCardContent(cardId!),
        enabled: !!cardId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    });
}; 