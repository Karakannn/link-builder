import { getAuthUserDetails, onAdminUser } from "@/actions/auth";
import { getPageById, adminGetPageById } from "@/actions/page";
import { getPublicSiteOverlaySettings, getSiteOverlaySettings, getPublicOverlayContent } from "@/actions/overlay";
import { getPublicLiveStreamCardContent } from "@/actions/live-stream-card";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider from "@/providers/editor/editor-provider";
import { LivePreviewWrapper } from "./_components/live-preview-wrapper";
import { client } from "@/lib/prisma";
import { Metadata } from "next";
import { parsePageContent } from "@/lib/utils";

type Props = {
    params: Promise<{ pageId: string }>;
    searchParams: Promise<{ live?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { pageId } = await params;
    const { live } = await searchParams;
    const isLiveMode = live === 'true';

    try {
        const pageData = await client.page.findUnique({
            where: { id: pageId },
            include: { site: { include: { settings: true } } },
        });

        if (!pageData?.site) {
            return {
                title: isLiveMode ? "Live Preview" : "Page Editor",
                description: "LinkBuilder - Build amazing landing pages",
            };
        }

        const { site: { settings, name, description }, title } = pageData;
        const finalTitle = settings?.title || title || name;
        const favicon = settings?.favicon || "/favicon.ico";

        return {
            title: isLiveMode ? finalTitle : `${finalTitle} - Editor`,
            description: description || `Edit and preview ${name}`,
            icons: { icon: favicon, shortcut: favicon, apple: favicon },
            openGraph: {
                title: finalTitle,
                description: description || `Edit and preview ${name}`,
                siteName: name,
                type: "website",
            },
        };
    } catch (error) {
        return {
            title: isLiveMode ? "Live Preview" : "Page Editor",
            description: "LinkBuilder - Build amazing landing pages",
        };
    }
}

async function getCompleteOverlayData(siteId: string, isAdmin: boolean) {
    try {
        const fn = isAdmin ? getSiteOverlaySettings : getPublicSiteOverlaySettings;
        const settingsResult = await fn(siteId);

        if (settingsResult.status !== 200 || !settingsResult.settings) {
            return null;
        }

        const { enableOverlay, selectedOverlayId, selectedCardId, liveStreamLink, googleAnalyticsId } = settingsResult.settings;

        const [overlayContent, liveStreamContent] = await Promise.all([
            selectedOverlayId ? getPublicOverlayContent(selectedOverlayId).catch(() => null) : Promise.resolve(null),
            selectedCardId ? getPublicLiveStreamCardContent(selectedCardId).catch(() => null) : Promise.resolve(null)
        ]);

        return {
            settings: {
                enableOverlay,
                selectedOverlayId,
                selectedCardId,
                liveStreamLink,
                googleAnalyticsId
            },
            overlayContent: overlayContent?.content ? JSON.parse(String(overlayContent.content)) : null,
            liveStreamContent: liveStreamContent?.card?.content ? JSON.parse(String(liveStreamContent.card.content)) : null
        };
    } catch (error) {
        console.error("❌ Error loading complete overlay data:", error);
        return null;
    }
}

export default async function page({ params, searchParams }: Props) {
    const { pageId } = await params;
    const { live } = await searchParams;
    const isLiveMode = live === 'true';

    const [user, adminCheck] = await Promise.all([
        getAuthUserDetails(),
        onAdminUser(),
    ]);

    const pageData = adminCheck.status === 200
        ? await adminGetPageById(pageId)
        : await getPageById(pageId);

    if (!pageData?.page || pageData.status !== 200 || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Sayfa Yüklenemedi</h2>
                    <p className="text-muted-foreground">
                        {pageData?.message || "Sayfa bulunamadı veya erişim izniniz yok."}
                    </p>
                </div>
            </div>
        );
    }

    const { page } = pageData;
    const pageContent = parsePageContent(page.content);

    if (isLiveMode) {
        const completeOverlayData = await getCompleteOverlayData(page.siteId, adminCheck.status === 200);

        return (
            <EditorProvider siteId={page.siteId} pageDetails={pageContent}>
                <LivePreviewWrapper
                    pageContent={pageContent}
                    siteId={page.siteId}
                    overlayData={completeOverlayData}
                />
            </EditorProvider>
        );
    }

    console.log(pageContent);

    return (
        <EditorProvider siteId={page.id} pageDetails={pageContent}>
            <DndContextProvider>
                <div className="flex flex-col h-full">
                    <FunnelEditorNavigation user={user} pageDetails={page} />
                    <div className="h-full flex justify-center">
                        <FunnelEditor pageDetails={pageContent} />
                    </div>
                    <FunnelEditorSidebar userId={user.id} />
                </div>
                <DragOverlayWrapper />
            </DndContextProvider>
        </EditorProvider>
    );
}