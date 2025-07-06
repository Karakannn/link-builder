"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, Globe, BarChart3, Layers, Video, FileText } from "lucide-react";
import { getAllUserModals, getSiteOverlaySettings, updateSiteSettings } from "@/actions/landing-modal";
import { toast } from "sonner";

type Props = {
  siteId: string;
};

export const SiteSettings = ({ siteId }: Props) => {
  const [enableOverlay, setEnableOverlay] = useState(false);
  const [selectedModalId, setSelectedModalId] = useState<string>("");
  const [liveStreamLink, setLiveStreamLink] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [favicon, setFavicon] = useState<string>("");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>("");
  const [modals, setModals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [siteId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load modals
      const modalsResult = await getAllUserModals();
      if (modalsResult.status === 200) {
        setModals(modalsResult.modals || []);
      }

      // Load site settings
      const settingsResult = await getSiteOverlaySettings(siteId);
      if (settingsResult.status === 200 && settingsResult.settings) {
        setEnableOverlay(settingsResult.settings.enableOverlay || false);
        setSelectedModalId(settingsResult.settings.selectedModalId || "");
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
      const result = await updateSiteSettings(siteId, {
        enableOverlay,
        selectedModalId: enableOverlay ? selectedModalId : undefined,
        liveStreamLink: enableOverlay ? liveStreamLink : undefined,
        title,
        favicon,
        googleAnalyticsId
      });

      if (result.status === 200) {
        toast.success("Ayarlar başarıyla kaydedildi!");
      } else {
        toast.error(result.message || "Ayarlar kaydedilirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
                {/* Landing Modal Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    <h4 className="font-medium">Landing Modal</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="modal-select">Modal Seçin</Label>
                    <Select value={selectedModalId} onValueChange={setSelectedModalId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir modal seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          <span className="text-muted-foreground">Seçimi Temizle</span>
                        </SelectItem>
                        {modals.length === 0 ? (
                          <SelectItem value="no-modal" disabled>
                            Modal bulunamadı
                          </SelectItem>
                        ) : (
                          modals.map((modal) => (
                            <SelectItem key={modal.id} value={modal.id}>
                              {modal.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {modals.length === 0 && (
                      <p className="text-sm text-amber-600">
                        Henüz modal oluşturmadınız.{" "}
                        <a 
                          href="/admin/landing-modal" 
                          className="text-primary hover:underline"
                        >
                          Modal oluşturmak için tıklayın
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Live Stream Card Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4" />
                    <h4 className="font-medium">Canlı Yayın Kartı</h4>
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
                  İkisi de yapılandırılmışsa, overlay her iki içeriği de yan yana gösterecek.
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
      </CardContent>
    </Card>
  );
}; 