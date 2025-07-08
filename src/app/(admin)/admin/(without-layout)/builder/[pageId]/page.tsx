import { getAuthUserDetails, onAdminUser } from "@/actions/auth";
import { getPageById, adminGetPageById } from "@/actions/page";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { LivePreviewWrapper } from "./_components/live-preview-wrapper";
import { getSiteOverlaySettings, adminGetSiteLandingModalSettings } from "@/actions/landing-modal";
import { client } from "@/lib/prisma";
import { Metadata } from "next";

type Props = {
    params: Promise<{ pageId: string }>;
    searchParams: Promise<{ live?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const pageId = resolvedParams.pageId;
    const isLiveMode = resolvedSearchParams.live === 'true';

    try {
        // Get page data with site settings
        const pageData = await client.page.findUnique({
            where: {
                id: pageId,
            },
            include: {
                site: {
                    include: {
                        settings: true,
                    },
                },
            },
        });

        if (!pageData?.site) {
            return {
                title: isLiveMode ? "Live Preview" : "Page Editor",
                description: "LinkBuilder - Build amazing landing pages",
            };
        }

        const siteSettings = pageData.site.settings;
        
        // Title: Site settings > Page title > Site name
        const title = siteSettings?.title || pageData.title || pageData.site.name;
        
        // Add mode suffix for non-live modes
        const finalTitle = isLiveMode ? title : `${title} - Editor`;
        
        // Favicon: Site settings > Default
        const favicon = siteSettings?.favicon || "/favicon.ico";

        return {
            title: finalTitle,
            description: pageData.site.description || `Edit and preview ${pageData.site.name}`,
            icons: {
                icon: favicon,
                shortcut: favicon,
                apple: favicon,
            },
            openGraph: {
                title: finalTitle,
                description: pageData.site.description || `Edit and preview ${pageData.site.name}`,
                siteName: pageData.site.name,
                type: "website",
            },
            twitter: {
                title: finalTitle,
                description: pageData.site.description || `Edit and preview ${pageData.site.name}`,
                card: "summary_large_image",
            },
        };
    } catch (error) {
        console.error("❌ Error generating metadata:", error);
        return {
            title: isLiveMode ? "Live Preview" : "Page Editor",
            description: "LinkBuilder - Build amazing landing pages",
        };
    }
}

export default async function page({ params, searchParams }: Props) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const pageId = resolvedParams.pageId;
    const isLiveMode = resolvedSearchParams.live === 'true';

    const user = await getAuthUserDetails();

    // Admin kontrolü yap
    const adminCheck = await onAdminUser();
    let pageData;

    if (adminCheck.status === 200) {
        pageData = await adminGetPageById(pageId);
    } else {
        pageData = await getPageById(pageId);
    }

    if (!pageData || pageData.status !== 200 || !pageData.page || !user) {
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

    const page = pageData.page;

    const pageContent = page.content as any as EditorElement[];

    if (isLiveMode) {
        let initialModalSettings = null;
        try {
            let modalSettingsResult;
            
            // Admin kontrolü yap
            if (adminCheck.status === 200) {
                modalSettingsResult = await adminGetSiteLandingModalSettings(page.siteId);
            } else {
                modalSettingsResult = await getSiteOverlaySettings(page.siteId);
            }
            
            if (modalSettingsResult.status === 200 && modalSettingsResult.settings) {
                const settings = modalSettingsResult.settings;
                initialModalSettings = {
                    enableLandingModal: ('enableLandingModal' in settings && settings.enableLandingModal) || (settings.enableOverlay && settings.overlayType === 'LANDING_MODAL'),
                    selectedModalId: settings.selectedModalId,
                    googleAnalyticsId: settings.googleAnalyticsId
                };
            }
        } catch (error) {
            console.error("❌ Error loading modal settings server-side:", error);
        }

        return (
            <EditorProvider siteId={page.siteId} pageDetails={pageContent}>
                <LivePreviewWrapper
                    pageContent={pageContent}
                    siteId={page.siteId}
                    initialModalSettings={initialModalSettings}
                />
            </EditorProvider>
        );
    }

    // Normal edit mode
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
