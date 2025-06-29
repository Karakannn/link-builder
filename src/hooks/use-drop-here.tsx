import { useState, useEffect } from 'react';
import { EditorElement } from '@/providers/editor/editor-provider';

export type DropHereState = {
    isVisible: boolean;
    targetElementId: string | null;
    rect: DOMRect | null;
};

const initialDropHereState: DropHereState = {
    isVisible: false,
    targetElementId: null,
    rect: null,
};

export const useDropHere = () => {
    const [dropHereState, setDropHereState] = useState<DropHereState>(initialDropHereState);

    const EDGE_THRESHOLD = 25;
    const CONTAINER_TYPES = ['container', 'closableContainer', 'column', 'gridLayout', '__body'];

    const isDraggedElementChild = (containerId: string, draggedElementId: string, elements: EditorElement[]): boolean => {
        const findContainer = (elements: EditorElement[], id: string): EditorElement | null => {
            for (const element of elements) {
                if (element.id === id) return element;
                if (Array.isArray(element.content)) {
                    const found = findContainer(element.content, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const container = findContainer(elements, containerId);
        if (!container || !Array.isArray(container.content)) return false;

        const findInContent = (elements: EditorElement[]): boolean => {
            for (const element of elements) {
                if (element.id === draggedElementId) return true;
                if (Array.isArray(element.content) && findInContent(element.content)) return true;
            }
            return false;
        };

        return findInContent(container.content);
    };

    const analyzeDropZone = (event: any, targetId: string) => {
        const targetElement = document.querySelector(`[data-element-id="${targetId}"]`);
        if (!targetElement) return null;

        const rect = targetElement.getBoundingClientRect();
        const mouseY = (event.activatorEvent?.clientY || event.clientY || 0) + (event.delta?.y || 0);

        const overType = event.over?.data?.current?.type;
        const isContainer = CONTAINER_TYPES.includes(overType);

        if (isContainer) {
            const topEdge = rect.top + EDGE_THRESHOLD;
            const bottomEdge = rect.bottom - EDGE_THRESHOLD;

            // Center zone = direct drop
            if (mouseY >= topEdge && mouseY <= bottomEdge) {
                return { isDirectDrop: true, rect };
            }
        }

        return { isDirectDrop: false, rect };
    };

    const updateDropHere = (event: any, elements: EditorElement[]) => {
        const { over, active } = event;


        if (!over?.data?.current?.isEditorElement || !active) {
            setDropHereState(initialDropHereState);
            return;
        }

        const targetId = over.id as string;
        const overType = over.data?.current?.type;
        const draggedType = active.data?.current?.type;
        
        // Prevent columns from being dropped into other columns
        if (overType === 'column' && draggedType === 'column') {
            setDropHereState(initialDropHereState);
            return;
        }

        const draggedElementId = active.data?.current?.elementId || active.id;
        const cleanDraggedId = String(draggedElementId).replace('draggable-', '');
        const zoneData = analyzeDropZone(event, targetId);


        if (!zoneData || !zoneData.isDirectDrop) {
            setDropHereState(initialDropHereState);
            return;
        }

        // Check if dragged element is child of target container
        const isChildOfTarget = isDraggedElementChild(targetId, cleanDraggedId, elements);

        setDropHereState({
            isVisible: !isChildOfTarget,
            targetElementId: !isChildOfTarget ? targetId : null,
            rect: zoneData.rect,
        });
    };

    const clearDropHere = () => {
        setDropHereState(initialDropHereState);
    };



    return {
        dropHereState,
        updateDropHereFromDragOver: updateDropHere,
        updateDropHereFromDragMove: updateDropHere,
        clearDropHere,
    };
};