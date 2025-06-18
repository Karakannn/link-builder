"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModalCard } from "./modal-card";
import { ModalTemplateSelectionModal } from "./modal-template-selection-modal";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { createModalFromTemplate, deleteModal } from "@/actions/landing-modal";
import { ModalTemplate } from "@/constants/modal-templates";
import { ModalTheme } from "@/constants/modal-templates";
import { ModalLayout } from "@/constants/modal-templates";
import { toast } from "sonner";

type ModalsData = {
  status: number;
  modals?: any[];
  message?: string;
};

type Props = {
  modalsData: ModalsData;
};

const AllModals = ({ modalsData }: Props) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleEdit = (modalId: string) => {
    router.push("/admin/landing-modal/builder/" + modalId);
  };

  const handleCreateModal = async (name: string, template: ModalTemplate, theme: ModalTheme, layout: ModalLayout) => {
    setIsCreatingModal(true);
    try {
      const templateContent = template.getContent(theme, layout);
      const result = await createModalFromTemplate(name, templateContent);
      
      if (result.status === 200) {
        toast.success("Modal başarıyla oluşturuldu!");
        router.refresh();
      } else {
        toast.error(result.message || "Modal oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsCreatingModal(false);
    }
  };

  const handleDeleteModal = async (modalId: string) => {
    setLoadingStates(prev => ({ ...prev, [modalId]: true }));
    try {
      const result = await deleteModal(modalId);
      
      if (result.status === 200) {
        toast.success("Modal başarıyla silindi!");
        router.refresh();
      } else {
        toast.error(result.message || "Modal silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [modalId]: false }));
    }
  };

  if (modalsData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{modalsData.message || "Modallar yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Landing Modallarım</h2>
          <p className="text-muted-foreground mt-1">
            {modalsData.modals ? `${modalsData.modals.length} modal` : "Modal bulunamadı"}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2" disabled={isCreatingModal}>
          {isCreatingModal ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isCreatingModal ? "Oluşturuluyor..." : "Yeni Modal Oluştur"}
        </Button>
      </div>

      {/* Modals Grid */}
      {!modalsData.modals || modalsData.modals.length === 0 ? (
        <div className="p-8 text-center bg-muted rounded-lg border border-border">
          <h3 className="text-lg font-medium text-foreground mb-2">Henüz modal bulunamadı</h3>
          <p className="text-muted-foreground mb-4">İlk modalınızı oluşturmak için yukarıdaki butonu kullanın</p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="gap-2" disabled={isCreatingModal}>
            {isCreatingModal ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isCreatingModal ? "Oluşturuluyor..." : "İlk Modalımı Oluştur"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modalsData.modals.map((modal) => (
            <ModalCard 
              key={modal.id} 
              modal={modal} 
              onEdit={handleEdit}
              onDelete={handleDeleteModal}
              isLoading={loadingStates[modal.id]}
            />
          ))}
        </div>
      )}

      {/* Template Selection Modal */}
      <ModalTemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateModal={handleCreateModal}
      />
    </div>
  );
};

export default AllModals; 