import { getLiveStreamCardContent } from "@/actions/live-stream-card";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { getAuthUserDetails } from "@/actions/auth";
import { LiveStreamCardEditorWrapper } from "./_components/live-stream-card-editor-wrapper";

const defaultContent: EditorElement[] = [
    {
        id: "stream-card-container",
        content: [
            {
                id: "stream-card-content",
                content: [],
                name: "Stream Card Content",
                styles: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    minHeight: "200px",
                },
                type: "container",
            }
        ],
        name: "Stream Card Container",
        styles: {
            display: "flex",
            flexDirection: "column",
            width: "500px",
            height: "300px",
            padding: "40px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            gap: "0.5rem",
        },
        type: "container",
    },
];

type Props = {
    params: Promise<{ cardId: any }>;
};

export default async function LiveStreamCardBuilderPage({ params }: Props) {
    const resolvedParams = await params;
    const user = await getAuthUserDetails();

    if (!user) return <>loading...</>;

    let cardContent;

    try {
        cardContent = await getLiveStreamCardContent(resolvedParams.cardId);
    } catch (error) {
        console.error("Error fetching card content:", error);
        cardContent = null;
    }

    // Safely parse content from database
    let content: EditorElement[] = defaultContent;
    if (cardContent?.content) {
        try {
            const parsedContent = typeof cardContent.content === "string" ? JSON.parse(cardContent.content) : cardContent.content;

            if (Array.isArray(parsedContent)) {
                content = parsedContent as EditorElement[];
            }
        } catch (parseError) {
            console.error("Error parsing card content:", parseError);
            content = defaultContent;
        }
    }

    return (
        <EditorProvider siteId={`stream-card-${resolvedParams.cardId}`} pageDetails={content}>
            <DndContextProvider>
                <div className="flex flex-col h-full">
                    <FunnelEditorNavigation
                        pageDetails={{
                            id: resolvedParams.cardId,
                            title: cardContent?.name || "Stream Card",
                            slug: `stream-card-${resolvedParams.cardId}`,
                            content: JSON.stringify(content),
                            siteId: `stream-card-${resolvedParams.cardId}`,
                            isHome: false,
                            seo: null,
                            updatedAt: cardContent?.updatedAt || new Date(),
                            createdAt: cardContent?.createdAt || new Date(),
                        }}
                        user={user}
                    />
                    <div className="mr-[385px] ml-80">
                        <LiveStreamCardEditorWrapper pageDetails={content} />
                    </div>
                    <FunnelEditorSidebar userId={user.id} />
                </div>
                <DragOverlayWrapper />
            </DndContextProvider>
        </EditorProvider>
    );
} 