import { getAuthUserDetails, onAdminUser } from "@/actions/auth";
import { getPageById, adminGetPageById } from "@/actions/page";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { LivePreviewWrapper } from "./_components/live-preview-wrapper";
import { getSiteLandingModalSettings, adminGetSiteLandingModalSettings } from "@/actions/landing-modal";

type Props = {
    params: Promise<{ pageId: string }>;
    searchParams: Promise<{ live?: string }>;
};

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

    console.log("User:", user);
    console.log("Page data:", pageData);

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
                modalSettingsResult = await getSiteLandingModalSettings(page.siteId);
            }
            
            if (modalSettingsResult.status === 200 && modalSettingsResult.settings) {
                initialModalSettings = {
                    enableLandingModal: modalSettingsResult.settings.enableLandingModal,
                    selectedModalId: modalSettingsResult.settings.selectedModalId
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
                    <div className="h-full flex justify-center ml-80">
                        <FunnelEditor pageDetails={pageContent} />
                    </div>
                    <FunnelEditorSidebar userId={user.id} />
                </div>
                <DragOverlayWrapper />
            </DndContextProvider>
        </EditorProvider>
    );
}
