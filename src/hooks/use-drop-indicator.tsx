import { useState, useEffect, useCallback } from 'react';
import { useDndContext } from '@dnd-kit/core';
import { EditorElement } from '@/providers/editor/editor-provider';

export type DropPosition = 'before' | 'after' | null;

export type DropIndicatorState = {
    isVisible: boolean;
    targetElementId: string | null;
    containerId: string | null;
    position: DropPosition;
    index: number;
    layout: 'vertical' | 'horizontal';
    rect: DOMRect | null;
};

const initialState: DropIndicatorState = {
    isVisible: false,
    targetElementId: null,
    containerId: null,
    position: null,
    index: 0,
    layout: 'vertical',
    rect: null,
};

export const useDropIndicator = () => {
    const [indicatorState, setIndicatorState] = useState<DropIndicatorState>(initialState);
    const { active } = useDndContext();

    const findContainerInfo = useCallback((elements: EditorElement[], targetId: string): any => {
        for (const element of elements) {
            if (Array.isArray(element.content)) {
                const childIndex = element.content.findIndex(child => child.id === targetId);
                if (childIndex !== -1) {
                    return {
                        containerId: element.id,
                        index: childIndex,
                        layout: element.layout === 'horizontal' ? 'horizontal' : 'vertical'
                    };
                }
                const result = findContainerInfo(element.content, targetId);
                if (result) return result;
            }
        }
        return null;
    }, []);

    const calculatePosition = useCallback((event: any, targetId: string) => {
        const targetElement = document.querySelector(`[data-element-id="${targetId}"]`);
        if (!targetElement) return null;

        const rect = targetElement.getBoundingClientRect();
        const mouseY = (event.activatorEvent?.clientY || event.clientY || 0) + (event.delta?.y || 0);

        // Check if target is a container type that can accept direct drops
        const overType = event.over?.data?.current?.type;
        const isContainer = ['container', 'closableContainer', 'column', 'gridLayout'].includes(overType);

        if (isContainer) {
            // For containers: use zones approach
            const EDGE_THRESHOLD = 25; // pixels from top/bottom edge
            const topEdge = rect.top + EDGE_THRESHOLD;
            const bottomEdge = rect.bottom - EDGE_THRESHOLD;



            if (mouseY < topEdge) {
                return { position: 'before' as DropPosition, rect, isDirectDrop: false };
            } else if (mouseY > bottomEdge) {
                return { position: 'after' as DropPosition, rect, isDirectDrop: false };
            } else {
                // Center area - direct drop into container
                return { position: null, rect, isDirectDrop: true };
            }
        } else {
            // For regular elements: use center line approach
            const centerY = rect.top + rect.height / 2;
            return {
                position: mouseY < centerY ? 'before' : 'after' as DropPosition,
                rect,
                isDirectDrop: false
            };
        }
    }, []);

    const updateIndicator = useCallback((event: any, elements: EditorElement[]) => {
        const { over, active } = event;

        if (!over?.data?.current?.isEditorElement) {
            setIndicatorState(prev => ({ ...prev, isVisible: false }));
            return;
        }

        const targetId = over.id as string;
        const overType = over.data?.current?.type;
        const draggedType = active.data?.current?.type;

        console.log('🔥 DropIndicator - draggedType:', draggedType, 'overType:', overType);

        // Column drag işlemlerini tamamen engelle - artık overlay handle ediyor
        if (draggedType === 'column') {
            console.log('🔥 Column drag detected - hiding drop indicator');
            setIndicatorState(prev => ({ ...prev, isVisible: false }));
            return;
        }

        // Column'lara drop yapmayı da engelle
        if (overType === 'column') {
            console.log('🔥 Dropping on column detected - hiding drop indicator');
            setIndicatorState(prev => ({ ...prev, isVisible: false }));
            return;
        }

        const positionData = calculatePosition(event, targetId);
        if (!positionData) return;

        const containerInfo = findContainerInfo(elements, targetId);

        // If it's a direct drop into container, don't show positioning indicator
        if (positionData.isDirectDrop) {
            setIndicatorState(prev => ({ ...prev, isVisible: false }));
            return;
        }

        console.log('🔥 Showing drop indicator for non-column element');

        setIndicatorState({
            isVisible: true,
            targetElementId: targetId,
            containerId: containerInfo?.containerId || null,
            position: positionData.position,
            index: containerInfo ? (positionData.position === 'before' ? containerInfo.index : containerInfo.index + 1) : 0,
            layout: containerInfo?.layout || 'vertical',
            rect: positionData.rect,
        });
    }, [calculatePosition, findContainerInfo]);

    // handleDragEndInsert metodunu da güncelle
    const handleDragEndInsert = useCallback((event: any, elements: EditorElement[]) => {
        const { active, over } = event;

        if (!over?.data?.current?.isEditorElement) {
            return null;
        }

        const overType = over.data?.current?.type;
        const draggedType = active.data?.current?.type;

        console.log('🔥 DragEndInsert - draggedType:', draggedType, 'overType:', overType);

        // Column işlemlerini tamamen engelle
        if (draggedType === 'column' || overType === 'column') {
            console.log('🔥 Column operation detected - blocking drag end insert');
            return null;
        }

        const targetId = over.id as string;
        const positionData = calculatePosition(event, targetId);

        if (!positionData) {
            return null;
        }

        // If it's a direct drop, return null so it falls back to container drop logic
        if (positionData.isDirectDrop) {
            return null;
        }

        const containerInfo = findContainerInfo(elements, targetId);

        if (!containerInfo) {
            return null;
        }

        const result = {
            isFromSidebar: active.data?.current?.isSidebarElement,
            isFromEditor: active.data?.current?.isEditorElement,
            elementId: active.data?.current?.elementId,
            draggedType: active.data?.current?.type,
            containerId: containerInfo.containerId,
            insertIndex: positionData.position === 'before' ? containerInfo.index : containerInfo.index + 1,
        };

        console.log('🔥 Drag end insert result:', result);
        return result;
    }, [calculatePosition, findContainerInfo]);


    const clearIndicator = useCallback(() => {
        setIndicatorState(initialState);
    }, []);

    // Clear indicator when drag ends
    useEffect(() => {
        if (!active) clearIndicator();
    }, [active, clearIndicator]);

    return {
        indicatorState,
        updateIndicatorFromDragOver: updateIndicator,
        updateIndicatorFromDragMove: updateIndicator,
        handleDragEndInsert,
        clearIndicator,
    };
};