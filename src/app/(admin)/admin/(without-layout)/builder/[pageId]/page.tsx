import { getAuthUserDetails } from "@/actions/auth";
import { getPageById } from "@/actions/page";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/components-tab/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";

type Props = {
  params: { pageId: string };
};
export default async function page({ params }: Props) {
  const pageId = params.pageId;

  const user = await getAuthUserDetails();
  const { page } = await getPageById(pageId);

  if (!page || !user) return <>loading...</>;

  const pageContent = JSON.parse(page.content as any) as unknown as EditorElement[];

  return (
    <DndContextProvider>
      <EditorProvider siteId={page.id} pageDetails={pageContent}>
        <div className="flex flex-col h-full">
          <FunnelEditorNavigation user={user} pageDetails={page} />
          <div className="h-full flex justify-center">
            <FunnelEditor pageDetails={pageContent} />
          </div>
          <FunnelEditorSidebar subaccountId={""} />
        </div>
      </EditorProvider>
      <DragOverlayWrapper />
    </DndContextProvider>
  );
}
