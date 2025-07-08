import { EditorElement } from "@/providers/editor/editor-provider";
import { useMemo, useCallback } from "react";
import { useElementActions } from "./use-element-actions";

export const useElementWorkflows = () => {
    const elementActions = useElementActions();

    const duplicateElement = useCallback(
        (element: EditorElement, targetContainerId?: string) => {
            const duplicatedElement = {
                ...element,
                id: crypto.randomUUID(),
                name: `${element.name} Copy`,
            };

            const containerId = targetContainerId || "__body";
            elementActions.addElement(containerId, duplicatedElement);
        },
        [elementActions]
    );

    const moveAndSelectElement = useCallback(
        (elementId: string, targetContainerId: string, elementDetails: EditorElement) => {
            elementActions.moveElement(elementId, targetContainerId);
            elementActions.selectElement(elementDetails);
        },
        [elementActions]
    );

    return useMemo(
        () => ({
            duplicateElement,
            moveAndSelectElement,
        }),
        [duplicateElement, moveAndSelectElement]
    );
};
