// src/hooks/editor/use-element-selection.tsx
"use client";

import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useCallback, useState } from "react";
import { useSmartSelection } from "./use-smart-selection";

export const useElementSelection = (element: EditorElement) => {
    const { handleSmartSelection } = useSmartSelection();
    const [isHovered, setIsHovered] = useState(false);

    // Smart selection handler - event'i pass et
    const handleSelectElement = useCallback((e: React.MouseEvent) => {
        console.log("sa");
        
        e.stopPropagation();
        handleSmartSelection(e, element); // Event'i geç
    }, [handleSmartSelection, element]);

    return {
        handleSelectElement,
        isHovered,
        setIsHovered,
    };
};

export const useElementBorderHighlight = (element: EditorElement) => {
    const { state } = useEditor();
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState<React.MouseEvent | null>(null);

    const isSelected = state.editor.selectedElement.id === element.id;

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!state.editor.liveMode) {
            setIsHovered(true);
            setHoveredEvent(e); // Event'i kaydet preview için
        }
    }, [state.editor.liveMode]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setHoveredEvent(null);
    }, []);

    const getBorderClasses = () => {
        const baseClasses = "transition-all";

        if (state.editor.liveMode) {
            return baseClasses;
        }

        // Seçili element - kalın mavi border
        if (isSelected) {
            return `${baseClasses} ring-2 ring-blue-500 ring-offset-1`;
        }

        // Normal hover - ince border
        if (isHovered) {
            return `${baseClasses} ring-1 ring-blue-200`;
        }

        return baseClasses;
    };

    const shouldShowBadge = (isHovered || isSelected) && !state.editor.liveMode;
    const shouldShowDeleteButton = isSelected && !state.editor.liveMode && element.type !== "__body";

    return {
        isSelected,
        isHovered,
        hoveredEvent, // Event'i expose et
        getBorderClasses,
        shouldShowBadge,
        shouldShowDeleteButton,
        handleMouseEnter,
        handleMouseLeave,
    };
};