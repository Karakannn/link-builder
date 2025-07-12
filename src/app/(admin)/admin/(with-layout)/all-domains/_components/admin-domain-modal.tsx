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

export const AddDomainModal = ({ isOpen, onClose, existingDomains, type, user, users }: AddDomainModalProps) => {
    const [domainName, setDomainName] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const { handleAddDomain, handleGlobalAddDomain, isLoading } = useDomainActions();

    const currentUser = type === "user" ? user : users?.find(u => u.id === selectedUser);
    const defaultSite = currentUser?.sites?.[0];
    const availableUsers = users?.filter(user => user.sites?.length > 0) || [];
    const loadingKey = type === "user" ? "adding" : "globalAdding";
    const canSubmit = domainName.trim() && defaultSite;

    const handleSubmit = async () => {
        if (!currentUser || !defaultSite) return;

        const action = type === "user" ? handleAddDomain : handleGlobalAddDomain;
        await action(domainName, currentUser.id, defaultSite.id, existingDomains, handleClose);
    };

    const handleClose = () => {
        setDomainName("");
        setSelectedUser("");
        onClose();
    };

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
                    <UserSelector
                        type={type}
                        availableUsers={availableUsers}
                        selectedUser={selectedUser}
                        onUserChange={setSelectedUser}
                    />

                    <SiteInfo currentUser={currentUser} defaultSite={defaultSite} />

                    <DomainInput
                        type={type}
                        selectedUser={selectedUser}
                        domainName={domainName}
                        onDomainChange={setDomainName}
                    />

                    <SubmitButton
                        canSubmit={canSubmit}
                        isLoading={isLoading(loadingKey)}
                        onSubmit={handleSubmit}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Helper Components
const UserSelector = ({ type, availableUsers, selectedUser, onUserChange }: {
    type: string;
    availableUsers: any[];
    selectedUser: string;
    onUserChange: (value: string) => void;
}) => {
    if (type !== "global") return null;

    return (
        <div>
            <Label>Kullanıcı Seçin</Label>
            {availableUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                    Sitesi olan kullanıcı bulunamadı
                </div>
            ) : (
                <Select value={selectedUser} onValueChange={onUserChange}>
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
    );
};

const SiteInfo = ({ currentUser, defaultSite }: { currentUser: any; defaultSite: any }) => {
    if (!currentUser) return null;

    return (
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
    );
};

const DomainInput = ({ type, selectedUser, domainName, onDomainChange }: {
    type: string;
    selectedUser: string;
    domainName: string;
    onDomainChange: (value: string) => void;
}) => {
    if (type === "global" && !selectedUser) return null;

    return (
        <div>
            <Label htmlFor="domain-name">Domain Adı</Label>
            <Input
                id="domain-name"
                value={domainName}
                onChange={(e) => onDomainChange(e.target.value)}
                placeholder="example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
                http:// veya www eklemeyin
            </p>
        </div>
    );
};

const SubmitButton = ({ canSubmit, isLoading, onSubmit }: {
    canSubmit: boolean;
    isLoading: boolean;
    onSubmit: () => void;
}) => {
    if (!canSubmit) return null;

    return (
        <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={onSubmit} disabled={isLoading} className="gap-2">
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Plus className="w-4 h-4" />
                )}
                {isLoading ? "Ekleniyor..." : "Domain Ekle"}
            </Button>
        </div>
    );
};