"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Save, Globe, BarChart3, Layers, Video, FileText, Settings } from "lucide-react";
import { getAllUserOverlays, getSiteOverlaySettings, updateSiteOverlaySettings } from "@/actions/overlay";
import { getAllUserLiveStreamCards } from "@/actions/live-stream-card";
import { toast } from "sonner";

type Props = {
  siteId: string;
  siteName?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const SiteSettingsModal = ({ siteId, siteName, isOpen, onClose }: Props) => {
  const [enableOverlay, setEnableOverlay] = useState(false);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string>("clear");
  const [selectedCardId, setSelectedCardId] = useState<string>("clear");
  const [liveStreamLink, setLiveStreamLink] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [favicon, setFavicon] = useState<string>("");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>("");
  const [overlays, setOverlays] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [siteId, isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load overlays
      const overlaysResult = await getAllUserOverlays();
      if (overlaysResult.status === 200) {
        const validOverlays = (overlaysResult.overlays || []).filter(
          (overlay) => overlay.id && overlay.id.trim() !== ""
        );
        setOverlays(validOverlays);
      }

      // Load live stream cards
      const cardsResult = await getAllUserLiveStreamCards();
      if (cardsResult.status === 200) {
        const validCards = (cardsResult.cards || []).filter(
          (card) => card.id && card.id.trim() !== ""
        );
        setCards(validCards);
      }

      // Load site settings
      const settingsResult = await getSiteOverlaySettings(siteId);
      if (settingsResult.status === 200 && settingsResult.settings) {
        setEnableOverlay(settingsResult.settings.enableOverlay || false);
        const overlayId = settingsResult.settings.selectedOverlayId;
        setSelectedOverlayId(overlayId && overlayId.trim() !== "" ? overlayId : "clear");
        const cardId = settingsResult.settings.selectedCardId;
        setSelectedCardId(cardId && cardId.trim() !== "" ? cardId : "clear");
        setLiveStreamLink(settingsResult.settings.liveStreamLink || "");
        setTitle(settingsResult.settings.title || "");
        setFavicon(settingsResult.settings.favicon || "");
        setGoogleAnalyticsId(settingsResult.settings.googleAnalyticsId || "");
      }
    } catch (error) {
      toast.error("Ayarlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const result = await updateSiteOverlaySettings(siteId, {
        enableOverlay,
        selectedOverlayId: enableOverlay && selectedOverlayId !== "clear" ? selectedOverlayId : undefined,
        selectedCardId: enableOverlay && selectedCardId !== "clear" ? selectedCardId : undefined,
        liveStreamLink: enableOverlay ? liveStreamLink : undefined,
        title,
        favicon,
        googleAnalyticsId
      });

      if (result.status === 200) {
        toast.success("Ayarlar başarıyla kaydedildi!");
        onClose();
      } else {
        toast.error(result.message || "Ayarlar kaydedilirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Site Ayarları
            {siteName && (
              <span className="text-sm text-muted-foreground">- {siteName}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Genel Ayarlar</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-title">Site Başlığı</Label>
                <Input
                  id="site-title"
                  placeholder="Sitenizin başlığını girin"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Bu başlık browser sekmesinde ve arama motorlarında görünecek
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-favicon">Favicon URL</Label>
                <Input
                  id="site-favicon"
                  placeholder="https://example.com/favicon.ico"
                  value={favicon}
                  onChange={(e) => setFavicon(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Sitenizin favicon'unun URL'sini girin (16x16 veya 32x32 px)
                </p>
              </div>
            </div>

            {/* Analytics Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input
                  id="google-analytics"
                  placeholder="G-XXXXXXXXXX"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Google Analytics tracking ID'nizi girin (örn: G-XXXXXXXXXX)
                </p>
              </div>
            </div>

            {/* Overlay Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Overlay Ayarları</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-foreground">Overlay Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    Ziyaretçiler siteye girdiğinde gösterilecek overlay
                  </p>
                </div>
                <Switch
                  checked={enableOverlay}
                  onCheckedChange={setEnableOverlay}
                />
              </div>

              {enableOverlay && (
                <div className="space-y-4 pl-4 border-l-2 border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overlay Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4" />
                        <h4 className="font-medium">Overlay</h4>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="overlay-select">Overlay Seçin</Label>
                        <Select 
                          value={selectedOverlayId || "clear"} 
                          onValueChange={(value) => setSelectedOverlayId(value || "clear")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Bir overlay seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clear">
                              <span className="text-muted-foreground">Seçimi Temizle</span>
                            </SelectItem>
                            {overlays.length === 0 ? (
                              <SelectItem value="no-overlay" disabled>
                                Overlay bulunamadı
                              </SelectItem>
                            ) : (
                              overlays
                                .filter((overlay) => overlay.id && overlay.id.trim() !== "")
                                .map((overlay) => (
                                  <SelectItem key={overlay.id} value={overlay.id}>
                                    {overlay.name || "Unnamed Overlay"}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        {overlays.length === 0 && (
                          <p className="text-sm text-amber-600">
                            Henüz overlay oluşturmadınız.{" "}
                            <a 
                              href="/admin/overlay" 
                              className="text-primary hover:underline"
                            >
                              Overlay oluşturmak için tıklayın
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Live Stream Card Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-4 h-4" />
                        <h4 className="font-medium">Canlı Yayın Kartı (Üst Kısım)</h4>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="card-select">Stream Card Seçin</Label>
                        <Select 
                          value={selectedCardId || "clear"} 
                          onValueChange={(value) => setSelectedCardId(value || "clear")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Bir stream card seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clear">
                              <span className="text-muted-foreground">Seçimi Temizle</span>
                            </SelectItem>
                            {cards.length === 0 ? (
                              <SelectItem value="no-card" disabled>
                                Stream card bulunamadı
                              </SelectItem>
                            ) : (
                              cards
                                .filter((card) => card.id && card.id.trim() !== "")
                                .map((card) => (
                                  <SelectItem key={card.id} value={card.id}>
                                    {card.name || "Unnamed Card"}
                                  </SelectItem>
                                ))
                            )}
                          </SelectContent>
                        </Select>
                        {cards.length === 0 && (
                          <p className="text-sm text-amber-600">
                            Henüz stream card oluşturmadınız.{" "}
                            <a 
                              href="/admin/live-stream-cards" 
                              className="text-primary hover:underline"
                            >
                              Stream card oluşturmak için tıklayın
                            </a>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="live-stream-link">Canlı Yayın Linki</Label>
                        <Input
                          id="live-stream-link"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={liveStreamLink}
                          onChange={(e) => setLiveStreamLink(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          YouTube, Twitch veya diğer platform canlı yayın URL'sini girin
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Stream card üst kısımda, overlay alt kısımda gösterilecek. Sadece overlay aktifse her ikisi de görünür.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 