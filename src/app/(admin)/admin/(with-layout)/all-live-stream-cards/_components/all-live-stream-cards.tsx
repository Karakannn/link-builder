"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, FileText, Plus, Video } from "lucide-react";
import { toast } from "sonner";
import { adminCreateLiveStreamCardFromTemplate, adminDeleteLiveStreamCard, adminUpdateLiveStreamCardName } from "@/actions/live-stream-card";
import { createSafeLiveStreamCardTemplate } from "@/lib/utils";
import { UserLiveStreamCard } from "./admin-user-live-stream-card";
import { CreateLiveStreamCardModal } from "./admin-create-live-stream-card-modal";
import { useLiveStreamCardActions } from "@/hooks/use-live-stream-card-actions";

// Kullanıcıya göre grupla
function groupByUser(cards: any[]) {
  const grouped: Record<string, { user: any; cards: any[] }> = {};
  for (const card of cards) {
    const userId = card.user?.email || card.user?.id || "unknown";
    if (!grouped[userId]) {
      grouped[userId] = {
        user: card.user,
        cards: [],
      };
    }
    grouped[userId].cards.push(card);
  }
  return grouped;
}

type CardsData = {
  status: number;
  cards?: any[];
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
  cardsData: CardsData;
  usersData: UsersData;
};

const AllLiveStreamCards = ({ cardsData, usersData }: Props) => {
  const router = useRouter();
  const [selectedUserForModal, setSelectedUserForModal] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isGlobalCreateOpen, setIsGlobalCreateOpen] = useState(false);
  
  const { handleEdit, handleDeleteCard, handleUpdateName, loadingStates } = useLiveStreamCardActions(router);

  const handleOpenUserModal = (user: any) => {
    const fullUserData = usersData.users?.find(u => u.id === user.id);
    setSelectedUserForModal(fullUserData);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUserForModal(null);
  };

  const handleUserSpecificCreateCard = async (name: string) => {
    if (!selectedUserForModal) return;
    
    try {
      const basicContent = createSafeLiveStreamCardTemplate(name);
      const result = await adminCreateLiveStreamCardFromTemplate(name, basicContent, selectedUserForModal.id);
      
      if (result.status === 200) {
        toast.success(`"${name}" stream card'ı başarıyla oluşturuldu!`);
        closeUserModal();
        router.refresh();
      } else {
        toast.error(result.message || "Stream card oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    }
  };

  if (cardsData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{cardsData.message || "Stream card verileri yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  const grouped = groupByUser(cardsData.cards || []);
  const userCount = Object.keys(grouped).length;
  const cardCount = cardsData.cards?.length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tüm Kullanıcı Live Stream Card'ları</h1>
            <p className="text-muted-foreground mt-2">
              Sistemdeki tüm kullanıcıların live stream card'larını görüntüleyin ve yönetin
            </p>
          </div>
          <Button onClick={() => setIsGlobalCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni Stream Card Oluştur
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Toplam Kullanıcı" value={userCount} icon={Users} />
          <StatsCard title="Toplam Stream Card" value={cardCount} icon={Video} />
          <StatsCard title="Aktif Kullanıcı" value={usersData.totalUsers || 0} icon={Globe} />
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {userCount === 0 ? (
          <EmptyState />
        ) : (
          Object.values(grouped).map(({ user, cards }) => (
            <UserLiveStreamCard
              key={user?.email || user?.id || Math.random()}
              user={user}
              cards={cards}
              onAddCard={() => handleOpenUserModal(user)}
              onEdit={handleEdit}
              onDelete={handleDeleteCard}
              onUpdateName={handleUpdateName}
              loadingStates={loadingStates}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <CreateLiveStreamCardModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        user={selectedUserForModal}
        existingCards={cardsData.cards || []}
        type="user"
        onCreateCard={handleUserSpecificCreateCard}
        onSuccess={() => router.refresh()}
      />

      <CreateLiveStreamCardModal
        isOpen={isGlobalCreateOpen}
        onClose={() => setIsGlobalCreateOpen(false)}
        users={usersData.users || []}
        existingCards={cardsData.cards || []}
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
      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Henüz stream card bulunamadı</h3>
      <p className="text-muted-foreground">Kullanıcılar henüz stream card oluşturmamış.</p>
    </CardContent>
  </Card>
);

export default AllLiveStreamCards; 