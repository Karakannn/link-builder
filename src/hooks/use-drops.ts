import { Active, Over } from "@dnd-kit/core";
import { useEditorUtilities } from "./use-editor-utilities";
import { useElementActions } from "./editor-actions/use-element-actions";

export const useDrops = () => {
    const { addElement, moveElement } = useElementActions();
    const { createElement } = useEditorUtilities();

    const handleContainerDrop = (active: Active, over: Over) => {
        if (!over || !active) return;

        const draggedType = active.data?.current?.type;
        const isFromSidebar = active.data?.current?.isSidebarElement;
        const isFromEditor = active.data?.current?.isEditorElement;
        const elementId = active.data?.current?.elementId;

        const containerId = over.data.current?.elementId;

        if (isFromSidebar) {
            console.log("\n🆕 Adding new element to container end");

            const newElement = createElement(draggedType);
            if (newElement) {
                addElement(containerId, newElement);
                console.log("✅ ADD_ELEMENT dispatched successfully");
            } else {
                console.error("❌ Failed to create new element");
            }
        } else if (isFromEditor && elementId) {
            if (elementId === containerId) {
                console.warn("⚠️ Cannot move element to itself, aborting");
                return;
            }

            moveElement(elementId, containerId);

            console.log("✅ MOVE_ELEMENT dispatched successfully");
        } else {
            console.warn("⚠️ CONTAINER operation but no valid source detected");
        }
    };

    return {
        handleContainerDrop,
    };
};
