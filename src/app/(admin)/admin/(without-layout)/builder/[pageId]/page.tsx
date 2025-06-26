import { getAuthUserDetails } from "@/actions/auth";
import { getPageById } from "@/actions/page";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";

type Props = {
    params: Promise<{ pageId: string }>;
};
export default async function page({ params }: Props) {
    const resolvedParams = await params;
    const pageId = resolvedParams.pageId;

    const user = await getAuthUserDetails();
    const { page }: any = await getPageById(pageId);

    if (!page || !user) return <>loading...</>;

    const pageContent = page.content as EditorElement[];

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
