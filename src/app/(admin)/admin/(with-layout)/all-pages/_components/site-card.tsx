import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { PageCard } from "./page-card";

type SiteCardProps = {
    site: any;
    onEdit: (pageId: string) => void;
    onDelete: (pageId: string, pageTitle: string) => void;
    onSetAsHome: (pageId: string, pageTitle: string) => void;
    onOpenSettings: (site: any) => void;
    onCreatePage?: (site: any) => void;
};

export const SiteCard = ({ site, onEdit, onDelete, onSetAsHome, onOpenSettings, onCreatePage }: SiteCardProps) => {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="font-semibold text-lg">{site.name}</h4>
                    <p className="text-sm text-muted-foreground">
                        {site.description || "Açıklama yok"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={site.isPublished ? "default" : "secondary"}>
                        {site.isPublished ? "Yayında" : "Taslak"}
                    </Badge>
                    {site.isDefault && <Badge variant="outline">Varsayılan</Badge>}
                    <Button size="sm" variant="outline" onClick={() => onOpenSettings(site)}>
                        <Settings className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onCreatePage?.(site)}>
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {site.pages.map((page: any) => (
                    <PageCard
                        key={page.id}
                        page={page}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSetAsHome={onSetAsHome}
                    />
                ))}
            </div>
        </div>
    );
};