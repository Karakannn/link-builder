"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UserDomainCard } from "./admin-user-domain-card";
import { AddDomainModal } from "./admin-domain-modal";
import { StatsCards } from "./stats-cards";
import { useDomainActions } from "@/hooks/use-admin-domain-actions";

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
  const [isGlobalCreateOpen, setIsGlobalCreateOpen] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const { handleDeleteDomain, handleVerifyDomain, loadingStates } = useDomainActions();

  const handleOpenUserModal = (user: any) => {
    const fullUserData = usersData.users?.find(u => u.id === user.id);
    setSelectedUserForModal(fullUserData);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUserForModal(null);
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
          <Button onClick={() => setIsGlobalCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni Domain Ekle
          </Button>
        </div>

        {/* Stats */}
        <StatsCards 
          userCount={userCount}
          domainCount={domainCount}
          verifiedCount={verifiedCount}
        />
      </div>

      {/* Domain List */}
      <div className="space-y-6">
        {userCount === 0 ? (
          <EmptyState />
        ) : (
          Object.values(grouped).map(({ user, domains }) => (
            <UserDomainCard
              key={user?.email || user?.id || Math.random()}
              user={user}
              domains={domains}
              onAddDomain={() => handleOpenUserModal(user)}
              onDeleteDomain={handleDeleteDomain}
              onVerifyDomain={handleVerifyDomain}
              loadingStates={loadingStates}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <AddDomainModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        user={selectedUserForModal}
        existingDomains={domainsData.domains || []}
        type="user"
      />

      <AddDomainModal
        isOpen={isGlobalCreateOpen}
        onClose={() => setIsGlobalCreateOpen(false)}
        users={usersData.users || []}
        existingDomains={domainsData.domains || []}
        type="global"
      />
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Henüz domain bulunamadı</h3>
      <p className="text-muted-foreground">Kullanıcılar henüz domain eklememiş.</p>
    </CardContent>
  </Card>
);

export default AllDomains;