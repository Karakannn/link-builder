"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { adminDeleteLiveStreamCard, adminUpdateLiveStreamCardName } from "@/actions/live-stream-card";

export const useLiveStreamCardActions = (router: any) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleEdit = (cardId: string) => {
    router.push("/admin/live-stream-cards/builder/" + cardId);
  };

  const handleDeleteCard = async (cardId: string) => {
    setLoadingStates(prev => ({ ...prev, [cardId]: true }));
    try {
      const result = await adminDeleteLiveStreamCard(cardId);

      if (result.status === 200) {
        toast.success("Stream card başarıyla silindi!");
        router.refresh();
      } else {
        toast.error(result.message || "Stream card silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [cardId]: false }));
    }
  };

  const handleUpdateName = async (cardId: string, name: string) => {
    setLoadingStates(prev => ({ ...prev, [cardId]: true }));
    try {
      const result = await adminUpdateLiveStreamCardName(cardId, name);

      if (result.status === 200) {
        toast.success("Stream card adı başarıyla güncellendi!");
        router.refresh();
      } else {
        toast.error(result.message || "Stream card adı güncellenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [cardId]: false }));
    }
  };

  return {
    handleEdit,
    handleDeleteCard,
    handleUpdateName,
    loadingStates
  };
}; 