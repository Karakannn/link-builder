import { getOverlayContent, adminGetOverlayContent } from "@/actions/overlay";
import FunnelEditorNavigation from "@/app/_components/editor-navigation/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { getAuthUserDetails, onAdminUser } from "@/actions/auth";
import { OverlayEditorWrapper } from "./_components/overlay-editor-wrapper";

const defaultContent: EditorElement[] = [
    {
        id: "overlay-container",
        content: [
            {
                id: "overlay-content",
                content: [],
                name: "Overlay Content",
                styles: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    minHeight: "200px",
                },
                type: "container",
            }
        ],
        name: "Overlay Container",
        styles: {
            display: "flex",
            flexDirection: "column",
            width: "500px",
            height: "300px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            gap: "0.5rem",
        },
        type: "container",
    },
];

type Props = {
    params: Promise<{ overlayId: any }>;
};

export default async function OverlayBuilderPage({ params }: Props) {
    const resolvedParams = await params;
    const user = await getAuthUserDetails();

    if (!user) return <>loading...</>;

    // Admin kontrolü yap
    const adminCheck = await onAdminUser();
    let overlayContent;

    try {
        if (adminCheck.status === 200) {
            const result = await adminGetOverlayContent(resolvedParams.overlayId);
            if (result.status === 200) {
                overlayContent = result.modal;
            } else {
                console.error("Admin overlay content error:", result);
                overlayContent = null;
            }
        } else {
            overlayContent = await getOverlayContent(resolvedParams.overlayId);
        }
    } catch (error) {
        console.error("Error fetching overlay content:", error);
        overlayContent = null;
    }

    // Safely parse content from database
    let content: EditorElement[] = defaultContent;
    if (overlayContent?.content) {
        try {
            const parsedContent = typeof overlayContent.content === "string" ? JSON.parse(overlayContent.content) : overlayContent.content;

            if (Array.isArray(parsedContent)) {
                content = parsedContent as EditorElement[];
            }
        } catch (parseError) {
            console.error("Error parsing overlay content:", parseError);
            content = defaultContent;
        }
    }


    return (
        <EditorProvider siteId={`overlay-${resolvedParams.overlayId}`} pageDetails={content}>
            <DndContextProvider>
                <div className="flex flex-col h-full">
                    <FunnelEditorNavigation
                        pageDetails={{
                            id: resolvedParams.overlayId,
                            title: overlayContent?.name || "Overlay",
                            slug: `overlay-${resolvedParams.overlayId}`,
                            content: JSON.stringify(content),
                            siteId: `overlay-${resolvedParams.overlayId}`,
                            isHome: false,
                            seo: null,
                            updatedAt: overlayContent?.updatedAt || new Date(),
                            createdAt: overlayContent?.createdAt || new Date(),
                        }}
                        user={user}
                    />
                    <div className="mr-[385px] ml-80">
                        <OverlayEditorWrapper pageDetails={content} />
                    </div>
                    <FunnelEditorSidebar userId={user.id} />
                </div>
                <DragOverlayWrapper />
            </DndContextProvider>
        </EditorProvider>
    );
}