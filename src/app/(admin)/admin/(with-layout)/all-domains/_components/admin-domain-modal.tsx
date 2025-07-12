// components/add-domain-modal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useDomainActions } from "@/hooks/use-admin-domain-actions";

interface AddDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingDomains: any[];
    type: "user" | "global";
    user?: any;
    users?: any[];
}

export const AddDomainModal = ({
    isOpen,
    onClose,
    existingDomains,
    type,
    user,
    users
}: AddDomainModalProps) => {
    const [domainName, setDomainName] = useState("");
    const [selectedUser, setSelectedUser] = useState("");

    const { handleAddDomain, handleGlobalAddDomain, isLoading } = useDomainActions();

    const currentUser = type === "user" ? user : users?.find(u => u.id === selectedUser);
    const defaultSite = currentUser?.sites?.[0];

    const handleSubmit = async () => {
        if (type === "global" && !selectedUser) {
            return;
        }

        if (!defaultSite) {
            return;
        }

        const success = type === "user"
            ? await handleAddDomain(
                domainName,
                currentUser.id,
                defaultSite.id,
                existingDomains,
                handleClose
            )
            : await handleGlobalAddDomain(
                domainName,
                currentUser.id,
                defaultSite.id,
                existingDomains,
                handleClose
            );

        // Modal otomatik kapanır success callback'inde
    };

    const handleClose = () => {
        setDomainName("");
        setSelectedUser("");
        onClose();
    };

    const availableUsers = users?.filter(user => user.sites?.length > 0) || [];
    const loadingKey = type === "user" ? "adding" : "globalAdding";

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        {type === "user"
                            ? `${currentUser?.firstname} ${currentUser?.lastname} için Domain Ekle`
                            : "Yeni Domain Ekle"
                        }
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {type === "global" && (
                        <div>
                            <Label>Kullanıcı Seçin</Label>
                            {availableUsers.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Sitesi olan kullanıcı bulunamadı
                                </div>
                            ) : (
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Bir kullanıcı seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUsers.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.firstname} {u.lastname} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {currentUser && (
                        <div>
                            <Label>Site</Label>
                            {defaultSite ? (
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm">
                                        <strong>Otomatik seçildi:</strong> {defaultSite.name}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-3 bg-destructive/10 rounded-lg">
                                    <p className="text-sm text-destructive">
                                        Bu kullanıcının sitesi bulunamadı
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {(type === "user" || selectedUser) && (
                        <div>
                            <Label htmlFor="domain-name">Domain Adı</Label>
                            <Input
                                id="domain-name"
                                value={domainName}
                                onChange={(e) => setDomainName(e.target.value)}
                                placeholder="example.com"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                http:// veya www eklemeyin
                            </p>
                        </div>
                    )}

                    {domainName.trim() && defaultSite && (
                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading(loadingKey)}
                                className="gap-2"
                            >
                                {isLoading(loadingKey) ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                {isLoading(loadingKey) ? "Ekleniyor..." : "Domain Ekle"}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};