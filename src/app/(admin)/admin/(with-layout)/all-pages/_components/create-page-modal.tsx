import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TemplateSelectionModal } from "../../sites/_components/template-selection-modal";
import { adminCreatePageFromTemplate } from "@/actions/page";
import { createSafePageTemplate } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const createPageSchema = z.object({
    userId: z.string().min(1, "Kullanıcı seçimi zorunludur"),
    siteId: z.string().min(1, "Site seçimi zorunludur"),
});

type CreatePageFormValues = z.infer<typeof createPageSchema>;

type CreatePageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    usersWithoutPages: any[];
};

export const CreatePageModal = ({ isOpen, onClose, usersWithoutPages }: CreatePageModalProps) => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [showTemplateSelection, setShowTemplateSelection] = useState(false);

    const form = useForm<CreatePageFormValues>({
        resolver: zodResolver(createPageSchema),
        defaultValues: {
            userId: "",
            siteId: "",
        },
    });

    const selectedUserId = form.watch("userId");
    const selectedSiteId = form.watch("siteId");

    const usersWithSites = usersWithoutPages.filter(user => user.sites.length > 0);
    const selectedUserData = usersWithoutPages.find(user => user.id === selectedUserId);

    const onSubmit = async (values: CreatePageFormValues) => {
        if (!values.siteId) {
            toast.error("Lütfen bir site seçin");
            return;
        }
        setShowTemplateSelection(true);
    };

    const handleCreatePage = async (title: string, slug: string) => {
        const siteId = form.getValues("siteId");

        if (!siteId) {
            toast.error("Lütfen bir site seçin");
            return;
        }

        setIsCreating(true);
        try {
            const basicContent = createSafePageTemplate(title);
            const result = await adminCreatePageFromTemplate(title, slug, basicContent, siteId);

            if (result.status === 200) {
                toast.success(`"${title}" sayfası başarıyla oluşturuldu!`);
                handleClose();
                router.refresh();
            } else {
                toast.error(result.message || "Sayfa oluşturulırken bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        form.reset();
        setShowTemplateSelection(false);
        onClose();
    };

    const handleUserChange = (userId: string) => {
        form.setValue("userId", userId);
        form.setValue("siteId", "");
    };

    return (
        <>
            {/* Main Create Page Modal */}
            <Dialog open={isOpen && !showTemplateSelection} onOpenChange={(open) => {
                if (!open) handleClose();
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Yeni Sayfa Oluştur</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* User Selection */}
                            <FormField
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <FormItem className="space-y-4 p-4 bg-muted rounded-lg">
                                        <FormLabel className="text-base font-medium">Kullanıcı Seçin</FormLabel>
                                        <FormControl>
                                            {usersWithSites.length === 0 ? (
                                                <div className="text-center py-4 text-muted-foreground">
                                                    Tüm kullanıcıların zaten sayfaları var.
                                                </div>
                                            ) : (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={handleUserChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Bir kullanıcı seçin" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {usersWithSites.map((user) => (
                                                            <SelectItem key={user.id} value={user.id}>
                                                                {user.firstname} {user.lastname} ({user.email})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Site Selection */}
                            {selectedUserId && selectedUserData && (
                                <FormField
                                    control={form.control}
                                    name="siteId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4 p-4 bg-muted rounded-lg">
                                            <FormLabel className="text-base font-medium">Site Seçin</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Bir site seçin" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {selectedUserData.sites.map((site: any) => (
                                                            <SelectItem key={site.id} value={site.id}>
                                                                {site.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isCreating}
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!selectedSiteId || isCreating}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Devam Ediliyor...
                                        </>
                                    ) : (
                                        "Template Seç"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <TemplateSelectionModal
                isOpen={showTemplateSelection}
                onClose={() => {
                    setShowTemplateSelection(false);
                }}
                onCreatePage={handleCreatePage}
            />
        </>
    );
};