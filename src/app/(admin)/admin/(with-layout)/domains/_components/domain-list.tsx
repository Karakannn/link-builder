"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Globe } from "lucide-react";
import { Domain, Site } from "@prisma/client";
import { DomainCard } from "./domain-card";
import { AddDomainModal } from "./add-domain-modal";
import { useDomainActions } from "@/hooks/use-domain-actions";

interface DomainWithSite extends Domain {
    site: {
        id: string;
        name: string;
        isPublished: boolean;
    } | null;
}

interface Props {
    domains: DomainWithSite[];
    sites: Site[];
}

export function DomainList({ domains, sites }: Props) {
    const [isAddingDomain, setIsAddingDomain] = useState(false);
    const { handleVerifyDomain, handleDeleteDomain, isLoading } = useDomainActions();

    const closeModal = () => setIsAddingDomain(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Custom Domains</h2>
                    <p className="text-muted-foreground">Connect your own domain to your published sites</p>
                </div>
                <Button 
                    onClick={() => setIsAddingDomain(true)}
                    disabled={sites.length === 0}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Domain
                </Button>
            </div>

            {/* Domains Grid */}
            <div className="grid gap-4">
                {domains.length === 0 ? (
                    <EmptyState hasAvailableSites={sites.length > 0} />
                ) : (
                    domains.map((domain) => (
                        <DomainCard
                            key={domain.id}
                            domain={domain}
                            onVerify={handleVerifyDomain}
                            onDelete={handleDeleteDomain}
                            isLoading={isLoading}
                        />
                    ))
                )}
            </div>

            {/* Add Domain Modal */}
            <AddDomainModal
                isOpen={isAddingDomain}
                onClose={closeModal}
                sites={sites}
                existingDomains={domains}
            />
        </div>
    );
}

// Empty State Component
const EmptyState = ({ hasAvailableSites }: { hasAvailableSites: boolean }) => (
    <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No domains added yet</h3>
            <p className="text-muted-foreground text-center mb-4">
                Add a custom domain to display your site on your own URL
            </p>
            {!hasAvailableSites && (
                <p className="text-sm text-amber-600 mb-4">
                    You need to create a site first before adding domains
                </p>
            )}
        </CardContent>
    </Card>
);