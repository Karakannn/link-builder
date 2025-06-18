import { getLandingModalContent } from "@/actions/landing-modal";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { getAuthUserDetails } from "@/actions/auth";
import { LandingModalProvider } from "@/providers/landing-modal-provider";

const defaultContent: EditorElement[] = [
    {
        id: "landing-modal-content",
        content: [],
        name: "Landing Modal Content",
        styles: {
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minHeight: "300px",
            backgroundColor: "white",
            borderRadius: "8px",
        },
        type: "container",
    },
];

type Props = {
    params: {
        modalId: string;
    };
};

export default async function ModalBuilderPage({ params }: Props) {
    const user = await getAuthUserDetails();

    if (!user) return <>loading...</>;

    let modalContent;
    try {
        modalContent = await getLandingModalContent(params.modalId);
    } catch (error) {
        console.error("Error fetching modal content:", error);
        modalContent = null;
    }

    // Safely parse content from database
    let content: EditorElement[] = defaultContent;
    if (modalContent?.content) {
        try {
            const parsedContent = typeof modalContent.content === "string" ? JSON.parse(modalContent.content) : modalContent.content;

            if (Array.isArray(parsedContent)) {
                content = parsedContent as EditorElement[];
            }
        } catch (parseError) {
            console.error("Error parsing modal content:", parseError);
            content = defaultContent;
        }
    }

    console.log("content", content);

    return (
        <EditorProvider siteId={`modal-${params.modalId}`} pageDetails={content}>
            <LandingModalProvider>
                <DndContextProvider>
                    <div className="flex flex-col h-full">
                        <FunnelEditorNavigation
                            pageDetails={{
                                id: params.modalId,
                                title: modalContent?.name || "Modal",
                                slug: `modal-${params.modalId}`,
                                content: JSON.stringify(content),
                                siteId: `modal-${params.modalId}`,
                                isHome: false,
                                seo: null,
                                updatedAt: new Date(),
                                createdAt: new Date(),
                            }}
                            user={user}
                        />
                        <div className="h-full flex justify-center">
                            <FunnelEditor pageDetails={content} liveMode={false} />
                        </div>
                        <FunnelEditorSidebar subaccountId={""} />
                    </div>
                    <DragOverlayWrapper />
                </DndContextProvider>
            </LandingModalProvider>
        </EditorProvider>
    );
} 