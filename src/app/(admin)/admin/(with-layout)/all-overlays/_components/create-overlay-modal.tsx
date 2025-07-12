"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { adminCreateOverlayFromTemplate } from "@/actions/overlay";
import { createSafeOverlayTemplate } from "@/lib/utils";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
    users?: any[];
    existingOverlays: any[];
    type: "user" | "global";
    onCreateOverlay?: (name: string) => void;
    onSuccess?: () => void;
};

export const CreateOverlayModal = ({
    isOpen,
    onClose,
    user,
    users = [],
    existingOverlays,
    type,
    onCreateOverlay,
    onSuccess
}: Props) => {
    const [overlayName, setOverlayName] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateOverlay = async () => {
        if (!overlayName.trim()) {
            toast.error("Overlay adı boş olamaz");
            return;
        }

        if (type === "user" && !user) {
            toast.error("Kullanıcı seçilmedi");
            return;
        }

        if (type === "global" && !selectedUserId) {
            toast.error("Kullanıcı seçilmedi");
            return;
        }

        // Check if overlay name already exists for the user
        const targetUserId = type === "user" ? user.id : selectedUserId;
        const userOverlays = existingOverlays.filter(o => o.userId === targetUserId);
        const nameExists = userOverlays.some(o => {
            return o.name.toLowerCase() === overlayName.toLowerCase()
        });

        if (nameExists) {
            toast.error(`"${overlayName}" isimli bir overlay zaten mevcut`);
            return;
        }

        setIsCreating(true);
        try {
            const basicContent = createSafeOverlayTemplate(overlayName);
            const result = await adminCreateOverlayFromTemplate(overlayName, basicContent, targetUserId);

            if (result.status === 200) {
                toast.success(`"${overlayName}" overlay'i başarıyla oluşturuldu!`);
                setOverlayName("");
                setSelectedUserId("");
                onClose();
                onSuccess?.();
            } else {
                toast.error(result.message || "Overlay oluşturulurken bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        setOverlayName("");
        setSelectedUserId("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {type === "user" ? "Kullanıcıya Overlay Ekle" : "Yeni Overlay Oluştur"}
                    </DialogTitle>
                    <DialogDescription>
                        {type === "user"
                            ? `${user?.firstname || user?.email} kullanıcısı için yeni bir overlay oluşturun.`
                            : "Seçilen kullanıcı için yeni bir overlay oluşturun."
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {type === "global" && (
                        <div className="grid gap-2">
                            <Label htmlFor="user">Kullanıcı Seç</Label>
                            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Kullanıcı seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.firstname && user.lastname
                                                ? `${user.firstname} ${user.lastname} (${user.email})`
                                                : user.email
                                            }
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="overlay-name">Overlay Adı</Label>
                        <Input
                            id="overlay-name"
                            value={overlayName}
                            onChange={(e) => setOverlayName(e.target.value)}
                            placeholder="Overlay adını girin"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreateOverlay();
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleCreateOverlay}
                        disabled={isCreating || !overlayName.trim() || (type === "global" && !selectedUserId)}
                    >
                        {isCreating ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 