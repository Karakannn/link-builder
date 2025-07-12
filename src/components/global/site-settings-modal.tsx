"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useQueries, useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Save, Globe, BarChart3, Layers, Video, FileText, Settings } from "lucide-react";
import { getOverlaysByUserId, getSiteOverlaySettings, updateSiteOverlaySettings } from "@/actions/overlay";
import { getLiveStreamCardsByUserId } from "@/actions/live-stream-card";
import { getSiteById } from "@/actions/site";
import { toast } from "sonner";

const siteSettingsSchema = z.object({
  enableOverlay: z.boolean(),
  selectedOverlayId: z.string(),
  selectedCardId: z.string(),
  liveStreamLink: z.string(),
  title: z.string(),
  favicon: z.string(),
  googleAnalyticsId: z.string(),
});

type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
type Props = { siteId: string; siteName?: string; isOpen: boolean; onClose: () => void; };

export const SiteSettingsModal = ({ siteId, siteName, isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<SiteSettingsFormValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: { enableOverlay: false, selectedOverlayId: "clear", selectedCardId: "clear", liveStreamLink: "", title: "", favicon: "", googleAnalyticsId: "" },
  });

  const queries = useQueries({
    queries: [
      { queryKey: ["site-info", siteId], queryFn: () => getSiteById(siteId), enabled: isOpen && !!siteId },
      { queryKey: ["site-overlay-settings", siteId], queryFn: () => getSiteOverlaySettings(siteId), enabled: isOpen && !!siteId },
    ],
  });

  const [siteInfoQuery, settingsQuery] = queries;
  const { data: siteInfoData, isLoading: siteInfoLoading, error: siteInfoError } = siteInfoQuery;
  const { data: settingsData, isLoading: settingsLoading, error: settingsError } = settingsQuery;

  // Site bilgileri yüklendikten sonra o kullanıcının overlay ve card'larını getir
  const userOverlaysQuery = useQueries({
    queries: [
      { 
        queryKey: ["user-overlays", siteInfoData?.site?.user?.id], 
        queryFn: () => {
          const userId = siteInfoData?.site?.user?.id;
          if (!userId) throw new Error("User ID not found");
          return getOverlaysByUserId(userId);
        }, 
        enabled: isOpen && !!siteInfoData?.site?.user?.id 
      },
      { 
        queryKey: ["user-live-stream-cards", siteInfoData?.site?.user?.id], 
        queryFn: () => {
          const userId = siteInfoData?.site?.user?.id;
          if (!userId) throw new Error("User ID not found");
          return getLiveStreamCardsByUserId(userId);
        }, 
        enabled: isOpen && !!siteInfoData?.site?.user?.id 
      },
    ],
  });

  const [overlaysQuery, cardsQuery] = userOverlaysQuery;
  const { data: overlaysData, isLoading: overlaysLoading, error: overlaysError } = overlaysQuery;
  const { data: cardsData, isLoading: cardsLoading, error: cardsError } = cardsQuery;

  const updateSettingsMutation = useMutation({
    mutationFn: (data: SiteSettingsFormValues) => updateSiteOverlaySettings(siteId, {
      enableOverlay: data.enableOverlay,
      selectedOverlayId: data.enableOverlay && data.selectedOverlayId !== "clear" ? data.selectedOverlayId : undefined,
      selectedCardId: data.enableOverlay && data.selectedCardId !== "clear" ? data.selectedCardId : undefined,
      liveStreamLink: data.enableOverlay ? data.liveStreamLink : undefined,
      title: data.title,
      favicon: data.favicon,
      googleAnalyticsId: data.googleAnalyticsId
    }),
    onSuccess: (result) => {
      if (result.status === 200) {
        toast.success("Ayarlar başarıyla kaydedildi!");
        queryClient.invalidateQueries({ queryKey: ["site-overlay-settings", siteId] });
        onClose();
      } else {
        toast.error(result.message || "Ayarlar kaydedilirken bir hata oluştu");
      }
    },
    onError: () => toast.error("Beklenmeyen bir hata oluştu"),
  });

  const overlays = overlaysData?.status === 200 ? (overlaysData.overlays || []).filter(overlay => overlay.id?.trim()) : [];
  const cards = cardsData?.status === 200 ? (cardsData.cards || []).filter(card => card.id?.trim()) : [];
  const isLoading = siteInfoLoading || overlaysLoading || cardsLoading || settingsLoading;
  const hasAnyError = siteInfoError || overlaysError || cardsError || settingsError;
  const enableOverlay = form.watch("enableOverlay");
  console.log( "settingsData", settingsData);

  useEffect(() => {
    if (settingsData?.status === 200 && settingsData.settings) {
      const s = settingsData.settings;
      form.reset({
        enableOverlay: s.enableOverlay || false,
        selectedOverlayId: s.selectedOverlayId?.trim() ? s.selectedOverlayId : "clear",
        selectedCardId: s.selectedCardId?.trim() ? s.selectedCardId : "clear",
        liveStreamLink: s.liveStreamLink || "",
        title: s.title || "",
        favicon: s.favicon || "",
        googleAnalyticsId: s.googleAnalyticsId || "",
      });
    }
  }, [settingsData, form]);

  useEffect(() => {
    siteInfoError && toast.error("Site bilgileri yüklenirken bir hata oluştu");
    overlaysError && toast.error("Overlay verileri yüklenirken bir hata oluştu");
    cardsError && toast.error("Stream card verileri yüklenirken bir hata oluştu");
    settingsError && toast.error("Ayarlar yüklenirken bir hata oluştu");
  }, [siteInfoError, overlaysError, cardsError, settingsError]);

  const FormSection = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  const FormInput = ({ name, label, placeholder, description }: { name: keyof SiteSettingsFormValues; label: string; placeholder: string; description: string }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} value={field.value as string} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Site Ayarları
            {siteName && <span className="text-sm text-muted-foreground">- {siteName}</span>}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm text-muted-foreground">Ayarlar yükleniyor...</p>
          </div>
        ) : hasAnyError ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-sm text-destructive">Veriler yüklenirken bir hata oluştu</p>
            <Button variant="outline" size="sm" onClick={() => {
              queryClient.refetchQueries({ queryKey: ["site-info", siteId] });
              queryClient.refetchQueries({ queryKey: ["user-overlays", siteInfoData?.site?.user?.id] });
              queryClient.refetchQueries({ queryKey: ["user-live-stream-cards", siteInfoData?.site?.user?.id] });
              queryClient.refetchQueries({ queryKey: ["site-overlay-settings", siteId] });
            }}>Tekrar Dene</Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateSettingsMutation.mutate(data))} className="space-y-6">
              <div className="pt-4 space-y-4">
                <FormInput name="title" label="Site Başlığı" placeholder="Sitenizin başlığını girin" description="Bu başlık browser sekmesinde ve arama motorlarında görünecek" />
                <FormInput name="favicon" label="Favicon URL" placeholder="https://example.com/favicon.ico" description="Sitenizin favicon'unun URL'sini girin (16x16 veya 32x32 px)" />
                <FormInput name="googleAnalyticsId" label="Google Analytics ID" placeholder="G-XXXXXXXXXX" description="Google Analytics tracking ID'nizi girin (örn: G-XXXXXXXXXX)" />
              </div>
              <FormSection icon={Layers} title="Overlay Ayarları">
                <FormField
                  control={form.control}
                  name="enableOverlay"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Overlay Aktif</FormLabel>
                        <FormDescription>Ziyaretçiler siteye girdiğinde gösterilecek overlay</FormDescription>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />

                {enableOverlay && (
                  <div className="space-y-4 pl-4 border-l-2 border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Bir overlay seçin" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="clear"><span className="text-muted-foreground">Seçimi Temizle</span></SelectItem>
                                  {overlays.length === 0 ? (
                                    <SelectItem value="no-overlay" disabled>Overlay bulunamadı</SelectItem>
                                  ) : (
                                    overlays.map((overlay) => (
                                      <SelectItem key={overlay.id} value={overlay.id}>{overlay.name || "Unnamed Overlay"}</SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              {overlays.length === 0 && (
                                <FormDescription className="text-amber-600">
                                  Henüz overlay oluşturmadınız. <a href="/admin/overlay" className="text-primary hover:underline">Overlay oluşturmak için tıklayın</a>
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Bir stream card seçin" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="clear"><span className="text-muted-foreground">Seçimi Temizle</span></SelectItem>
                                  {cards.length === 0 ? (
                                    <SelectItem value="no-card" disabled>Stream card bulunamadı</SelectItem>
                                  ) : (
                                    cards.map((card) => (
                                      <SelectItem key={card.id} value={card.id}>{card.name || "Unnamed Card"}</SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                              {cards.length === 0 && (
                                <FormDescription className="text-amber-600">
                                  Henüz stream card oluşturmadınız. <a href="/admin/live-stream-cards" className="text-primary hover:underline">Stream card oluşturmak için tıklayın</a>
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/*                         <FormInput name="liveStreamLink" label="Canlı Yayın Linki" placeholder="https://www.youtube.com/watch?v=..." description="YouTube, Twitch veya diğer platform canlı yayın URL'sini girin" />
 */}                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Stream card üst kısımda, overlay alt kısımda gösterilecek. Sadece overlay aktifse her ikisi de görünür.</p>
                    </div>
                  </div>
                )}
              </FormSection>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={updateSettingsMutation.isPending} className="gap-2">
                  {updateSettingsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {updateSettingsMutation.isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};