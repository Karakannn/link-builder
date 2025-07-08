"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserNav } from "@/components/global/user-nav";
import { useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Page, User } from "@prisma/client";
import { useDataActions } from "@/hooks/editor-actions/use-data-actions";
import { DeviceSelector } from "./device-selector";
import { HistoryControls } from "./history-controls";
import { PreviewControls } from "./preview-controls";
import { SaveButton } from "./save-button";
import { LastUpdatedInfo } from "./last-updated-info";
import { usePreviewMode } from "@/providers/editor/editor-ui-context";

interface Props {
    user: User;
    pageDetails: Page;
}

const FunnelEditorNavigation: React.FC<Props> = memo(({ user, pageDetails }) => {

    const pathname = usePathname();
    
    const { setPageId } = useDataActions();
    
    const [lastUpdated, setLastUpdated] = useState<Date>(pageDetails.updatedAt || new Date());
    const previewMode = usePreviewMode();

    const isLandingModalPage = pathname?.includes("landing-modal");
    const isLiveStreamCardPage = pathname?.includes("live-stream-cards");

    useEffect(() => {
        setPageId(pageDetails.id);
    }, [pageDetails.id, setPageId]);

    const handleSaveSuccess = useCallback(() => {
        setLastUpdated(new Date());
    }, []);

    const backLink = isLandingModalPage ? `/admin/landing-modal` : isLiveStreamCardPage ? `/admin/live-stream-cards` : `/admin/sites`;

    return (
        <TooltipProvider>
            <nav
                className={clsx(`border-b flex items-center justify-between p-6 gap-2 transition-all`, {
                    "!h-0 !p-0 !overflow-hidden": previewMode,
                })}
            >
                <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
                    <Link href={backLink}>
                        <ArrowLeftCircle />
                    </Link>
                    <div className="flex flex-col w-full">
                        <Input defaultValue={pageDetails.title} className="border-none h-5 m-0 p-0 text-lg" />
                    </div>
                </aside>

                <aside>
                    <DeviceSelector />
                </aside>

                <aside className="flex items-center gap-2">
                    <PreviewControls />
                    <HistoryControls />
                    <LastUpdatedInfo lastUpdated={lastUpdated} />
                    <SaveButton pageDetails={pageDetails} onSaveSuccess={handleSaveSuccess} />
                    <div className="ml-2">
                        <UserNav user={user} />
                    </div>
                </aside>
            </nav>
        </TooltipProvider>
    );
});

export default FunnelEditorNavigation;
