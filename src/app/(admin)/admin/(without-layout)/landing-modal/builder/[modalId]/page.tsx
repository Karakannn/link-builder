import { getLandingModalContent } from "@/actions/landing-modal";
import FunnelEditor from "@/app/_components/editor";
import FunnelEditorNavigation from "@/app/_components/editor-navigation";
import FunnelEditorSidebar from "@/app/_components/editor-sidebar";
import { DragOverlayWrapper } from "@/app/_components/editor-sidebar/tabs/placeholder-elements/drag-overlay-wrapper";
import { DndContextProvider } from "@/providers/dnd-context-provider";
import EditorProvider, { EditorElement } from "@/providers/editor/editor-provider";
import { getAuthUserDetails } from "@/actions/auth";
import { LandingModalProvider } from "@/providers/landing-modal-provider";
import { ModalEditorWrapper } from "./_components/modal-editor-wrapper";

const defaultContent: EditorElement[] = [
    {
        id: "modal-container",
        content: [
            {
                id: "modal-content",
                content: [],
                name: "Modal Content",
                styles: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    minHeight: "200px",
                },
                type: "container",
            }
        ],
        name: "Modal Container",
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
    params: Promise<{ modalId: any }>;
};

export default async function ModalBuilderPage({ params }: Props) {
    const resolvedParams = await params;
    const user = await getAuthUserDetails();

    if (!user) return <>loading...</>;

    let modalContent;
    try {
        modalContent = await getLandingModalContent(resolvedParams.modalId);
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
        <EditorProvider siteId={`modal-${resolvedParams.modalId}`} pageDetails={content}>
            <LandingModalProvider isPreview={true}>
                <DndContextProvider>
                    <div className="flex flex-col h-full">
                        <FunnelEditorNavigation
                            pageDetails={{
                                id: resolvedParams.modalId,
                                title: modalContent?.name || "Modal",
                                slug: `modal-${resolvedParams.modalId}`,
                                content: JSON.stringify(content),
                                siteId: `modal-${resolvedParams.modalId}`,
                                isHome: false,
                                seo: null,
                                updatedAt: modalContent?.updatedAt || new Date(),
                                createdAt: modalContent?.createdAt || new Date(),
                            }}
                            user={user}
                        />
                        <div className="mr-[385px]">
                            <ModalEditorWrapper pageDetails={content} />
                        </div>
                        <FunnelEditorSidebar userId={user.id} />
                    </div>
                    <DragOverlayWrapper />
                </DndContextProvider>
            </LandingModalProvider>
        </EditorProvider>
    );
} 