import { useState } from "react";
import { toast } from "sonner";
import { adminDeletePage, adminSetPageAsHome } from "@/actions/page";

export const usePageActions = (router: any) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const setLoading = (id: string, loading: boolean) => {
        setLoadingStates(prev => ({ ...prev, [id]: loading }));
    };

    const handleEdit = (pageId: string) => {
        router.push("/admin/builder/" + pageId);
    };

    const handleDeletePage = async (pageId: string, pageTitle: string) => {
        setLoading(pageId, true);
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
            setLoading(pageId, false);
        }
    };

    const handleSetAsHome = async (pageId: string, pageTitle: string) => {
        setLoading(pageId, true);
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
            setLoading(pageId, false);
        }
    };

    return {
        loadingStates,
        handleEdit,
        handleDeletePage,
        handleSetAsHome
    };
};