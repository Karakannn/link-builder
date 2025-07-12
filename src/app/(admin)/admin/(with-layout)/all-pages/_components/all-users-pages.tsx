"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { adminCreatePageFromTemplate } from "@/actions/page";
import { createSafePageTemplate } from "@/lib/utils";
import { UserCard } from "./user-card";
import { CreatePageModal } from "./create-page-modal";
import { TemplateSelectionModal } from "../../sites/_components/template-selection-modal";
import { SiteSettingsModal } from "@/components/global/site-settings-modal";
import { usePageActions } from "@/hooks/use-page-actions";
import { useGlobalCreate } from "@/hooks/use-global-page-creat";

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
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSiteForCreate, setSelectedSiteForCreate] = useState<any>(null);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  
  const { isGlobalCreateOpen, openGlobalCreate, closeGlobalCreate, usersWithoutPages } = useGlobalCreate();
  const { handleEdit, handleDeletePage, handleSetAsHome } = usePageActions(router);

  const handleOpenSiteSettings = (site: any) => {
    setSelectedSite(site);
    setIsSettingsOpen(true);
  };

  const closeSiteSettings = () => {
    setIsSettingsOpen(false);
    setSelectedSite(null);
  };

  const handleOpenCreatePage = (site: any) => {
    setSelectedSiteForCreate(site);
    setIsCreatePageOpen(true);
  };

  const closeCreatePage = () => {
    setIsCreatePageOpen(false);
    setSelectedSiteForCreate(null);
  };

  const handleSiteSpecificCreatePage = async (title: string, slug: string) => {
    if (!selectedSiteForCreate) return;
    
    try {
      const basicContent = createSafePageTemplate(title);
      const result = await adminCreatePageFromTemplate(title, slug, basicContent, selectedSiteForCreate.id);
      
      if (result.status === 200) {
        toast.success(`"${title}" sayfası başarıyla oluşturuldu!`);
        closeCreatePage();
        router.refresh();
      } else {
        toast.error(result.message || "Sayfa oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    }
  };

  if (usersData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{usersData.message || "Kullanıcı verileri yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  const usersWithPages = usersData.users?.filter(user => 
    user.sites.reduce((acc: number, site: any) => acc + site.pages.length, 0) > 0
  ) || [];

  return (
    <div className="w-full space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tüm Kullanıcı Sayfaları</h1>
            <p className="text-muted-foreground mt-2">
              Sistemdeki tüm kullanıcıların sayfalarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={openGlobalCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni Sayfa Oluştur
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Toplam Kullanıcı" value={usersData.totalUsers || 0} icon={Users} />
          <StatsCard title="Toplam Site" value={usersData.totalSites || 0} icon={Globe} />
          <StatsCard title="Toplam Sayfa" value={usersData.totalPages || 0} icon={FileText} />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-6">
        {usersWithPages.length === 0 ? (
          <EmptyState />
        ) : (
          usersWithPages.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDeletePage}
              onSetAsHome={handleSetAsHome}
              onOpenSettings={handleOpenSiteSettings}
              onCreatePage={handleOpenCreatePage}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {selectedSite && (
        <SiteSettingsModal
          siteId={selectedSite.id}
          siteName={selectedSite.name}
          isOpen={isSettingsOpen}
          onClose={closeSiteSettings}
        />
      )}

      {/* Site-specific Create Page Modal */}
      {selectedSiteForCreate && (
        <TemplateSelectionModal
          isOpen={isCreatePageOpen}
          onClose={closeCreatePage}
          onCreatePage={handleSiteSpecificCreatePage}
        />
      )}

      {/* Global Create Page Modal */}
      <CreatePageModal
        isOpen={isGlobalCreateOpen}
        onClose={closeGlobalCreate}
        usersWithoutPages={usersWithoutPages}
      />
    </div>
  );
};

// Helper Components
const StatsCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Henüz sayfa bulunamadı</h3>
      <p className="text-muted-foreground">Kullanıcılar henüz sayfa oluşturmamış.</p>
    </CardContent>
  </Card>
);

export default AllUsersPages;