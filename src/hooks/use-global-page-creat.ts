// hooks/use-global-create.ts
import { useState } from "react";
import { toast } from "sonner";
import { getUsersWithoutPages } from "@/actions/page";

export const useGlobalCreate = () => {
    const [isGlobalCreateOpen, setIsGlobalCreateOpen] = useState(false);
    const [usersWithoutPages, setUsersWithoutPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const openGlobalCreate = async () => {
        setIsGlobalCreateOpen(true);
        setIsLoading(true);

        try {
            const result = await getUsersWithoutPages();
            if (result.status === 200) {
                setUsersWithoutPages(result.users || []);
            } else {
                toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const closeGlobalCreate = () => {
        setIsGlobalCreateOpen(false);
        setUsersWithoutPages([]);
    };

    return {
        isGlobalCreateOpen,
        usersWithoutPages,
        isLoading,
        openGlobalCreate,
        closeGlobalCreate
    };
};