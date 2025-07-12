// hooks/use-domain-actions.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminDeleteDomain, adminVerifyDomain, adminAddDomain } from "@/actions/domain";

export const useDomainActions = () => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const router = useRouter();

    const setLoading = (id: string, loading: boolean) => {
        setLoadingStates(prev => ({ ...prev, [id]: loading }));
    };

    const handleDeleteDomain = async (domainId: string, domainName: string) => {
        setLoading(domainId, true);
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
            setLoading(domainId, false);
        }
    };

    const handleVerifyDomain = async (domainId: string, domainName: string) => {
        setLoading(domainId, true);
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
            setLoading(domainId, false);
        }
    };

    const handleAddDomain = async (
        domainName: string,
        userId: string,
        siteId: string,
        existingDomains: any[],
        onSuccess?: () => void
    ) => {
        if (!domainName.trim() || !userId || !siteId) {
            toast.error("Lütfen tüm alanları doldurun");
            return false;
        }

        const cleanDomainName = domainName.toLowerCase().trim();

        // Check if domain already exists
        const existingDomain = existingDomains.find(d =>
            d.name.toLowerCase() === cleanDomainName
        );

        if (existingDomain) {
            toast.error("Bu domain adı zaten sistemde mevcut");
            return false;
        }

        setLoading('adding', true);
        try {
            const result = await adminAddDomain({
                name: cleanDomainName,
                siteId,
                userId
            });

            if (result.status === 200) {
                toast.success(`"${cleanDomainName}" domaini başarıyla eklendi!`);
                onSuccess?.();
                router.refresh();
                return true;
            } else {
                toast.error(result.message || "Domain eklenirken bir hata oluştu");
                return false;
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
            return false;
        } finally {
            setLoading('adding', false);
        }
    };

    const handleGlobalAddDomain = async (
        domainName: string,
        userId: string,
        siteId: string,
        existingDomains: any[],
        onSuccess?: () => void
    ) => {
        if (!domainName.trim() || !userId || !siteId) {
            toast.error("Lütfen tüm alanları doldurun");
            return false;
        }

        const cleanDomainName = domainName.toLowerCase().trim();

        // Check if domain already exists
        const existingDomain = existingDomains.find(d =>
            d.name.toLowerCase() === cleanDomainName
        );

        if (existingDomain) {
            toast.error("Bu domain adı zaten sistemde mevcut");
            return false;
        }

        setLoading('globalAdding', true);
        try {
            const result = await adminAddDomain({
                name: cleanDomainName,
                siteId,
                userId
            });

            if (result.status === 200) {
                toast.success(`"${cleanDomainName}" domaini başarıyla eklendi!`);
                onSuccess?.();
                router.refresh();
                return true;
            } else {
                toast.error(result.message || "Domain eklenirken bir hata oluştu");
                return false;
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
            return false;
        } finally {
            setLoading('globalAdding', false);
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

    const isLoading = (key: string) => loadingStates[key] || false;

    return {
        loadingStates,
        handleDeleteDomain,
        handleVerifyDomain,
        handleAddDomain,
        handleGlobalAddDomain,
        formatDate,
        isLoading
    };
};