"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Play } from "lucide-react";

interface LiveStreamCardProps {
    liveStreamLink: string;
    onClose?: () => void;
    showCloseButton?: boolean;
}

export function LiveStreamCard({ liveStreamLink, onClose, showCloseButton = true }: LiveStreamCardProps) {
    const [isEmbedVisible, setIsEmbedVisible] = useState(false);

    // Extract video ID from YouTube URL for embedding
    const getYouTubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
        }
        return null;
    };

    // Extract video ID from Twitch URL for embedding
    const getTwitchEmbedUrl = (url: string) => {
        const channelMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
        if (channelMatch && channelMatch[1]) {
            return `https://player.twitch.tv/?channel=${channelMatch[1]}&parent=${window.location.hostname}`;
        }
        return null;
    };

    const getEmbedUrl = () => {
        if (liveStreamLink.includes('youtube.com') || liveStreamLink.includes('youtu.be')) {
            return getYouTubeEmbedUrl(liveStreamLink);
        } else if (liveStreamLink.includes('twitch.tv')) {
            return getTwitchEmbedUrl(liveStreamLink);
        }
        return null;
    };

    const embedUrl = getEmbedUrl();

    const handleWatchClick = () => {
        if (embedUrl) {
            setIsEmbedVisible(true);
        } else {
            // If we can't embed, open in new tab
            window.open(liveStreamLink, '_blank');
        }
    };

    if (isEmbedVisible && embedUrl) {
        return (
            <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="relative aspect-video">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-red-500/10 to-purple-500/10 border-red-500/20">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-red-500">CANLI YAYIN</span>
                    </div>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">🔴 Canlı Yayın Başladı!</h3>
                        <p className="text-muted-foreground">
                            Özel canlı yayınımıza katılın ve hiçbir anı kaçırmayın.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={handleWatchClick} className="w-full gap-2">
                            <Play className="w-4 h-4" />
                            {embedUrl ? "Şimdi İzle" : "Yayını Aç"}
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            onClick={() => window.open(liveStreamLink, '_blank')}
                            className="w-full gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Yeni Sekmede Aç
                        </Button>
                    </div>

                    {showCloseButton && (
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                Bu pencereyi kapatmak için X butonuna tıklayın
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 