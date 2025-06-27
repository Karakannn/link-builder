import { getAuthUserDetails } from "@/actions/auth";
import { getPageById } from "@/actions/page";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { LivePreviewWrapper } from "./_components/live-preview-wrapper";

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
    const { page }: any = await getPageById(pageId);

    if (!page || !user) return <>loading...</>;

    const pageContent = page.content as EditorElement[];

    // Live mode ise sadece preview göster
    if (isLiveMode) {
        return (
            <EditorProvider siteId={page.siteId} pageDetails={pageContent}>
                <LivePreviewWrapper pageContent={pageContent} siteId={page.siteId} />
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
