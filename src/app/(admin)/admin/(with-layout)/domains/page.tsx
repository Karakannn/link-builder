export const dynamic = "force-dynamic";

import React from "react";
import { DomainList } from "./_components/domain-list";
import { getUserDomains } from "@/actions/domain";
import { getAllSites } from "@/actions/page";

export default async function DomainsPage() {
    const [domainsData, sitesData] = await Promise.all([getUserDomains(), getAllSites()]);

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                    <DomainList domains={domainsData.domains || []} sites={sitesData.sites || []} />
                </div>
            </div>
        </div>
    );
}
