"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Globe, 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Mail,
  User,
  Home,
  Loader2,
  Settings,
  Save,
  Plus
} from "lucide-react";
import { adminDeletePage, adminCreatePageFromTemplate, adminSetPageAsHome, getUsersWithoutPages } from "@/actions/page";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TemplateSelectionModal } from "../../sites/_components/template-selection-modal";

type UsersData = {
  status: number;
  users?: any[];
  message?: string;
  totalUsers?: number;
  totalSites?: number;
  totalPages?: number;
};

type Props = {
  usersData: UsersData;
};

const AllUsersPages = ({ usersData }: Props) => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({});
  const [modals, setModals] = useState<any[]>([]);
  const [selectedSiteForSettings, setSelectedSiteForSettings] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isCreatePageModalOpen, setIsCreatePageModalOpen] = useState(false);
  const [selectedSiteForCreate, setSelectedSiteForCreate] = useState<any>(null);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isGlobalCreatePageOpen, setIsGlobalCreatePageOpen] = useState(false);
  const [selectedGlobalUser, setSelectedGlobalUser] = useState<string>("");
  const [selectedGlobalSite, setSelectedGlobalSite] = useState<string>("");
  const [isGlobalCreatingPage, setIsGlobalCreatingPage] = useState(false);
  const [usersWithoutPages, setUsersWithoutPages] = useState<any[]>([]);

  const handleEdit = (pageId: string) => {
    router.push("/admin/builder/" + pageId);
  };

  const handleDeletePage = async (pageId: string, pageTitle: string) => {
    setLoadingStates(prev => ({ ...prev, [pageId]: true }));
    try {
      const result = await adminDeletePage(pageId);
      
      if (result.status === 200) {
        toast.success(`"${pageTitle}" sayfası başarıyla silindi!`);
        router.refresh();
      } else {
        toast.error(result.message || "Sayfa silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const handleSetAsHome = async (pageId: string, pageTitle: string) => {
    setLoadingStates(prev => ({ ...prev, [pageId]: true }));
    try {
      const result = await adminSetPageAsHome(pageId);
      
      if (result.status === 200) {
        toast.success(`"${pageTitle}" sayfası ana sayfa olarak ayarlandı!`);
        router.refresh();
      } else {
        toast.error(result.message || "Ana sayfa ayarlanırken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const handleOpenSiteSettings = async (site: any) => {
    console.log("[FRONTEND] Opening site settings for site:", {
      siteId: site.id,
      siteName: site.name,
      userId: site.user?.id,
      userEmail: site.user?.email
    });

    setSelectedSiteForSettings(site);
    setIsSettingsOpen(true);
    setIsLoadingSettings(true);
    
    try {
      // Check if user info exists  
      if (!site.user?.id) {
        console.error("[FRONTEND] No user info found for site:", site);
        toast.error("Site kullanıcı bilgisi bulunamadı");
        return;
      }

      // Load user's modals
      console.log("[FRONTEND] Loading modals for user:", site.user.id);
    /*   const modalsResult = await adminGetUserModals(site.user.id); */
    /*   console.log("[FRONTEND] Modals result:", modalsResult); */
      
    /*   if (modalsResult.status === 200) {
        setModals(modalsResult.modals || []);
      } else {
        console.error("[FRONTEND] Failed to load modals:", modalsResult);
      } */

      // Load site settings
      console.log("[FRONTEND] Loading site settings for site:", site.id);
    /*   const settingsResult = await adminGetSiteLandingModalSettings(site.id); */
    /*   console.log("[FRONTEND] Settings result:", settingsResult); */
      
    /*   if (settingsResult.status === 200) {
        setSiteSettings(prev => ({
          ...prev,
          [site.id]: settingsResult.settings || {
            enableLandingModal: false,
            selectedModalId: ""
          }
        }));
      } else {
        console.error("[FRONTEND] Failed to load site settings:", settingsResult);
      } */
    } catch (error) {
      console.error("[FRONTEND] Error in handleOpenSiteSettings:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        site: site
      });
      toast.error("Site ayarları yüklenirken bir hata oluştu");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveSiteSettings = async () => {
    if (!selectedSiteForSettings) return;
    
    setIsSavingSettings(true);
    try {
      const currentSettings = siteSettings[selectedSiteForSettings.id];
    /*   const result = await adminUpdateSiteLandingModalSettings(
        selectedSiteForSettings.id,
        currentSettings.enableLandingModal,
        currentSettings.enableLandingModal ? currentSettings.selectedModalId : undefined
      ); */

    /*   if (result.status === 200) {
        toast.success("Site ayarları başarıyla kaydedildi!");
        setIsSettingsOpen(false);
      } else {
        toast.error(result.message || "Ayarlar kaydedilirken bir hata oluştu");
      } */
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleOpenCreatePage = (site: any) => {
    setSelectedSiteForCreate(site);
    setIsCreatePageModalOpen(true);
  };

  const handleCreatePage = async (title: string, slug: string) => {
    if (!selectedSiteForCreate) return;
    
    setIsCreatingPage(true);
    try {
      // Generate basic page content
      const basicContent = [
        {
          id: "container-1",
          type: "container",
          content: [
            {
              id: "text-1",
              type: "text",
              content: {
                innerText: `Hoş geldiniz! Bu sayfa "${title}" başlıklı yeni sayfanızdır.`,
                className: "text-2xl font-bold text-center"
              }
            }
          ],
          styles: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            minHeight: "50vh"
          }
        }
      ];
      
      const result = await adminCreatePageFromTemplate(
        title, 
        slug, 
        basicContent,
        selectedSiteForCreate.id
      );
      
      if (result.status === 200) {
        toast.success(`"${title}" sayfası başarıyla oluşturuldu!`);
        setIsCreatePageModalOpen(false);
        setSelectedSiteForCreate(null);
        router.refresh();
      } else {
        toast.error(result.message || "Sayfa oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsCreatingPage(false);
    }
  };

  const handleGlobalCreatePage = async (title: string, slug: string) => {
    if (!selectedGlobalSite) {
      toast.error("Lütfen bir site seçin");
      return;
    }
    
    setIsGlobalCreatingPage(true);
    try {
      // Generate basic page content
      const basicContent = [
        {
          id: "container-1",
          type: "container",
          content: [
            {
              id: "text-1",
              type: "text",
              content: {
                innerText: `Hoş geldiniz! Bu sayfa "${title}" başlıklı yeni sayfanızdır.`,
                className: "text-2xl font-bold text-center"
              }
            }
          ],
          styles: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            minHeight: "50vh"
          }
        }
      ];
      
      const result = await adminCreatePageFromTemplate(
        title, 
        slug, 
        basicContent,
        selectedGlobalSite
      );
      
      if (result.status === 200) {
        toast.success(`"${title}" sayfası başarıyla oluşturuldu!`);
        setIsGlobalCreatePageOpen(false);
        setSelectedGlobalUser("");
        setSelectedGlobalSite("");
        router.refresh();
      } else {
        toast.error(result.message || "Sayfa oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsGlobalCreatingPage(false);
    }
  };

  const handleOpenGlobalCreatePage = async () => {
    setIsGlobalCreatePageOpen(true);
    setSelectedGlobalUser("");
    setSelectedGlobalSite("");
    
    try {
      const result = await getUsersWithoutPages();
      if (result.status === 200) {
        setUsersWithoutPages(result.users || []);
      } else {
        toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (usersData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{usersData.message || "Kullanıcı verileri yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tüm Kullanıcı Sayfaları</h1>
            <p className="text-muted-foreground mt-2">
              Sistemdeki tüm kullanıcıların sayfalarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleOpenGlobalCreatePage}
            className="gap-2"
            disabled={isGlobalCreatingPage}
          >
            {isGlobalCreatingPage ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isGlobalCreatingPage ? "Oluşturuluyor..." : "Yeni Sayfa Oluştur"}
          </Button>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersData.totalUsers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Site</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersData.totalSites || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Sayfa</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersData.totalPages || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kullanıcılar Listesi */}
      <div className="space-y-6">
        {!usersData.users || usersData.users.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz kullanıcı bulunamadı</h3>
              <p className="text-muted-foreground">Sistemde henüz kayıtlı kullanıcı bulunmuyor.</p>
            </CardContent>
          </Card>
        ) : usersData.users.filter((user) => {
            // Kullanıcının toplam sayfa sayısını hesapla
            const totalPages = user.sites.reduce((acc: number, site: any) => acc + site.pages.length, 0);
            return totalPages > 0; // Sadece sayfası olan kullanıcıları göster
          }).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz sayfa bulunamadı</h3>
              <p className="text-muted-foreground">Kullanıcılar henüz sayfa oluşturmamış.</p>
            </CardContent>
          </Card>
        ) : (
          usersData.users
            .filter((user) => {
              // Kullanıcının toplam sayfa sayısını hesapla
              const totalPages = user.sites.reduce((acc: number, site: any) => acc + site.pages.length, 0);
              return totalPages > 0; // Sadece sayfası olan kullanıcıları göster
            })
            .map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user.firstname} {user.lastname}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {user.sites.reduce((acc: number, site: any) => acc + site.pages.length, 0)} sayfa
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {user.sites.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Bu kullanıcının henüz sitesi bulunmuyor.
                  </div>
                ) : (
                  <div className="divide-y">
                    {user.sites
                      .filter((site: any) => site.pages.length > 0) // Sadece sayfası olan site'ları göster
                      .map((site: any) => (
                      <div key={site.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{site.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {site.description || "Açıklama yok"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={site.isPublished ? "default" : "secondary"}>
                              {site.isPublished ? "Yayında" : "Taslak"}
                            </Badge>
                            {site.isDefault && (
                              <Badge variant="outline">Varsayılan</Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenSiteSettings(site)}
                            >
                              <Settings className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenCreatePage(site)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {site.pages.map((page: any) => (
                            <Card key={page.id} className="border-dashed">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm font-medium truncate">
                                    {page.title}
                                  </CardTitle>
                                  {page.isHome && (
                                    <Home className="w-4 h-4 text-primary" />
                                  )}
                                </div>
                                <CardDescription className="text-xs">
                                  /{page.slug}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(page.createdAt)}
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(page.id)}
                                    className="flex-1"
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Düzenle
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`/admin/builder/${page.id}?live=true`, '_blank')}
                                  >
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {!page.isHome && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleSetAsHome(page.id, page.title)}
                                      disabled={loadingStates[page.id]}
                                      title="Aktifleştir"
                                    >
                                      {loadingStates[page.id] ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Home className="w-3 h-3" />
                                      )}
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={loadingStates[page.id]}
                                      >
                                        {loadingStates[page.id] ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Trash2 className="w-3 h-3" />
                                        )}
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Sayfayı Sil</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          <strong>"{page.title}"</strong> sayfasını silmek istediğinizden emin misiniz? 
                                          Bu işlem geri alınamaz ve sayfa kalıcı olarak silinecektir.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>İptal</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeletePage(page.id, page.title)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Evet, Sil
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Site Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Site Ayarları
              {selectedSiteForSettings && (
                <Badge variant="outline">
                  {selectedSiteForSettings.name}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingSettings ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : selectedSiteForSettings ? (
            <div className="space-y-6">
              {/* Site Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Site Bilgileri</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Site Adı:</strong> {selectedSiteForSettings.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Site ID:</strong> {selectedSiteForSettings.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Kullanıcı:</strong> {selectedSiteForSettings.user?.firstname} {selectedSiteForSettings.user?.lastname}
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
                    checked={siteSettings[selectedSiteForSettings.id]?.enableLandingModal || false}
                    onCheckedChange={(checked) => {
                      setSiteSettings(prev => ({
                        ...prev,
                        [selectedSiteForSettings.id]: {
                          ...prev[selectedSiteForSettings.id],
                          enableLandingModal: checked
                        }
                      }));
                    }}
                  />
                </div>

                {(siteSettings[selectedSiteForSettings.id]?.enableLandingModal) && (
                  <div className="space-y-2">
                    <Label htmlFor="modal-select">Modal Seçin</Label>
                    <Select 
                      value={siteSettings[selectedSiteForSettings.id]?.selectedModalId || ""}
                      onValueChange={(value) => {
                        setSiteSettings(prev => ({
                          ...prev,
                          [selectedSiteForSettings.id]: {
                            ...prev[selectedSiteForSettings.id],
                            selectedModalId: value
                          }
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Bir modal seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {modals.length === 0 ? (
                          <SelectItem value="no-modal" disabled>
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
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleSaveSiteSettings} disabled={isSavingSettings} className="gap-2">
                  {isSavingSettings ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSavingSettings ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Create Page Modal */}
      <TemplateSelectionModal
        isOpen={isCreatePageModalOpen}
        onClose={() => {
          setIsCreatePageModalOpen(false);
          setSelectedSiteForCreate(null);
        }}
        onCreatePage={handleCreatePage}
      />

      {/* Global Create Page Modal */}
      <Dialog open={isGlobalCreatePageOpen} onOpenChange={setIsGlobalCreatePageOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Yeni Sayfa Oluştur</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Selection */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="user-select">Kullanıcı Seçin</Label>
                {usersWithoutPages.filter((user) => user.sites.length > 0).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Henüz sayfası olmayan kullanıcı bulunmuyor. Tüm kullanıcıların zaten sayfaları var.
                  </div>
                ) : (
                  <Select 
                    value={selectedGlobalUser} 
                    onValueChange={(value) => {
                      setSelectedGlobalUser(value);
                      setSelectedGlobalSite(""); // Reset site selection when user changes
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bir kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersWithoutPages.filter((user) => user.sites.length > 0).map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstname} {user.lastname} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Site Selection */}
            {selectedGlobalUser && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label htmlFor="site-select">Site Seçin</Label>
                  <Select value={selectedGlobalSite} onValueChange={setSelectedGlobalSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bir site seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersWithoutPages.find((user) => user.id === selectedGlobalUser)?.sites.map((site: any) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedGlobalSite && (
              <TemplateSelectionModal
                isOpen={true}
                onClose={() => {}}
                onCreatePage={handleGlobalCreatePage}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllUsersPages; 