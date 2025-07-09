"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  User, 
  Edit, 
  Trash2, 
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  AlertTriangle,
  Shield
} from "lucide-react";
import { adminDeleteDomain, adminVerifyDomain, adminAddDomain } from "@/actions/domain";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Kullanıcıya göre grupla
function groupByUser(domains: any[]) {
  const grouped: Record<string, { user: any; domains: any[] }> = {};
  for (const domain of domains) {
    const userId = domain.user?.email || domain.user?.id || "unknown";
    if (!grouped[userId]) {
      grouped[userId] = {
        user: domain.user,
        domains: [],
      };
    }
    grouped[userId].domains.push(domain);
  }
  return grouped;
}

type DomainsData = {
  status: number;
  domains?: any[];
  message?: string;
};

type UsersData = {
  status: number;
  users?: any[];
  message?: string;
  totalUsers?: number;
  totalSites?: number;
  totalPages?: number;
};

type Props = {
  domainsData: DomainsData;
  usersData: UsersData;
};

const AllDomains = ({ domainsData, usersData }: Props) => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [domainName, setDomainName] = useState("");
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isGlobalCreateDomainOpen, setIsGlobalCreateDomainOpen] = useState(false);
  const [selectedGlobalUser, setSelectedGlobalUser] = useState<string>("");
  const [isGlobalCreatingDomain, setIsGlobalCreatingDomain] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<any>(null);

  const handleDeleteDomain = async (domainId: string, domainName: string) => {
    setLoadingStates(prev => ({ ...prev, [domainId]: true }));
    try {
      const result = await adminDeleteDomain(domainId);
      
      if (result.status === 200) {
        toast.success(`"${domainName}" domaini başarıyla silindi!`);
        router.refresh();
      } else {
        toast.error(result.message || "Domain silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [domainId]: false }));
    }
  };

  const handleVerifyDomain = async (domainId: string, domainName: string) => {
    setLoadingStates(prev => ({ ...prev, [domainId]: true }));
    try {
      const result = await adminVerifyDomain(domainId);
      
      if (result.status === 200) {
        toast.success(`"${domainName}" domaini başarıyla doğrulandı!`);
        router.refresh();
      } else {
        toast.error(result.message || "Domain doğrulanırken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [domainId]: false }));
    }
  };

  const handleAddDomain = async () => {
    if (!selectedUserForModal || !selectedSite || !domainName.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    // Domain adını temizle ve kontrol et
    const cleanDomainName = domainName.toLowerCase().trim();


    // Aynı domain adının zaten var olup olmadığını kontrol et
    const existingDomain = domainsData.domains?.find(d => d.name.toLowerCase() === cleanDomainName);
    if (existingDomain) {
      toast.error("Bu domain adı zaten sistemde mevcut");
      return;
    }
    
    setIsAddingDomain(true);
    try {
      const result = await adminAddDomain({
        name: cleanDomainName,
        siteId: selectedSite,
        userId: selectedUserForModal.id
      });
      
      if (result.status === 200) {
        toast.success(`"${cleanDomainName}" domaini başarıyla eklendi!`);
        setIsAddDomainOpen(false);
        setSelectedUserForModal(null);
        setSelectedSite("");
        setDomainName("");
        router.refresh();
      } else {
        toast.error(result.message || "Domain eklenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleGlobalCreateDomain = async () => {
    if (!selectedGlobalUser || !selectedSite || !domainName.trim()) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    // Domain adını temizle ve kontrol et
    const cleanDomainName = domainName.toLowerCase().trim();
    
    // Aynı domain adının zaten var olup olmadığını kontrol et
    const existingDomain = domainsData.domains?.find(d => d.name.toLowerCase() === cleanDomainName);
    if (existingDomain) {
      toast.error("Bu domain adı zaten sistemde mevcut");
      return;
    }
    
    setIsGlobalCreatingDomain(true);
    try {
      const result = await adminAddDomain({
        name: cleanDomainName,
        siteId: selectedSite,
        userId: selectedGlobalUser
      });
      
      if (result.status === 200) {
        toast.success(`"${cleanDomainName}" domaini başarıyla eklendi!`);
        setIsGlobalCreateDomainOpen(false);
        setSelectedGlobalUser("");
        setSelectedSite("");
        setDomainName("");
        router.refresh();
      } else {
        toast.error(result.message || "Domain eklenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsGlobalCreatingDomain(false);
    }
  };

  const handleOpenGlobalCreateDomain = () => {
    setIsGlobalCreateDomainOpen(true);
    setSelectedGlobalUser("");
    setSelectedSite("");
    setDomainName("");
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

  if (domainsData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{domainsData.message || "Domain verileri yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  const grouped = groupByUser(domainsData.domains || []);
  const userCount = Object.keys(grouped).length;
  const domainCount = domainsData.domains?.length || 0;
  const verifiedCount = domainsData.domains?.filter((d: any) => d.isVerified).length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tüm Domainler</h1>
            <p className="text-muted-foreground mt-2">
              Sistemdeki tüm kullanıcıların domainlerini görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleOpenGlobalCreateDomain}
            className="gap-2"
            disabled={isGlobalCreatingDomain}
          >
            {isGlobalCreatingDomain ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isGlobalCreatingDomain ? "Ekleniyor..." : "Yeni Domain Ekle"}
          </Button>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Domain</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{domainCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doğrulanmış</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kullanıcılar Listesi */}
      <div className="space-y-6">
        {userCount === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz domain bulunamadı</h3>
              <p className="text-muted-foreground">Kullanıcılar henüz domain eklememiş.</p>
            </CardContent>
          </Card>
        ) : (
          Object.values(grouped).map(({ user, domains }) => (
            <Card key={user?.email || user?.id || Math.random()} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user?.firstname} {user?.lastname}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user?.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {domains.length} domain
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const fullUserData = usersData.users?.find(u => u.id === user.id);
                          setSelectedUserForModal(fullUserData);
                          setSelectedSite("");
                          setDomainName("");
                          setIsAddDomainOpen(true);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {domains.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Bu kullanıcının henüz domaini bulunmuyor.
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {domains.map((domain: any) => (
                        <Card key={domain.id} className="border-dashed">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium truncate">
                                {domain.name}
                              </CardTitle>
                              <div className="flex items-center gap-1">
                                {domain.isVerified && (
                                  <Badge variant="default" className="text-xs">
                                    Doğrulanmış
                                  </Badge>
                                )}
                                <Badge variant={domain.sslStatus === "active" ? "default" : "outline"} className="text-xs">
                                  SSL {domain.sslStatus === "active" ? "Aktif" : "Bekliyor"}
                                </Badge>
                              </div>
                            </div>
                            <CardDescription className="text-xs">
                              Site: {domain.site.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(domain.createdAt)}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {!domain.isVerified && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerifyDomain(domain.id, domain.name)}
                                  disabled={loadingStates[domain.id]}
                                  className="flex-1"
                                >
                                  {loadingStates[domain.id] ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                  Doğrula
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={loadingStates[domain.id]}
                                  >
                                    {loadingStates[domain.id] ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3 h-3" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Domaini Sil</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      <strong>"{domain.name}"</strong> domainini silmek istediğinizden emin misiniz? 
                                      Bu işlem geri alınamaz ve domain kalıcı olarak silinecektir.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteDomain(domain.id, domain.name)}
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
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Domain Modal (Per User) */}
      <Dialog open={isAddDomainOpen} onOpenChange={(open) => {
        setIsAddDomainOpen(open);
        if (!open) setSelectedUserForModal(null);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {selectedUserForModal ? `${selectedUserForModal.firstname} ${selectedUserForModal.lastname} için Domain Ekle` : "Yeni Domain Ekle"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Site Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="site-select">Site Seçin</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bir site seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedUserForModal?.sites?.length > 0
                      ? selectedUserForModal.sites.map((site: any) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name}
                          </SelectItem>
                        ))
                      : <div className="p-2 text-sm text-muted-foreground">Bu kullanıcının sitesi bulunamadı</div>
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Domain Name */}
            {selectedSite && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain-name">Domain Adı</Label>
                  <Input
                    id="domain-name"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="example.com"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            {selectedSite && domainName.trim() && (
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleAddDomain} disabled={isAddingDomain} className="gap-2">
                  {isAddingDomain ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isAddingDomain ? "Ekleniyor..." : "Domain Ekle"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Add Domain Modal */}
      <Dialog open={isGlobalCreateDomainOpen} onOpenChange={setIsGlobalCreateDomainOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Yeni Domain Ekle
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="global-user-select">Kullanıcı Seçin</Label>
                <Select value={selectedGlobalUser} onValueChange={(value) => {
                  setSelectedGlobalUser(value);
                  setSelectedSite(""); // Reset site selection when user changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bir kullanıcı seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersData.users?.filter((user) => user.sites.length > 0).map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstname} {user.lastname} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Site Selection */}
            {selectedGlobalUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="global-site-select">Site Seçin</Label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bir site seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersData.users?.find((user) => user.id === selectedGlobalUser)?.sites.map((site: any) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Domain Name */}
            {selectedSite && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="global-domain-name">Domain Adı</Label>
                  <Input
                    id="global-domain-name"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="example.com"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            {selectedSite && domainName.trim() && (
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={handleGlobalCreateDomain} disabled={isGlobalCreatingDomain} className="gap-2">
                  {isGlobalCreatingDomain ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isGlobalCreatingDomain ? "Ekleniyor..." : "Domain Ekle"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllDomains; 