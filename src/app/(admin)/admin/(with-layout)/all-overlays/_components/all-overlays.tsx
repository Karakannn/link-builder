"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, FileText, Plus, Monitor } from "lucide-react";
import { toast } from "sonner";
import { adminCreateOverlayFromTemplate, adminDeleteOverlay, adminUpdateOverlayName } from "@/actions/overlay";
import { createSafeOverlayTemplate } from "@/lib/utils";
import { UserOverlayCard } from "./user-overlay-card";
import { CreateOverlayModal } from "./create-overlay-modal";
import { useOverlayActions } from "@/hooks/use-overlay-actions";

// Kullanıcıya göre grupla
function groupByUser(overlays: any[]) {
  const grouped: Record<string, { user: any; overlays: any[] }> = {};
  for (const overlay of overlays) {
    const userId = overlay.user?.email || overlay.user?.id || "unknown";
    if (!grouped[userId]) {
      grouped[userId] = {
        user: overlay.user,
        overlays: [],
      };
    }
    grouped[userId].overlays.push(overlay);
  }
  return grouped;
}

type OverlaysData = {
  status: number;
  overlays?: any[];
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
  overlaysData: OverlaysData;
  usersData: UsersData;
};

const AllOverlays = ({ overlaysData, usersData }: Props) => {
  const router = useRouter();
  const [selectedUserForModal, setSelectedUserForModal] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGlobalCreateOpen, setIsGlobalCreateOpen] = useState(false);
  
  const { handleEdit, handleDeleteOverlay, handleUpdateName, loadingStates } = useOverlayActions(router);

  const handleOpenUserModal = (user: any) => {
    const fullUserData = usersData.users?.find(u => u.id === user.id);
    setSelectedUserForModal(fullUserData);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUserForModal(null);
  };

  const handleUserSpecificCreateOverlay = async (name: string) => {
    if (!selectedUserForModal) return;
    
    try {
      const basicContent = createSafeOverlayTemplate(name);
      const result = await adminCreateOverlayFromTemplate(name, basicContent, selectedUserForModal.id);
      
      if (result.status === 200) {
        toast.success(`"${name}" overlay'i başarıyla oluşturuldu!`);
        closeUserModal();
        router.refresh();
      } else {
        toast.error(result.message || "Overlay oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    }
  };

  if (overlaysData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{overlaysData.message || "Overlay verileri yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  const grouped = groupByUser(overlaysData.overlays || []);
  const userCount = Object.keys(grouped).length;
  const overlayCount = overlaysData.overlays?.length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tüm Kullanıcı Overlay'ları</h1>
            <p className="text-muted-foreground mt-2">
              Sistemdeki tüm kullanıcıların overlay'larını görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setIsGlobalCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni Overlay Oluştur
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Toplam Kullanıcı" value={userCount} icon={Users} />
          <StatsCard title="Toplam Overlay" value={overlayCount} icon={Monitor} />
          <StatsCard title="Aktif Kullanıcı" value={usersData.totalUsers || 0} icon={Globe} />
        </div>
      </div>

      {/* Overlays List */}
      <div className="space-y-6">
        {userCount === 0 ? (
          <EmptyState />
        ) : (
          Object.values(grouped).map(({ user, overlays }) => (
            <UserOverlayCard
              key={user?.email || user?.id || Math.random()}
              user={user}
              overlays={overlays}
              onAddOverlay={() => handleOpenUserModal(user)}
              onEdit={handleEdit}
              onDelete={handleDeleteOverlay}
              onUpdateName={handleUpdateName}
              loadingStates={loadingStates}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <CreateOverlayModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        user={selectedUserForModal}
        existingOverlays={overlaysData.overlays || []}
        type="user"
        onCreateOverlay={handleUserSpecificCreateOverlay}
        onSuccess={() => router.refresh()}
      />

      <CreateOverlayModal
        isOpen={isGlobalCreateOpen}
        onClose={() => setIsGlobalCreateOpen(false)}
        users={usersData.users || []}
        existingOverlays={overlaysData.overlays || []}
        type="global"
        onSuccess={() => router.refresh()}
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
      <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Henüz overlay bulunamadı</h3>
      <p className="text-muted-foreground">Kullanıcılar henüz overlay oluşturmamış.</p>
    </CardContent>
  </Card>
);

export default AllOverlays; 