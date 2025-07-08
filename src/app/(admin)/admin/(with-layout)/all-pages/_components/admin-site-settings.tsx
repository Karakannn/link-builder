"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, User, Mail } from "lucide-react";
import { adminGetAllUserModals, adminGetSiteLandingModalSettings, adminUpdateSiteLandingModalSettings } from "@/actions/landing-modal";
import { toast } from "sonner";

type Props = {
  siteId: string;
  siteName: string;
  userName: string;
  userEmail: string;
};

export const AdminSiteSettings = ({ siteId, siteName, userName, userEmail }: Props) => {
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
      // Load all modals
      const modalsResult = await adminGetAllUserModals();
      if (modalsResult.status === 200) {
        setModals(modalsResult.modals || []);
      }

      // Load site settings
      const settingsResult: any = await adminGetSiteLandingModalSettings(siteId);
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
      const result = await adminUpdateSiteLandingModalSettings(
        siteId,
        enableLandingModal,
        enableLandingModal ? selectedModalId : undefined
      );

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
      <CardContent className="space-y-6">
        {/* Site Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Site Bilgileri</h4>
          <p className="text-sm text-muted-foreground">
            <strong>Site Adı:</strong> {siteName}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Site ID:</strong> {siteId}
          </p>
        </div>

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
                        <div className="flex flex-col">
                          <span>{modal.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {modal.user.firstname} {modal.user.lastname}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {modals.length === 0 && (
                <p className="text-sm text-amber-600">
                  Henüz modal oluşturulmamış.
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