"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Plus
} from "lucide-react";
import { createOverlayFromTemplate, deleteOverlay, updateOverlayName } from "@/actions/overlay";
import { toast } from "sonner";
import { OverlayTemplateSelectionModal } from "./overlay-template-selection-modal";
import { OverlayCard } from "./overlay-card";

type OverlaysData = {
    status: number;
    overlays?: any[];
    message?: string;
};

type Props = {
    overlaysData: OverlaysData;
};

const AllOverlays = ({ overlaysData }: Props) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreatingOverlay, setIsCreatingOverlay] = useState(false);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const handleEdit = (overlayId: string) => {
        router.push("/admin/overlay/builder/" + overlayId);
    };

    const handleCreateOverlay = async (name: string) => {
        setIsCreatingOverlay(true);
        try {
            // Create a basic overlay with default template
            const basicOverlayContent = [
                {
                    id: "overlay-container",
                    name: "Overlay Container",
                    type: "container",
                    styles: {
                        display: "flex",
                        flexDirection: "column",
                        width: "500px",
                        height: "300px",
                        padding: "40px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        gap: "0.5rem",
                    },
                    content: [
                        {
                            id: "overlay-title",
                            name: "Overlay Title",
                            type: "text",
                            styles: {
                                fontSize: "24px",
                                fontWeight: "bold",
                                color: "#667eea",
                                marginBottom: "20px",
                                textAlign: "center",
                            },
                            content: {
                                innerText: name,
                            },
                        },
                        {
                            id: "overlay-content",
                            name: "Overlay Content",
                            type: "text",
                            styles: {
                                fontSize: "16px",
                                color: "#666",
                                lineHeight: "1.6",
                                textAlign: "center",
                                marginBottom: "20px",
                            },
                            content: {
                                innerText: "Overlay içeriğini düzenlemek için editörde değişiklik yapın.",
                            },
                        },
                        {
                            id: "overlay-button",
                            name: "Overlay Button",
                            type: "link",
                            styles: {
                                padding: "12px 24px",
                                fontSize: "16px",
                                backgroundColor: "#667eea",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "500",
                                textAlign: "center",
                                textDecoration: "none",
                            },
                            content: {
                                href: "#",
                                innerText: "Tamam",
                            },
                        },
                    ],
                },
            ];

            const result = await createOverlayFromTemplate(name, basicOverlayContent);

            if (result.status === 200) {
                toast.success("Overlay başarıyla oluşturuldu!");
                router.refresh();
            } else {
                toast.error(result.message || "Overlay oluşturulurken bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsCreatingOverlay(false);
        }
    };

    const handleDeleteOverlay = async (overlayId: string) => {
        setLoadingStates(prev => ({ ...prev, [overlayId]: true }));
        try {
            const result = await deleteOverlay(overlayId);

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

    if (overlaysData.status !== 200) {
        return (
            <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
                <h3 className="text-lg font-medium mb-2">Hata</h3>
                <p>{overlaysData.message || "Overlay'lar yüklenirken bir hata oluştu."}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header with Create Button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Overlaylarım</h2>
                    <p className="text-muted-foreground mt-1">
                        {overlaysData.overlays ? `${overlaysData.overlays.length} overlay` : "Overlay bulunamadı"}
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2" disabled={isCreatingOverlay}>
                    {isCreatingOverlay ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    {isCreatingOverlay ? "Oluşturuluyor..." : "Yeni Overlay Oluştur"}
                </Button>
            </div>

            {/* Overlays Grid */}
            {!overlaysData.overlays || overlaysData.overlays.length === 0 ? (
                <div className="p-8 text-center bg-muted rounded-lg border border-border">
                    <h3 className="text-lg font-medium text-foreground mb-2">Henüz overlay bulunamadı</h3>
                    <p className="text-muted-foreground mb-4">İlk overlay'ınızı oluşturmak için yukarıdaki butonu kullanın</p>
                    <Button onClick={() => setIsModalOpen(true)} variant="outline" className="gap-2" disabled={isCreatingOverlay}>
                        {isCreatingOverlay ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        {isCreatingOverlay ? "Oluşturuluyor..." : "İlk Overlay'ımı Oluştur"}
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {overlaysData.overlays.map((overlay) => (
                        <OverlayCard
                            key={overlay.id}
                            overlay={overlay}
                            onEdit={handleEdit}
                            onDelete={handleDeleteOverlay}
                            isLoading={loadingStates[overlay.id]}
                        />
                    ))}
                </div>
            )}

            {/* Template Selection Modal */}
            <OverlayTemplateSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateOverlay={handleCreateOverlay}
            />
        </div>
    );
};

export default AllOverlays;