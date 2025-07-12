// hooks/use-domain-actions.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyDomain, deleteDomain } from "@/actions/domain";

export const useDomainActions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleVerifyDomain = async (domainId: string) => {
        setIsLoading(true);
        try {
            const result = await verifyDomain(domainId);
            
            if (result.status === 200) {
                toast.success("Domain verified successfully!");
                router.refresh(); // Sadece server components'ı yenile
            } else {
                toast.error(result.message || "Domain verification failed");
            }
        } catch (error) {
            toast.error("An error occurred during verification");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDomain = async (domainId: string) => {
        if (!confirm("Are you sure you want to delete this domain?")) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await deleteDomain(domainId);
            
            if (result.status === 200) {
                toast.success("Domain deleted successfully!");
                router.refresh(); // Sadece server components'ı yenile
            } else {
                toast.error(result.message || "Failed to delete domain");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        handleVerifyDomain,
        handleDeleteDomain
    };
};