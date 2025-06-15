import React, { useState } from 'react';
import {
    closestCenter,
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    useDndContext,
    MeasuringStrategy,
    DropAnimation,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragEndEvent,
    MeasuringConfiguration,
    UniqueIdentifier,
} from '@dnd-kit/core';
import {
    arrayMove,
    useSortable,
    SortableContext,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS, isKeyboardEvent } from '@dnd-kit/utilities';


import { Page, Layout, Position } from './Page';
import type { Props as PageProps } from './Page';
import styles from './Pages.module.css';
import { cn } from '@/lib/utils';

const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
    length: number,
    initializer: (index: number) => any = defaultInitializer
): T[] {
    return [...new Array(length)].map((_, index) => initializer(index));
}

interface Props {
    layout: Layout;
}


export function Pages({ layout }: Props) {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [items, setItems] = useState(() =>
        createRange<UniqueIdentifier>(20, (index) => `${index + 1}`)
    );


    const activeIndex = activeId != null ? items.indexOf(activeId) : -1;

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            sensors={sensors}
            collisionDetection={closestCenter}
        >
            <SortableContext items={items}>
                <ul className={cn(styles.Pages, styles[layout])}>
                    {items.map((id, index) => (
                        <SortablePage
                            id={id}
                            index={index + 1}
                            key={id}
                            layout={layout}
                            activeIndex={activeIndex}
                            onRemove={() =>
                                setItems((items) => items.filter((itemId) => itemId !== id))
                            }
                        />
                    ))}
                </ul>
            </SortableContext>
            <DragOverlay>
                {activeId != null ? (
                   <>sa</>
                ) : null}
            </DragOverlay>
        </DndContext>
    );

    function handleDragStart({ active }: DragStartEvent) {
        setActiveId(active.id);
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    function handleDragEnd({ over }: DragEndEvent) {
        if (over) {
            const overIndex = items.indexOf(over.id);

            if (activeIndex !== overIndex) {
                const newIndex = overIndex;

                setItems((items) => arrayMove(items, activeIndex, newIndex));
            }
        }

        setActiveId(null);
    }
}



function SortablePage({
    id,
    activeIndex,
    ...props
}: PageProps & { activeIndex: number }) {
    const {
        attributes,
        listeners,
        index,
        isDragging,
        over,
        setNodeRef,

    } = useSortable({ id });

    return (
        <Page
            ref={setNodeRef}
            id={id}
            active={isDragging}
            insertPosition={
                over?.id === id
                    ? index > activeIndex
                        ? Position.After
                        : Position.Before
                    : undefined
            }
            {...props}
            {...attributes}
            {...listeners}
        />
    );
}

function always() {
    return true;
}