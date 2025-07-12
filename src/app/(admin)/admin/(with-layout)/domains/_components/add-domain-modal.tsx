import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site, Domain } from "@prisma/client";
import { toast } from "sonner";
import { addDomain } from "@/actions/domain";

interface AddDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    sites: Site[];
    existingDomains: Domain[];
}

export const AddDomainModal = ({ isOpen, onClose, sites, existingDomains }: AddDomainModalProps) => {
    const [domainName, setDomainName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // İlk site'ı otomatik seç
    const defaultSite = sites[0];

    const handleSubmit = async () => {
        if (!domainName) {
            toast.error("Lütfen domain adı girin");
            return;
        }

        if (!defaultSite) {
            toast.error("Henüz hiç siteniz yok. Önce bir site oluşturun.");
            return;
        }

        const cleanDomainName = domainName.toLowerCase().trim();

        // Check if domain already exists
        const existingDomain = existingDomains.find(d =>
            d.name.toLowerCase() === cleanDomainName
        );

        if (existingDomain) {
            toast.error("Bu domain adı zaten kullanılıyor");
            return;
        }

        setIsLoading(true);
        try {
            const result = await addDomain({
                name: cleanDomainName,
                siteId: defaultSite.id,
            });

            if (result.status === 200) {
                toast.success("Domain başarıyla eklendi!");
                handleClose();
                router.refresh(); // Sadece server components'ı yenile
            } else {
                toast.error(result.message || "Domain eklenirken bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setDomainName("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Custom Domain</DialogTitle>
                    <DialogDescription>
                        Domain will be connected to your default site: <strong>{defaultSite?.name || "No site available"}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    <div>
                        <Label htmlFor="domain">Domain Name</Label>
                        <Input
                            id="domain"
                            placeholder="example.com"
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Don't include http:// or www
                        </p>
                    </div>

                    {defaultSite && (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                <strong>Site:</strong> {defaultSite.name}
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !defaultSite}
                        className="w-full"
                    >
                        {isLoading ? "Adding..." : "Add Domain"}
                    </Button>

                    {!defaultSite && (
                        <p className="text-sm text-destructive text-center">
                            You need to create a site first before adding domains.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};