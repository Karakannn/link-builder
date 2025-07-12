"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { adminDeleteOverlay, adminUpdateOverlayName } from "@/actions/overlay";

export const useOverlayActions = (router: any) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleEdit = (overlayId: string) => {
    router.push("/admin/overlay/builder/" + overlayId);
  };

  const handleDeleteOverlay = async (overlayId: string) => {
    setLoadingStates(prev => ({ ...prev, [overlayId]: true }));
    try {
      const result = await adminDeleteOverlay(overlayId);

      if (result.status === 200) {
        toast.success("Overlay başarıyla silindi!");
        router.refresh();
      } else {
        toast.error(result.message || "Overlay silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [overlayId]: false }));
    }
  };

  const handleUpdateName = async (overlayId: string, name: string) => {
    setLoadingStates(prev => ({ ...prev, [overlayId]: true }));
    try {
      const result = await adminUpdateOverlayName(overlayId, name);

      if (result.status === 200) {
        toast.success("Overlay adı başarıyla güncellendi!");
        router.refresh();
      } else {
        toast.error(result.message || "Overlay adı güncellenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [overlayId]: false }));
    }
  };

  return {
    handleEdit,
    handleDeleteOverlay,
    handleUpdateName,
    loadingStates
  };
}; 