import { useEditor } from "@/providers/editor/editor-provider";
import { Active, Over } from "@dnd-kit/core";
import { useEditorUtilities } from "./use-editor-utilities";


export const useDrops = () => {

    const { state, dispatch } = useEditor();
    const { createElement } = useEditorUtilities()

    const handleContainerDrop = (active: Active, over: Over) => {

        if (!over || !active) return

        const draggedType = active.data?.current?.type;
        const isFromSidebar = active.data?.current?.isSidebarElement;
        const isFromEditor = active.data?.current?.isEditorElement;
        const elementId = active.data?.current?.elementId;

        const containerId = over.data.current?.elementId;

        // Handle sidebar elements (creating new elements)
        if (isFromSidebar) {
            console.log("\n🆕 Adding new element to container end");

            const newElement = createElement(draggedType);
            if (newElement) {
                console.log("🚀 Dispatching ADD_ELEMENT action:");
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId,
                        elementDetails: newElement,
                    },
                });

                console.log("✅ ADD_ELEMENT dispatched successfully");
            } else {
                console.error("❌ Failed to create new element");
            }
        }
        // Handle existing editor elements (moving to different container)
        else if (isFromEditor && elementId) {
            console.log("\n🔄 Moving existing element to different container");

            // Check if trying to move element to itself
            if (elementId === containerId) {
                console.warn("⚠️ Cannot move element to itself, aborting");
                return;
            }

            console.log("🚀 Dispatching MOVE_ELEMENT action:");
            dispatch({
                type: "MOVE_ELEMENT",
                payload: {
                    elementId,
                    targetContainerId: containerId,
                },
            });

            console.log("✅ MOVE_ELEMENT dispatched successfully");
        } else {
            console.warn("⚠️ CONTAINER operation but no valid source detected");
        }
    }

    return {
        handleContainerDrop
    }
}




