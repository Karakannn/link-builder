
import React, { forwardRef, HTMLAttributes } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';

export enum Position {
    Before = -1,
    After = 1,
}

export enum Layout {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
    Grid = 'grid',
}

export interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, 'id'> {
    active?: boolean;
    clone?: boolean;
    insertPosition?: Position;
    id: UniqueIdentifier;
    index?: number;
    layout: Layout;
    onRemove?(): void;
}

// Background images for different page IDs
const backgroundImages: Record<string, string> = {
    '1': 'https://images.unsplash.com/photo-1581714239128-da7bf940cd82?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    '3': 'https://images.unsplash.com/photo-1524605546309-2f5cf29dc90f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    '5': 'https://images.unsplash.com/photo-1558612123-351952fa7c3d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80',
    '7': 'https://images.unsplash.com/photo-1520764816423-52375cbff016?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80',
    '9': 'https://images.unsplash.com/photo-1485627941502-d2e6429a8af0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80',
    '11': 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80',
    '13': 'https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80',
    '15': 'https://images.unsplash.com/photo-1501769214405-5e5ee5125a02?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80',
    '17': 'https://images.unsplash.com/photo-1506017531682-eccdf2f5acfa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    '19': 'https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=500&q=80'
};

export const Page = forwardRef<HTMLLIElement, Props>(function Page(
    { id, index, active, clone, insertPosition, layout, onRemove, style, className, ...props },
    ref
) {
    const isVertical = layout === Layout.Vertical;
    const isBefore = insertPosition === Position.Before;
    const isAfter = insertPosition === Position.After;
    const backgroundImage = backgroundImages[id.toString()];

    return (
        <li
            className={`
                relative list-none w-[150px] mb-2 group
                ${active ? '' : ''}
                ${clone ? (isVertical ? (isBefore ? '-mt-[125px]' : 'mb-[125px]') : (isBefore ? '-ml-[75px]' : 'ml-[75px]')) : ''}
                ${className || ''}
            `}
            style={style}
            ref={ref}
        >
            <button 
                className={`
                    relative block w-full h-[200px] bg-[rgb(250,255,255)] bg-cover rounded border-none outline-none appearance-none
                    shadow-[0_0_0_1px_rgba(63,63,68,0.05),0_1px_3px_0_rgba(34,33,81,0.15)]
                    focus-visible:shadow-[0_0_0_2px_#4c9ffe] cursor-grab touch-none
                    ${active ? '!bg-none !bg-gray-200' : ''}
                    ${clone ? 'transform translate-x-[10px] translate-y-[10px] scale-[1.025] animate-pulse shadow-[0_0_0_1px_rgba(63,63,68,0.05),0_1px_6px_0_rgba(34,33,81,0.3)] cursor-grabbing' : ''}
                    ${!active && !clone && insertPosition ? 'after:content-[""] after:absolute after:bg-[#4c9ffe]' : ''}
                    ${!active && !clone && insertPosition && !isVertical ? 'after:top-0 after:bottom-0 after:w-[2px]' : ''}
                    ${!active && !clone && insertPosition && isVertical ? 'after:left-0 after:right-0 after:h-[2px]' : ''}
                    ${!active && !clone && isBefore && !isVertical ? 'after:-left-[9px]' : ''}
                    ${!active && !clone && isAfter && !isVertical ? 'after:-right-[9px]' : ''}
                    ${!active && !clone && isBefore && isVertical ? 'after:-top-[15px]' : ''}
                    ${!active && !clone && isAfter && isVertical ? 'after:-bottom-[45px]' : ''}
                `}
                data-id={id.toString()}
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: id.toString() === '1' ? '196px' : 'cover',
                    backgroundPosition: id.toString() === '1' ? '-18px 1px' : 'center'
                }}
                {...props} 
            />
            
            {!active && onRemove && (
                <button 
                    className={`
                        flex invisible group-hover:visible absolute top-[5px] right-[5px] w-5 h-5 p-0
                        items-center justify-center bg-black/30 rounded-full border-none outline-none cursor-pointer
                        hover:bg-black/50 active:bg-red-400/90
                    `}
                    onClick={onRemove}
                >
                    <svg className="fill-white w-3 h-3" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            )}
            
            {index != null && (
                <span 
                    className={`
                        inline-block w-full mt-4 text-center text-black/50 select-none animate-fade-in
                        ${active ? 'opacity-30' : ''}
                    `}
                >
                    {index}
                </span>
            )}
        </li>
    );
});
