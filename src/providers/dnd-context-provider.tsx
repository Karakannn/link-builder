"use client";

import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent, PointerSensor, pointerWithin, useSensor, useSensors } from "@dnd-kit/core";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useEditorUtilities } from "@/hooks/use-editor-utilities";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useDrops } from "@/hooks/use-drops";
import { useDropIndicator } from "@/hooks/use-drop-indicator";
import { useDropHere } from "@/hooks/use-drop-here";
import { DropHere } from "@/components/global/drop-here";
import { DropIndicator } from "@/components/global/drop-indicator";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElements } from "./editor/editor-elements-provider";
import { useLiveMode } from "./editor/editor-ui-context";

type DndContextProviderProps = {
    children: React.ReactNode;
};

export const DndContextProvider = ({ children }: DndContextProviderProps) => {
    
    const { selectElement, moveElement, insertElement, updateElement, reorderElement, addElement } = useElementActions();
    const { createElement } = useEditorUtilities();
    const { handleContainerDrop } = useDrops();

    const elements = useElements();
    const liveMode = useLiveMode();

    const { indicatorState, updateIndicatorFromDragOver, updateIndicatorFromDragMove, handleDragEndInsert, clearIndicator } = useDropIndicator();
    const { dropHereState, updateDropHereFromDragOver, updateDropHereFromDragMove, clearDropHere } = useDropHere();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    // Grid layout ve column bulma yardımcı fonksiyonu
    const findGridLayoutWithColumn = (elements: EditorElement[], columnId: string): EditorElement | null => {
        for (const element of elements) {
            if (element.type === "gridLayout" && Array.isArray(element.content)) {
                if (element.content.some(col => col.id === columnId)) {
                    return element;
                }
            }
            if (Array.isArray(element.content)) {
                const found = findGridLayoutWithColumn(element.content, columnId);
                if (found) return found;
            }
        }
        return null;
    };

    const findParentColumn = (elements: EditorElement[], elementId: string): EditorElement | null => {
        for (const element of elements) {
            if (element.type === "gridLayout" && Array.isArray(element.content)) {
                for (const column of element.content) {
                    if (column.id === elementId) {
                        return column;
                    }
                    if (Array.isArray(column.content)) {
                        const found = findElementInColumn(column, elementId);
                        if (found) return column;
                    }
                }
            }
            if (Array.isArray(element.content)) {
                const found = findParentColumn(element.content, elementId);
                if (found) return found;
            }
        }
        return null;
    };

    const findElementInColumn = (column: EditorElement, elementId: string): boolean => {
        if (column.id === elementId) return true;
        if (Array.isArray(column.content)) {
            for (const child of column.content) {
                if (findElementInColumn(child, elementId)) return true;
            }
        }
        return false;
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        if (!active.data.current) return;

        console.log('🔥 DragStart:', {
            id: active.id,
            type: active.data.current.type,
            isEditorElement: active.data.current.isEditorElement
        });

        if (!liveMode && active.data.current.isEditorElement) {
            selectElement(active.data.current.element);
        }
    };

    const handleDragMove = (event: DragMoveEvent) => {
        const { active } = event;
        const draggedType = active?.data?.current?.type;

        // Column drag sırasında normal indicators'ı gösterme
        if (draggedType === "column") {
            console.log('🔥 DragMove - Column drag, skipping indicators');
            return;
        }

        updateIndicatorFromDragMove(event, elements);
        updateDropHereFromDragMove(event, elements);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !active) return;

        const draggedType = active.data?.current?.type;
        const overType = over.data?.current?.type;

        console.log('🔥 DragOver:', {
            draggedType,
            overType,
            activeId: active.id,
            overId: over.id
        });

        // Column drag sırasında normal logic'i engelle
        if (draggedType === "column") {
            console.log('🔥 Column drag detected - blocking normal DragOver logic');
            return;
        }

        // Diğer elementler için normal işlemler
        updateIndicatorFromDragOver(event, elements);
        updateDropHereFromDragOver(event, elements);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Clear indicators
        clearIndicator();
        clearDropHere();

        if (!over || !active) {
            console.log('🔥 DragEnd - No over or active');
            return;
        }

        const draggedType = active.data?.current?.type;
        const overType = over.data?.current?.type;
        const isFromSidebar = active.data?.current?.isSidebarElement;
        const isFromEditor = active.data?.current?.isEditorElement;
        const elementId = active.data?.current?.elementId;

        console.log('🔥 DragEnd:', {
            draggedType,
            overType,
            activeId: active.id,
            overId: over.id,
            isFromSidebar,
            isFromEditor
        });

        // =================== COLUMN REORDERING ===================
        if (draggedType === "column") {
            console.log('🔥 Column drag end detected');
            
            if (over.id && over.id !== active.id) {
                const gridLayout = findGridLayoutWithColumn(elements, active.id as string);
                
                if (gridLayout && Array.isArray(gridLayout.content)) {
                    // Droppable ID'sinden column ID'sini çıkar
                    let targetColumnId = over.id as string;
                    if (targetColumnId.startsWith('droppable-')) {
                        targetColumnId = targetColumnId.replace('droppable-', '');
                    }
                    
                    // Eğer over.id bir element ise, parent column'u bul
                    if (!targetColumnId.startsWith('droppable-')) {
                        const parentColumn = findParentColumn(elements, targetColumnId);
                        if (parentColumn) {
                            targetColumnId = parentColumn.id;
                        }
                    }
                    
                    // Aynı grid içinde mi kontrol et
                    const isOverInSameGrid = gridLayout.content.some(col => col.id === targetColumnId);
                    
                    if (isOverInSameGrid) {
                        const oldIndex = gridLayout.content.findIndex((col) => col.id === active.id);
                        const newIndex = gridLayout.content.findIndex((col) => col.id === targetColumnId);

                        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                            const reorderedColumns = [...gridLayout.content];
                            const [removed] = reorderedColumns.splice(oldIndex, 1);
                            reorderedColumns.splice(newIndex, 0, removed);

                            console.log('🔥 Reordering columns:', active.id, '->', targetColumnId);
                            updateElement({ ...gridLayout, content: reorderedColumns });
                        }
                    }
                }
            }
            return;
        }

        // =================== NORMAL ELEMENT OPERATIONS ===================
        
        const overId = over.id as string;

        // Mathematical positioning kontrolü
        const insertInfo = handleDragEndInsert(event, elements);

        if (insertInfo) {
            console.log('🔥 Insert info found:', insertInfo);
            const { containerId, insertIndex } = insertInfo;

            if (isFromSidebar) {
                const newElement = createElement(draggedType);
                if (newElement) {
                    console.log('🔥 Inserting new element from sidebar');
                    insertElement(containerId, insertIndex, newElement);
                }
            } else if (isFromEditor && elementId) {
                console.log('🔥 Reordering existing element');
                reorderElement(elementId, containerId, insertIndex);
            }
            return;
        }

        // Container drop handlers (fallback)
        const dropHandlers = {
            container: () => {
                console.log('🔥 Container drop');
                handleContainerDrop(active, over);
            },

            __body: () => {
                console.log('🔥 Body drop');
                handleContainerDrop(active, over);
            },

            closableContainer: () => {
                console.log('🔥 Closable container drop');
                const containerId = over.data?.current?.containerId || overId;
                if (isFromSidebar) {
                    const newElement = createElement(draggedType);
                    if (newElement) {
                        addElement(containerId, newElement);
                    }
                } else if (isFromEditor && elementId) {
                    moveElement(elementId as string, containerId);
                }
            },

            column: () => {
                console.log('🔥 Column container drop');
                const containerId = over.data?.current?.containerId || overId;
                if (isFromSidebar) {
                    const newElement = createElement(draggedType);
                    if (newElement) {
                        addElement(containerId, newElement);
                    }
                } else if (isFromEditor && elementId) {
                    moveElement(elementId as string, containerId);
                }
            },


        };

        // Execute drop handler
        if (dropHandlers[overType as keyof typeof dropHandlers]) {
            dropHandlers[overType as keyof typeof dropHandlers]();
        } else {
            console.log('🔥 No drop handler for type:', overType);
        }
    };

    const handleDragCancel = () => {
        console.log('🔥 Drag cancelled');
        clearIndicator();
        clearDropHere();
        selectElement();
    };

    return (
        <DndContext
            collisionDetection={pointerWithin}
            onDragCancel={handleDragCancel}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <SortableContext items={elements.map((child) => child.id)} strategy={verticalListSortingStrategy}>
                {children}
            </SortableContext>
            <DropIndicator state={indicatorState} />
            <DropHere state={dropHereState} />
        </DndContext>
    );
};