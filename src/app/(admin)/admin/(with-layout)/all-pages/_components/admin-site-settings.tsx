"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, User, Mail, Globe, BarChart3, Layers, Video, FileText } from "lucide-react";
import { adminGetAllUserOverlays, adminGetSiteOverlaySettings, adminUpdateSiteOverlaySettings } from "@/actions/overlay";
import { adminGetAllUserLiveStreamCards } from "@/actions/live-stream-card";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema for form validation
const siteSettingsSchema = z.object({
  title: z.string().optional(),
  favicon: z.string().url().optional().or(z.literal("")),
  googleAnalyticsId: z.string().optional(),
  enableOverlay: z.boolean(),
  selectedOverlayId: z.string().optional(),
  selectedCardId: z.string().optional(),
  liveStreamLink: z.string().url().optional().or(z.literal("")),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

type Props = {
  siteId: string;
  siteName: string;
  userName: string;
  userEmail: string;
};

export const AdminSiteSettings = ({ siteId, siteName, userName, userEmail }: Props) => {
  const [overlays, setOverlays] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      title: "",
      favicon: "",
      googleAnalyticsId: "",
      enableOverlay: false,
      selectedOverlayId: "clear",
      selectedCardId: "clear",
      liveStreamLink: "",
    },
  });

  useEffect(() => {
    loadData();
  }, [siteId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load overlays
      const overlaysResult = await adminGetAllUserOverlays();
      if (overlaysResult.status === 200) {
        const validOverlays = (overlaysResult.overlays || []).filter(
          (overlay) => overlay.id && overlay.id.trim() !== ""
        );
        setOverlays(validOverlays);
      }

      // Load live stream cards
      const cardsResult = await adminGetAllUserLiveStreamCards();
      if (cardsResult.status === 200) {
        const validCards = (cardsResult.cards || []).filter(
          (card) => card.id && card.id.trim() !== ""
        );
        setCards(validCards);
      }

      // Load site settings
      const settingsResult = await adminGetSiteOverlaySettings(siteId);
      if (settingsResult.status === 200 && settingsResult.settings) {
        const settings = settingsResult.settings;
        form.reset({
          title: settings.title || "",
          favicon: settings.favicon || "",
          googleAnalyticsId: settings.googleAnalyticsId || "",
          enableOverlay: settings.enableOverlay || false,
          selectedOverlayId: settings.selectedOverlayId && settings.selectedOverlayId.trim() !== "" 
            ? settings.selectedOverlayId 
            : "clear",
          selectedCardId: settings.selectedCardId && settings.selectedCardId.trim() !== "" 
            ? settings.selectedCardId 
            : "clear",
          liveStreamLink: settings.liveStreamLink || "",
        });
      }
    } catch (error) {
      toast.error("Ayarlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      const result = await adminUpdateSiteOverlaySettings(siteId, {
        enableOverlay: data.enableOverlay,
        selectedOverlayId: data.enableOverlay && data.selectedOverlayId !== "clear" ? data.selectedOverlayId : undefined,
        selectedCardId: data.enableOverlay && data.selectedCardId !== "clear" ? data.selectedCardId : undefined,
        liveStreamLink: data.enableOverlay ? data.liveStreamLink : undefined,
        title: data.title,
        favicon: data.favicon,
        googleAnalyticsId: data.googleAnalyticsId
      });

      if (result.status === 200) {
        toast.success("Site ayarları başarıyla kaydedildi!");
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
        <CardTitle className="flex items-center justify-between">
          <span>Site Ayarları</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {userName}
            </Badge>
          </div>
        </CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Mail className="w-3 h-3" />
          {userEmail}
        </div>
      </CardHeader>
      <CardContent>
        {/* Site Info */}
        <div className="p-4 bg-muted/50 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Site Bilgileri</h4>
          <p className="text-sm text-muted-foreground">
            <strong>Site Adı:</strong> {siteName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Site ID:</strong> {siteId}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Genel Ayarlar</h3>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Başlığı</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sitenizin başlığını girin"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Bu başlık browser sekmesinde ve arama motorlarında görünecek
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favicon URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/favicon.ico"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Sitenizin favicon'unun URL'sini girin (16x16 veya 32x32 px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Analytics Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Analytics</h3>
              </div>

              <FormField
                control={form.control}
                name="googleAnalyticsId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Analytics ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="G-XXXXXXXXXX"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Google Analytics tracking ID'nizi girin (örn: G-XXXXXXXXXX)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Overlay Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Overlay Ayarları</h3>
              </div>

              <FormField
                control={form.control}
                name="enableOverlay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">
                        Overlay Aktif
                      </FormLabel>
                      <FormDescription>
                        Ziyaretçiler siteye girdiğinde gösterilecek overlay
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("enableOverlay") && (
                <div className="space-y-4 pl-4 border-l-2 border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overlay Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4" />
                        <h4 className="font-medium">Overlay</h4>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="selectedOverlayId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overlay Seçin</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "clear"}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Bir overlay seçin" />
                                </SelectTrigger>
                              </FormControl>
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
                                        <div className="flex flex-col">
                                          <span>{overlay.name || "Unnamed Overlay"}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {overlay.user?.firstname} {overlay.user?.lastname}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))
                                )}
                              </SelectContent>
                            </Select>
                            {overlays.length === 0 && (
                              <FormDescription className="text-amber-600">
                                Henüz overlay oluşturulmamış.
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Live Stream Card Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-4 h-4" />
                        <h4 className="font-medium">Canlı Yayın Kartı (Üst Kısım)</h4>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="selectedCardId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stream Card Seçin</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "clear"}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Bir stream card seçin" />
                                </SelectTrigger>
                              </FormControl>
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
                                        <div className="flex flex-col">
                                          <span>{card.name || "Unnamed Card"}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {card.user?.firstname} {card.user?.lastname}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))
                                )}
                              </SelectContent>
                            </Select>
                            {cards.length === 0 && (
                              <FormDescription className="text-amber-600">
                                Henüz stream card oluşturulmamış.
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="liveStreamLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Canlı Yayın Linki</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              YouTube, Twitch veya diğer platform canlı yayın URL'sini girin
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 