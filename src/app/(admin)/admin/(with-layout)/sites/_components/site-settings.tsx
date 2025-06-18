"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { getAllUserModals, getSiteLandingModalSettings, updateSiteLandingModalSettings } from "@/actions/landing-modal";
import { toast } from "sonner";

type Props = {
  siteId: string;
};

export const SiteSettings = ({ siteId }: Props) => {
  const [enableLandingModal, setEnableLandingModal] = useState(false);
  const [selectedModalId, setSelectedModalId] = useState<string>("");
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
      const settingsResult = await getSiteLandingModalSettings(siteId);
      if (settingsResult.status === 200 && settingsResult.settings) {
        setEnableLandingModal(settingsResult.settings.enableLandingModal);
        setSelectedModalId(settingsResult.settings.selectedModalId || "");
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
      const result = await updateSiteLandingModalSettings(
        siteId,
        enableLandingModal,
        enableLandingModal ? selectedModalId : undefined
      );

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
        {/* Landing Modal Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium text-foreground">Landing Modal</Label>
              <p className="text-sm text-muted-foreground">
                Ziyaretçiler siteye girdiğinde gösterilecek modal
              </p>
            </div>
            <Switch
              checked={enableLandingModal}
              onCheckedChange={setEnableLandingModal}
            />
          </div>

          {enableLandingModal && (
            <div className="space-y-2">
              <Label htmlFor="modal-select">Modal Seçin</Label>
              <Select value={selectedModalId} onValueChange={setSelectedModalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Bir modal seçin" />
                </SelectTrigger>
                <SelectContent>
                  {modals.length === 0 ? (
                    <SelectItem value="" disabled>
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