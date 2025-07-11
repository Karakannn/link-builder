import { getAuthUserDetails, onAdminUser } from "@/actions/auth";
import { getPageById, adminGetPageById } from "@/actions/page";
import { getPublicSiteOverlaySettings, getSiteOverlaySettings } from "@/actions/overlay";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { LivePreviewWrapper } from "./_components/live-preview-wrapper";
import { client } from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { parsePageContent } from "@/lib/utils";

type Props = {
    params: Promise<{ pageId: string }>;
    searchParams: Promise<{ live?: string }>;
};

// 🚀 Cached data fetcher - Next.js 15 optimizasyonu
const getPageData = unstable_cache(
    async (pageId: string) => {
        return await client.page.findUnique({
            where: { id: pageId },
            include: { site: { include: { settings: true } } },
        });
    },
    ['page-data'],
    { revalidate: 60 } // 1 dakika cache
);

// 🚀 Metadata için optimize edilmiş fonksiyon
async function getMetadataForPage(pageId: string, isLiveMode: boolean): Promise<Metadata> {
    const pageData = await getPageData(pageId);

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
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { pageId } = await params;
    const { live } = await searchParams;
    const isLiveMode = live === 'true';

    return await getMetadataForPage(pageId, isLiveMode);
}

export default async function page({ params, searchParams }: Props) {
    const { pageId } = await params;
    const { live } = await searchParams;
    const isLiveMode = live === 'true';

    // 🚀 Paralel veri çekme
    const [user, adminCheck, cachedPageData] = await Promise.all([
        getAuthUserDetails(),
        onAdminUser(),
        getPageData(pageId) // Cache'den gelecek
    ]);

    // Admin kontrolü sonrası fresh data gerekirse
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
        const overlaySettings = await getOverlaySettings(page.siteId, adminCheck.status === 200);
        return (
            <EditorProvider siteId={page.siteId} pageDetails={pageContent}>
                <LivePreviewWrapper
                    pageContent={pageContent}
                    siteId={page.siteId}
                    initialOverlaySettings={overlaySettings}
                />
            </EditorProvider>
        );
    }

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



async function getOverlaySettings(siteId: string, isAdmin: boolean) {
    try {
        const fn = isAdmin ? getPublicSiteOverlaySettings : getSiteOverlaySettings;
        const result = await fn(siteId);
        
        if (result.status === 200 && result.settings) {
            const { enableOverlay, selectedOverlayId, selectedCardId, liveStreamLink, googleAnalyticsId } = result.settings;
            return { enableOverlay, selectedOverlayId, selectedCardId, liveStreamLink, googleAnalyticsId };
        }
    } catch (error) {
        console.error("❌ Error loading overlay settings:", error);
    }
    return null;
}